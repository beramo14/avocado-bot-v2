const appRootPath = require("app-root-path");
const { createLogger } = require("winston");
const winstonDaily = require("winston-daily-rotate-file");
const winston = require("winston");
const { combine, timestamp, label, printf } = winston.format;

const logFileSaveDir = `${appRootPath}/logs`;


const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}] : ${message}`; 
});

const logger = createLogger({
    format: combine(label({ label: "NODE_PROJECT" }), timestamp(), logFormat), 
    transports: [
        new winstonDaily({
            level: "info",
            datePattern: "YYYY-MM-DD",
            dirname: logFileSaveDir,
            filename: "%DATE%.log",
            maxSize: "20m",
            maxFiles: "30d"
        }),
        new winston.transports.Console()
    ]
})

module.exports = logger;