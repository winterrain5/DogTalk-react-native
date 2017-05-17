import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView,
  ListView,
  TextInput,
  Modal,
  AlertIOS
} from 'react-native';

import request from '../Common/request'
import config from '../Common/config'
import Video from 'react-native-video';
import Button from 'react-native-button'
// var Video = require('react-native-video').default;
var {width,height} = Dimensions.get('window');

// 缓存的数据
var cacheResults = {
  nextPage: 1,
  items: [],
  total: 0
};

export default class Detail extends Component{
  constructor(props) {
    super(props);
    this.state = {
      rete: 1,
      muted: true,
      resizeMode: 'contain',
      repate: false, // 是否重播

      videoLoaded: false, // 视频是否已经准备完毕
      playing: false, // 视频是否正在播放
      paused: false, // 是否暂停视频
      videoOk: true,

      videoProgress: 0.01, // 视屏的进度
      videoTotal: 0, // 总进度
      currentTime: 0,

      // 评论列表
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1,r2) => r1 !==r2
      }),

      content: '', // 提交评论内容
      isSending: false, // 评论请求是否已发送

      // modal
      animationType: 'none', // modal动画类型
      modalVisible: false, // modal是否可见
    };
  }
  render() {
    return(
      <View style={styles.container}>

        {/* <Text style={{color: '#333'}}>{this.props.rowData.title}</Text> */}
        {/* 作者信息 */}
          <View style={styles.infoBox}>
            <Image source={{uri: this.props.rowData.author.avatar}} style={styles.avatar}/>
            <View style={styles.descBox}>
              <Text style={styles.nickName}>{this.props.rowData.author.nickName}</Text>
              <Text style={styles.title}>{this.props.rowData.title}</Text>
            </View>
          </View>
          <View style={styles.videoBox}>
            <Video
              ref='videoPlayer'
              source={{uri: this.props.rowData.video}}
              style={styles.video}
              volume={5} // 声音的放大倍数
              paused={this.state.paused} // 是否暂停  进入详情页立即播放
              rate={this.state.rate}   // 0：暂停 1: 正常播放
              muted={this.state.muted} // 是否静音
              // 视频拉伸方式
              resizeMode={this.state.resizeMode}
              // 是否重复播放
              repeat={this.state.repate}
              // 视屏刚加载时触发的方法
              onLoadStart={this._onLoadStart}
              // 当视频不断的加载时触发
              onLoad={this._onLoad}
              // 当视频在播放时 每隔250ms触发操作
              onProgress={this._onProgress.bind(this)}
              onEnd={this._onEnd.bind(this)}
              onError={this._onError.bind(this)}
            />
            {/* 播放器内部控件 */}
            {/* 进度条 */}
            <View style={styles.progressBox}>
              <View style={[styles.progressBar,{width: width * this.state.videoProgress}]}></View>
            </View>
            {/* 加载菊花 */}
            {
              !this.state.videoLoaded && < ActivityIndicator color='#fff' style={styles.loading}/>
            }
            {/* 播放按钮 */}
            {
              this.state.videoLoaded && !this.state.playing ?
              <TouchableOpacity onPress={this._rePlay.bind(this)} style={styles.playIcon}>
                <Image source={{uri: 'play'}} style={{width: 30,height: 30}}/>
              </TouchableOpacity> : null
            }
            {/* 暂停按钮 */}
            {
              this.state.videoLoaded && this.state.playing ?
              <TouchableOpacity onPress={this._pause.bind(this)} style={styles.pauseBtn}>
                  {
                    this.state.paused ? <Image source={{uri: 'play'}} style={{width: 30, height: 30}}/> : <Text></Text>
                  }
              </TouchableOpacity>
              : null
            }
            {/* 视频出错 */}
            {!this.state.videoOk && <Text style={styles.failText}>视频出错了！</Text>}
          </View>
          {/* 表头 */}
          {/* 评论列表 */}
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderRow.bind(this)}
            renderHeader={this._renderHeader.bind(this)}
            renderFooter={this._rederFooter.bind(this)}
            // 滚动到底部触发的操作
            onEndReached={this._fetchMoreData.bind(this)}
            // 预加载 距离底部多少像素的时候预加载
            onEndReachedThreshold={20}
            automaticallyAdjustContentInsets={false}
            enableEmptySections={true}
            style={styles.listView}
          />
          <Modal
            animationType={'fade'}
            visible={this.state.modalVisible}
            onRequestClose={() => this._setModalVisible(false).bind(this)}>
            {/* // 内容视图 */}
            <View style={styles.modalContainer}>
              {/* // 关闭按钮 */}
              <TouchableOpacity onPress={this._closeModal.bind(this)} style={styles.closeIcon}>
                <Image source={{uri: 'ios7-close-outline'}} style={{width: 35,height: 35}}/>
              </TouchableOpacity>
              {/* 评论框 */}
              <View style={styles.commentBox}>
                <TextInput
                  placeholder="留下精彩评论<..."
                  style={styles.content}
                  multiline={true}
                  // onFocus={this._focus.bind(this)}
                  // onBlur={this._onBlur.bind(this)}
                  defaultValue={this.state.content}
                  onChangeText={(text) => {
                    this.setState({
                      content: text
                    });
                  }}
                />
              </View>
            <Button style={styles.submitButton} onPress={this._submit.bind(this)}>提交评论</Button>
            </View>
          </Modal>
      </View>
    );
  }
  /****************************************************************************/
  // 组件生命周期
  componentDidMount() {
    this._fetchData();
  }
  /****************************************************************************/
  // 网络请求

  _fetchData(page) {

    this.setState({
      isLoadingTail: true
    });

    var url = config.api.base + config.api.comment;
    request.get(url,{
      _id: this.props.rowData._id,
      accessToken: 'asdf',
      page: page
    })
      .then((data) => {
        if (data.success) {
          // 取出已缓存的数据
          var items = cacheResults.items.slice();
          // 将新请求到的数据追加进去
          items = items.concat(data.data);
          cacheResults.nextPage += 1;


          // 存储新的数据
          cacheResults.items = items;
          cacheResults.total = data.total;

          this.setState({
            // 数据请求成功 更新加载状态为FALSE
            isLoadingTail: false,
            dataSource: this.state.dataSource.cloneWithRows(cacheResults.items)
          });
        }

      })
      .catch((error) => {
          this.setState({
            // 数据请求失败 更新加载状态为FALSE
            isLoadingTail: false,

          });
        alert(error)
      })
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


  /****************************************************************************/
  // 视图相关

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

  // 返回headerView
  _renderHeader() {
    return(
      <View style={styles.listHeader}>
        {/* 评论框 */}
        <View style={styles.commentBox}>
          <TextInput
            placeholder="留下精彩评论<..."
            style={styles.content}
            multiline={true}
            onFocus={this._focus.bind(this)}
          />
        </View>
        <Text style={styles.listHeaderText}>最新热评</Text>
      </View>
    );
  }
  // 评论cell
  _renderRow(row) {
    return(
      <View key={row._id} style={styles.replyBox}>
          <Image source={{uri: row.replyBy.avatar}} style={styles.replyAvatar}/>
          <View style={styles.reply}>
            <Text style={styles.replyNickName}>{row.replyBy.nickName}</Text>
            <Text style={styles.replyContent}>{row.content}</Text>
          </View>
      </View>
    );
  }


  /****************************************************************************/
  // video 相关的方法
  // 视屏刚加载时触发的方法
  _onLoadStart() {
    console.log('start');
  }
  // 当视频不断的加载时触发
  _onLoad() {
    console.log('load');
  }
  // 当视频在播放时 每隔250ms触发操作
  _onProgress(data) {

    var duration = data.playableDuration;
    var currentTime = data.currentTime;
    var percent = Number((currentTime / duration).toFixed(4))

    var newState = {
      videoTotal: duration,
      currentTime: Number(data.currentTime.toFixed(2)),
      videoProgress: percent
    };
    if (!this.state.videoLoaded) {
      newState.videoLoaded = true
    }
    if (!this.state.playing) {
      newState.playing = true
    }
    this.setState(newState);
  }
  _onEnd() {
    console.log('end');

    if (this.state.playing) {
      this.setState({
        videoProgress: 1,
        playing: false
      });
    }
  }
  _onError(err) {
    console.log(this.props.rowData.video);
    this.setState({
      videoOk: false
    });
    console.error(err);
  }

  /****************************************************************************/
  // 事件
  // 重新播放
  _rePlay() {
    this.setState({
      playing: true
    });
    this.refs.videoPlayer.seek(0);
  }
  // 暂停播放
  _pause() {
    var paused = !this.state.paused;
    this.setState({
      paused: paused
    });
  }
  // 评论框获取焦点时
  _focus() {
    this._setModalVisible(true);
  }
  // 控制modal是否可见
  _setModalVisible(isVisible) {
    this.setState({
      modalVisible: isVisible
    });
  }

  // 关闭浮层
  _closeModal() {
    this._setModalVisible(false);
  }

  // 提交评论表单
  _submit() {
    // 评论时暂停播放
    this._pause();

    if (!this.state.content) {
        alert('评论内容不能为空！');
        return
    }

    if (this.state.isSending) {
      alert('评论提交中！');
      return
    }

    // setState的另一种用法 第二个参数可看做一个回调
    this.setState({
      isSending: true
    },() => {
      // 发送请求
      var body = {
        accessToken: 'asdf',
        _id: this.props.rowData._id,
        content: this.state.content
      };
      var url =  config.api.base + config.api.sendComment
      request.post(url,body)
      .then((data) => {
        if (data && data.success) {
          // 缓存的数据
          var items = cacheResults.items.slice();
          // 拼接最新的数据
          items = [{
            content: this.state.content,
            replyBy: {
              avatar: 'http://dummyimage.com/640x640/9b026f)',
              nickName: 'derric'
            },
          }].concat(items);

          // 拼接的数据进行缓存
          cacheResults.items = items;
          cacheResults.total = cacheResults.total + 1;
          this.setState({
            isSending: false,
            dataSource: this.state.dataSource.cloneWithRows(cacheResults.items)
          });
          this._setModalVisible(false);
        }
      })
      .catch((err) => {
        this.setState({
          isSending: false
        });
        this._setModalVisible(false);
        alert('评论失败！');
        console.error(err);
      })
    });

  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoBox: {
    marginTop: 8,
    width: width,
    height: width * 0.56,
    backgroundColor: '#000'
  },
  video: {
    width: width,
    height: width * 0.56,
    backgroundColor: '#000'
  },
  loading: {
    position: 'absolute',
    left: 0,
    top: width * 0.56 * 0.5,
    width: width,
    alignSelf: 'center',
    backgroundColor: 'transparent'
  },
  progressBox: {
    width: width,
    height: 2,
    backgroundColor: '#ccc',
  },
  progressBar: {
    width: 1,
    height: 2,
    backgroundColor: '#ff6600'
  },
  playIcon: {
    position: 'absolute',
    top: width * 0.56 * 0.5,
    right: width*0.5 - 30,
    width: 60,
    height: 60,
    paddingLeft: 4,
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  pauseBtn: {
    position: 'absolute',
    width: width,
    height: width * 0.56,
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  failText: {
    position: 'absolute',
    left: 0,
    top: width * 0.56 * 0.5,
    width: width,
    backgroundColor: 'transparent',
    color: '#fff',
    textAlign: 'center'
  },
  infoBox: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 72
  },
  avatar: {
    width: 30,
    height: 30,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 15
  },
  descBox: {
    flex: 1
  },
  nickName: {
    fontSize: 13
  },
  title: {
    marginTop: 4,
    fontSize: 12,
    color: '#666'
  },
  replyBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10
  },
  replyAvatar: {
    width: 40,
    height: 40,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 20
  },
  replyNickName: {
    color: '#666'
  },
  replyContent: {
    color: '#666',
    marginTop: 4
  },
  reply: {
    flex: 1
  },

  // 评论视图
  listHeader: {
    marginTop: 8,
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#f1f1f1'
  },
  commentBox:{
    justifyContent: 'center',
  },
  content: {
    height: 60,
    marginBottom: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 3,
    fontSize: 15,
    marginLeft: 10,
    marginRight: 10,
    justifyContent: 'center',
    color: '#333',
    paddingLeft: 4
  },
  listHeaderText: {
    color: '#666',
    marginLeft: 10,
    marginBottom: 8
  },
  // 加载视图
  loadingMore: {
    marginVertical: 20
  },
  loadingText: {
    color: '#777',
    textAlign: 'center'
  },

  // 弹出层
  modalContainer: {
    flex: 1,
    paddingTop: 45,
    backgroundColor: '#fff'
  },
  closeIcon: {
    alignSelf: 'center',
  },
  submitButton: {
    paddingTop: 12,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ee735c',
    borderRadius: 4,
    color: '#ee735c',
    fontSize: 18,
    height: 40,
  }
});
