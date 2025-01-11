import dgram from "node:dgram";
import os from "node:os";
import process from "node:process";
import pino from "pino";

const logger = pino();
const multicastAddress = process.env.MULTICAST_ADDRESS
	? process.env.MULTICAST_ADDRESS
	: "233.255.255.255";
const multicastPort = process.env.MULTICAST_PORT
	? Number(process.env.MULTICAST_PORT)
	: 5000;
let serverAddress = "0.0.0.0";
const socket = dgram.createSocket({ type: "udp4", reuseAddr: true });

export default function initMulticastHandler() {
	socket.bind(multicastPort);

	socket.on("listening", () => {
		socket.addMembership(multicastAddress);
		const address = socket.address();
		serverAddress = address.address;
		logger.info(`UDP socket listening on ${address.address}:${address.port}`);
	});

	socket.on("message", (message, rinfo) => {
		// respond to any messages that contain the word "probe" in them with the list of avalibe ip addresses
		logger.info(
			`Multicast message from: ${rinfo.address}:${rinfo.port} - ${message}`,
		);
		if (message.toString().includes("probe")) {
			logger.info("Client seems to be probing for server address");
			sendMessage();
		}
	});

	function sendMessage() {
		const message = Buffer.from(`alternativeIPs: ${getIP()}`);
		socket.send(
			message,
			0,
			message.length,
			multicastPort,
			multicastAddress,
			() => {
				logger.info(`Sending message "${message}"`);
			},
		);
	}

	function getIP(): string[] {
		const networkInterfaces = os.networkInterfaces();
		if (!networkInterfaces) {
			logger.fatal("No Network interfaces found");
		}

		const avalibleAddresses: string[] = [];
		for (const [key, value] of Object.entries(networkInterfaces)) {
			if (value) {
				for (const interfaceInfo of value) {
					interfaceInfo.family === "IPv4" && interfaceInfo.internal === false
						? // ignore any ipv6 addresses and internal addresses, we can assume the buzzers will use ipv4
							avalibleAddresses.push(interfaceInfo.address)
						: logger.info(
								`Ignoring interface ${key}'s ip address ${interfaceInfo.address}`,
							);
				}
			}
		}
		return avalibleAddresses;
	}
}
