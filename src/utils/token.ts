import Taro from '@tarojs/taro';

const tokenStore: {
  token: string | null;
} = {
  token: null,
}

export function setToken(token: string) {
  try {
    Taro.setStorageSync('TOKEN', token);
    tokenStore.token = token;
  } catch (error) {}
}

export function getToken() {
  if (tokenStore.token) return tokenStore.token;
  try {
    const token = Taro.getStorageSync('TOKEN');
    tokenStore.token = token;
  } catch (error) {
    return null;
  }
}

getToken();

export function removeToken() {
  try {
    Taro.removeStorageSync('TOKEN')
    tokenStore.token = null;
  } catch (e) {}
}
