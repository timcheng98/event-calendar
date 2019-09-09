import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  Animated,
  Platform,
  Keyboard,
  Dimensions,
  ScrollView,
  TextInput,
  Switch,
  StyleSheet
} from 'react-native';
import {Button, Icon} from 'native-base';
import DatePicker from 'react-native-datepicker';
import Header from '../../components/Header';
import * as Main from '../../core/Main';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

class EventEditForm extends React.Component {
  static navigationOptions = ({navigation}) => ({
    headerTitleStyle: {
      fontWeight: 'bold'
    },
    headerStyle: {
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 0
    },
    headerForceInset: {top: 'never', bottom: 'never'},
    headerLeft: (
      <Header
        action={() => navigation.navigate('Home')}
        type="MaterialCommunityIcons"
        iconName="chevron-left"
      />
    ),
    headerRight: null
  });

  constructor(props) {
    super(props);
    this.keyboardWillHide = this.keyboardWillHide.bind(this);
    this.keyboardWillShow = this.keyboardWillShow.bind(this);
    this.state = {
      title: '',
      remark: '',
      date: null,
      startTime: null,
      endTime: null,
      allDay: false,
      target: {},
      markedDates: [],
      animTop: new Animated.Value(0),
      isRemark: false
    };
  }

  async componentDidMount() {
    let markedDates = [];
    let id = await Main.getStorage('event_id');
    if (await Main.getStorage('markedDates')) {
      markedDates = await Main.getStorage('markedDates');
      this.setState({markedDates});
    } else {
      await Main.setStorage('markedDates', markedDates);
    }
    this.state.markedDates.map((item) => {
      let date = Main.getKey(item);
      let event = Main.getValue(item);
      let {
        title, startTime, endTime, remark, allDay
      } = event;
      let target = {
        title,
        date,
        startTime,
        endTime,
        remark,
        allDay
      };
      if (event.id === id) {
        this.setState({target});
      }
      return null;
    });
    const {
      title, startTime, endTime, remark, date, allDay
    } = this.state.target;
    this.setState({
      title,
      startTime,
      endTime,
      remark,
      date,
      allDay
    });

    if (Platform.OS === 'ios') {
      this.keyboardDidShowListener = Keyboard.addListener(
        'keyboardWillShow',
        this.keyboardWillShow,
      );
      this.keyboardDidHideListener = Keyboard.addListener(
        'keyboardWillHide',
        this.keyboardWillHide,
      );
    } else {
      this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow);
      this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide);
    }
  }

  toggleSwitch = async (value) => {
    await this.setState({allDay: value});
    if (this.state.allDay) {
      this.setState({startTime: '00:00', endTime: '23:59'});
      this.props.navigation.setParams({startTime: '00:00', endTime: '23:59'});
    } else {
      this.setState({startTime: null, endTime: null});
      this.props.navigation.setParams({startTime: null, endTime: null});
    }
  };

  keyboardWillHide() {
    this.setState({isRemark: false});
    Animated.timing(this.state.animTop, {
      toValue: 0,
      duration: 500
    }).start();
  }

  keyboardWillShow() {
    Animated.timing(this.state.animTop, {
      toValue: -screenHeight * 0.3,
      duration: 500
    }).start();
  }

  render() {
    const {
      title, startTime, endTime, remark, date, allDay
    } = this.state;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{flex: 1, paddingHorizontal: '5%'}}>
          <SafeAreaView style={{flex: 1}}>
            <Animated.View style={{flex: 1, top: this.state.isRemark ? this.state.animTop : null}}>
              <View style={{flex: 0.1}}>
                <Text
                  style={{
                    color: '#1A1A1A',
                    fontWeight: 'bold',
                    fontSize: 30
                  }}
                >
                  Edit Event
                </Text>
                <Text
                  style={{
                    color: '#4A4A4A',
                    fontSize: 15
                  }}
                >
                  Edit your personal schedule
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
                  style={{fontSize: 30, color: '#8D8D8D', paddingRight: 5}}
                  type="MaterialCommunityIcons"
                  name="calendar-text"
                />
                <TextInput
                  placeholder="Event Title"
                  value={title}
                  onChangeText={(value) => {
                    this.setState({title: value});
                  }}
                />
              </View>
              <View style={{flex: 0.1, justifyContent: 'center'}}>
                <Text style={{fontSize: 15}}>Date</Text>
                <DatePicker
                  style={{width: 200, borderWidth: 0, alignItems: 'flex-start'}}
                  date={date}
                  mode="date"
                  placeholder="select date"
                  format="YYYY-MM-DD"
                  minDate={new Date()}
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
                  onDateChange={(value) => {
                    this.setState({date: value});
                  }}
                />
              </View>
              <View style={{flex: 0.1, paddingTop: '5%', flexDirection: 'row'}}>
                <View style={{flex: 0.85}}>
                  <Text style={{fontSize: 15}}>Whole Day</Text>
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
              <View
                style={{
                  flex: 0.1,
                  justifyContent: 'center',
                  display: this.state.allDay ? 'none' : 'flex'
                }}
              >
                <Text style={{fontSize: 15}}>Start Time</Text>
                <DatePicker
                  style={{width: 200, borderWidth: 0, alignItems: 'flex-start'}}
                  date={startTime}
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
                  onDateChange={(value) => {
                    this.setState({startTime: value});
                    // this.props.navigation.setParams({startTime})
                  }}
                />
              </View>
              <View
                style={{
                  flex: 0.1,
                  justifyContent: 'center',
                  width: '100%',
                  display: this.state.allDay ? 'none' : 'flex'
                }}
              >
                <Text>Due Time</Text>
                <DatePicker
                  style={{width: 200, borderWidth: 0, alignItems: 'flex-start'}}
                  date={endTime}
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
                  onDateChange={(value) => {
                    this.setState({endTime: value});
                    // this.props.navigation.setParams({endTime});
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
                  style={{fontSize: 20, paddingTop: '0.5%', color: '#8D8D8D'}}
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
                  style={{fontSize: 25, paddingTop: '0.5%', color: '#8D8D8D'}}
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
                  style={{fontSize: 25, paddingTop: '0.5%', color: '#8D8D8D'}}
                  type="MaterialIcons"
                  name="notifications-none"
                />
                <Text style={{fontSize: 15}}>Notifications</Text>
              </View>
              <View style={{flex: 0.3, paddingTop: '5%'}}>
                <View style={{flexDirection: 'row'}}>
                  <Icon
                    style={{fontSize: 20, paddingRight: 5, color: '#8D8D8D'}}
                    type="MaterialCommunityIcons"
                    name="calendar-edit"
                  />
                  <Text>Remarks</Text>
                </View>
                <TextInput
                  onTouchStart={() => this.setState({isRemark: true})}
                  multiline
                  placeholder="Remarks"
                  style={{width: '100%', borderColor: '#DCD6D6', borderBottomWidth: 1}}
                  onChangeText={(value) => {
                    this.setState({remark: value});
                    // this.props.navigation.setParams({remark})
                  }}
                  value={remark}
                />
              </View>
              <View style={{flex: 0.1, alignItems: 'center', justifyContent: 'center'}}>
                <Button
                  rounded
                  bordered
                  style={{
                    borderColor: '#4A4A4A',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    width: '67%'
                  }}
                  onPress={async () => {
                    let id = await Main.getStorage('event_id');
                    let newMarkedDates = [];
                    this.state.markedDates.map((item) => {
                      let event = Main.getValue(item);

                      if (event.id !== id) {
                        newMarkedDates.push(item);
                      } else {
                        let markedDateObj = {
                          [date]: {
                            id,
                            title,
                            startTime,
                            endTime,
                            remark,
                            allDay,
                            marked: true,
                            selectedColor: '#008CBF',
                            selected: true,
                            dotColor: 'black'
                          }
                        };
                        newMarkedDates.push(markedDateObj);
                      }
                      return newMarkedDates;
                    });
                    await Main.setStorage('markedDates', newMarkedDates);
                    let markedDatesObj = {};
                    newMarkedDates.map((item) => {
                      markedDatesObj = Object.assign(markedDatesObj, item);
                      return markedDatesObj;
                    });

                    await Main.setStorage('markedDatesObj', markedDatesObj);

                    this.props.navigation.goBack();
                  }}
                >
                  <Text style={{fontSize: 15, color: '#4A4A4A', fontWeight: '500'}}>Confirm</Text>
                </Button>
              </View>
            </Animated.View>
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({});
export default EventEditForm;
