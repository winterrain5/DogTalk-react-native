import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TabBarIOS
} from 'react-native';

import List from '../Home/List';
import Edit from '../Edit/Edit';
import Accout from '../Account/Account';


export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'Home'
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
           <List></List>
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
           <Accout/>
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
