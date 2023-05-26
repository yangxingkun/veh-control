import Taro from '@tarojs/taro';
import { safeJSONParse } from './JSON';
import { getToken, removeToken } from './token';
import { removeUserInfo } from './user';

// const BASE_URL = 'http://152.136.205.136:8080/api';
const BASE_URL = 'https://wx.chekkk.com/api';
interface IResponseData {
  code: string;
  data: any;
  message: string;
}
const handlSuccess = (res, resolve, reject) => {
  if (res.statusCode !== 200) {
    reject(new Error(res.errMsg))
    return;
  }
  let { data } = res;
  if (!data) {
    data = {}
  }
  if (typeof data === 'string') {
    data = safeJSONParse(data, {});
  }
  if (data.code === '401') {
    Taro.redirectTo({
      url: '/pages/auth/index'
    })
    removeToken();
    removeUserInfo();
    return reject(new Error('登录过期'));
  }
  if (data.code === '0000') {
    resolve(data.data);
    return;
  }
  // console.log(res);
  Taro.showToast({
    title: data.message,
    icon: 'error',
    duration: 3000,
  })
  const err = new Error() as (Error & {
    responseData: IResponseData;
  })
  err.responseData = data;
  reject(err);
}
const handlFail = (reject) => {
  const message = '连接出错，请检查网络';
  Taro.showToast({
    title: message,
    icon: 'error',
  })
  reject(new Error(message))
}
export function request<TData extends any = any>(options: Taro.request.Option): Promise<TData> {
  return new Promise((resolve, reject) => {
    const requestOptions = {...options}
    requestOptions.url = BASE_URL + options.url;
    const token = getToken();
    const header: Record<string, any> = {
      ...(options.header || {}),
    }
    if (token) {
      header['token'] = token;
    }
    Taro.request({
      ...options,
      url: BASE_URL + options.url,
      dataType: options.dataType ? options.dataType : 'json',
      header,
      success: (res) => {
        handlSuccess(res, resolve, reject);
      },
      fail: handlFail,
    })
  })
}

export interface uploadConfig {
  filePath: string;
  name?: string;
  formData?: Record<string, any>;
  url: string;
}
export function upload(config: uploadConfig) {
  return new Promise((resolve, reject) => {
    const header: Record<string, any> = {}
    const token = getToken();
    if (token) {
      header['token'] = token;
    }
    return Taro.uploadFile({
      url: BASE_URL + config.url,
      filePath: config.filePath,
      name: config.name || 'file',
      formData: config.formData || {},
      header,
      success: (res) => {
        handlSuccess(res, resolve, reject);
      },
      fail: handlFail,
    })
  })
}
