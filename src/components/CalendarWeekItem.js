import React, { Component } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';

export default class CalendarWeekItem extends Component {
  render() {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 2,
          backgroundColor: this.props.bgColor,
          borderBottomWidth: 1 / 3,
          borderColor: '#cccccc',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          paddingVertical: 10
        }}
        // key={uuidV4()}
      >
        <View style={{flex: 0.2, alignItems: 'center'}}>
          <Text style={{fontSize: 15, color: '#4A4A4A'}}>{this.props.date}</Text>
          <Text style={{fontSize: 18, color: '#4A4A4A'}}>{this.props.day}</Text>
        </View>
        {this.props.item.length > 0 ? (
          <View style={{flex: 0.8}}>{this.props.item}</View>
        ) : (
          <TouchableOpacity
            style={{
              flex: 0.8,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: '5%',
              width: '100%'
            }}
            onPress={() => this.props.navigation.navigate('EventForm')}
          >
            <View style={{alignItems: 'center'}}>
              <Text style={{fontSize: 15, color: '#CCCCCC'}}>No Event</Text>
              <Icon
                style={{fontSize: 18, color: '#008CBF'}}
                type="MaterialIcons"
                name="add-circle-outline"
              />
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>
    )
  }
}
