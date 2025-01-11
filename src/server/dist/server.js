"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multicastHandler_1 = __importDefault(require("./api/multicastHandler"));
const express = require("express");
const path = require("node:path");
const app = express();
(0, multicastHandler_1.default)();
app.use(express.static(path.resolve(__dirname, "client")));
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
