import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TabBarIOS,
  NavigatorIOS,
  Navigator,
  AsyncStorage,
  AlertIOS
} from 'react-native';

import List from '../Home/List';
import Edit from '../Edit/Edit';
import Accout from '../Account/Account';
import Login from '../Account/Login'


export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'Home',
      logined: false,
      user: null
    };
  }

  componentDidMount() {
      this._asyncAppStatus();
  }

  _asyncAppStatus() {
    // 取出用户数据
    AsyncStorage.getItem('user')
      .then((data) => {
        var user;
        var newState = {};
        if (data) {
          user = JSON.parse(data)
        }
        if (user && user.accessToken) {
          newState.user = user;
          newState.logined = true;
        } else {
          newState.logined = false;
        }

        this.setState(newState);
      })
  }
  // 登录成功后的回调函数
  _afterLogin(data) {
    var user = JSON.stringify(data)
    AsyncStorage.setItem('user',user)
      .then((data) => {
        this.setState({
          logined: true,
          user: user
        });
      })
  }
  // 登出
  _logout() {
    AsyncStorage.removeItem('user',() => {
      this.setState({
        logined: false,
        user: null
      })
    })
  }

  render() {
    if (!this.state.logined) {
      return <Login afterLogin={this._afterLogin.bind(this)}/>
    }
    return (
      <TabBarIOS
        tintColor="#ee735c"
        translucent={true}
         >
         <TabBarIOS.Item
           title="首页"
           icon={{uri:'videocam-outline.png',scale:15}}
           selectedIcon={{uri:'videocam',scale: 15}}
           selected={this.state.selectedTab === 'Home'}
           onPress={() => {
             this.setState({
               selectedTab: 'Home',
             });
           }}>
           <NavigatorIOS
             // 配置标题和组件
             initialRoute={{
               title: '首页',
               component: List
             }}
             barTintColor='#ee735c'
             style={{flex: 1}}
             tintColor='#fff'
             titleTextColor='#fff'
             translucen={true}
             shadowHidden={true}
           />
         </TabBarIOS.Item>
         <TabBarIOS.Item
           icon={{uri:'recording-outline.png',scale:15}}
           selectedIcon={{uri:'recording',scale: 15}}
           title="发布"
           selected={this.state.selectedTab === 'edit'}
           onPress={() => {
             this.setState({
               selectedTab: 'edit',
             });
           }}>
           <Edit/>
         </TabBarIOS.Item>
         <TabBarIOS.Item
           icon={{uri:'more-outline.png',scale:15}}
           selectedIcon={{uri:'more',scale: 15}}
           title="账户"
           selected={this.state.selectedTab === 'acount'}
           onPress={() => {
             this.setState({
               selectedTab: 'acount',
             });
           }}>
           <Accout
             logout={this._logout.bind(this)}
             user={this.state.user}
           />
         </TabBarIOS.Item>
       </TabBarIOS>
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
