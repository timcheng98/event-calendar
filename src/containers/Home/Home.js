import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Icon, Tab, Tabs} from 'native-base';
import { SafeAreaView } from 'react-navigation';
import CalendarMonth from '../../components/CalendarMonth';
import AsynStorage from '@react-native-community/async-storage';
import moment from 'moment';

export const Home = (props) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (props.navigation.state.params === undefined) {
      props.navigation.setParams({
        selectedMonth: {
          year: moment().toDate().getFullYear(),
          month: moment().toDate().getMonth(),
          day: moment().toDate().getDate(),
          timestamp: moment().unix(),
          dateString: moment().format('YYYY-MM-DD')
        }
      });
    }
    getEvents();
  }, events);

  const getEvents = async () => {
    let markedDates = JSON.parse(await AsynStorage.getItem('markedDates'));
    setEvents(markedDates);
  };

  const renderEvent = () => {
    let renderItems = [];
    let upcomingEvents = [];
    events.map((item) => {
      let date = Object.keys(item);
      let start = moment();
      let end = moment(date, 'YYYY-MM-DD');
      let diff = Math.ceil(moment.duration(end.diff(start)).asDays());
      if (diff >= 0 && diff <= 7) {
        upcomingEvents.push(item);
      }
      return upcomingEvents;
    });
    upcomingEvents.map((item) => {
      let event = Object.values(item)[0];
      let date = Object.keys(item);
      let {
        title,
        startTime,
        endTime
      } = event;
      date = moment(date).format('MMMM DD, YYYY');

      return renderItems.push(
        <View
          style={{
            flex: 0.2,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <View>
            <Icon
              style={{ fontSize: 25, color: '#4A4A4A', marginRight: 10 }}
              type="MaterialCommunityIcons"
              name="circle-medium"
            />
          </View>
          <View style={{flex: 0.6}}>
            <Text
              style={{
                fontSize: 15,
                color: '#2E2E2E',
                fontWeight: 'bold',
                paddingBottom: '2%'
              }}
            >
              {title}
            </Text>
            <Text style={{ fontSize: 12, color: '#BFBFBF'}}>
              {date}
            </Text>
          </View>
          <View style={{flex: 0.3}}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View>
                <Text>
                  {`${startTime} - ${endTime}`}
                </Text>
              </View>
              <Icon
                style={{ fontSize: 35, color: '#2E2E2E', marginRight: 10 }}
                type="MaterialCommunityIcons"
                name="arrow-right-box"
              />
            </View>
          </View>
        </View>
      );
    });
    return renderItems;
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{ flex: 0.6}}>
        <View style={{ flex: 1, width: '95%', alignSelf: 'center'}}>
          <Tabs
            style={{}}
            tabContainerStyle={{ elevation: 0 }}
            tabBarUnderlineStyle={{ backgroundColor: '#000', height: 2 }}
          >
            <Tab
              textStyle={{ fontSize: 12, color: '#4A4A4A' }}
              tabStyle={{
                backgroundColor: '#FFF',
                borderBottomWidth: 0.333,
                borderColor: '#c9c9c9'
              }}
              activeTabStyle={{ backgroundColor: '#FFF' }}
              activeTextStyle={{ fontSize: 12, color: '#000' }}
              heading="MONTH"
            >
              <CalendarMonth {...props} />
            </Tab>
            <Tab
              textStyle={{ fontSize: 12, color: '#4A4A4A' }}
              tabStyle={{
                backgroundColor: '#FFF',
                borderBottomWidth: 0.333,
                borderColor: '#c9c9c9'
              }}
              activeTabStyle={{ backgroundColor: '#FFF' }}
              activeTextStyle={{ fontSize: 12, color: '#000' }}
              heading="WEEK"
            >
              {/* <Records navigation={this.props.navigation} /> */}
            </Tab>
            <Tab
              textStyle={{ fontSize: 12, color: '#4A4A4A' }}
              tabStyle={{
                backgroundColor: '#FFF',
                borderBottomWidth: 0.333,
                borderColor: '#c9c9c9'
              }}
              activeTabStyle={{ backgroundColor: '#FFF' }}
              activeTextStyle={{ fontSize: 12, color: '#000' }}
              heading="DAY"
            >
              {/* <Applications navigation={this.props.navigation} /> */}
            </Tab>
          </Tabs>
        </View>
      </View>
      <View style={{flex: 0.5, paddingHorizontal: '5%' }}>
        <View style={{ flex: 1, alignItems: 'flex-start', width: '100%'}}>
          <View style={{ flex: 0.1, width: '100%'}}>
            <Text style={{ fontSize: 12, color: '#BFBFBF' }}>Upcoming</Text>
          </View>
          {renderEvent()}
        </View>
      </View>
    </SafeAreaView>
  );
};

Home.navigationOptions = ({navigation}) => {
  const {
    params = {
      selectedMonth: {
        year: moment().toDate().getFullYear(),
        month: moment().toDate().getMonth(),
        day: moment().toDate().getDate(),
        timestamp: moment().unix(),
        dateString: moment().format('YYYY-MM-DD')
      }
    }
  } = navigation.state;

  let month = moment().month(params.selectedMonth.month - 1).format('MMMM');
  let {year} = params.selectedMonth;

  return ({
    headerTitleStyle: {
      fontWeight: 'bold'
    },
    headerStyle: {
      backgroundColor: '#FFFFFF',
      marginTop: -40,
      borderBottomWidth: 0
    },
    headerLeft: (
      <View style={{marginLeft: 20, flex: 1, flexDirection: 'row'}}>
        <TouchableOpacity>
          <Icon
            style={{ fontSize: 25, color: '#4A4A4A', marginRight: 10 }}
            type="MaterialIcons"
            name="menu"
          />
        </TouchableOpacity>
        <View style={{ alignSelf: 'center'}}>
          <Text style={{ fontSize: 18, fontWeight: '100'}}>
            {month}
            &nbsp;
            <Text style={{ fontWeight: '400'}}>
              {year}
            </Text>
          </Text>
        </View>
      </View>
    ),
    headerRight: (
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View style={{ marginRight: 10}}>
          <TouchableOpacity>
            <Icon
              style={{ fontSize: 25, color: '#4A4A4A' }}
              type="MaterialIcons"
              name="search"
            />
          </TouchableOpacity>
        </View>
        <View style={{ marginRight: 20}}>
          <TouchableOpacity
            onPress={ () => navigation.navigate('EventForm')}
          >
            <Icon
              style={{ fontSize: 25}}
              type="MaterialIcons"
              name="add-box"
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  });
};

export default Home;
