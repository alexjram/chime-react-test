import { ConsoleLogger, DefaultDeviceController, DefaultMeetingSession, LogLevel, MeetingSessionConfiguration } from "amazon-chime-sdk-js";
import { getMeetingInfo } from "../chimeService";
import HtmlLogger from "../HtmlLogger";
import htmlLogger from "./HtmlLogger";

//const logger = new ConsoleLogger("Logger", LogLevel.INFO);
const logger = new HtmlLogger();
const deviceController = new DefaultDeviceController(logger);

export default async function createMeetingSession() {
    const {meeting, attendee} = await getMeetingInfo();

    const configuration = new MeetingSessionConfiguration(
        meeting,
        attendee
    );

    const meetingSession = new DefaultMeetingSession(
        configuration,
        logger,
        deviceController
    );

    htmlLogger('session created');
    return meetingSession;
}

navigator.sayswho= (function(){
    var ua= navigator.userAgent;
    var tem; 
    var M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
})();