const { contextBridge } = require("electron");

const jetpack = require("fs-jetpack");
contextBridge.exposeInMainWorld("jetpack", jetpack);
