import { useState } from "react";
import htmlLogger from "../Service/HtmlLogger";


export default function Controls({meetingSession}) {
    const [muted, setMuted] = useState(meetingSession.audioVideo.realtimeIsLocalAudioMuted());
    const [isVideoOn, setVideoOn] = useState(meetingSession.audioVideo.hasStartedLocalVideoTile());
    const handleMute = () => {
        htmlLogger('mic muted')
        meetingSession.audioVideo.realtimeMuteLocalAudio();
        setMuted(true);
    }
    const handleUnmute = () => {
        htmlLogger('mic unmuted')
        meetingSession.audioVideo.realtimeUnmuteLocalAudio();
        setMuted(false);
    }
    const handlePlayVideo = () => {
        htmlLogger('video started');
        meetingSession.audioVideo.startLocalVideoTile();
        setVideoOn(true);
    }
    const handleStopVideo = () => {
        htmlLogger('video stoped')
        meetingSession.audioVideo.stopLocalVideoTile();
        setVideoOn(false);
    }
    return (
        <div className="controls">
            
            {isVideoOn? (<button
                type="button"
                onClick={handleStopVideo}
            >
                Stop video
            </button>):(<button
                type="button"
                onClick={handlePlayVideo}
            >
                Start video
            </button>)}
            {
                muted?
                    (<button
                        type="button"
                        onClick={handleUnmute}
                    >
                        Unmute
                    </button>):(
                        <button
                        type="button"
                        onClick={handleMute}
                    >
                        Mute
                    </button>
                    )
            }
        </div>
    )
}