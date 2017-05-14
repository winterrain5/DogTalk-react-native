import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TabBarIOS
} from 'react-native';

export default class Accout extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <View style={styles.container}>
        <Text>账户页面</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
