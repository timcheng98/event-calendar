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
import {Icon} from 'native-base';
import moment from 'moment';
import DatePicker from 'react-native-datepicker';
import uuidv4 from 'uuid/v4';
import Header from '../../components/Header';
import * as Main from '../../core/Main';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

class EventForm extends React.Component {
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
        iconName="chevron-left"
        type="MaterialCommunityIcons"
      />
    ),
    headerRight: (
      <Header
        action={async () => {
          const {
            title, date, startTime, endTime, remark, allDay
          } = navigation.state.params;
          let newEvent = {
            [date]: {
              id: uuidv4(),
              title,
              startTime,
              endTime,
              remark,
              marked: true,
              dotColor: 'black',
              selected: true,
              allDay,
              selectedColor: '#008CBF'
            }
          };
          const markedDates = await Main.getStorage('markedDates');
          markedDates.push(newEvent);
          await Main.setStorage('markedDates', markedDates);

          let markedDatesObj = {};
          markedDates.map((item) => {
            markedDatesObj = Object.assign(markedDatesObj, item);
            return markedDatesObj;
          });

          await Main.setStorage('markedDatesObj', markedDatesObj);
          navigation.navigate('Home', {newEvent});
        }}
        type="MaterialIcons"
        iconName="add-box"
      />
    )
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
      animTop: new Animated.Value(0),
      isRemark: false
    };
    this.props.navigation.addListener('willFocus', () => {
      this.setState({
        title: '',
        remark: '',
        date: null,
        startTime: null,
        endTime: null,
        allDay: false
      });
    });
  }

  async componentDidMount() {
    let markedDates = [];
    // await Main.removeStorage('markedDates');
    // await Main.removeStorage('markedDatesObj');
    if (await Main.getStorage('markedDates')) {
      markedDates = await Main.getStorage('markedDates');
    } else {
      await Main.setStorage('markedDates', markedDates);
    }

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
      this.props.navigation.setParams({startTime: '00:00', endTime: '23:59', allDay: true});
    } else {
      this.setState({startTime: null, endTime: null, allDay: false});
      this.props.navigation.setParams({startTime: null, endTime: null});
    }
    console.log(this.state.allDay);
    console.log(typeof this.state.startTime);
    console.log(this.state.endTime);
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
    console.log('isRemark', this.state.isRemark);
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{flex: 1, paddingHorizontal: '5%'}}>
          <SafeAreaView style={{flex: 1}}>
            <Animated.View style={{flex: 1, top: this.state.isRemark ? this.state.animTop : null}}>
              <View style={{flex: 0.1}}>
                <Text style={styles.newEvent}>New Event</Text>
                <Text style={styles.mdText}>Create your personal schedule</Text>
              </View>
              <View style={styles.title}>
                <Icon style={styles.lgIcon} type="MaterialCommunityIcons" name="calendar-text" />
                <TextInput
                  style={{flex: 1, paddingVertical: '1%'}}
                  placeholder="Event Title"
                  value={this.state.title}
                  onChangeText={(title) => {
                    this.setState({title});
                    this.props.navigation.setParams({title});
                  }}
                />
              </View>
              <View style={{flex: 0.1, justifyContent: 'center'}}>
                <Text style={{fontSize: 15}}>Date</Text>
                <DatePicker
                  style={styles.datePicker}
                  date={this.state.date}
                  mode="date"
                  placeholder="Pick a Date"
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
                  onDateChange={(date) => {
                    this.setState({date});
                    this.props.navigation.setParams({date});
                  }}
                />
              </View>
              <View style={{flex: 0.05, alignItems: 'center', flexDirection: 'row'}}>
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
                <Text style={styles.mdText}>Start Time</Text>
                <DatePicker
                  style={styles.datePicker}
                  date={this.state.startTime}
                  mode="time"
                  placeholder="Pick a time"
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
                    this.props.navigation.setParams({startTime});
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
                  style={styles.datePicker}
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
                  placeholder="Pick a time"
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
                      width: '100%'
                    }
                  }}
                  onDateChange={(endTime) => {
                    this.setState({endTime});
                    this.props.navigation.setParams({endTime});
                  }}
                />
              </View>
              <View style={styles.title}>
                <Text style={{fontSize: 15}}>Repeat</Text>
                <Icon style={styles.mdIcon} type="MaterialIcons" name="loop" />
              </View>
              <View style={styles.title}>
                <Icon
                  style={styles.mdIcon}
                  type="MaterialCommunityIcons"
                  name="map-marker-outline"
                />
                <Text style={{fontSize: 15}}>Add Location</Text>
              </View>
              <View style={styles.title}>
                <Icon style={styles.mdIcon} type="MaterialIcons" name="notifications-none" />
                <Text style={{fontSize: 15}}>Notifications</Text>
              </View>
              <View style={{flex: 0.3, paddingTop: '5%'}}>
                <View style={{flexDirection: 'row'}}>
                  <Icon style={styles.mdIcon} type="MaterialCommunityIcons" name="calendar-edit" />
                  <Text>Remarks</Text>
                </View>
                <TextInput
                  onTouchStart={() => this.setState({isRemark: true})}
                  multiline
                  placeholder="Remarks"
                  style={styles.textInput}
                  onChangeText={(remark) => {
                    this.setState({remark});
                    this.props.navigation.setParams({remark});
                  }}
                  value={this.state.remark}
                />
              </View>
            </Animated.View>
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: 'space-between'
  },
  newEvent: {
    color: '#1A1A1A',
    fontWeight: 'bold',
    fontSize: 30
  },
  mdText: {
    color: '#4A4A4A',
    fontSize: 15
  },
  textInput: {
    width: '100%',
    borderColor: '#DCD6D6',
    borderBottomWidth: 1
  },
  title: {
    flex: 0.1,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#EFEFEF'
  },
  lgIcon: {
    fontSize: 25,
    color: '#8D8D8D',
    paddingRight: 5
  },
  mdIcon: {
    fontSize: 18,
    color: '#8D8D8D',
    paddingRight: 5
  },
  datePicker: {
    width: '100%',
    borderWidth: 0,
    alignItems: 'flex-start'
  }
});

export default EventForm;
