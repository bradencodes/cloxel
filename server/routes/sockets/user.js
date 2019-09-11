const User = require('../../models/User');
const Activity = require('../../models/Activity');
const Breaktime = require('../../models/Breaktime');

//route = '/userRooms'
module.exports = namespace => {
  namespace.on('connect', socket => {
    socket.on('join room', room => {
      socket.join(room);
      socket.room = room;
      console.log(`socket ${socket} joined room ${room}`);
    });

    socket.on('change doing', async (userId, doNowId, wasDoingId, time) => {
      try {
        let user = await User.findById(userId);
        let doNow = await Activity.findById(doNowId);
        let wasDoing = await Activity.findById(wasDoingId);

        doNow.start.push(time);
        doNow.end.push(time);
        wasDoing.end[wasDoing.end.length - 1] = time;
        user.active = doNowId;

        await doNow.save();
        await wasDoing.save();
        await user.save();
      } catch (err) {
        console.error(err.message);
        namespace.to(socket.room).broadcast.emit('error', {
          errors: [{ msg: 'Server Error', param: 'change doing' }]
        });
      }
    });
  });
};
