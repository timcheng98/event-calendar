import React from 'react';
import { View, Image } from 'react-native';
import SpinnerGif from '../assets/img/Spinner-1s-50px.gif';


const Spinner = () => (
  <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
    <Image source={SpinnerGif} />
  </View>
);

export default Spinner;
