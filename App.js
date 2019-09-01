
import React from 'react';
import {
  SafeAreaView
} from 'react-native';
import { createAppContainer, createSwitchNavigator} from 'react-navigation';
import { DrawerNavigator } from './src/Navigator';

const AppContainer = createAppContainer(createSwitchNavigator({
  DrawerNavigator
},
{
  initialRouteName: 'DrawerNavigator'
}));

export const App = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <AppContainer />
    </SafeAreaView>
  );
}

export default App;
