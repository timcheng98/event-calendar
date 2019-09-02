import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import AsynStorage from '@react-native-community/async-storage';

export default class EventDetail extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   eventData: {}
    // };
  }

  async componentDidMount() {
    AsynStorage.removeItem('event_id');
    AsynStorage.setItem('event_id', JSON.stringify(this.props.eventData.id));
    console.log(await AsynStorage.getItem('event_id'));
    // this.setState({eventData: this.props.eventData});
    // console.log(this.props.eventData);
  }

  render() {
    const {
      title,
      startTime,
      endTime,
      remark,
      date
    } = this.props.eventData;
    return (
      <View style={{ flex: 1}}>
        <View style={{ flex: 0.3, backgroundColor: '', alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize: 35}}>{title}</Text>
        </View>
        <View style={{ flex: 0.2, justifyContent: ''}}>
          <View
            style={{
              flex: 0.2,
              paddingVertical: '2%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              width: '100%'
            }}
          >
            <View style={{flex: 0.1}}>
              <Icon
                style={{ fontSize: 25, color: '#4A4A4A' }}
                type="MaterialCommunityIcons"
                name="circle-medium"
              />
            </View>
            <View style={{flex: 0.55, justifyContent: 'center'}}>
              <Text
                style={{
                  fontSize: 12,
                  color: '#2E2E2E',
                  fontWeight: 'bold',
                  // paddingBottom: '2%'
                }}
              >
                {date}
              </Text>
            </View>
            <View style={{flex: 0.3 }}>
              <Text style={{fontSize: 12, color: '#2E2E2E'}}>
                {`${startTime} - ${endTime}`}
              </Text>
            </View>

            <View style={{flex: 0.15}}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('EventEditForm')}
              >
                <Icon
                  style={{ fontSize: 25, color: '#2E2E2E', paddingLeft: 10 }}
                  type="MaterialCommunityIcons"
                  name="square-edit-outline"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ flex: 0.5, justifyContent: 'flex-start', backgroundColor: ''}}>
          <Text>Remark</Text>
          <Text>
            {remark}
          </Text>
        </View>  
      </View>
    )
  }
}
