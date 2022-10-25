import { useCallback } from "react";
import htmlLogger from "../Service/HtmlLogger";


export default function VideoRemoteOutput({attendee, meetingSession}) {


    const videoRef = useCallback(node => {
        if (!node) {
            return;
        }
        const observer = {
            videoTileDidUpdate: tileState => {
                console.warn('entro')
                if (!tileState.boundAttendeeId || tileState.isLocalTile || tileState.boundAttendeeId !== attendee.id) {
                    return;
                }
                meetingSession.audioVideo.bindVideoElement(
                    tileState.tileId,
                    node
                );
                htmlLogger('remote video added '+ (tileState.boundVideoStream.active?'true':'false'))
            },
        };
        
        meetingSession.audioVideo.addObserver(observer);
        
    }, [meetingSession, attendee.id]);

    if (meetingSession._configuration.credentials?.attendeeId === attendee.id) {
        return null;
    }
    return (
        <div>
            <h3>Video Remote Output</h3>
            <div>
                <video
                    ref={videoRef}
                    width="100%"
                    height="100%"
                    style={{objectFit: 'cover'}}
                    poster="/poster.webp"
                />
            </div>
            <h6>{attendee.id}</h6>
        </div>
    )
}