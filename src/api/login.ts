import { request } from '@/utils/request';

// 微信登录
export function loginWechat({ code }) {
  return request({
    method: 'GET',
    url: '/login/wechat',
    data: {
      code,
    }
  })
}

// 短信登录
export function loginPhone({ code, phone }) {
  return request({
    method: 'POST',
    url: '/login/phone',
    data: {
      code,
      phone,
    }
  })
}

// 校验token
export function loginCheckToken() {
  return request({
    method: 'GET',
    url: '/login/checkToken',
  })
}

// 发送登录验证码
export function loginSendLoginMessage({ phone }) {
  return request({
    method: 'GET',
    url: '/login/sendLoginMessage',
    data: {
      phone,
    }
  })
}

// 发送修改手机号验证码
export function loginSendChangeMessage({ phone }) {
  return request({
    method: 'GET',
    url: '/login/sendChangeMessage',
    data: {
      phone,
    }
  })
}

