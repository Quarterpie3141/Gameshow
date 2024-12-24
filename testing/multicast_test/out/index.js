"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_dgram_1 = __importDefault(require("node:dgram"));
const node_readline_1 = __importDefault(require("node:readline"));
const socket = node_dgram_1.default.createSocket({ type: "udp4", reuseAddr: true });
const rl = node_readline_1.default.createInterface({ input: process.stdin, output: process.stdout });
socket.bind(5000);
socket.on("listening", () => {
    socket.addMembership("233.255.255.255");
    console.log(`bound to ${socket.address().address}:${socket.address().port}`);
    askMessage();
});
socket.on("message", (message, rinfo) => {
    console.log(`recieved message: ${message.toString()} from ${rinfo.address}:${rinfo.port}`);
});
function sendMessage(msg) {
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
