import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
  Image,
  Dimensions,
  AlertIOS,
  TouchableOpacity
} from 'react-native';

import request from '../Common/request'
import config from '../Common/config'

var {width,height} = Dimensions.get('window');

export default class Item extends Component {
  static defaultProps = {
    rowData: null,
    onSelect: null
  };
  constructor(props) {
    super(props);
    this.state = {
      up: this.props.rowData.voted
    };
  }
  render() {
    return(
      <TouchableOpacity onPress={this.props.onSelect}>
        <View style={styles.item}>
          <Text style={styles.title}>{this.props.rowData.title}</Text>
          <Image source={{uri: this.props.rowData.thumb}} style={styles.thumb}>
            <Image source={{uri: 'play'}} style={styles.play}></Image>
          </Image>
          <View style={styles.itemFooter}>
            <TouchableOpacity onPress={this._up.bind(this)} style={styles.handleBox}>
              <Image source={{uri: this.state.up ? 'ios7-heart' : 'ios7-heart-outline'}} style={styles.up}></Image>
            <Text style={styles.handleText}>喜欢</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._common.bind(this)} style={styles.handleBox}>
              <Image source={{uri: 'ios7-chatbubble-outline'}} style={styles.common}></Image>
              <Text style={styles.handleText}>评论</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  // 点赞
  _up() {
    var up = !this.state.up;
    var rowData = this.props.rowData;
    var url = config.api.base + config.api.up;

    var body = {
      id: rowData._id,
      up: up ? 'yes' : 'no',
      accessToken: 'asdf'
    };

    request.post(url,body)
    .then((data) => {
      if(data && data.success) {
        this.setState({
          up: up
        });
      } else {
        alert('点赞失败');
      }
    })
    .catch((err) => {
      console.error(err);
      alert('点赞失败');
    })
  }

  // 评论
  _common() {

  }
}

const styles = StyleSheet.create({
  item:{
    width: width,
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  title:{
    padding: 10,
    fontSize: 18,
    color: '#333'
  },
  thumb:{
    width: width,
    height: width*0.5,
    resizeMode: 'cover'
  },
  play:{
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 44,
    height: 44,
    paddingTop: 9,
    paddingLeft: 18,
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 22,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#eee'
  },
  handleBox: {
    padding: 10,
    flexDirection: 'row',
    width: width*0.5 - 0.5,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  handleText: {
    paddingLeft: 12,
    fontSize: 18,
    color: '#333',
    textAlign: 'center'
  },
  up: {
    width: 22,
    height: 22
  },
  common:{
    width: 22,
    height: 22
  },
  loadingMore: {
    marginVertical: 20
  },
  loadingText: {
    color: '#777',
    textAlign: 'center'
  }
});
