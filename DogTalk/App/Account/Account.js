import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TabBarIOS,
  TouchableOpacity,
  Image,
  Dimensions,
  AsyncStorage,
  AlertIOS,
  Modal,
  TextInput,
} from 'react-native';

import Button from 'react-native-button'
import Progress from 'react-native-progress/Bar';
import request from '../Common/request'
import config from '../Common/config'
import ImagePicker from 'react-native-image-picker'
import sha1 from 'sha1'
var {width,height} = Dimensions.get('window');

// 上传图床配置
var options = {
  title: '选择头像',
  cancelButtonTitle: '取消',
  takePhotoButtonTitle: '拍照',
  chooseFromLibraryButtonTitle: '从相册选择',
  quality: 0.75,
  allowsEditing: true,
  noData: false,
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};
var CLOUDINARY = {
  cloud_name: 'winterrain5',
  api_key: '587226835334382',
  api_secret: '-Un3wdU-s3JSaXkUUAyJ2q2Y9aM',
  base: 'http://res.cloudinary.com/winterrain5',
  image: 'https://api.cloudinary.com/v1_1/winterrain5/image/upload',
  video: 'https://api.cloudinary.com/v1_1/winterrain5/video/upload',
  audio: 'https://api.cloudinary.com/v1_1/winterrain5/raw/upload',
}

export default class Accout extends Component {
  constructor(props) {
    super(props);
    var user = this.props.user || {}
    this.state = {
      user: user,
      avatarProgress: 0,
      avatarUploading: false,
      modalVisible: false
    };
  }
  componentWillMount() {
    AsyncStorage.getItem('user')
    .then((data) => {
      var user;
      if (data) {
        user = JSON.parse(data);
      }
      if (user && user.accessToken) {
        this.setState({
          user: user
        });
      }
    })
  }

  render() {
    var user = this.state.user
    return(
      <View style={styles.container}>
        <View style={styles.navBar}>
          <Text style={styles.navTitle}>账户</Text>
          <Text style={styles.navRightTitle} onPress={this._edit.bind(this)}>编辑</Text>
        </View>
        {
          user.avatar
          ?
          <TouchableOpacity style={styles.avatarContainer} onPress={this._pickPhoto.bind(this)}>
            <Image source={{uri: this.avatar(user.avatar,'image')}} style={styles.avatarContainer}>
              <View style={styles.avatarBox}>
                  <Image
                    source={{uri: this.avatar(user.avatar,'image')}}
                    style={styles.avatar}
                  />
                </View>
              <Text style={styles.avatartip}>修改头像</Text>
            </Image>
          </TouchableOpacity>
          :
          <View style={styles.avatarContainer}>
            <Text style={styles.avatartip}>添加头像</Text>
            <TouchableOpacity activityOpacity={0.5} style={styles.avatarBox} onPress={this._pickPhoto.bind(this)}>
              <Image source={{uri: 'plus-round'}} style={styles.plusIcon}/>
            </TouchableOpacity>
          </View>
        }
        {
          this.avatarUploading
          ? <Progress progress={this.avatarProgress} width={200} style={{justifyContent: 'center',alignItems: 'center'}}/>
          : null
        }
        <Modal
          animationType={'slide'}
          visible={this.state.modalVisible}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={this._closeModal.bind(this)} style={styles.closeBtn}>
              <Image source={{uri: 'close_x'}} style={styles.closeIcon}></Image>
            </TouchableOpacity>
            {/* 昵称 */}
            <View style={styles.fieldItem}>
              <Text style={styles.label}>昵称</Text>
              <TextInput
                placeholder='输入狗狗的昵称'
                style={styles.inputField}
                autoCapitalize={'none'}
                autoCorrect={false}
                defaultValue={user.nickName}
                onChangeText={(text) => {
                  this._changeUserState('nickName',text)
                }}
                />
            </View>

            {/* 品种 */}
            <View style={styles.fieldItem}>
              <Text style={styles.label}>品种</Text>
              <TextInput
                placeholder='输入狗狗的品种'
                style={styles.inputField}
                autoCapitalize={'none'}
                autoCorrect={false}
                defaultValue={user.breed}
                onChangeText={(text) => {
                  this._changeUserState('breed',text)
                }}
                />
            </View>

            {/* 品种 */}
            <View style={styles.fieldItem}>
              <Text style={styles.label}>年龄</Text>
              <TextInput
                placeholder='输入狗狗的年龄'
                style={styles.inputField}
                autoCapitalize={'none'}
                autoCorrect={false}
                defaultValue={user.age}
                onChangeText={(text) => {
                  this._changeUserState('age',text)
                }}
                />
            </View>

            {/* 品种 */}
            <View style={styles.fieldItem}>
              <Text style={styles.label}>性别</Text>
              <View style={styles.btnContainer}>
                <Button
                  onPress={this._changeUserState('gender','male')}
                  style={[styles.gender,user.gender === 'male' && styles.genderChecked]}>公</Button>
                <Button
                  onPress={this._changeUserState('gender','female')}
                  style={[styles.gender,styles.genderChecked]}
                  >母</Button>
              </View>
            </View>
            <Button style={styles.saveBtn} onPress={this._submit.bind(this)}>保存</Button>
          </View>
        </Modal>
        {/* 退出 */}
        <Button style={styles.saveBtn} onPress={this._logout.bind(this)}>退出登录</Button>
      </View>
    );
  }

  /*******************************************************************/
  // 编辑用户其他信息
  // 呼出浮层
  _edit() {
    this.setState({
      modalVisible: true
    })
  }

