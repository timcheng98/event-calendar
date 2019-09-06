import React, { useEffect, useState } from 'react';
import { 
  Text, View, TouchableOpacity, FlatList, TouchableWithoutFeedback
} from 'react-native';
import { 
  Card, Icon, Tab, Tabs, TabHeading, Spinner
} from 'native-base';
import { SafeAreaView } from 'react-navigation';
import moment from 'moment';
import CalendarMonth from '../../components/CalendarMonth';
import * as Main from '../../core/Main';
import EventDetailComponent from '../../components/EventDetailCompoent';

export const Home = (props) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [countMonth, setCountMonth] = useState(0);
  const [loading, setLoading] = useState(true);

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
      props.navigation.setParams({isEventSelected: false});
    }
    props.navigation.addListener(
      'willFocus',
      () => {
        getEvents();
        getMonthlyEvents();
        console.log('willFocus');
      }
    );
    props.navigation.setParams({visible: false});
    setLoading(false);
  }, []);

  const getEvents = async () => {
    let markedDates = await Main.getStorage('markedDates');
    setEvents(markedDates);
    console.log('markedDates', markedDates);
  };

  const getMonthlyEvents = async () => {
    let markedDates = await Main.getStorage('markedDates');
    let count = 0;
    markedDates.map((item) => {
      let date = Object.keys(item)[0];
      let date_year = moment(date).year();
      let date_month = moment(date).month();
      if (date_year === moment().year()) {
        if (date_month === moment().month()) {
          count++;
          setCountMonth(count);
        }
      }
    });
  };

  const renderEvent = () => {
    if (events !== null) {
      let upcomingEvents = [];
      events.map((item) => {
        let date = Object.keys(item)[0];
        let start = moment();
        let end = moment(date, 'YYYY-MM-DD');
        let diff = moment.duration(end.diff(start)).asDays();
        if (diff > -1 && diff <= 7) {
          upcomingEvents.push(item);
        }
        return upcomingEvents;
      });
      let sortedUpcomingEvents = upcomingEvents.sort((a, b) => {
        let first = moment(Object.keys(a)[0]).unix();
        let second = moment(Object.keys(b)[0]).unix();
        return first - second;
      });
      if (sortedUpcomingEvents.length > 0) {
        return (
          <FlatList
            style={{flex: 1}}
            keyExtractor={(item, index) => index.toString()}
            data={sortedUpcomingEvents}
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
                <TouchableOpacity onPress={() => {
                  props.navigation.setParams({isEventSelected: true});
                  setSelectedEvent(eventObj);
                }}
                >
                  <View
                    style={{
                      flex: 0.2,
                      paddingVertical: '3%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      width: '100%',
                      borderBottomWidth: 1 / 3,
                      borderColor: '#CCCCCC'
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
                      <Text style={{ fontSize: 12, color: '#6A6A6A'}}>
                        {date}
                      </Text>
                    </View>
                    <View style={{flex: 0.3 }}>
                      <Text style={{color: '#4A4A4A', fontSize: 15}}>
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
                </TouchableOpacity>
              );
            }}
          />
        );
      }
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{paddingVertical: '2%'}}>
            <Text style={{color: '#8D8D8D', fontSize: 15}}>No Upcoming Event</Text>
          </View>
          <View>
            <Text style={{color: '#CCCCCC', fontSize: 15}}>Click “+” button to create event</Text>
          </View>
        </View>
      );
    }
  };

  const renderEventDetail = () => {
    if (props.navigation.getParam('isEventSelected')) {
      return (<EventDetailComponent {...props} eventData={selectedEvent} />
      );
    }
    return (
      <View style={{ flex: 1, alignItems: 'flex-start', width: '100%'}}>
        <View style={{ flex: 0.15, width: '100%'}}>
          <Text style={{ fontSize: 18, color: '#BFBFBF', fontWeight: '500' }}>Upcoming Events</Text>
        </View>
        <Card
          style={{
            flex: 1,
            width: '100%',
            shadowColor: '#4A4A4A',
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.3,
            shadowRadius: 3.84,
            borderRadius: 5,
            elevation: 5,
            paddingHorizontal: '5%'
          }}
        >
          <View style={{ flex: 1, width: '100%'}}>
            {renderEvent()}
          </View>
        </Card>
      </View>
    );
  };

  if (loading) {
    console.log(loading);
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Spinner />
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <TouchableWithoutFeedback onPress={() => {
          props.navigation.setParams({isEventSelected: false});
        }}
        >
          <View style={{ flex: 0.6}}>
            <View style={{ flex: 1, width: '95%', alignSelf: 'center'}}>
              <Tabs
                style={{}}
                tabContainerStyle={{ elevation: 0 }}
                tabBarUnderlineStyle={{ backgroundColor: '#000000', height: 2 }}
              >
                <Tab
                  textStyle={{ fontSize: 12, color: '#4A4A4A' }}
                  tabStyle={{
                    backgroundColor: '#FFFFFF',
                    borderBottomWidth: 0.333,
                    borderColor: '#cccccc'
                  }}
                  activeTabStyle={{ backgroundColor: '#FFFFFF' }}
                  activeTextStyle={{ fontSize: 12, color: '#4A4A4A' }}
                  heading={(
                    <TabHeading style={{backgroundColor: '#FFFFFF'}}>
                      <Text>Month</Text>
                      <Card style={{borderRadius:  25 / 2, height: 25, width: 25, backgroundColor: '#fd5c5c',flex: 0.35, alignItems:'center', justifyContent: 'center'}}>
                        <Text style={{color: '#FFFFFF', fontSize: 12, alignSelf: 'center', fontWeight: '500'}}>{countMonth}</Text>
                      </Card>
                    </TabHeading>
                    )}
                >
                  <CalendarMonth {...props} markedDates={events} />
                </Tab>
                <Tab
                  textStyle={{ fontSize: 12, color: '#4A4A4A' }}
                  tabStyle={{
                    backgroundColor: '#FFFFFF',
                    borderBottomWidth: 0.333,
                    borderColor: '#cccccc'
                  }}
                  activeTabStyle={{ backgroundColor: '#FFFFFF' }}
                  activeTextStyle={{ fontSize: 12, color: '#4A4A4A' }}
                  heading={(
                    <TabHeading style={{backgroundColor: '#FFFFFF'}}>
                      <Text>Week</Text>
                    </TabHeading>
                    )}
                >
                  {/* <Records navigation={this.props.navigation} /> */}
                </Tab>
                <Tab
                  textStyle={{ fontSize: 12, color: '#4A4A4A' }}
                  tabStyle={{
                    backgroundColor: '#FFFFFF',
                    borderBottomWidth: 0.333,
                    borderColor: '#cccccc'
                  }}
                  activeTabStyle={{ backgroundColor: '#FFFFFF' }}
                  activeTextStyle={{ fontSize: 12, color: '#4A4A4A' }}
                  heading={(
                    <TabHeading style={{backgroundColor: '#FFFFFF'}}>
                      <Text>Day</Text>
                    </TabHeading>
                    )}
                >
                  {/* <Applications navigation={this.props.navigation} /> */}
                </Tab>
              </Tabs>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={{flex: 0.4, paddingHorizontal: '5%', paddingVertical: 15 }}>
          {renderEventDetail()}
        </View>
      </SafeAreaView>
    </View>
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
      fontWeight: 'bold',
    },
    headerStyle: {
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 0
    },
    headerForceInset: { top: 'never', bottom: 'never' },
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
          <Text style={{ fontSize: 15, fontWeight: '400'}}>
            {/* {month}
            &nbsp;
            {year} */}
            {moment().format('MMM DD, YYYY')}
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
