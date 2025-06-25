const prisma = require("../utils/db");
const fs = require('fs')
const outputLog = fs.createWriteStream('./outputLog.log', { flags: "a" });
const errorsLog = fs.createWriteStream('./errorsLog.log', { flags: "a" });
const consoler = new console.Console(outputLog, errorsLog);

class Log {
    constructor(timestamp = now(), uni_application_id, uni_document_id, evaluator_id, actionPerformed, doer, object) {
        this.timestamp = timestamp;
        this.uni_application_id = uni_application_id;
        this.uni_document_id = uni_document_id;
        this.evaluator_id = evaluator_id;
        this.actionPerformed = actionPerformed;
        this.doer = doer;
        this.object = object;
    }
    toJSON() {
        return {
            timestamp: this.timestamp,
            uni_application_id: this.uni_application_id,
            uni_document_id: this.uni_document_id,
            evaluator_id: this.evaluator_id,
            actionPerformed: this.actionPerformed,
            doer: this.doer,
            object: this.object
        };
    }
}

class Logger {
    allLogs = [];
    retry = 3;
    constructor(allLogs = []) {
        this.allLogs = allLogs;
        setInterval(() => {
            this.pushToDB();
        }, 3600000);
    }
    destroy
    async writeToLogsFile() {
        consoler.log(this.allLogs);
    }

    async pushToDB() {
        try {
            const response = await prisma.logs.createMany({ data: this.allLogs });

        }
        catch (error) {
            this.retry -= 1;
            console.error(error);
            if (this.retry) {
                await this.pushToDB();
            }

            else this.retry = 3;
        }

    }
    error(err) {
        consoler.error(err);
    }
    async log(log) {
        this.allLogs.push(log);
        if (this.allLogs.length >= 100) {
            await this.pushToDB();
        }
    }
}

const actionLogger = new Logger();
module.exports = { actionLogger, Log };