  // 关闭浮层
  _closeModal() {
    this.setState({
      modalVisible: false
    })
  }

  // 编辑用户资料
  // userKey 是用户字段
  // userState 是用户编辑后的结果
  //
  _changeUserState(userKey,userState) {
    var user = this.state.user
    user[userKey] = userState
    // this.setState({
    //   user: user
    // })
  }

  _submit() {
    this._closeModal()
  }
  // 登出
  _logout() {
    this.props.logout()
  }

  /*******************************************************************/
  // 上传头像相关方法
  _pickPhoto() {

    // 打开相册
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        return;
      }
      var avatarData = 'data:image/jpeg;base64,' + response.data;

      // 构建图片上传参数及请求
      var timestamp = Date.now();
      var tags = 'app,avatar';
      var folder = 'avatar';
      var signatureUrl = config.api.base + config.api.signature;
      // 模拟请求签名
      request.post(signatureUrl,{
        accessToken: this.state.user.accessToken,
        timestamp: timestamp,
        type: 'avatar'
      })
      .catch((err) => {
        console.error(err);
      })
      .then((data) => {
        if (data && data.success) {
          // 拼接签名
          var signature = 'folder=' + folder + '&tags=' + tags + '&timestamp=' + timestamp + CLOUDINARY.api_secret;
          signature = sha1(signature);

          // 准备表单内容
          var body = new FormData()
          body.append('folder',folder);
          body.append('signature',signature);
          body.append('timestamp',timestamp);
          body.append('tags',tags);
          body.append('api_key',CLOUDINARY.api_key);
          body.append('resource_type','image');
          body.append('file',avatarData);

          // 上传到图床
          this._upload(body);
        }
      })
    });
  }
  _upload(body) {

    this.setState({
      avatarUploading: true,
      avatarProgress: 0
    });
    var xhr = new XMLHttpRequest();
    var url = CLOUDINARY.image;

    xhr.open('POST',url);

    // 获取服务器返回数据
    xhr.onreadystatechange = () => {
      if (xhr.status !== 200) {
        console.log(xhr.responseText);
        alert('responseText请求失败');
        return;
      }
      var response;
      try {
        response = JSON.parse(xhr.response)
      } catch (e) {
        console.log(e);
      }

      if (response && response.public_id) {
        var user = this.state.user
        user.avatar = response.public_id
        this.setState({
          user: user,
          avatarUploading: false,
          avatarProgress: 0
        });

        // 更新用户信息
        this._asyncUser(true)
      }
    }

    // 获取上传进度
    if (xhr.upload) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          var percent = ((event.loaded / event.total).toFixed(2))
          console.log(percent);
          this.setState({
            avatarProgress: percent
          });
        }
      }
    }

    // 发送请求
    xhr.send(body);

  }
  // 更新用户信息
  _asyncUser(isAvatar) {
    var user = this.state.user
    if (user && user.accessToken) {
      var  url = config.api.base + config.api.update

      request.post(url,user)
      .then((data) => {
        if (data && data.success) {
          var user = data.data
          this.setState({
            user: user
          },()=>{
            alert('存储成功')
            AsyncStorage.setItem('user',JSON.stringify(user))
          })
        }
      })
    }
  }

  /********************************************************/
  avatar(id,type) {
    // 是链接
    if (id.indexOf('http') > -1) {
      return id
    }
    // 是base64
    if (id.indexOf('data:image') > -1) {

    }
    return CLOUDINARY.base + '/' + type + '/upload/' + id;
  }
  sdaf

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  avatartip: {
    color: '#fff',
    backgroundColor: 'transparent',
    fontSize: 14
  },
  avatarContainer: {
    width: width,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#666'
  },
  avatarBox: {
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  plusIcon: {
    padding: 20,
    paddingLeft: 25,
    paddingRight: 25,
    backgroundColor: '#fff',
    borderRadius: 8,
    width: 60,
    height: 60
  },
  avatar: {
    marginBottom: 15,
    width : width * 0.2,
    height: width * 0.2,
    resizeMode: 'cover',
    borderRadius: width * 0.1,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  // nav
  navBar: {
    height: 64,
    flexDirection: 'row',
    backgroundColor: '#ee735c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  navRightTitle: {
    position: 'absolute',
    right: 12,
    top: 23,
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600'
  },
  // modal
  closeBtn: {
    position: 'absolute',
    top: 30,
    left: 15
  },
  closeIcon: {
    width: 20,
    height: 20
  },
  modalContainer: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff'
  },
  fieldItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginLeft: 15,
    paddingRight: 15,
    borderColor: '#eee',
    borderBottomWidth: 1
  },
  label: {
    color: '#ccc',
    marginRight: 15
  },
  inputField: {
    height: 50,
    flex: 1,
    color: '#666',
    fontSize: 14
  },
  gender: {
    backgroundColor: '#fff',
    color: '#ccc',
    borderColor: '#eee',
    borderWidth: 1,
    width: 40,
    height: 30,
    borderRadius: 4,
    textAlign: 'center',
    marginRight: 20,
    paddingTop: 6
  },
  genderChecked: {
    color: '#ee735c',
    borderColor: '#ee735c',
  },
  btnContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 50,
  },
  saveBtn: {
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 60,
    backgroundColor: 'transparent',
    borderColor: '#ee735c',
    borderWidth: 1,
    borderRadius: 4,
    color: '#ee735c'
  }
});
