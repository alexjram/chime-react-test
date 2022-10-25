import { useEffect, useRef, useState } from "react";
import htmlLogger from "../Service/HtmlLogger";
import Controls from "./Controls";
import Video from "./Video";


export default function VideoLocalOutput({meetingSession}) {
    const videoRef = useRef(null);
    const [localTileId, setLocalTileId] = useState(null);

    useEffect(() => {
        if (!videoRef.current) {
            return;
        }

        const videoElement = videoRef.current;

        const observer = {
            videoTileDidUpdate: tileState => {
                if (!tileState.boundAttendeeId || !tileState.localTile) {
                    return;
                }
                htmlLogger('wants to initiate video');
                tileState.active = true;
                meetingSession.audioVideo.bindVideoElement(
                    tileState.tileId,
                    videoElement
                );
                console.warn(tileState);
                htmlLogger('local video binded '+ (tileState.boundVideoStream?.active?'true':'false'))
                setLocalTileId(tileState.tileId);
            },
            videoTileWasRemoved: tileId => {
                if (tileId === localTileId) {
                    setLocalTileId(null);
                }
            }
        };
        meetingSession.audioVideo.addObserver(observer);

        meetingSession.audioVideo.startLocalVideoTile();

    }, [meetingSession]);

    return (
        <div>
            <h3>Video Local Output</h3>
            <div>
                <Video ref={videoRef} />
                <Controls meetingSession={meetingSession} />
            </div>
            <h6>{meetingSession._configuration.credentials.attendeeId}</h6>
        </div>
    )
}