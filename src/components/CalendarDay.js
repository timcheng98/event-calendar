import React, {Component} from 'react';
import {
  View, TouchableOpacity, ScrollView
} from 'react-native';
import moment from 'moment';
import EventDetailComponent from './EventDetailComponent';
import * as Main from '../core/Main';

export default class CalendarDay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weekEvents: []
    };
  }

  async componentDidMount() {
    let dayOfWeek = moment().format('YYYY-MM-DD');
    let weekEvents = [];
    let markedDates = await Main.getStorage('markedDates');
    markedDates.map((item) => {
      let date = Main.getKey(item);
      let event = Main.getValue(item);
      if (date === dayOfWeek) {
        let {
          id, title, startTime, endTime, remark
        } = event;
        date = moment(date).format('MMMM DD, YYYY');
        let eventObj = {
          id,
          date,
          title,
          startTime,
          endTime,
          remark
        };
        weekEvents.push((
          <EventDetailComponent
            eventData={eventObj}
            singleDay
            weekMode
            {...this.props}
          />
        ));
      }
      return item;
    });

    this.setState({weekEvents});
  }

  renderEvent() {
    let items = [];
    if (this.state.weekEvents !== null) {
      this.state.weekEvents.map((item) => {
        items.push(item);
        return item;
      });
    }
    return items;
  }

  render() {
    return (
      <View>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <TouchableOpacity
            activeOpacity={1}
          >
            {this.renderEvent()}
          </TouchableOpacity>
        </ScrollView>

      </View>
    );
  }
}
