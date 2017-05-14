/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TabBarIOS
} from 'react-native';

import Main from './App/Main/Main'


export default class DogTalk extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'Home'
    };
  }
  render() {
    return (
      <Main/>
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

AppRegistry.registerComponent('DogTalk', () => DogTalk);
