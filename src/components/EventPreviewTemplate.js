import React, {Component} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {Card, Icon} from 'native-base';

export default class EventPreviewTemplate extends Component {
  render() {
    let {
      title, startTime, endTime, id, allDay, remark
    } = this.props.dataSet;
    let {date} = this.props;

    return (
      <View style={{flex: 1}}>
        <TouchableOpacity
          onPress={() => {
            let eventObj = {
              title,
              startTime,
              endTime,
              date,
              remark,
              id,
              allDay
            };
            this.props.navigation.setParams({visible: true, selectedEvent: eventObj});
          }}
        >
          <Card
            style={{
              flex: 1,
              paddingHorizontal: '3%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              width: '90%',
              backgroundColor: '#FFFFFF',
              borderColor: '#FFFFFF',
              shadowColor: '#FFFFFF',
              shadowOffset: {
                width: 0,
                height: 2
              },
              shadowOpacity: 0.3,
              shadowRadius: 3.84,
              borderRadius: 5,
              elevation: 3
            }}
          >
            <View
              style={{
                flex: 0.4,
                paddingVertical: '5%'
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
            <View style={{flex: 0.3}}>
              <Text style={{color: '#4A4A4A', fontSize: 12}}>
                {allDay ? 'Whole Day' : `${startTime} - ${endTime}`}
              </Text>
            </View>
            <View style={{flex: 0.3}}>
              <Icon
                style={{fontSize: 25, color: '#2E2E2E', paddingLeft: 10}}
                type="MaterialCommunityIcons"
                name="arrow-right-box"
              />
            </View>
          </Card>
        </TouchableOpacity>
      </View>
    );
  }
}
