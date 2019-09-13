const User = require('../../models/User');
const Activity = require('../../models/Activity');
const Breaktime = require('../../models/Breaktime');

//route = '/userRooms'
module.exports = namespace => {
  namespace.on('connect', socket => {
    socket.on('join room', room => {
      socket.join(room);
      socket.room = room;
    });

    socket.on('change doing', async (userId, doNowId, wasDoingId, time) => {
      try {
        let user = await User.findById(userId);
        let doNow = await Activity.findById(doNowId);
        if (!doNow) {
          doNow = await Breaktime.findById(doNowId);
        }
        let wasDoing = await Activity.findById(wasDoingId);
        if (!wasDoing) {
          wasDoing = await Breaktime.findById(wasDoingId);
        }

        doNow.start.push(time);
        wasDoing.end.push(time);
        user.active = doNowId;

        await doNow.save();
        await wasDoing.save();
        await user.save();

        namespace
          .to(socket.room)
          .emit('change doing', userId, doNowId, wasDoingId, time);
      } catch (err) {
        console.error(err.message);
        namespace.to(socket.room).emit('error', {
          errors: [{ msg: 'Server Error', param: 'change doing' }]
        });
      }
    });

    socket.on('add activity', activity => {
      namespace.to(socket.room).emit('add activity', activity);
    });
  });
};
