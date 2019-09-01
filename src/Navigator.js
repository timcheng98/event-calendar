import React from 'react';
import { Dimensions} from 'react-native';
import { createDrawerNavigator} from 'react-navigation-drawer';
import {Home} from './containers/Home/Home';
import CalendarMonth from './components/CalendarMonth';
import {createStackNavigator} from 'react-navigation-stack'
import EventForm from './containers/Event/EventForm';
import DrawerContent from './containers/DrawerContent';

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
  drawerWidth: Dimensions.get('window').width * 0.6,
  drawerBackgroundColor: '#FFF',
  contentComponent: DrawerContent,
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
