import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Switch } from 'react-native';
import { Icon } from 'native-base';
import moment from 'moment';
import DatePicker from 'react-native-datepicker';
import AsynStorage from '@react-native-community/async-storage';

class EventForm extends React.Component {
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
      <View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
        >
          <Icon
            style={{ fontSize: 40, color: '#4A4A4A', paddingLeft: 10 }}
            type="MaterialCommunityIcons"
            name="chevron-left"
          />
        </TouchableOpacity>
      </View>
    ),
    headerRight: (
      <View>
        <TouchableOpacity
          onPress={ async () => {
            const {
              title,
              date,
              startTime,
              endTime,
              remark
            } = navigation.state.params;
            let newEvent = {
              [date]: {
                title,
                startTime,
                endTime,
                remark,
                marked: true,
                dotColor: 'black'
              }
            };
            const markedDates = JSON.parse(await AsynStorage.getItem('markedDates'));
            markedDates.push(newEvent);
            AsynStorage.setItem('markedDates', JSON.stringify(markedDates));

            let markedDatesObj = {};
            markedDates.map((item) => {
              markedDatesObj = Object.assign(markedDatesObj, item);
              return markedDatesObj;
            });

            AsynStorage.setItem('markedDatesObj', JSON.stringify(markedDatesObj));

            // console.log('params title', navigation.state.params.title);
            // console.log('params date', navigation.state.params.date);
            // console.log('params start', navigation.state.params.startTime);
            // console.log('params end', navigation.state.params.endTime);
            // console.log('params remark', navigation.state.params.remark);
            navigation.navigate('Home', {newEvent});
          }}
        >
          <Icon
            style={{ fontSize: 30, paddingRight: 20}}
            type="MaterialIcons"
            name="add-box"
          />
        </TouchableOpacity>
      </View>
    )
  });

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      remark: '',
      date: null,
      startTime: null,
      endTime: null,
      allDay: false
    };
  }

  async componentDidMount() {
    let markedDates = [];
    // AsynStorage.removeItem('markedDates');
    // AsynStorage.removeItem('markedDatesObj');
    if (await AsynStorage.getItem('markedDates')) {
      markedDates = await AsynStorage.getItem('markedDates');
    } else {
      AsynStorage.setItem('markedDates', JSON.stringify(markedDates));
    }
  }

  toggleSwitch = async (value) => {
    await this.setState({allDay: value});
    if (this.state.allDay) {
      this.setState({startTime: '00:00', endTime: '23:59'});
    } else {
      this.setState({startTime: null, endTime: null});
    }
    console.log(this.state.allDay);
  }

  render() {
    // console.log('title', this.state.title);
    // console.log('start', this.state.startTime);
    // console.log('end', this.state.endTime);
    // console.log('remark', this.state.remark);
    return (
      <View style={{ flex: 1, paddingHorizontal: '5%'}}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'space-between'
          }}
        >
          <View style={{ flex: 0.1}}>
            <Text
              style={{
                color: '#1A1A1A',
                fontWeight: 'bold',
                fontSize: 30
              }}
            >
              New Event
            </Text>
            <Text
              style={{
                color: '#4A4A4A',
                fontSize: 15
              }}
            >
              Create your personal schedule
            </Text>
          </View>
          <View
            style={{
              flex: 0.1,
              alignItems: 'center',
              flexDirection: 'row',
              borderBottomWidth: 1,
              borderColor: '#EFEFEF'
            }}
          >
            <Icon
              style={{ fontSize: 30, color: '#8D8D8D', paddingRight: 5}}
              type="MaterialCommunityIcons"
              name="calendar-text"
            />
            <TextInput
              placeholder="Event Title"
              value={this.state.title}
              onChangeText={(title) => {
                this.setState({title});
                this.props.navigation.setParams({title});
              }}
            />
          </View>
          <View style={{flex: 0.1, justifyContent: 'center'}}>
            <Text style={{ fontSize: 15}}>Date</Text>
            <DatePicker
              style={{width: 200, borderWidth: 0, alignItems: 'flex-start'}}
              date={this.state.date}
              mode="date"
              placeholder="select date"
              format="YYYY-MM-DD"
              minDate={moment()}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              is24Hour
              customStyles={{
                dateIcon: {
                  display: 'none'
                },
                placeholderText: {
                  alignItems: 'flex-start'
                },
                dateInput: {
                  borderWidth: 0,
                  alignItems: 'flex-start'
                }
              }}
              onDateChange={(date) => {
                this.setState({date});
                this.props.navigation.setParams({date})
              }}
            />
          </View>
          <View style={{flex: 0.1, paddingTop: '5%', flexDirection: 'row'}}>
            <View style={{flex: 0.85}}>
              <Text style={{ fontSize: 15}}>All-Day</Text>
            </View>
            <View style={{flex: 0.15}}>
              <Switch
                onValueChange={async (value) => {
                  this.toggleSwitch(value);
                }}
                value={this.state.allDay}
              />
            </View>
          </View>
          <View style={{flex: 0.1, justifyContent: 'center', display: this.state.allDay ? 'none' : 'flex'}}>
            <Text style={{ fontSize: 15}}>Start Time</Text>
            <DatePicker
              style={{width: 200, borderWidth: 0, alignItems: 'flex-start'}}
              date={this.state.startTime}
              mode="time"
              placeholder="select date"
              format="HH:mm"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              is24Hour
              customStyles={{
                dateIcon: {
                  display: 'none'
                },
                placeholderText: {
                  alignItems: 'flex-start'
                },
                dateInput: {
                  borderWidth: 0,
                  alignItems: 'flex-start'
                }
              }}
              onDateChange={(startTime) => {
                this.setState({startTime});
                this.props.navigation.setParams({startTime})
              }}
            />
          </View>
          <View style={{flex: 0.1, justifyContent: 'center', width: '100%', display: this.state.allDay ? 'none' : 'flex'}}>
            <Text>Due Time</Text>
            <DatePicker
              style={{width: 200, borderWidth: 0, alignItems: 'flex-start'}}
              date={this.state.endTime}
              mode="time"
              iconComponent={(
                <Icon
                  type="MaterialIcons"
                  name="block"
                  style={{
                    fontSize: 20,
                    color: '#c9c9c9',
                    display: this.state.startTime === null ? 'flex' : 'none'
                  }}
                />
              )}
              disabled={this.state.startTime === null}
              placeholder="select date"
              format="HH:mm"
              minDate={this.state.startTime}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              is24Hour
              customStyles={{
                disabled: {
                  backgroundColor: null
                },
                placeholderText: {
                  alignItems: 'flex-start'
                },
                dateIcon: {
                  marginLeft: 100
                },
                dateInput: {
                  borderWidth: 0,
                  alignItems: 'flex-start',
                  marginRight: 100,
                  width: '150%'
                }
              }}
              onDateChange={(endTime) => {
                this.setState({endTime}); this.props.navigation.setParams({endTime});
              }}
            />
          </View>
          <View
            style={{
              flex: 0.1,
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderColor: '#EFEFEF'
            }}
          >
            <Text style={{fontSize: 15}}>Repeat</Text>
            <Icon
              style={{ fontSize: 20, paddingTop: '0.5%', color: '#8D8D8D'}}
              type="MaterialIcons"
              name="loop"
            />
          </View>
          <View
            style={{
              flex: 0.1,
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderColor: '#EFEFEF'
            }}
          >
            <Icon
              style={{ fontSize: 25, paddingTop: '0.5%', color: '#8D8D8D'}}
              type="MaterialCommunityIcons"
              name="map-marker-outline"
            />
            <Text style={{fontSize: 15}}>Add Location</Text>
          </View>
          <View
            style={{
              flex: 0.1,
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderColor: '#EFEFEF'
            }}
          >
            <Icon
              style={{ fontSize: 25, paddingTop: '0.5%', color: '#8D8D8D'}}
              type="MaterialIcons"
              name="notifications-none"
            />
            <Text style={{fontSize: 15}}>Notifications</Text>
          </View>
          <View style={{ flex: 0.3, paddingTop: '5%'}}>
            <View style={{ flexDirection: 'row'}}>
              <Icon
                style={{ fontSize: 20, paddingRight: 5, color: '#8D8D8D'}}
                type="MaterialCommunityIcons"
                name="calendar-edit"
              />
              <Text>Remarks</Text>
            </View>
            <TextInput
              multiline
              placeholder="Remarks"
              style={{ width: '100%', borderColor: '#DCD6D6', borderBottomWidth: 1}}
              onChangeText={(remark) => {
                this.setState({remark});
                this.props.navigation.setParams({remark})
              }}
              value={this.state.remark}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default EventForm;
