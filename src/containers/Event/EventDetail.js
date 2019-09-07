import React, {Component} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Icon} from 'native-base';
import EventDetailCompoent from '../../components/EventDetailCompoent';

export default class EventDetail extends Component {
  static navigationOptions = ({navigation}) => ({
    headerTitleStyle: {
      fontWeight: 'bold'
    },
    headerStyle: {
      backgroundColor: '#FFFFFF',
      marginTop: -40,
      borderBottomWidth: 0
    },
    headerLeft: (
      <View style={{marginLeft: 20, flex: 1, flexDirection: 'row'}}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon
            style={{fontSize: 30, color: '#4A4A4A', marginRight: 10}}
            type="MaterialIcons"
            name="menu"
          />
        </TouchableOpacity>
      </View>
    ),
    headerRight: (
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View style={{marginRight: 20}}>
          <TouchableOpacity onPress={() => navigation.navigate('EventForm')}>
            <Icon style={{fontSize: 30}} type="MaterialIcons" name="add-box" />
          </TouchableOpacity>
        </View>
      </View>
    )
  });

  render() {
    return (
      <View style={{flex: 1}}>
        <EventDetailCompoent />
      </View>
    );
  }
}
