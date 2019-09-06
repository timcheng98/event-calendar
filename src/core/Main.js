import AsyncStorage from '@react-native-community/async-storage';

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
  if (await getStorage('events') === null) {
    await setEvents('events');
  }
  return getStorage('events');
}

export async function setModalVisible(value) {
  return setStorage('modalVisible', value);
}

export async function getModalVisible() {
  if (await getStorage('modalVisible') === null) {
    await setModalVisible(true);
  }
  return getStorage('modalVisible');
}


