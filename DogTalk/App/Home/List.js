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
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity
} from 'react-native';

import request from '../Common/request'
import config from '../Common/config'
import Detail from './Detail'
import Item from './Item'
var {width,height} = Dimensions.get('window');




// 缓存的数据
var cacheResults = {
  nextPage: 1,
  items: [],
  total: 0
};

export default class List extends Component {
  static defaultProps = {
    REQUEST_URL: 'http://rapapi.org/mockjsdata/18956/api/home'
  };
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({
      rowHasChanged: (r1,r2) => r1 !==r2
    });

    this.state = {
      // 数据源
      dataSource: ds,
      // 是否在加载中
      isLoadingTail: false,
      isRefreshing: false
    };
  }
  render() {
    return(
      <View style={styles.container}>
        <View style={styles.header}>
          {/* <Text style={styles.headerTitle}>列表页面</Text> */}
        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          renderFooter={this._rederFooter.bind(this)}
          automaticallyAdjustContentInsets={false}
          style={{marginBottom: 90}}
          // 滚动到底部触发的操作
          onEndReached={this._fetchMoreData.bind(this)}
          // 预加载 距离底部多少像素的时候预加载
          onEndReachedThreshold={20}
          showsVerticalScrollIndicator={false}
          refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this._onRefresh.bind(this)}
            tintColor="#ff6600"
            title="拼命加载中..."
          />
        }
        />
      </View>
    );
  }

  componentDidMount() {
    this._fetchData(1);
  }

  // 请求数据
  _fetchData(page) {
    if (page !== 0) {
      this.setState({
        isLoadingTail: true
      });
    } else {
      this.setState({
        isRefreshing: true
      });
    }

    request.get(config.api.base + config.api.home,{
      accessToken: 'asdf',
      page: page
    })
      .then((data) => {
        if (data.success) {
          // 取出已缓存的数据
          var items = cacheResults.items.slice();
          // 将新请求到的数据追加进去
          if (page !== 0) {
            items = items.concat(data.data);
            cacheResults.nextPage += 1;
          } else {
            items = data.data.concat(items);
          }

          // 存储新的数据
          cacheResults.items = items;
          cacheResults.total = data.total;
          if (page !== 0) {
            this.setState({
              // 数据请求成功 更新加载状态为FALSE
              isLoadingTail: false,
              dataSource: this.state.dataSource.cloneWithRows(cacheResults.items)
            });
          } else {
            this.setState({
              isRefreshing: false,
              dataSource: this.state.dataSource.cloneWithRows(cacheResults.items)
            });
          }

        }

      })
      .catch((error) => {
        if (page !== 0) {
          this.setState({
            // 数据请求失败 更新加载状态为FALSE
            isLoadingTail: false,

          });
        }else {
          this.setState({
            // 数据请求失败 更新加载状态为FALSE
            isRefreshing: false,

          });
        }

        alert(error)
      })
  }

  // 下拉刷新触发的操作
  _onRefresh() {
    if (!this._hasMore() || this.state.isRefreshing) {
      return
    }

    this._fetchData(0);
  }
  // 加载更多数据
  _fetchMoreData(){
    // 已经没有更多数据 或者在加载中 直接返回
    if(!this._hasMore() || this.state.isLoadingTail) {
      return
    };
    var page = cacheResults.nextPage;
    this._fetchData(page);
  }

  // 判断是否有新数据
  _hasMore() {
    return cacheResults.items.length  !== cacheResults.total;
  }

  // 返回footer
  _rederFooter() {
    // 没有更多数据显示的footer
    if (!this._hasMore() && cacheResults.total !== 0) {
      return(
        <View style={styles.loadingMore}>
          <Text style={styles.loadingText}>没有更多了</Text>
        </View>
      );
    }
    //
    if (!this.state.isLoadingTail) {
      return <View style={styles.loadingMore}/>
    }
    return(
      <ActivityIndicator style={styles.loadingMore}/>
    );
  }
  // 返回每一个cell
  _renderRow(rowData) {
    return(
    <Item
      key={rowData._id}
      rowData={rowData}
      onSelect={() => this._loadPage(rowData)}
    />
    );
  }
  // 进入详情页
  _loadPage(rowData) {
    
    this.props.navigator.push({
      title: '详情',
      component: Detail,
      passProps: { rowData: rowData }
    });
  }

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5fcff',
  },
  header: {
    height: 64,
    backgroundColor: '#f5fcff',

  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600'
  }
});
