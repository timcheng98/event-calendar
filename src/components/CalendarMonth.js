import React from 'react';
import {
  View, Modal, TouchableOpacity, FlatList, Text
} from 'react-native';
import { Spinner, Card, Icon } from 'native-base';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';
import EventDetailComponent from './EventDetailCompoent';
import * as Main from '../core/Main';

class CalendarMonth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markedDatesObj: {},
      day: '',
      loading: true
    };
    this.props.navigation.addListener(
      'willFocus',
      async () => {
        let markedDatesObj = await Main.getStorage('markedDatesObj');
        this.setState({markedDatesObj, loading: false});
      }
    );
  }

  async componentDidMount() {
    let markedDatesObj = await Main.getStorage('markedDatesObj');
    this.setState({markedDatesObj, loading: false});
    this.props.navigation.setParams({visible: false});
  }

  renderEvent() {
    let {markedDates} = this.props;
    let selectedDay = [];
    if (markedDates !== null) {
      markedDates.map((item) => {
        if (Object.keys(item)[0] === this.state.day) {
          selectedDay.push(item);
        }
        return item;
      });
    }
    if (selectedDay.length > 0 ) {
      return (
        <FlatList
          showsVerticalScrollIndicator={true}
          data={selectedDay}
          style={{flex: 1}}
          keyExtractor={(item, index) => index.toString()}
          renderItem={(item) => {
            let event = Object.values(item.item)[0];
            let date = Object.keys(item.item)[0];
            let {
              title,
              startTime,
              endTime,
              remark,
              id
            } = event;
            date = moment(date).format('MMMM DD, YYYY');
            let eventObj = {
              title, startTime, endTime, date, remark, id
            };
            return (
              <EventDetailComponent
                eventData={eventObj}
                singleDay
                {...this.props}
              />
            );
          }}
        />
      );
    }
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <TouchableOpacity
          onPress={() => this.props.navigation.setParams({visible: false})}
        >
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text style={{color: '#CCCCCC', fontSize: 18}}>No Event</Text>
            <Text style={{color: '#CCCCCC', fontSize: 18}}>Click “+” button to create event</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const {
      markedDatesObj,
      loading
    } = this.state;

    if (loading) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Spinner />
        </View>
      );
    }

    return (
      <View
        style={{ flex: 1, width: '100%', height: '100%', alignItems: 'center'}}
      >
        <Calendar
          markedDates={markedDatesObj}
          displayLoadingIndicator
          style={{ width: '100%' }}
          hideExtraDays
          onMonthChange={(month) => this.props.navigation.setParams({selectedMonth: month})}
          onDayPress={async (day) => {
            this.props.navigation.setParams({visible: true});
            await Main.setEvents(day.dateString);
            let dateString = await Main.getEvents();
            this.setState({day: dateString});
          }}
        />
        <Modal
          animationType="slide"
          transparent
          visible={this.props.navigation.getParam('visible')}
        >
          {/* <TouchableWithoutFeedback
            onPress={() => this.props.navigation.setParams({visible: false})}
          > */}
            <View style={{flex: 1, backgroundColor: '#FFFFFFE7'}}>
              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <View 
                  style={{
                    flex: 0.2,
                    alignItems: 'flex-end',
                    paddingBottom: 5,
                    flexDirection: 'row'
                  }}
                >
                  <View style={{flex: 0.25, paddingLeft: '5%'}}>
                  </View>
                  <View style={{flex: 0.5, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 25, color: '#4A4A4A', alignSelf: 'center'}}>
                      {this.state.day}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 0.25,
                      justifyContent: 'flex-end',
                      alignItems: 'flex-end',
                      paddingRight: '5%'
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => this.props.navigation.setParams({visible: false})}
                    >
                      <Icon
                        type="MaterialIcons"
                        name="clear"
                        style={{fontSize: 28, color: '#4A4A4A', width: '100%'}}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{flex: 0.6, width: '100%'}}>
                  {this.renderEvent()}
                </View>
                <View style={{flex: 0.2}} />
              </View>
            </View>
          {/* </TouchableWithoutFeedback> */}
        </Modal>
      </View>
    );
  }
}
export default CalendarMonth;
