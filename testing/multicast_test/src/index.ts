import dgram from "node:dgram"
import readline from "node:readline"

const socket = dgram.createSocket({type: "udp4", reuseAddr: true});
const rl = readline.createInterface({input: process.stdin, output: process.stdout})
socket.bind(5000);

socket.on("listening", ()=>{
    socket.addMembership("233.255.255.255")
    console.log(`bound to ${socket.address().address}:${socket.address().port}`)
    askMessage()
})

socket.on("message", (message, rinfo) =>{
    console.log(`recieved message: ${message.toString()} from ${rinfo.address}:${rinfo.port}`)
    
})

function sendMessage(msg: string) {
    const message = Buffer.from(msg);
    socket.send(message, 0, message.length, 5000, "233.255.255.255", () => {
        console.log(`Sending message "${message}"`);
    });
}

function askMessage() {
    rl.question("Message? ", (message) => {
      sendMessage(message);
      askMessage();
    });
  }

