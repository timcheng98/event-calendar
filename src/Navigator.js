import React from 'react';
import { Text, View ,TouchableOpacity} from 'react-native';
import {createStackNavigator, createDrawerNavigator} from 'react-navigation';
import {Home} from './containers/Home/Home';
import CalendarMonth from './components/CalendarMonth';
import EventForm from './containers/Event/EventForm';

export const HomeNavigator = createStackNavigator({
  Home,
  CalendarMonth
},
{
  initialRouteName: 'Home'
});

export const EventNavigator = createStackNavigator({
  EventForm
});

export const DrawerNavigator = createDrawerNavigator({
  HomeNavigator,
  EventNavigator
},
{
  initialRouteName: 'HomeNavigator',
  drawerPosition: 'left',
  defaultNavigationOptions: {
    header: null
  },
  drawerBackgroundColor: '#FFF',
  contentComponent: null,
  contentOptions: {
    activeTintColor: '#707070',
    activeLabelStyle: {
      fontWeight: '400'
    },
    inactiveLabelStyle: {
      fontWeight: '200'
    }
  }
});
