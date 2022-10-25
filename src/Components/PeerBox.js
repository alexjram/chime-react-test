

export default PeerBox = ({enabled, ...props}) => (
    <div style={{"display": (enabled?'inline-block':'none')}}>
    </div>
);