const net = require('net');
const port = 8081
const host = "0.0.0.0"


let sockets = [];

const server = net.createServer();
server.listen(port, host, () => {
  console.log(`ProcessWeb is up at ${host}:${port}.`)
})
server.on('connection', function(socket) {
  const cl = socket.remoteAddress + ':' + socket.remotePort
  console.log('Incoming connection from ' + cl);
  socket.on('data', function(data) {
    socket.end("HTTP/1.1 200\n\nbruh")
  })
  socket.on('end', function() {console.log(cl + " ended connection")})
})
