import React, {Component} from 'react';
import {
  View, Modal, TouchableOpacity, Text, ScrollView
} from 'react-native';
import {Icon} from 'native-base';
import moment from 'moment';
import EventDetailComponent from './EventDetailCompoent';
import EventPreviewTemplate from './EventPreviewTemplate';
import uuidV4 from 'uuid/v4';
import * as Main from '../core/Main';

export default class CalendarWeek extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weekEvents: [],
      dayOfWeek: [],
      sun: [],
      mon: [],
      tue: [],
      wed: [],
      thu: [],
      fri: [],
      sat: []
    };
  }

  async componentDidMount() {
    let year = moment().year();
    let week = moment().week();
    let dayOfWeek = [];
    for (let i = 0; i < 7; i++) {
      dayOfWeek.push(this.getDateFromWeek(week, year, i));
    }
    let weekEvents = [];
    let markedDates = await Main.getStorage('markedDates');
    markedDates.map((item) => {
      let date = Main.getKey(item);
      if (date >= dayOfWeek[0] && date <= dayOfWeek[6]) {
        weekEvents.push(item);
      }
      return item;
    });

    this.setState({dayOfWeek, weekEvents});

    this.renderItem();
  }

  getDateFromWeek(week, year, addDay = 0) {
    return moment()
      .day('Sunday')
      .year(year)
      .week(week)
      .add(addDay, 'd')
      .format('YYYY-MM-DD');
  }

  getDayFromWeek(week, year, addDay = 0) {
    return moment()
      .day('Sunday')
      .year(year)
      .week(week)
      .add(addDay, 'd')
      .format('DD');
  }

  eventPreviewTemplate(event, date) {
    console.log('date', date);
    return <EventPreviewTemplate key={event.id} dataSet={event} date={date} {...this.props} />;
  }

  renderItem() {
    let sun = [];
    let mon = [];
    let tue = [];
    let wed = [];
    let thu = [];
    let fri = [];
    let sat = [];
    this.state.weekEvents.map((item) => {
      let date = Main.getKey(item);
      let event = Main.getValue(item);
      if (date === this.state.dayOfWeek[0]) {
        sat.push(this.eventPreviewTemplate(event, date));
      }
      if (date === this.state.dayOfWeek[1]) {
        sat.push(this.eventPreviewTemplate(event, date));
      }
      if (date === this.state.dayOfWeek[2]) {
        sat.push(this.eventPreviewTemplate(event, date));
      }
      if (date === this.state.dayOfWeek[3]) {
        sat.push(this.eventPreviewTemplate(event, date));
      }
      if (date === this.state.dayOfWeek[4]) {
        sat.push(this.eventPreviewTemplate(event, date));
      }
      if (date === this.state.dayOfWeek[5]) {
        sat.push(this.eventPreviewTemplate(event, date));
      }
      if (date === this.state.dayOfWeek[6]) {
        sat.push(this.eventPreviewTemplate(event, date));
      }
    });

    this.setState({
      sun,
      mon,
      tue,
      wed,
      thu,
      fri,
      sat
    });
  }

  renderWeekItem(date, day, item, bgColor = '#FFFFFF') {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 2,
          backgroundColor: bgColor,
          borderBottomWidth: 1 / 3,
          borderColor: '#cccccc',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row'
        }}
        key={uuidV4()}
      >
        <View style={{flex: 0.2, alignItems: 'center'}}>
          <Text style={{fontSize: 15, color: '#4A4A4A'}}>{date}</Text>
          <Text style={{fontSize: 18, color: '#4A4A4A'}}>{day}</Text>
        </View>
        {item.length > 0 ? (
          <View style={{flex: 0.8}}>{item}</View>
        ) : (
          <TouchableOpacity
            style={{
              flex: 0.8,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: '5%',
              width: '100%'
            }}
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
    );
  }

  renderEvent() {
    return (
      <View style={{flex: 1}}>
        <EventDetailComponent
          eventData={this.props.navigation.getParam('selectedEvent')}
          singleDay
          weekMode
          {...this.props}
        />
        <View style={{flex: 0.2}} />
      </View>
    );
  }

  render() {
    let {dayOfWeek} = this.state;
    console.log(dayOfWeek[0]);
    return (
      <View>
        <ScrollView contentContainerStyle={{flexGrow: 1}} key={uuidV4()}>
          {this.renderWeekItem(
            this.getDayFromWeek(moment().week(), moment().year(), 0),
            'Sun',
            this.state.sun,
            '#FDFDFD',
          )}
          {this.renderWeekItem(
            this.getDayFromWeek(moment().week(), moment().year(), 1),
            'Mon',
            this.state.mon,
          )}
          {this.renderWeekItem(
            this.getDayFromWeek(moment().week(), moment().year(), 2),
            'Tue',
            this.state.tue,
            '#FDFDFD',
          )}
          {this.renderWeekItem(
            this.getDayFromWeek(moment().week(), moment().year(), 3),
            'Wed',
            this.state.wed,
          )}
          {this.renderWeekItem(
            this.getDayFromWeek(moment().week(), moment().year(), 4),
            'Thu',
            this.state.thu,
            '#FDFDFD',
          )}
          {this.renderWeekItem(
            this.getDayFromWeek(moment().week(), moment().year(), 5),
            'Fri',
            this.state.fri,
          )}
          {this.renderWeekItem(
            this.getDayFromWeek(moment().week(), moment().year(), 6),
            'Sat',
            this.state.sat,
            '#FDFDFD',
          )}
        </ScrollView>
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
                <View style={{flex: 0.25, paddingLeft: '5%'}} />
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
              <View style={{flex: 0.6, width: '100%'}}>{this.renderEvent()}</View>
              <View style={{flex: 0.2}} />
            </View>
          </View>
          {/* </TouchableWithoutFeedback> */}
        </Modal>
      </View>
    );
  }
}
