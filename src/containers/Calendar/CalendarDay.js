import React, {Component} from 'react';
import {View, TouchableOpacity, ScrollView, Text} from 'react-native';
import {Icon} from 'native-base';
import moment from 'moment';
import EventDetailComponent from '../../components/EventDetailComponent';
import * as Main from '../../core/Main';

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
        weekEvents.push(
          <EventDetailComponent key={eventObj.id} eventData={eventObj} singleDay {...this.props} />,
        );
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
      return items;
    }
  }

  render() {
    return (
      <TouchableOpacity activeOpacity={1} style={{flex: 1}}>
        <View style={{flex: 1}}>
          <ScrollView
            contentContainerStyle={{flexGrow: 1, paddingVertical: '5%', paddingHorizontal: '2.5%'}}
          >
            {(this.state.weekEvents.length > 0 
              ? (
                <TouchableOpacity activeOpacity={1}>
                  {this.renderEvent()}
                </TouchableOpacity>
              ) : (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={{fontSize: 25, color: '#CCCCCC', paddingVertical: '5%'}}>No Event</Text>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('EventForm')}
                  >
                    <Icon
                      style={{fontSize: 25, color: '#008CBF'}}
                      type="MaterialIcons"
                      name="add-circle-outline"
                    />
                  </TouchableOpacity>
                </View>
              ))}
        
          </ScrollView>
        </View>
      </TouchableOpacity>
    );
  }
}
