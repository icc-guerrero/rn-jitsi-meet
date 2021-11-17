/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import JitsiComponent from 'rn-jitsi-meet';

const App = () => {
  return (
    <View style={styles.container}>
      <JitsiComponent
        roomId={'thisismyjitsitest999'}
        roomName={'My conference'}
        displayName={'Andrés'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'lightgray',
  },
});

export default App;
