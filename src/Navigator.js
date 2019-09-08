import {Dimensions} from 'react-native';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {Home} from './containers/Home/Home';
import CalendarMonth from './components/CalendarMonth';
import CalendarWeek from './components/CalendarWeek';
import {createStackNavigator} from 'react-navigation-stack';
import EventForm from './containers/Event/EventForm';
import EventEditForm from './containers/Event/EventEditForm';
import DrawerContent from './containers/DrawerContent';

export const HomeNavigator = createStackNavigator(
  {
    Home,
    EventForm,
    EventEditForm,
    CalendarMonth,
    CalendarWeek
  },
  {
    initialRouteName: 'Home'
  },
);

export const EventNavigator = createStackNavigator(
  {
    EventForm,
    EventEditForm
  },
  {
    initialRouteName: 'EventForm'
  },
);

export const DrawerNavigator = createDrawerNavigator(
  {
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
  },
);
