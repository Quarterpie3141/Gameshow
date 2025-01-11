import initMulticastHandler from "./api/multicastHandler";

const express = require("express");
const path = require("node:path");
const app = express();

initMulticastHandler();

app.use(express.static(path.resolve(__dirname, "client")));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "index.html"));
	console.log(`sending ${path.resolve(__dirname, "client", "index.html")}`)
});

const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
