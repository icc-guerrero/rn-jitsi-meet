import JitsiMeetJS, {
  JitsiConferenceEvents,
  JitsiConnectionQualityEvents,
  JitsiConnectionEvents,
} from './';

import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import RTCView from 'react-native-webrtc/RTCView';
import * as Progress from 'react-native-progress';

const status = {
  CONNECTED: 0,
  DISCONNECTED: 1,
  CONNECTING: 2,
};

const JitsiComponent = props => {
  const jitsiConfig = {
    e2eping: {
      pingInterval: -1,
    },
    hosts: {
      domain: 'beta.meet.jit.si',
      muc: 'conference.beta.meet.jit.si',
    },
    bosh: 'https://beta.meet.jit.si/http-bind',
    websocket: 'wss://beta.meet.jit.si/xmpp-websocket',
  };
  const [videoURL, setVideoURL] = useState();
  const [localVideoURL, setLocalVideoURL] = useState();
  const [roomId, setRoomId] = useState(props.room);
  const [conferenceStatus, setConferenceStatus] = useState(status.DISCONNECTED);

  useEffect(() => {
    let connection = null;
    let room = null;
    JitsiMeetJS.init(jitsiConfig);
    JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
  }, [jitsiConfig]);

  const connect = () => {
    setConferenceStatus(status.CONNECTING);
    navigator.mediaDevices.enumerateDevices().then(sourceInfos => {
      console.log('sourceInfos', sourceInfos);

      navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {
        console.log('stream', stream);

        connection = new JitsiMeetJS.JitsiConnection(null, null, jitsiConfig);
        connection.connect();

        connection.addEventListener(
          JitsiConnectionEvents.CONNECTION_ESTABLISHED,
          event => onConnectionEstablished(event, roomId),
        );

        connection.addEventListener(
          JitsiConnectionEvents.CONNECTION_FAILED,
          event => onConnectionFailed(event),
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
    console.log('connection established', event);
    console.log(connection);
    const configWithBosh = {
      ...jitsiConfig,
      // bosh: `${this.jitsiConfig.bosh}?room=${roomId}`,
      // serviceUrl: `${this.jitsiConfig.bosh}?room=${roomId}`,
      serviceUrl: `${jitsiConfig.websocket}?room=${roomId}`,
    };

    room = connection.initJitsiConference(roomId, configWithBosh);
    room.join();
    room.on(
      JitsiConferenceEvents.CONFERENCE_JOINED,
      () => console.log('Conference Joined'),
      onConferenceJoined(),
    );
    room.on(JitsiConferenceEvents.TRACK_ADDED, track => onTrackAdded(track));
    setConferenceStatus(status.CONNECTED);
    // room.on(JitsiConferenceEvents.CONFERENCE_LEFT, () =>
    //   this.onConferenceLeft(),
    // );
    // room.on(JitsiConferenceEvents.CONNECTION_INTERRUPTED, () =>
    //   this.onConnectionInterrupted(),
    // );
    // room.on(JitsiConferenceEvents.CONNECTION_RESTORED, () =>
    //   this.onConnectionRestored(),
    // );
    // room.on(JitsiConferenceEvents.USER_JOINED, userId =>
    //   this.onUserJoined(userId),
    // );
    // room.on(JitsiConferenceEvents.USER_LEFT, userId =>
    //   this.onUserLeft(userId),
    // );
    // room.on(JitsiConnectionQualityEvents.LOCAL_STATS_UPDATED, stats =>
    //   this.onLocalStatsUpdated(stats),
    // );
    // room.on(
    //   JitsiConnectionQualityEvents.REMOTE_STATS_UPDATED,
    //   (id, stats) => this.onRemoteStatsUpdated(id, stats),
    // );
    // room.on(
    //   JitsiConferenceEvents.PARTICIPANT_CONN_STATUS_CHANGED,
    //   (id, connectionStatus) =>
    //     this.onParticipantConnectionStatusChanged(id, connectionStatus),
    // );

    // room.on(JitsiConferenceEvents.TRACK_REMOVED, track =>
    //   this.onTrackRemoved(track),
    // );
    // room.on(JitsiConferenceEvents.TRACK_MUTE_CHANGED, track =>
    //   this.onTrackMuteChanged(track),
    // );
    // room.on(
    //   JitsiConferenceEvents.TRACK_AUDIO_LEVEL_CHANGED,
    //   (userId, audioLevel) => this.onTrackAudioLevelChanged(userId, audioLevel),
    // );
  };

  const onTrackAdded = track => {
    //console.log(`${track.isLocal() ? 'LOCAL' : 'REMOTE'} track added`, track);
    if (!track.isLocal() && track.getType() === 'video') {
      console.log(this.video);
      console.log(track.stream.toURL());
      // track.attach(this.video.current);
      setVideoURL(track.stream.toURL());
    } else if (track.isLocal() && track.getType() === 'video') {
      setLocalVideoURL(track.stream.toURL());
    }
  };

  const onConferenceJoined = () => {
    console.log('conference joined', room.myUserId());
    //

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
    // setTimeout(() => {
    //   room.setDisplayName('Jitsi RN app');
    //   room.sendTextMessage('Hola, me he conectado!');
    // }, 3000);

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
          <View style={[StyleSheet.absoluteFill, styles.centered]}>
            <Progress.CircleSnail
              size={40}
              style={{width: 40, height: 40}}
              color={['blue']}
            />
            <Text>Connecting...</Text>
          </View>
        )}
        {videoURL && (
          <RTCView
            streamURL={videoURL}
            objectFit={'cover'}
            style={[StyleSheet.absoluteFill, styles.remoteTrack]}
          />
        )}
        {localVideoURL && (
          <RTCView
            streamURL={localVideoURL}
            style={styles.localTrack}
            objectFit={'cover'}
          />
        )}
        {conferenceStatus === status.DISCONNECTED && (
          <TextInput
            style={styles.textInput}
            onChangeText={setRoomId}
            placeholder="room id"
            placeholderTextColor="gray"
            value={roomId}
          />
        )}
      </View>
      <View style={styles.buttonsArea}>
        <Button
          style={styles.button}
          onPress={connect}
          title="Connect"
          disabled={
            conferenceStatus === status.CONNECTING ||
            conferenceStatus === status.CONNECTED
          }
        />
        <Button
          style={styles.button}
          onPress={disconnect}
          title="Disconnect"
          disabled={conferenceStatus === status.DISCONNECTED}
        />
        {/*<Button onPress={getTracks} title="Tracks" />*/}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'lightgray',
  },
  textInput: {
    height: 40,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    right: 0,
    left: 0,
    top: 40,
    color: 'black',
    position: 'absolute',
    backgroundColor: 'white',
  },
  remoteTrack: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'gray',
  },
  buttonsArea: {
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'black',
  },
  button: {
    backgroundColor: 'blue',
    color: 'white',
  },

  localTrack: {
    backgroundColor: 'white',
    bottom: 95,
    right: 20,
    zIndex: 99,
    width: 100,
    height: 150,
    position: 'absolute',
    borderWidth: 1,
    borderRadius: 3,
  },

  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default JitsiComponent;
