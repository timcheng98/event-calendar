import React from 'react';
import {
  View, Modal, TouchableOpacity, FlatList, Text
} from 'react-native';
import {Spinner, Icon} from 'native-base';
import {CalendarList} from 'react-native-calendars';
import moment from 'moment';
import EventDetailComponent from '../../components/EventDetailComponent';
import EventModal from '../../components/EventModal';
import * as Main from '../../core/Main';

class CalendarMonth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markedDatesObj: {},
      day: '',
      loading: true
    };
    this.props.navigation.addListener('willFocus', async () => {
      let markedDatesObj = await Main.getStorage('markedDatesObj');
      this.setState({markedDatesObj, loading: false});
    });
  }

  async componentDidMount() {
    let markedDatesObj = await Main.getStorage('markedDatesObj');
    this.setState({markedDatesObj, loading: false});
    this.props.navigation.setParams({visible: false});
  }

  render() {
    const {markedDatesObj, loading} = this.state;

    if (loading) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Spinner />
        </View>
      );
    }

    return (
      <TouchableOpacity activeOpacity={1} style={{flex: 0.55}}>
        <View
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
            alignItems: 'center'
          }}
        >
          <CalendarList
            markedDates={markedDatesObj}
            style={{width: '100%'}}
            hideExtraDays
            onMonthChange={(month) => this.props.navigation.setParams({selectedMonth: month})}
            onDayPress={async (day) => {
              this.props.navigation.setParams({visible: true});
              await Main.setEvents(day.dateString);
              let dateString = await Main.getEvents();
              this.setState({day: dateString});
            }}
          />
          <EventModal
            {...this.props}
            day={this.state.day}
          />
        </View>
      </TouchableOpacity>
    );
  }
}
export default CalendarMonth;
