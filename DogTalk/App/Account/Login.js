import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  AlertIOS,
  Dimensions,
  Keyboard
} from 'react-native';

import Button from 'react-native-button'
import request from '../Common/request'
import config from '../Common/config'

var TimerMixin = require('react-timer-mixin');
var {width,height} = Dimensions.get('window');
var codeTime = 60;
export default class Login extends Component {
  mixins: [TimerMixin]
  static defaultProps = {
    afterLogin: null
  };
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '',
      codeSend: false,
      verifyCode: '',
      countingDone: false,
      timerCount: codeTime,
      timerTitle:'60s重新获取',
      disabled: false
    };

  }
  render() {
    return(
      <View style={styles.container}>
        <View style={styles.signupBox}>
          <Text style={styles.title}>快速登录</Text>
          <TextInput
            placeholder='输入手机号'
            // 不纠正大小写
            autoCapitalize={'none'}
            autoCorrect={false}
            keyboardType={'number-pad'}
            style={styles.inputField}
            onChangeText={(text) => {
              this.setState({
                phoneNumber: text
              });
            }}
          />
          {
            this.state.codeSend ?
            <View style={styles.verifyCodeBox}>
              <TextInput
                placeholder='输入验证码'
                // 不纠正大小写
                autoCapitalize={'none'}
                autoCorrect={false}
                keyboardType={'number-pad'}
                style={[styles.inputField,{width: width - 140}]}
                onChangeText={(text) => {
                  this.setState({
                    verifyCode: text
                  });
                }}
              />
              {
                this.state.countingDone ?
                <Button style={styles.countBtn} onPress={this._sendVerifyCode.bind(this)}>获取验证码</Button>
                : <Button style={styles.countBtn} onPress={this._sendVerifyCode.bind(this)}>{this.state.timerTitle}</Button>
              }
            </View>
            : null
          }
          {
            this.state.codeSend ?
            <Button style={styles.btn} onPress={this._submit.bind(this)}>登录</Button>
            : <Button style={styles.btn} onPress={this._sendVerifyCode.bind(this)}>获取验证码</Button>
          }
        </View>
      </View>
    );
  }
  /************************************/
  componentWillUnmount() {
    this.interval&&clearInterval(this.interval);
  }

  /************************************/
  // 事件
  // 登录
  _submit() {
    // 隐藏键盘
    Keyboard.dismiss();
    var phoneNumber = this.state.phoneNumber;
    var verifyCode = this.state.verifyCode;
    if (!phoneNumber) {
      alert('手机号码不能为空');
      return;
    }

    if (!verifyCode) {
      alert('验证码不能为空');
      return;
    }

    var body = {
      phoneNumber: phoneNumber,
      verifyCode: verifyCode
    };

    var url = config.api.base + config.api.verify;
    console.log(url);
    request.post(url,body)
      .then((data) => {
        if (data && data.success) {
          this.props.afterLogin(data.data);
        }
      })
      .catch((err) => {

        console.error(err);
      })
  }

  // 开启定时器
  _startTimer() {
    this.interval=setInterval(() =>{
      var timer=this.state.timerCount-1
      if(timer===0){
        this.interval&&clearInterval(this.interval);
        this.setState({
          timerCount:codeTime,
          timerTitle:'获取验证码'
        })
      }else{
        this.setState({
          timerCount:timer,
          timerTitle:timer+'s重新获取'
        })
      }
    },1000)
  }

  // 发送验证码
  _sendVerifyCode() {
    this._startTimer();
    var phoneNumber = this.state.phoneNumber;
    if (!phoneNumber) {
      alert('手机号码不能为空');
      return;
    }
    var body = {
      phoneNumber: phoneNumber
    };

    var url = config.api.base + config.api.signup;
    console.log(url);
    request.post(url,body)
      .then((data) => {
        if (data && data.success) {
          this._showVerifyCode();
        } else {
          alert('获取验证码失败');
        }
      })
      .catch((err) => {
        alert('获取验证码错误');
        console.error(err);
      })
  }
    //
    _showVerifyCode() {
      this.setState({
        codeSend: true
      });
  }

  // 倒计时结束
  _countingDone() {
    this.setState({
      countingDone: true
    });
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9'
  },
  signupBox: {
    marginTop: 30,
    height: 50
  },
  title: {
    marginBottom: 20,
    color: '#333',
    fontSize: 20,
    textAlign: 'center'
  },
  inputField: {
    height: 40,
    padding:5,
    fontSize: 16,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  btn: {
    padding: 10,
    marginTop: 10,
    backgroundColor: 'transparent',
    borderColor: '#ee735c',
    borderWidth: 1,
    borderRadius: 4,
    color: '#ee735c'

  },
  verifyCodeBox: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  countBtn: {
    width: 110,
    height: 40,
    padding: 10,
    marginLeft: 8,
    backgroundColor: 'transparent',
    borderColor: '#ee735c',
    borderWidth: 1,
    borderRadius: 4,
    color: '#ee735c',
    textAlign: 'center',
    fontSize: 14
  }


});
