import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import {Card, Icon} from 'native-base';


export default class EventPreviewTemplate extends Component {

  render() {
    let {
      title,
      startTime,
      endTime,
      id,
      allDay,
      remark
    } = this.props.dataSet;
    let {date} = this.props;
    console.log('123', this.props.date);

    return (
      <View style={{flex: 1}}>
        <TouchableOpacity 
          onPress={() => {
            let eventObj = {
              title, startTime, endTime, date, remark, id, allDay
            };
            this.props.navigation.setParams({visible: true});
            this.props.navigation.setParams({selectedEvent: eventObj});
            console.log(eventObj);
            // setSelectedEvent(eventObj);
      }}
        >
          <Card
            style={{
              flex: 1,
              paddingVertical: '5%',
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 0,
              width: '90%'
              // justifyContent: 'flex-start',
              // width: '100%',
              // borderBottomWidth: 1 / 3,
              // borderColor: '#CCCCCC'
            }}
          >
            <View 
              style={{
                flex: 0.4,
                paddingHorizontal: '5%',
                paddingVertical: '5%'
                // padding: '1%'
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  color: '#2E2E2E',
                  fontWeight: 'bold'
                }}
              >
                {title}
              </Text>
            </View>
            <View style={{flex: 0.3 }}>
              <Text style={{color: '#4A4A4A', fontSize: 12}}>
                {allDay
                  ? 'Whole Day'
                  : `${startTime} - ${endTime}`}
              </Text>
            </View>
            <View style={{flex: 0.3}}>
              <Icon
                style={{ fontSize: 25, color: '#2E2E2E', paddingLeft: 10 }}
                type="MaterialCommunityIcons"
                name="arrow-right-box"
              />
            </View>
          </Card>
        </TouchableOpacity>
      </View>
    )
  }
}
