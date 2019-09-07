import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Icon } from 'native-base';

export default class DrawerContent extends Component {
  render() {
    return (
      <View style={{ flex: 1}}>
        <View style={{ flex: 0.1, justifyContent: 'flex-end', borderBottomWidth: 1 / 3, borderColor: '#cccccc'}}>
          <Text style={{ fontSize: 18, paddingHorizontal: '5%', paddingBottom:'3%', color: '#4A4A4A'}}>Event Managment</Text>
        </View>
        <View style={{ flex: 0.6, justifyContent: 'flex-start', paddingHorizontal: '5%'}}>
          <View style={{ flex: 0.02, alignItems: 'center', flexDirection: 'row'}} />
          <View style={{ flex: 0.1, alignItems: 'center', flexDirection: 'row'}}>
            <Icon
              style={{ fontSize: 25, color: '#4A4A4A'}}
              type="MaterialCommunityIcons"
              name="home"
            />
            <Text style={{ fontSize: 15, color: '#4A4A4A'}}>Home</Text>
          </View>
          <View style={{ flex: 0.1, alignItems: 'center', flexDirection: 'row'}}>
            <Icon
              style={{ fontSize: 25, color: '#4A4A4A'}}
              type="MaterialIcons"
              name="list"
            />
            <Text style={{ fontSize: 15, color: '#4A4A4A'}}>Todo</Text>
          </View>
        </View>
      </View>
    )
  }
}
