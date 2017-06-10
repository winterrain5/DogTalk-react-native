import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions
} from 'react-native';

import Swiper from 'react-native-swiper'
import Button from 'react-native-button'
var {width,height} = Dimensions.get('window')
export default class Slider extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <Swiper
        style={styles.wrapper}
        dot={<View style={styles.dot}></View>}
        activeDot={<View style={styles.activeDot}></View>}
        paginationStyle={styles.pagenation}
        loop={false}
        >
        <View style={styles.slide}>
          <Image  style={styles.image} source={require('../assets/Images/s1.png')}/>
        </View>
        <View style={styles.slide}>
          <Image  style={styles.image} source={require('../assets/Images/s2.png')}/>
        </View>
        <View style={styles.slide}>
          <Image  style={styles.image} source={require('../assets/Images/s3.png')}/>
          <Button style={styles.saveBtn} onPress={this._enter.bind(this)}>马上体验</Button>
        </View>
      </Swiper>
    );
  }
  _enter() {
    this.props.enterSlider()
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  slide:{
    flex: 1,
    width: width
  },
  image: {
    flex: 1,
    width: width
  },
  saveBtn: {
    position: 'absolute',
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 80,
    marginRight: 80,
    bottom: 70,
    height: 40,
    width: width - 160,
    backgroundColor: '#ee735c',
    borderWidth: 1,
    borderColor: '#ee735c',
    borderRadius: 4,
    color: '#fff',

  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor : 'transparent',
    borderColor: '#ccc',
    borderRadius: 5,
    borderWidth: 1,
    marginLeft: 12,
    marginRight: 12
  },
  activeDot: {
    width: 10,
    height: 10,
    backgroundColor : '#ee735c',
    borderColor: '#ccc',
    borderRadius: 5,
    borderWidth: 1,
    marginLeft: 12,
    marginRight: 12
  },
  pagenation: {
    bottom: 30
  },

});
