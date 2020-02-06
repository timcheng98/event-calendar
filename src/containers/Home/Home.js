import React, {useEffect, useState} from 'react';
import {
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';
import {
  Icon, Tab, Tabs, TabHeading, Spinner
} from 'native-base';
import {
  Badge
} from 'react-native-elements';
import moment from 'moment';
import _ from 'lodash';
import CalendarMonth from '../Calendar/CalendarMonth';
import CalendarWeek from '../Calendar/CalendarWeek';
import CalendarDay from '../Calendar/CalendarDay';
import EventDetailComponent from '../../components/EventDetailComponent';
import Header from '../../components/Header';
import * as Main from '../../core/Main';

export const Home = (props) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [countMonth, setCountMonth] = useState(0);
  const [countWeek, setCountWeek] = useState(0);
  const [countDay, setCountDay] = useState(0);
  const [day, setDay] = useState('');
  const [loading, setLoading] = useState(true);

  const {navigation} = props;

  useEffect(() => {
    setLoading(false);
    navigationWillFocus();
    navigation.setParams({isEventSelected: false, visible: false, selectedEvent: {}});
  }, []);

  const navigationWillFocus = () => {
    navigation.addListener('willFocus', () => {
      getEvents();
      getMonthlyEvents();
      navigation.setParams({isEventSelected: false, visible: false, selectedEvent: {}});
    });
  };

  const getEvents = async () => {
    let markedDates = await Main.getStorage('markedDates');
    setEvents(markedDates);
    // console.log('markedDates', markedDates);
  };

  const getMonthlyEvents = async () => {
    let markedDates = await Main.getStorage('markedDates');
    let monthCount = 0;
    let weekCount = 0;
    let dayCount = 0;
    markedDates.map((item) => {
      let date = Main.getKey(item);
      let date_year = moment(date).year();
      let date_month = moment(date).month();
      let date_day = moment(date).date();

      let today = moment().format('YYYY-MM-DD');
      let weekEnd = Main.getDateFromWeek(moment().week(), moment().year(), 6);

      if (date === moment().format('YYYY-MM-DD')) {
        dayCount++;
        setCountDay(dayCount);
      }

      if (date_year === moment().year()) {
        if (date_month === moment().month()) {
          if (date_day >= moment().date()) {
            monthCount++;
            setCountMonth(monthCount);
          }
          if (date >= today && date <= weekEnd) {
            weekCount++;
            setCountWeek(weekCount);
          }
        }
      }
      return item;
    });
  };


  const showEvent = () => {
    return (
      <View style={{flex: 1}}>
        <EventDetailComponent
          eventData={selectedEvent}
          singleDay
          weekMode
          {...props}
        />
        <View style={{flex: 0.2}} />
      </View>
    );
  }

  const displayUpcoming = (item, events) => {
    let renderItem = [];
    events.map((event) => {
      if (item === event.date) {
        let {
          title, startTime, endTime, id, allDay, remark, date
        } = event;
        renderItem.push(
          <ScrollView key={event.id} contentContainerStyle={{flexGrow: 2}}>
            <TouchableOpacity
              onPress={() => {
                let eventObj = {
                  title,
                  startTime,
                  endTime,
                  date,
                  remark,
                  id,
                  allDay
                };
                console.log(eventObj);
                setDay(date);
                setSelectedEvent(eventObj);
                props.navigation.setParams({visible: true});
              }}
            >
              <View style={{flex: 1, flexDirection: 'row', backgroundColor: ''}}>
                <View
                  style={{
                    flex: 0.3,
                    backgroundColor: '',
                    borderRightWidth: 1,
                    marginVertical: '3%',
                    borderColor: '#4A4A4A'
                  }}
                >
                  {event.allDay ? (
                    <Text style={{fontSize: 12, alignSelf: 'center'}}>All Day</Text>
                  ) : (
                    <Text style={{fontSize: 12, alignSelf: 'center'}}>{`${event.startTime} - ${event.endTime}`}</Text>
                  )}
                </View>
                <View
                  style={{
                    flex: 0.7,
                    paddingLeft: '5%',
                    backgroundColor: '',
                    marginVertical: '3%'
                  }}
                >
                  <Text>
                    {event.title}
                    {' '}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </ScrollView>,
        );
      }
    });
    // console.log('item', item);
    // console.log('events', events);
    return renderItem;
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
      
      let eventArr = [];
      upcomingEvents.map((item) => {
        let date = Main.getKey(item);
        Object.assign(Main.getValue(item), {date});
        eventArr.push(Main.getValue(item));
        return item;
      });

      let sortedEvent = [];
      sortedEvent = _.orderBy(eventArr, ['date', 'startTime', 'allDay'], ['asc', 'asc', 'asc']);

      if (eventArr.length > 0) {
        let dates = [];

        eventArr.map((item) => {
          dates.push(item.date);
          return item;
        });

        dates = [...new Set(dates)];

        return dates.map((item) => (
          <View style={{flex: 1}} key={item}>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
              <TouchableOpacity activeOpacity={1}>
                <View>
                  <View style={{width: '100%', paddingVertical: '1%', backgroundColor: '#008CBF'}}>
                    <Text
                      style={{
                        color: '#FFFFFF',
                        paddingLeft: '2%',
                        fontWeight: '500',
                        fontSize: 14
                      }}
                    >
                      {moment(item).format('DD/MM ddd')}
                    </Text>
                  </View>
                  {displayUpcoming(item, sortedEvent)}
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        ));
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
          <View style={{alignItems: 'center'}}>
            <Text style={{color: '#CCCCCC', fontSize: 15}}>Click “+” button to create event</Text>
            <TouchableOpacity onPress={() => props.navigation.navigate('EventForm')}>
              <Icon
                style={{fontSize: 20, color: '#008CBF', padding: 10}}
                type="MaterialIcons"
                name="add-circle-outline"
              />
            </TouchableOpacity>
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
      <View>
        <View style={{flexGrow: 0.15, width: '100%', height: 30}}>
          <Text style={{fontSize: 18, color: '#BFBFBF', fontWeight: '500'}}>Upcoming Events</Text>
        </View>
        <ScrollView contentContainerStyle={{flexGrow: 1, width: '100%'}}>
          <View style={{flex: 1, width: '100%'}}>{renderEvent()}</View>
        </ScrollView>
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
          <View style={{flex: 1, width: '100%', height: '100%'}}>
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
                      <Badge value={countMonth} status="error" />
                    </TabHeading>
)}
                >
                  <CalendarMonth {...props} markedDates={events} />
                  <View
                    style={{
                      flex: 0.45,
                      paddingHorizontal: '5%',
                      width: '100%',
                      height: '100%',
                      paddingVertical: '2%'
                    }}
                  >
                    {renderEventDetail()}
                  </View>
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
                      <Badge value={countWeek} status="error" />
                    </TabHeading>
                  )}
                >
                  <CalendarWeek {...props} />
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
                      <Badge value={countDay} status="error" />
                    </TabHeading>
)}
                >
                  <CalendarDay {...props} />
                </Tab>
              </Tabs>
            </View>
          </View>
        </TouchableWithoutFeedback>

        <Modal
          animationType="slide"
          transparent
          visible={props.navigation.getParam('visible')}
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
                    {day}
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
                    onPress={() => props.navigation.setParams({visible: false})}
                  >
                    <Icon
                      type="MaterialIcons"
                      name="clear"
                      style={{fontSize: 28, color: '#4A4A4A', width: '100%'}}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{flex: 0.6, width: '100%'}}>{showEvent()}</View>
              <View style={{flex: 0.2}} />
            </View>
          </View>
          {/* </TouchableWithoutFeedback> */}
        </Modal>
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
      <Header action={() => navigation.openDrawer()} type="MaterialIcons" iconName="sort" />
      <View style={{alignSelf: 'center'}}>
        <Text style={{fontSize: 15, fontWeight: '400'}}>{moment().format('DD MMMM, YYYY')}</Text>
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
