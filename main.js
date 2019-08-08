const net = require('net');
const child = require('child_process');
const port = 8081
const host = "0.0.0.0"
//word-wrap: break-word; white-space: pre-wrap;
html = `<head><meta http-equiv="refresh" content="5"/></head><body style="font-family:monospace;word-wrap: break-word; white-space: pre-wrap;">`

const server = net.createServer();
server.listen(port, host, () => {console.log(`ProcessWeb is up at ${host}:${port}.`)})
server.on('connection', function(socket) {
  const cl = socket.remoteAddress + ':' + socket.remotePort
  console.log('Incoming connection from ' + cl);
  socket.on('data', function(data) {
    socket.end(`HTTP/1.1 200\n\n${html}${getProcesses()}`)
  })
})

function getProcesses() {
  processes = child.execSync("ps -aux | grep jvyden").toString()
  return processes
}
