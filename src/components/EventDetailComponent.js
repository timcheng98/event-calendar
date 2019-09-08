import React, {Component} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {Card, Icon} from 'native-base';
import * as Main from '../core/Main';

export default class EventDetailComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      title, startTime, endTime, remark, date, allDay
    } = this.props.eventData;
    return (
      <View
        style={{
          flex: 1,
          paddingHorizontal: this.props.singleDay ? '5%' : null
        }}
      >
        <Card
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
            shadowColor: '#4A4A4A',
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.3,
            shadowRadius: 3.84,
            borderRadius: 5,
            elevation: 5,
            paddingHorizontal: '5%'
          }}
        >
          {this.props.singleDay ? null : (
            <View
              style={{
                flex: 0.1,
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingTop: 10,
                flexDirection: 'row'
              }}
            >
              <TouchableOpacity
                onPress={() => this.props.navigation.setParams({isEventSelected: false})}
              >
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Icon
                    type="MaterialIcons"
                    name="clear"
                    style={{fontSize: 18, color: '#4A4A4A'}}
                  />
                  <Text style={{fontSize: 15, color: '#4A4A4A'}}>Close</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          <View
            style={{
              flex: 0.15,
              paddingTop: this.props.singleDay ? '5%' : null,
              alignItems: 'center',
              justifyContent: this.props.weekMode ? 'flex-end' : null,
              borderBottomWidth: 1 / 3,
              borderColor: '#8D8D8D'
            }}
          >
            <Text style={{fontSize: 25, color: '#4A4A4A'}}>{title}</Text>
          </View>
          <View style={{flex: 0.2, justifyContent: 'center'}}>
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
                  style={{fontSize: 18, color: '#4A4A4A'}}
                  type="MaterialCommunityIcons"
                  name="circle-medium"
                />
              </View>
              <View style={{flex: 0.55, justifyContent: 'center'}}>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#2E2E2E',
                    fontWeight: 'bold'
                  }}
                >
                  {date}
                </Text>
              </View>
              <View style={{flex: 0.3}}>
                <Text style={{fontSize: 12, color: '#2E2E2E'}}>
                  {allDay ? 'Whole Day' : `${startTime} - ${endTime}`}
                </Text>
              </View>

              <View style={{flex: 0.15}}>
                <TouchableOpacity
                  onPress={async () => {
                    this.props.navigation.setParams({visible: false});
                    await Main.removeStorage('event_id');
                    await Main.setStorage('event_id', this.props.eventData.id);
                    this.props.navigation.navigate('EventEditForm');
                  }}
                >
                  <Icon
                    style={{fontSize: 18, color: '#2E2E2E', paddingLeft: 10}}
                    type="MaterialCommunityIcons"
                    name="square-edit-outline"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{flex: 0.5, justifyContent: 'flex-start', paddingBottom: '10%'}}>
            <Text
              style={{
                color: '#4A4A4A',
                fontSize: 15,
                paddingVertical: '2%',
                textDecorationLine: 'underline'
              }}
            >
              Remark
            </Text>
            {remark === undefined || remark === '' ? (
              <Text style={{
                color: '#CCCCCC', fontSize: 15, alignSelf: 'center', paddingTop: 15
              }}
              >
                No Remark
              </Text>
            ) : (
              <Text style={{color: '#4A4A4A', fontSize: 15}}>{remark}</Text>
            )}
          </View>
        </Card>
      </View>
    );
  }
}
