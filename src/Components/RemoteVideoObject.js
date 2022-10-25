import { createRef } from "react";
import VideoRemoteOutput from "./VideoRemoteOutput";


export default class RemoteVideoObject {
    
    constructor(id, externalUserId, tileId) {
        this.id = id;
        this.externalUserId = externalUserId;
        this.ref = createRef();
        this.tileId = tileId;
        this.VideoComponent = (<VideoRemoteOutput attendee={this} ref={this.ref} />)
    }
}