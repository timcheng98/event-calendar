import React, {Component} from 'react';
import {View} from 'native-base';
import {ActivityIndicator, SafeAreaView, StyleSheet} from 'react-native';
import * as Main from '../../core/Main';

class LandingScreen extends Component {
  constructor(props) {
    super(props);
    this.loadingTimerDone = false;
    this.navigationTarget = undefined;
  }

  async componentDidMount() {
    setTimeout(() => {
      this.loadingTimerDone = true;
    }, 1000);

    await Main.getStorage('markedDates');
    this.props.navigation.navigate('DrawerNavigator');
  }

  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default LandingScreen;
