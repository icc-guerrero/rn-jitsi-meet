import JitsiMeetJS, {
  JitsiConferenceEvents,
  JitsiConnectionQualityEvents,
  JitsiConnectionEvents,
} from './index';

import React, {useEffect, useState} from 'react';
import {Button, Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import RTCView from 'react-native-webrtc/RTCView';
import Timer from './Timer'
import * as Progress from 'react-native-progress';
import Styles from './Styles';
import Phone from './components/Phone';
import Camera from './components/Camera';
import Microphone from './components/Microphone';

const status = {
  INIT: 0,
  CONNECTED: 1,
  DISCONNECTED: 2,
  CONNECTING: 3,
};

interface JitsiComponentProps {
  roomId?: string;
  roomName?: string;
  displayName: string;
  domain?: string;
  muc?: string;
  token?: string;
}

let room : any;
let connection : any;

const JitsiComponent = (props:JitsiComponentProps) => {
  const domain = props.domain || 'beta.meet.jit.si'
  const initOptions = {
    e2eping: {
      pingInterval: -1,
    },
    hosts: {
      domain: domain,
      muc: props.muc || `conference.${domain}`,
    },
    bosh: `https://${domain}/http-bind`,
    websocket: `wss://${domain}/xmpp-websocket`,
  };
  const [videoURL, setVideoURL] = useState();
  const [localVideoURL, setLocalVideoURL] = useState();
  const [roomId, setRoomId] = useState(props.roomId);
  const [conferenceStatus, setConferenceStatus] = useState(status.INIT);
  const roomName = props.roomName || 'Conference';
  const [localTracks, setLocalTracks] = useState([]);
  const [remoteTracks, setRemoteTracks]= useState([]);

  useEffect(() => {
    JitsiMeetJS.init(initOptions);
    JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
  }, [initOptions]);

  useEffect(() => {
      if (roomId && conferenceStatus==status.INIT) {
        connect()
      }
      else{
        setConferenceStatus(status.DISCONNECTED);
      }
    }, [roomId]
  )

  const renderInConference = () => {
    return  (
      <>
        <View style={[Styles.conferenceContainer,Styles.centered]}>
          <View style={[Styles.conferenceInfo, Styles.centered]}>
            <Text style={[Styles.white]}>{roomName}</Text>
            <Text style={[Styles.white]}><Timer></Timer></Text>
          </View>
        </View>
        <View style={Styles.buttonsArea}>
          <Pressable style={Styles.roundButton}><Microphone/></Pressable>
          <Pressable
            style={[Styles.roundButton, Styles.leaveButton]}
            onPress={disconnect}
            disabled={conferenceStatus === status.DISCONNECTED}
          ><Phone/></Pressable>
          <Pressable style={Styles.roundButton}><Camera/></Pressable>
        </View>
      </>
    )
  }
  const renderConnectWindow = () => {
    return (<View style={[{flex: 1},Styles.centered]}>
      <View style={[Styles.joinContainer,Styles.centered]}>
        <Text>Enter Room ID</Text>
        <TextInput
          style={Styles.textInput}
          onChangeText={setRoomId}
          placeholder="room id"
          placeholderTextColor="gray"
          value={roomId}
        />
        <Pressable style={Styles.button} onPress={connect} disabled={
          conferenceStatus === status.CONNECTING ||
          conferenceStatus === status.CONNECTED
        }>
          <Text style={Styles.buttonText}>Join</Text>
        </Pressable>
      </View>
    </View>)
  }

  const toggleLocalVideoPosition = () => {

  }
  const connect = () => {
    setConferenceStatus(status.CONNECTING);

    navigator.mediaDevices.enumerateDevices().then((sourceInfos: any) => {
      console.log('sourceInfos', sourceInfos);

      navigator.mediaDevices.getUserMedia({audio: true}).then((stream: any) => {
        console.log('stream', stream);

        connection = new JitsiMeetJS.JitsiConnection(null, null, initOptions);
        connection.connect();

        connection.addEventListener(
          JitsiConnectionEvents.CONNECTION_ESTABLISHED,
          (event: any) => onConnectionEstablished(event, roomId),
        );

        connection.addEventListener(
          JitsiConnectionEvents.CONNECTION_FAILED,
          (event: any) => onConnectionFailed(event),
        );

        connection.addEventListener(
          JitsiConnectionEvents.CONNECTION_DISCONNECTED,
          () => onConnectionDisconnected(),
        );
      });
    });
  };

  const disconnect = () => {
    setConferenceStatus(status.DISCONNECTED);
    room.leave();
    connection.disconnect();
    setVideoURL(null);
    setLocalVideoURL(null);
    setLocalTracks([]);
    setRemoteTracks([]);

    connection.removeEventListener(
      JitsiConnectionEvents.CONNECTION_ESTABLISHED,
      event => onConnectionEstablished(event),
    );
    connection.removeEventListener(
      JitsiConnectionEvents.CONNECTION_FAILED,
      event => onConnectionFailed(event),
    );
    connection.removeEventListener(
      JitsiConnectionEvents.CONNECTION_DISCONNECTED,
      () => onConnectionDisconnected(),
    );
  };

  const onConnectionEstablished = (event, roomId) => {
    const configWithBosh = {
      ...initOptions,
      openBridgeChannel: 'websocket',
      serviceUrl: `${initOptions.websocket}?room=${roomId}`,
    };

    room = connection.initJitsiConference(roomId, configWithBosh);
    room.join();
    room.on(
      JitsiConferenceEvents.CONFERENCE_JOINED,
      () => console.log('Conference Joined'),
      onConferenceJoined(),
    );
    room.on(JitsiConferenceEvents.TRACK_ADDED, track => onTrackAdded(track));
    room.on(JitsiConferenceEvents.USER_LEFT, (id,user) => onParticipantLeft(id, user));


    setConferenceStatus(status.CONNECTED);
  };

  const onTrackAdded = track => {
    if (!track.isLocal() && track.getType() === 'video') {
      setVideoURL(track.stream.toURL());
      setRemoteTracks([...remoteTracks,track]);
    } else if (track.isLocal() && track.getType() === 'video') {
      setLocalVideoURL(track.stream.toURL());
      setLocalTracks([...localTracks,track]);

    }
  };

  const onParticipantLeft = (id, user) => {
    setVideoURL(null);
  }

  const onConferenceJoined = () => {
    console.log('conference joined', room.myUserId());

    JitsiMeetJS.createLocalTracks({
      devices: ['video', 'audio'],
      // micDeviceId: 'audio-1',
      micDeviceId: 'com.apple.avfoundation.avcapturedevice.built-in_audio:0',
      cameraDeviceId: 'com.apple.avfoundation.avcapturedevice.built-in_video:0',
    })
      .then(async localTracks => {
        // console.log('local tracks', localTracks);

        for (const localTrack of localTracks) {
          room.addTrack(localTrack);
        }
      })
      .catch(error => {
        console.log('createLocalTracks error', error);
      });
    //
    setTimeout(() => {
      room.setDisplayName(props.displayName);
      room.setSubject(props.roomName);
    }, 3000);

    console.log('CONNECTION', connection);
  };

  const onConnectionFailed = event => {
    console.log('connection failed', event);
  };

  const onConnectionDisconnected = () => {
    connection.removeEventListener(
      JitsiConnectionEvents.CONNECTION_ESTABLISHED,
      event => onConnectionEstablished(event),
    );
    connection.removeEventListener(
      JitsiConnectionEvents.CONNECTION_FAILED,
      event => onConnectionFailed(event),
    );
    connection.removeEventListener(
      JitsiConnectionEvents.CONNECTION_DISCONNECTED,
      () => onConnectionDisconnected(),
    );
  };

  return (
    <>
      <View style={StyleSheet.absoluteFill}>
        {conferenceStatus === status.CONNECTING && (
          <View style={[StyleSheet.absoluteFill, Styles.centered]}>
            <Progress.CircleSnail
              size={40}
              style={{width: 40, height: 40}}
              color={['blue']}
            />
            <Text style={Styles.text}>Connecting...</Text>
          </View>
        )}
        {videoURL && (
          <RTCView
            streamURL={videoURL}
            objectFit={'cover'}
            style={[StyleSheet.absoluteFill, Styles.remoteTrack]}
          />
        )}
        {conferenceStatus === status.CONNECTED && !videoURL && (
          <View style={[StyleSheet.absoluteFill, Styles.centered]}><Text>Waiting for participants..</Text></View>
        )}
        {localVideoURL && (
          <RTCView
            streamURL={localVideoURL}
            style={Styles.localTrack}
            objectFit={'cover'}
          />
        )}
        {conferenceStatus === status.CONNECTED && renderInConference() }
        {conferenceStatus === status.DISCONNECTED && renderConnectWindow() }
      </View>

    </>
  );
};

export default JitsiComponent;
