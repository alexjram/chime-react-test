import { forwardRef } from "react";


const Video = forwardRef((props, ref) => (
    <video
        ref={ref}
        width="100%"
        height="100%"
        style={{objectFit: 'cover'}}
        poster="/poster.webp"
        {...props}
    />
));

export default Video;