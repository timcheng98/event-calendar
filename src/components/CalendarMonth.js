import React from 'react';
import { View, Image } from 'react-native';
import {Calendar} from 'react-native-calendars';
import AsynStorage from '@react-native-community/async-storage';
import Spinner from './Spinner';

class CalendarMonth extends React.Component {
  // console.log('CalendarMonth', newEvent);
  // let mark = {};
  // if (newEvent !== undefined ) {
  //   mark = {
  //     '2019-09-01': { marked: true, dotColor: 'black'}
  //   };
  //   console.log('mark', mark);
  // }
  // let test = { '2019-09-01': { marked: true, dotColor: 'black'}}
  // console.log('mark 123', test);
  constructor(props) {
    super(props);
    this.state = {
      markedDatesObj: {},
      loading: true
    };

    this.props.navigation.addListener(
      'willFocus',
      async () => {
        let markedDatesObj = JSON.parse(await AsynStorage.getItem('markedDatesObj'));
        this.setState({markedDatesObj, loading: false});
      }
    );
  }

  async componentDidMount() {
    let markedDatesObj = JSON.parse(await AsynStorage.getItem('markedDatesObj'));
    this.setState({markedDatesObj, loading: false});
  }

  render() {
    const {
      markedDatesObj,
      loading
    } = this.state;

    if (loading) {
      return <Spinner />;
    }

    return (
      <View style={{ flex: 0.7, width: '100%', alignItems: 'center'}}>  
        <Calendar
          markedDates={markedDatesObj}
          style={{ width: '100%' }}
          // current={new Date()}
          hideExtraDays
          // hideArrows={true}
          // minDate={new Date()}
          onMonthChange={(month) => this.props.navigation.setParams({selectedMonth: month})}
          theme={{
            // 'stylesheet.calendar.header': {
            //   header: {
            //     height: 0,
            //     opacity: 0
            //   }
            // }
          }}
        />
      </View>
    );
  }
}
export default CalendarMonth;
