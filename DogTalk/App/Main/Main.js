import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TabBarIOS,
  NavigatorIOS,
  Navigator
} from 'react-native';

import List from '../Home/List';
import Edit from '../Edit/Edit';
import Accout from '../Account/Account';
import Login from '../Account/Login'


export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'acount'
    };
  }
  render() {
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
              style={{flex: 1}}
            //  // 配置转场方式
             configureScene={(route) => {
               return NavigatorIOS.SceneConfigs.FloatFromFight
             }}
            //  renderScene={(route, navigator) => {
            //    var Component = route.component;
            //    return <Component {...route.params} navigator={navigator}/>
            //  }}

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
           <Login/>
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
