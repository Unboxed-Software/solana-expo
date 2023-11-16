import {StatusBar, StyleSheet, View, Text} from 'react-native';
import React from 'react';
import { useConnection } from '../components/ConnectionProvider';
import { PublicKey } from '@solana/web3.js';
import ImagePickerExample from '../components/ImagePicker';

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

    const {connection} = useConnection();

    const printConnection = async () => {
        // const bh = await connection.getBlockHeight();
        try {
            const publicKey = new PublicKey('7RawqnUsUxA8pnb8nAUTgyzRaLVRYwR9yzPR3gfzbdht');
            const info = await connection.getBalance(publicKey);
            console.log(info);
        } catch (e) {
            console.log(e);
        }
    }

    printConnection();

  return (
    <View style={mainScreenStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="darkblue" />
      <Text>Solana Expo App</Text>
      <ImagePickerExample/>
    </View>
  );
}