const express = require('express');
const { METHODS } = require('http');
const app = express()
const server = require('http').Server(app);
const cors = require('cors');

const io = require('socket.io')(server, {
  options: {
    cors: {
      origin: '*',
    }
  }
});

io.on('connection', (socket) => {
  const idHandShake = socket.id; // id de cada conexión
  const { nameRoom } = socket.handshake.query;
  
  socket.join(nameRoom);

  console.log(`Hola dispositivo: ${idHandShake} a la sala <<${nameRoom}>>` )

  //socket.emit() emite al emisor
  //socket.to() emite a todos excepto al emisor
  //io.emit() emite a todos los conectados
  socket.on('newUserConnected', (res) => {
    const nickname = res;
    io.emit(nameRoom).emit('newUserConnected', nickname);
  })

  /*draw*/
  socket.on('event', (res) => {
    const data = res;
    socket.to(nameRoom).emit('event', res);
  });

  socket.on('deleteDraw', () => {
    io.emit(nameRoom).emit('deleteDraw');
  });
  /*end draw */

  /*chat*/
  socket.on('chat', (messages) => {
    io.emit(nameRoom).emit('chat', messages);
  });
  /*end chat */
})

server.listen(3000, () => {
  console.log('>> Socket listo y escuchando por el puerto: 3000')
})




