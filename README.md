# React Native Jitsi module

## Installation
How to include rn-jitsi-meet module into your React Native project

#### 1. Install required dependencies
```bash
yarn add react-native-svg react-native-video react-native-webrtc@1.84.0 react-native-background-timer @react-native-async-storage/async-storage
```
#### 2. Install rn-jitsi-meet module
```bash
yarn add rn-jitsi-meet
```

### iOS required steps
#### Run pod install into your project
```bash
cd $(PROJECT_ROOT)/ios
pod install
```
Add permissions with usage descriptions to your app Info.plist:
```html
<!-- Required with iOS 10 and higher -->
<key>NSCameraUsageDescription</key>
<string>Your message to user when the camera is accessed for the first time</string>

<!-- Required with iOS 10 and higher -->
<key>NSMicrophoneUsageDescription</key>
<string>Your message to user when the microphone is accessed for the first time</string>
```

### Android required steps
Add permissions to your app android/app/src/main/AndroidManifest.xml file:
```html
<!-- Required -->
<uses-permission android:name="android.permission.CAMERA" />
<!-- Required -->
<uses-permission android:name="android.permission.RECORD_AUDIO"/>
```

