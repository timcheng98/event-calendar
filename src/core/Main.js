import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

export async function getStorage(key) {
  let item = await AsyncStorage.getItem(key);
  item = JSON.parse(item);
  return item;
}

export async function setStorage(key, value) {
  return AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeStorage(key) {
  return AsyncStorage.removeItem(key);
}

export async function setEvents(value) {
  return setStorage('events', value);
}

export async function getEvents() {
  if ((await getStorage('events')) === null) {
    await setEvents('events');
  }
  return getStorage('events');
}

export async function setModalVisible(value) {
  return setStorage('modalVisible', value);
}

export async function getModalVisible() {
  if ((await getStorage('modalVisible')) === null) {
    await setModalVisible(true);
  }
  return getStorage('modalVisible');
}

export function getKey(key) {
  let item = Object.keys(key)[0];
  return item;
}

export function getValue(value) {
  let item = Object.values(value)[0];
  return item;
}

export function getDateFromWeek(week, year, addDay = 0, format = 'YYYY-MM-DD') {
  return moment()
    .day('Sunday')
    .year(year)
    .week(week)
    .add(addDay, 'd')
    .format(format);
}