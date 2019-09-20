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

    socket.on('change doing', async (doNowId, wasDoingId, time) => {
      namespace.to(socket.room).emit('change doing', doNowId, wasDoingId, time);
    });

    socket.on('add activity', activity => {
      namespace.to(socket.room).emit('add activity', activity);
    });

    socket.on('edit activity', activity => {
      namespace.to(socket.room).emit('edit activity', activity);
    });

    socket.on('delete activity', activity => {
      namespace.to(socket.room).emit('delete activity', activity);
    });
  });
};
