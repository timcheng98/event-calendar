import React, {useEffect, useState} from 'react';
import {
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback
} from 'react-native';
import {
  Card, Icon, Tab, Tabs, TabHeading, Spinner
} from 'native-base';
import moment from 'moment';
import CalendarMonth from '../../components/CalendarMonth';
import CalendarWeek from '../../components/CalendarWeek';
import EventDetailComponent from '../../components/EventDetailComponent';
import Header from '../../components/Header';
import * as Main from '../../core/Main';

export const Home = (props) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [countMonth, setCountMonth] = useState(0);
  const [loading, setLoading] = useState(true);

  const {navigation} = props;

  useEffect(() => {
    setLoading(false);
    navigationWillFocus();
  }, []);

  const navigationWillFocus = () => {
    navigation.addListener('willFocus', () => {
      getEvents();
      getMonthlyEvents();
      navigation.setParams({isEventSelected: false, visible: false});
    });
  };

  const getEvents = async () => {
    let markedDates = await Main.getStorage('markedDates');
    setEvents(markedDates);
    console.log('markedDates', markedDates);
  };

  const getMonthlyEvents = async () => {
    let markedDates = await Main.getStorage('markedDates');
    let count = 0;
    markedDates.map((item) => {
      let date = Main.getKey(item);
      let date_year = moment(date).year();
      let date_month = moment(date).month();
      let date_day = moment(date).date();

      if (date_year === moment().year()) {
        if (date_month === moment().month()) {
          if (date_day >= moment().date()) {
            count++;
            setCountMonth(count);
          }
        }
      }
      return item;
    });
  };

  const renderEvent = () => {
    if (events !== null) {
      let upcomingEvents = [];

      events.map((item) => {
        let date = Main.getKey(item);
        let start = moment();
        let end = moment(date, 'YYYY-MM-DD');
        let diff = moment.duration(end.diff(start)).asDays();

        if (diff > -1 && diff <= 7) {
          upcomingEvents.push(item);
        }

        return upcomingEvents;
      });

      let sortedUpcomingEvents = upcomingEvents.sort((a, b) => {
        let first = moment(Main.getKey(a)).unix();
        let second = moment(Main.getKey(b)).unix();
        return first - second;
      });

      if (sortedUpcomingEvents.length > 0) {
        return (
          <FlatList
            style={{flex: 1}}
            keyExtractor={(item, index) => index.toString()}
            data={sortedUpcomingEvents}
            renderItem={(item) => {
              let event = Main.getValue(item.item);
              let date = Main.getKey(item.item);
              let {
                id, title, startTime, endTime, remark, allDay
              } = event;
              date = moment(date).format('MMMM DD, YYYY');
              let eventObj = {
                id,
                date,
                title,
                startTime,
                endTime,
                remark,
                allDay
              };
              return (
                <TouchableOpacity
                  onPress={() => {
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
                        style={{
                          fontSize: 25,
                          color: '#4A4A4A',
                          marginRight: 10
                        }}
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
                      <Text
                        style={{
                          fontSize: 12,
                          color: '#6A6A6A'
                        }}
                      >
                        {date}
                      </Text>
                    </View>
                    <View style={{flex: 0.3}}>
                      <Text
                        style={{
                          color: '#4A4A4A',
                          fontSize: 15
                        }}
                      >
                        {allDay ? 'Whole Day' : `${startTime} - ${endTime}`}
                      </Text>
                    </View>
                    <View style={{flex: 0.15}}>
                      <Icon
                        style={{
                          fontSize: 35,
                          color: '#2E2E2E',
                          paddingLeft: 10
                        }}
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
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
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
    if (navigation.getParam('isEventSelected')) {
      return <EventDetailComponent {...props} eventData={selectedEvent} />;
    }
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'flex-start',
          width: '100%'
        }}
      >
        <View style={{flex: 0.15, width: '100%'}}>
          <Text style={{fontSize: 18, color: '#BFBFBF', fontWeight: '500'}}>Upcoming Events</Text>
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
          <View style={{flex: 1, width: '100%'}}>{renderEvent()}</View>
        </Card>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Spinner />
      </View>
    );
  }

  /* Render */
  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.setParams({isEventSelected: false});
          }}
        >
          <View style={{flex: 0.55, width: '100%', height: '100%'}}>
            <View
              style={{
                flex: 1,
                width: '100%',
                padding: '2%',
                alignSelf: 'center'
              }}
            >
              <Tabs
                tabContainerStyle={{elevation: 0}}
                tabBarUnderlineStyle={{backgroundColor: '#000000', height: 2}}
              >
                <Tab
                  textStyle={{fontSize: 12, color: '#4A4A4A'}}
                  tabStyle={{
                    backgroundColor: '#FFFFFF',
                    borderBottomWidth: 0.333,
                    borderColor: '#cccccc'
                  }}
                  activeTabStyle={{backgroundColor: '#FFFFFF'}}
                  activeTextStyle={{fontSize: 12, color: '#4A4A4A'}}
                  heading={(
                    <TabHeading style={{backgroundColor: '#FFFFFF'}}>
                      <Text>Month</Text>
                      <Card
                        style={{
                          borderRadius: 25 / 2,
                          height: 25,
                          width: 25,
                          backgroundColor: '#fd5c5c',
                          flex: 0.35,
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Text
                          style={{
                            color: '#FFFFFF',
                            fontSize: 12,
                            alignSelf: 'center',
                            fontWeight: '500'
                          }}
                        >
                          {countMonth}
                        </Text>
                      </Card>
                    </TabHeading>
                  )}
                >
                  <CalendarMonth {...props} markedDates={events} />
                </Tab>
                <Tab
                  textStyle={{fontSize: 12, color: '#4A4A4A'}}
                  tabStyle={{
                    backgroundColor: '#FFFFFF',
                    borderBottomWidth: 0.333,
                    borderColor: '#cccccc'
                  }}
                  activeTabStyle={{backgroundColor: '#FFFFFF'}}
                  activeTextStyle={{fontSize: 12, color: '#4A4A4A'}}
                  heading={(
                    <TabHeading style={{backgroundColor: '#FFFFFF'}}>
                      <Text>Week</Text>
                    </TabHeading>
                  )}
                >
                  <CalendarWeek {...props} />
                </Tab>
                <Tab
                  textStyle={{fontSize: 12, color: '#4A4A4A'}}
                  tabStyle={{
                    backgroundColor: '#FFFFFF',
                    borderBottomWidth: 0.333,
                    borderColor: '#cccccc'
                  }}
                  activeTabStyle={{backgroundColor: '#FFFFFF'}}
                  activeTextStyle={{fontSize: 12, color: '#4A4A4A'}}
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
        <View
          style={{
            flex: 0.45,
            paddingHorizontal: '5%',
            width: '100%',
            height: '100%',
            paddingVertical: 15
          }}
        >
          {renderEventDetail()}
        </View>
      </SafeAreaView>
    </View>
  );
};

Home.navigationOptions = ({navigation}) => ({
  headerTitleStyle: {
    fontWeight: 'bold'
  },
  headerStyle: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0
  },
  headerForceInset: {top: 'never', bottom: 'never'},
  headerLeft: (
    <View style={{flex: 1, flexDirection: 'row'}}>
      <Header
        action={() => navigation.openDrawer()}
        type="MaterialIcons"
        iconName="sort"
      />
      <View style={{alignSelf: 'center'}}>
        <Text style={{fontSize: 15, fontWeight: '400'}}>
          {moment().format('DD MMMM, YYYY')}
        </Text>
      </View>
    </View>
  ),
  headerRight: (
    <View style={{flex: 1, flexDirection: 'row'}}>
      <Header
        // action={}
        type="MaterialIcons"
        iconName="search"
      />
      <Header
        action={() => navigation.navigate('EventForm')}
        type="MaterialIcons"
        iconName="add-box"
      />
    </View>
  )
});

export default Home;
