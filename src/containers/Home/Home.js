import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, FlatList } from 'react-native';
import { Icon, Tab, Tabs } from 'native-base';
import { SafeAreaView } from 'react-navigation';
import AsynStorage from '@react-native-community/async-storage';
import moment from 'moment';
import CalendarMonth from '../../components/CalendarMonth';

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
  }, [events]);

  const getEvents = async () => {
    let markedDates = JSON.parse(await AsynStorage.getItem('markedDates'));
    setEvents(markedDates);
  };

  const renderEvent = () => {
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
    let sortedUpcomingEvents = upcomingEvents.sort((a, b) => {
      let first = moment(Object.keys(a)[0]).unix();
      let second = moment(Object.keys(b)[0]).unix();
      return first - second;
    });
    /* fake data
    console.log('Upcoming', upcomingEvents);
    upcomingEvents = [
      {'2019-09-06': {
        title: '123', startTime: '00:00', endTime: '00:01', marked: true, dotColor: 'black'}
      }
    ];
    */
    return (
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={sortedUpcomingEvents}
        renderItem={(item) => {
          let event = Object.values(item.item)[0];
          let date = Object.keys(item.item)[0];
          let {
            title,
            startTime,
            endTime
          } = event;
          date = moment(date).format('MMMM DD, YYYY');
          return (
            <View
              style={{
                flex: 0.2,
                paddingVertical: '2%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%'
              }}
            >
              <View style={{flex: 0.1}}>
                <Icon
                  style={{ fontSize: 25, color: '#4A4A4A', marginRight: 10 }}
                  type="MaterialCommunityIcons"
                  name="circle-medium"
                />
              </View>
              <View style={{flex: 0.55}}>
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
              <View style={{flex: 0.3 }}>
                <Text>
                  {`${startTime} - ${endTime}`}
                </Text>
              </View>
              <View style={{flex: 0.15}}>
                <Icon
                  style={{ fontSize: 35, color: '#2E2E2E', paddingLeft: 10 }}
                  type="MaterialCommunityIcons"
                  name="arrow-right-box"
                />
              </View>
            </View>
          );
        }}
      />
    );
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
          <View style={{ flex: 0.15, width: '100%'}}>
            <Text style={{ fontSize: 25, color: '#BFBFBF', fontWeight: '500' }}>Upcoming</Text>
          </View>
          <View style={{ flex: 0.5, width: '100%'}}>
            {renderEvent()}
          </View>
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
        <TouchableOpacity
          onPress={ () => navigation.openDrawer()}
        >
          <Icon
            style={{ fontSize: 30, color: '#4A4A4A', marginRight: 10 }}
            type="MaterialIcons"
            name="menu"
          />
        </TouchableOpacity>
        <View style={{ alignSelf: 'center'}}>
          <Text style={{ fontSize: 20, fontWeight: '400'}}>
            {month}
            &nbsp;
            {year}
          </Text>
        </View>
      </View>
    ),
    headerRight: (
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View style={{ marginRight: 10}}>
          <TouchableOpacity>
            <Icon
              style={{ fontSize: 30, color: '#4A4A4A' }}
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
              style={{ fontSize: 30}}
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
