const net = require('net');
const child = require('child_process');
const os = require('os');
const platform = os.platform()
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
//USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
//jvyden   22429  0.0  0.0  39664  3540 pts/2    R+   21:23   0:00 ps -aux

// USER   %CPU %MEM COMMAND
// jvyden 0.0 0.0 ssh
function getProcesses() {
  let psaux = child.execSync("ps -aux --no-headers | sort -nrk 3,3").toString()
  processes = psaux.split('\n')
  for(let i=0;i<processes.length;i++) {
    let process = processes[i]
    let pcolumns = process.split(" ")
    while(pcolumns.includes('')) {for(let l=0;l<pcolumns.length;l++) {if(pcolumns[l].length === 0){pcolumns.splice(l,1)}}}
    process = `${pcolumns[0]} ${pcolumns[2]} ${pcolumns[3]} ${pcolumns[10]}`
    processes[i] = process
  }
  processes.pop()
  return processes.join('\n')
}
