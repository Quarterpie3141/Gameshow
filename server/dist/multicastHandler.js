"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = initMulticastHandler;
const node_dgram_1 = __importDefault(require("node:dgram"));
const node_os_1 = __importDefault(require("node:os"));
const node_process_1 = __importDefault(require("node:process"));
const dotenv_1 = __importDefault(require("dotenv"));
const pino_1 = __importDefault(require("pino"));
dotenv_1.default.config({ path: "../../.env" });
const logger = (0, pino_1.default)();
let multicastAddress = "233.255.255.255";
let serverAddress = "0.0.0.0";
const port = 5000;
const socket = node_dgram_1.default.createSocket({ type: "udp4", reuseAddr: true });
if (node_process_1.default.env.MULTICAST_ADDRESS) {
    multicastAddress = node_process_1.default.env.MULTICAST_ADDRESS;
}
function initMulticastHandler() {
    socket.bind(port);
    socket.on("listening", () => {
        socket.addMembership(multicastAddress);
        const address = socket.address();
        serverAddress = address.address;
        logger.info(`UDP socket listening on ${address.address}:${address.port}`);
    });
    socket.on("message", (message, rinfo) => {
        // respond to any messages that contain the word "probe" in them with the list of avalibe ip addresses
        logger.info(`Multicast message from: ${rinfo.address}:${rinfo.port} - ${message}`);
        if (message.toString().includes("probe")) {
            logger.info("Client seems to be probing for server address");
            sendMessage();
        }
    });
    function sendMessage() {
        const message = Buffer.from(`serverip: ${getIP()}`);
        socket.send(message, 0, message.length, port, multicastAddress, () => {
            logger.info(`Sending message "${message}"`);
        });
    }
    function getIP() {
        const networkInterfaces = node_os_1.default.networkInterfaces();
        if (!networkInterfaces) {
            logger.fatal("No Network interfaces found");
        }
        const avalibleAddresses = [];
        for (const [key, value] of Object.entries(networkInterfaces)) {
            if (value) {
                for (const interfaceInfo of value) {
                    interfaceInfo.family === "IPv4" && interfaceInfo.internal === false
                        ? // ignore any ipv6 addresses and internal addresses, we can assume the buzzers will use ipv4
                            avalibleAddresses.push(interfaceInfo.address)
                        : logger.info(`Ignoring interface ${key}'s ip address ${interfaceInfo.address}`);
                }
            }
        }
        return avalibleAddresses;
    }
}
