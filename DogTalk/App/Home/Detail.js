import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default class Detail extends Component{
  constructor(props) {
    super(props);
    console.log(this.props.rowData);
  }
  render() {
    return(
      <View style={styles.container}>
        <Text style={{color: '#333'}}>{this.props.rowData.title}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
