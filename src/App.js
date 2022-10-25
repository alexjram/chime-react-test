import './App.css';
import { useEffect, useReducer, useRef, useState } from 'react';
import VideoLocalOutput from './Components/VideoLocalOutput';
import VideoRemoteOutput from './Components/VideoRemoteOutput';
import  createMeetingSession from './Service/CreateMeetingSession';
import htmlLogger from './Service/HtmlLogger';

const initialState = [];

function reducer(state, action) {
  const {type, payload} = action;
  switch (type) {
    case 'add':
      htmlLogger(`reducer wants to add ${payload.id}`);
      const found = state.findIndex(rost => rost.id === payload.id) !== -1; 
      const newState = [...state];
      if(!found) {
        newState.push(payload);
      }
      return newState;
    case 'remove':
      htmlLogger('reducer removing ' + payload);
      return state.filter(rost => rost.id !== payload);
    default:
      return state;
  }
}

function App() {
  const [meetingSession, setMeetingSession] = useState(null);
  const [hasStartedMediaInputs, setStartedMediaInputs] = useState(false);
  const audioRef = useRef(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  
  useEffect(() => {
    if (!meetingSession) {
      htmlLogger('version 2');
      createMeetingSession().then(it => setMeetingSession(it));
      return;
    }

    const setupInput = async ({audioId, videoId} = {}) => {
      if (!audioId || !videoId) {
        throw new Error("No video nor audio input detected");
      }

      if (audioId) {
        const audioInputDevices = await meetingSession.audioVideo.listAudioInputDevices();

        if(audioInputDevices.length) {
          const defaultAudioId = audioInputDevices[0].deviceId;
          await meetingSession.audioVideo.startAudioInput(
            audioId === 'default'? defaultAudioId: audioId
          );
        }
      }

      if (videoId) {
        const videoInputDevices = await meetingSession.audioVideo.listVideoInputDevices();

        if (videoInputDevices.length) {
          const defaultVideoId = videoInputDevices[0].deviceId;

          await meetingSession.audioVideo.startVideoInput(
            videoId === 'default'? defaultVideoId: videoId
          );
        }
      }

      const audioOutput = audioRef.current;

      if (audioOutput) {
        await meetingSession.audioVideo.bindAudioElement(audioOutput);
      }

      htmlLogger('inputs started');
      setStartedMediaInputs(true);
    };
    
    const tileObserver = {
      videoTileDidUpdate: tileState => {
        if (!tileState.boundAttendeeId) {
          return;
        }
        if (tileState.localTile) {
          htmlLogger('removing local tile in tile observer');
          dispatch({type: 'remove', payload: tileState.boundAttendeeId});
          return;
        }
        
        htmlLogger('new Tile created')
        let attendee = {
          id: tileState.boundAttendeeId,
          externalUserId: tileState.boundExternalUserId,
          isVideoTile: true,
        }
        dispatch({type: 'add', payload: attendee});
      },
    }

    meetingSession.audioVideo.addObserver(tileObserver);

    setupInput({audioId: "default", videoId: "default"}).then(() => {
      const observer = {
        audioInputMuteStateChanged: (device, muted) => {
          console.warn(
            "Device",
            device,
            muted? "is muted": "is not muted"
          );
        }
      };
      meetingSession.audioVideo.addDeviceChangeObserver(observer);

      meetingSession.audioVideo.start();
    });

    meetingSession.audioVideo.realtimeSubscribeToAttendeeIdPresence((presentAttendeeId, present, externalUserId, dropped, posInFrame) => {
      htmlLogger(`wants to add ${presentAttendeeId} that it's ${present?"present":'not present'}`)
      console.warn(presentAttendeeId, present, dropped, posInFrame);
      if (!present) {
        htmlLogger(`removing unpresent tile on attendee observer`);
        dispatch({
          type: 'remove',
          payload: presentAttendeeId
        })
        return;
      }
      htmlLogger('attendee observer wants to add' + presentAttendeeId);
      const videoTiles = meetingSession.audioVideo.getAllRemoteVideoTiles();
      const isVideoTile = videoTiles.findIndex(vT => vT.state().boundAttendeeId === presentAttendeeId) !== -1;

      dispatch({
        type: 'add',
        payload: {
          id: presentAttendeeId,
          externalUserId,
          isVideoTile,
        }
      });
    })

  },[meetingSession]);

  return (
    <div className="App">
      <h2>{navigator.sayswho }</h2>
      <div className='video-container'>
        {hasStartedMediaInputs && <VideoLocalOutput meetingSession={meetingSession} /> }
        {meetingSession && state.map(attendee => (<VideoRemoteOutput attendee={attendee} meetingSession={meetingSession} key={attendee.id} />))}
        <audio ref={audioRef} />
      </div>
    </div>
  );
}

export default App;
