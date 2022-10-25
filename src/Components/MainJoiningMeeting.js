

export default function MainJoiningMeeting({onJoin}) {
    const handleSubmit = event => {
        event.preventDefault();

        onJoin();
    }
    
    return (
        <div>
            <p>Start or join a conference room</p>
            <form onSubmit={handleSubmit}>
                <button type="submit">Start call</button>
            </form>
        </div>
    )
}