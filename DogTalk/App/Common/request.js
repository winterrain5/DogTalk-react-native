'use stric'
import queryString from 'query-string'
import loadsh from 'lodash'
import config from './config'
import Mock from 'mockjs'

var request = {}

request.get = function(url,params) {
  if(params) {
    url += '?' + queryString.stringify(params);
  }
  return fetch(url)
  .then((response) => response.json())
  .then((rensonsejson) => Mock.mock(rensonsejson))
}

request.post = function(url,body) {
  var options = loadsh.extend(config.header,{
    body: JSON.stringify(body)
  }
);
  return fetch(url,options)
  .then((response) => response.json())
  .then((rensonsejson) => Mock.mock(rensonsejson))
}

module.exports = request
