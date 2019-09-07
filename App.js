
import React from 'react';
import {
  SafeAreaView, View
} from 'react-native';
import { createAppContainer, createSwitchNavigator} from 'react-navigation';
import { DrawerNavigator } from './src/Navigator';
import LandingScreen from './src/containers/Landing/LandingScreen';

const AppContainer = createAppContainer(createSwitchNavigator({
  LandingScreen,
  DrawerNavigator
},
{
  initialRouteName: 'DrawerNavigator'
}));

export const App = () => {
  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <AppContainer />
      </SafeAreaView>
    </View>
  );
}

export default App;
