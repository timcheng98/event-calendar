import React, {Component} from 'react';
import {
  View, Modal, TouchableOpacity, Text, ScrollView
} from 'react-native';
import {Icon} from 'native-base';
import moment from 'moment';
import EventDetailComponent from '../../components/EventDetailComponent';
import EventPreviewTemplate from '../../components/EventPreviewTemplate';
import CalendarWeekItem from '../../components/CalendarWeekItem';
import uuidV4 from 'uuid/v4';
import * as Main from '../../core/Main';

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
      dayOfWeek.push(Main.getDateFromWeek(week, year, i));
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
      console.log('tiem', item);
      if (date === this.state.dayOfWeek[0]) {
        sun.push(this.eventPreviewTemplate(event, date));
      }
      if (date === this.state.dayOfWeek[1]) {
        mon.push(this.eventPreviewTemplate(event, date));
      }
      if (date === this.state.dayOfWeek[2]) {
        tue.push(this.eventPreviewTemplate(event, date));
      }
      if (date === this.state.dayOfWeek[3]) {
        wed.push(this.eventPreviewTemplate(event, date));
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
    let week = moment().week();
    let year = moment().year();

    return (
      <View style={{flex: 0.55}}>
        <ScrollView contentContainerStyle={{flexGrow: 1}} >
          <CalendarWeekItem
            {...this.props}
            date={Main.getDateFromWeek(week, year, 0, 'DD')}
            day="Sun"
            item={this.state.sun}
            bgColor="#FDFDFD"
          />
          <CalendarWeekItem
            {...this.props}
            date={Main.getDateFromWeek(week, year, 1, 'DD')}
            day="Mon"
            item={this.state.mon}
            bgColor="#FFFFFF"
          />
          <CalendarWeekItem
            {...this.props}
            date={Main.getDateFromWeek(week, year, 2, 'DD')}
            day="Tue"
            item={this.state.tue}
            bgColor="#FDFDFD"
          />
          <CalendarWeekItem
            {...this.props}
            date={Main.getDateFromWeek(week, year, 3, 'DD')}
            day="Wed"
            item={this.state.wed}
            bgColor="#FFFFFF"
          />
          <CalendarWeekItem
            {...this.props}
            date={Main.getDateFromWeek(week, year, 4, 'DD')}
            day="Thu"
            item={this.state.thu}
            bgColor="#FDFDFD"
          />
          <CalendarWeekItem
            {...this.props}
            date={Main.getDateFromWeek(week, year, 5, 'DD')}
            day="Fri"
            item={this.state.fri}
            bgColor="#FFFFFF"
          />
          <CalendarWeekItem
            {...this.props}
            date={Main.getDateFromWeek(week, year, 6, 'DD')}
            day="Sat"
            item={this.state.sat}
            bgColor="#FDFDFD"
          />
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
                    {this.props.navigation.getParam('date')}
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
