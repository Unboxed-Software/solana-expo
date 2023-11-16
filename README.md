# Notes

- Java version 11 (openjdk 11.0.20.1 2023-08-24)
- https://developer.android.com/studio
- if you’re running on a mac - you’ll need to run:
    
    ```bash
    git clone https://github.com/Unboxed-Software/solana-mobile-counter.git
    cd solana-mobile-counter
    npm install
    cd android/
    chmod +x gradlew
    cd ..
    npm run android
    ```
    

# Lesson

---
title: Basic React Native
objectives:
- Explain the...
- Explain how...
- Use...
---

# TL;DR

- …
- ….
- …

# Overview

## Topic

### Subtopic

## Conclusion

# Demo

Today we will be building a simple Android mobile counter dApp with React Native with Expo. The app will interact with the [Anchor counter program](https://www.soldev.app/course/intro-to-anchor-frontend) that we made in the [Intro to client-side Anchor development](https://www.soldev.app/course/intro-to-anchor-frontend) lesson. In the app we will be able to: see the current count, and increment it. All on devnet.

### 1. Prerequisites

React Native allows us to write our applications like we’re used to on the web. To do this, React Native actually compiles down to languages that phones understand. On top of this, we will be using [Expo which is a set of tools and services](https://reactnative.dev/docs/environment-setup) built around React Native to make our lives easier. However, this means we have some setup to do.

1. Android Studio
    1. [Setup a React Native dev environment](https://reactnative.dev/docs/environment-setup?guide=native#creating-a-new-application). Go through the ***[entire article](https://reactnative.dev/docs/environment-setup?guide=native#creating-a-new-application)*** and accomplish the following for **************Android**************:
        1. Install dependancies
        2. Installing Android Studio
        3. Configuring **ANDROID_HOME** environment variable 
        4. Create a new sample project (only for setting up the emulator)
            1. If you run into an error `✖ Copying template`, add the `--npm` flag at the end
            
            ```bash
            npx react-native@latest init AwesomeProject
            ✔ Downloading template
            ✖ Copying template
            
            npx react-native@latest init AwesomeProject --npm
            ✔ Downloading template
            ✔ Copying template
            ```
            
        5. Run and compile the sample project on an emulator 
    2. Install the Solana fake wallet
        1. Install the repo
            
            ```bash
            git clone https://github.com/solana-mobile/mobile-wallet-adapter.git
            ```
            
        2. In Android Studio, `Open project > Navigate to the cloned directory > Select mobile-wallet-adapter/android/build.gradle`
        3. After Android Studio finishes loading the project, select `fakewallet` in the build/run configuration dropdown in the top right
            
            ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/ec2a3cf6-83e2-40e2-9f09-a64e303f7a96/a7b704e7-60cb-45af-8bbd-0f4acd5587e4/Untitled.png)
            
2. Expo and EAS ( Expo Application Services )
    1. [Create an account](https://expo.dev/signup)
    2. Install the eas-cli 
        ```bash
        npm install --global eas-cli
        ```
        

Lastly, if you run into Java versioning issues - you’ll want to be on Java version 11. To check what you’re currently running type `java --version` in your terminal.

### 2. Create the App

**Important!** Since the `@solana-mobile/mobile-wallet-adapter-protocol` package we will use includes native code, we cannot build and [run Expo normally](https://docs.solanamobile.com/react-native/expo#running-the-app). We’ll need to build it first, and then run our development client. You can do this locally, or use an Expo account to have them build it for you. We are going to build this locally, if you want expo to build it [follow the Solana Mobile’s guide](https://docs.solanamobile.com/react-native/expo#local-vs-eas-builds).

Let’s create our app with the following:

`npx create-expo-app -t expo-template-blank-typescript solana-expo`

Then let’s make sure everything is setup properly by starting the default app and running it on our android emulator.

`cd solana-expo` 

### 3. Install Dependancies

We’ll need to add in our Solana dependancies. Fortunately [Solana Mobile gives](https://docs.solanamobile.com/react-native/expo) us a really nice list of what packages we need and why we need them: 

- `@solana-mobile/mobile-wallet-adapter-protocol`: A React Native/Javascript API enabling interaction with MWA-compatible wallets.
- `@solana-mobile/mobile-wallet-adapter-protocol-web3js`: A convenience wrapper to use common primitives from [@solana/web3.js](https://github.com/solana-labs/solana-web3.js) – such as `Transaction` and `Uint8Array`.
- `@solana/web3.js`: Solana Web Library for interacting with Solana network through the [JSON RPC API](https://docs.solana.com/api/http).
- `react-native-get-random-values` Secure random number generator polyfill for `web3.js` underlying Crypto library on React Native.
- `buffer` Buffer polyfill also needed for `web3.js` on React Native.

We are also going to add three of our own `@project-serum/anchor` to allow us to interact with our counter program, and `assert`, `react-native-get-random-values` and  as a polyfill to allow our other package to do it’s thing.

```bash
npm install \
  @solana/web3.js \
  @solana-mobile/mobile-wallet-adapter-protocol-web3js \
  @solana-mobile/mobile-wallet-adapter-protocol \
  react-native-get-random-values \
  buffer \
	@project-serum/anchor \
	assert
```

We will be adding the appropriate polyfills to our `App.tsx` in a couple of steps. Polyfills actively replace node-native libraries to make them work anywhere Node is not running.  But in case you’re curious now. We will be adding:

At the very top of the file:

`import 'react-native-get-random-values';`

below all of the imports:

`global.Buffer = require('buffer').Buffer;`

### 4. Expo Dependancies

```bash
npx expo install expo-image-picker
```

In `app.json`:
```json
  "expo": {
    // ....
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "Allows you to use images to create solana NFTs"
        }
      ]
    ],
    // ....
  }
```

***NOTE*** Every time you add in new dependancies you'll have to build and re-install the app. Anything visual or logic-based can be done in the hot-reloader

### 4. First Build

Then we'll need to login

```bash
eas login
```

Then create a file called `eas.json` in the root of your directory, with the following inside.

```bash
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```



Then build the project. You will choose `y` for every answer. This will take a while. When it is done, you will get an output of `build-XXXXXXXXXXX.apk`

```bash
npx eas build --profile development --platform android --local
```

Take the resulting build file and ***drag it*** into your emulator.

Finally run the following to build and deploy on your emulator:

```bash
npx expo start --dev-client --android
```

This should open and run the app in your Android emulator. If you run into problems, check to make sure you’ve accomplished everything in the Prerequisites section.

**Note:** We are making everything from scratch today, however if you just want to start with Expo Go development with Solana, check out [Solana Mobile’s Expo template](https://docs.solanamobile.com/react-native/expo-dapp-template).


### 5. Solana Items

Create two new folders `components` and `screens`

Add in two new files `components/AuthProvider.tsx` and `components/ConnectionProvider/tsx`:

Create new file in `screens/MainScreen.tsx`:

```tsx
import {StatusBar, StyleSheet, View, Text} from 'react-native';
import React from 'react';

const mainScreenStyles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: 'lightgray',
  },

  incrementButtonContainer: {position: 'absolute', right: '5%', bottom: '3%'},
  counterContainer: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export function MainScreen() {
  return (
    <View style={mainScreenStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="darkblue" />
      <Text>Solana Expo App</Text>
    </View>
  );
}
```

Change `App.tsx`:
```tsx
import 'react-native-get-random-values';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { ConnectionProvider } from './components/ConnectionProvider';
import { AuthorizationProvider } from './components/AuthProvider';
import { clusterApiUrl } from '@solana/web3.js';
import { MainScreen } from './screens/MainScreen';
global.Buffer = require('buffer').Buffer;

export default function App() {
  // const cluster = "localhost" as any;
  // const endpoint = 'http://10.0.2.2:8899';
  const cluster = "devnet";
  const endpoint = clusterApiUrl(cluster);

  return (
    <ConnectionProvider
      endpoint={endpoint}
      config={{ commitment: "processed" }}
    >
      <AuthorizationProvider cluster={cluster}>
        <MainScreen/>
      </AuthorizationProvider>
    </ConnectionProvider>
  );
}
```
