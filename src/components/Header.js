import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';

export default class Header extends Component {
  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={this.props.action}
        >
          <Icon style={{fontSize: 30, paddingHorizontal: 10}} type={this.props.type} name={this.props.iconName} />
        </TouchableOpacity>
      </View>
    );
  }
}
