import { LogLevel } from "amazon-chime-sdk-js";
import { Logger } from "amazon-chime-sdk-js/libs/voicefocus/types";

export default class HtmlLogger {

    loggerUl;

    constructor() {
        this.level = LogLevel.WARN;
        this.loggerUl = document.querySelector('#logger > ul');
    }
    

    debug(debugFunction) {
        if (LogLevel.DEBUG < this.level) {
            return;
        }
        let msg = '';
        if (typeof debugFunction === 'function') {
            msg = debugFunction();
        }else {
            msg = debugFunction;
        }
        const li = document.createElement('li');
        li.innerHTML = 'debug: '+msg;
        this.loggerUl.appendChild(li);
    }

    error(msg) {
        if (LogLevel.ERROR < this.level) {
            return;
        }
        const li = document.createElement('li');
        li.innerHTML = 'error: '+msg;
        this.loggerUl.appendChild(li);
    }
    info(msg) {
        if (LogLevel.INFO < this.level) {
            return;
        }
        const li = document.createElement('li');
        li.innerHTML = 'info: '+msg;
        this.loggerUl.appendChild(li);
    }
    warn(msg) {
        if (LogLevel.WARN < this.level) {
            return;
        }
        const li = document.createElement('li');
        li.innerHTML = 'warning: '+msg;
        this.loggerUl.appendChild(li);
    }

    getLogLevel() {
        return this.level;
    }

    setLogLevel(level) {
        this.level = level;
    }
}