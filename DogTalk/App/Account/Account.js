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
  AlertIOS
} from 'react-native';

import request from '../Common/request'
import config from '../Common/config'
import ImagePicker from 'react-native-image-picker'
import sha1 from 'sha1'
var {width,height} = Dimensions.get('window');
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
    this.state = {
      user: {},
      avatarSource: null
    };
  }
  componentDidMount() {
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
        {
          user.avatar
          ?
          <TouchableOpacity style={styles.avatarContainer} onPress={this._pickPhoto.bind(this)}>
            <Image source={{uri: user.avatar}} style={styles.avatarContainer}>
              <View style={styles.avatarBox}>
                <Image
                  source={{uri: user.avatar}}
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
      </View>
    );
  }
  _pickPhoto() {

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
          var signature = 'folder=' + folder + '&tags=' + tags + '&timestamp=' + timestamp + CLOUDINARY.api_secret;
          signature = sha1(signature);

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
    console.log(body);
    var xhr = new XMLHttpRequest();
    var url = CLOUDINARY.image;

    xhr.open('POST',url);

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
        var user = this.state.user;
        user.avatar = this.avatar(response.public_id,'image')
        this.setState(
          user: user
        );
      }
    }
    xhr.send(body);

  }

  avatar(id,type) {
    return CLOUDINARY.base + '/' + type + '/upload/' + id;
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 64,
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
  }
});
