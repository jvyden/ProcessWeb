const net = require('net');
const child = require('child_process');
const dotenv = require("dotenv");
const os = require('os');
const fs = require('fs');
const platform = os.platform()
const html = fs.readFileSync("main.html").toString()

if(platform === 'win32' && !process.env.SHUTUP) {
  console.log("WARNING: Windows isn't officially supported yet. ProcessWeb will still run, but don't expect things to work properly, if it all. Use the SHUTUP global variable to hide this warning. (SHUTUP=true)")
}

if(!fs.existsSync('.env')) {
  try { fs.copyFileSync(".env.example", ".env") }
  catch(e) {
    console.error("ERROR: I couldn't make a config: " + e)
    process.exit(1)
  }
  console.log("I didn't find a config, so I made one for you.")
}
dotenv.config()

const port = process.env.PORT
const host = process.env.HOST

const server = net.createServer();
server.listen(port, host, () => {console.log(`ProcessWeb is up at ${host}:${port}.`)})
server.on('connection', function(socket) {
  const cl = socket.remoteAddress + ':' + socket.remotePort
  console.log('Request from ' + cl);
  socket.on('data', function() {
    socket.end(`HTTP/1.1 200\n\n${html.replace("<!-- ProcessWeb !-->", getProcesses())}`)
  })
})

function getProcesses() {
  const cmd = (platform === 'linux') ? "ps -aux --no-headers | sort -nrk 3,3" : "ps -Ao user,pid,%cpu,%mem,vsz,rss,tt,stat,start,time,command | sort -nrk 3,3";
  let psaux = child.execSync(cmd).toString()
  let processes = psaux.split('\n')
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
