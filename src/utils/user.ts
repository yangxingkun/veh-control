import { UserInfo } from '@/types/user';
import Taro from '@tarojs/taro';

const userInfoStore: {
  data: UserInfo | null;
} = {
  data: null,
}
const userInfoKey = 'userInfo'
export function setUserInfo(useInfo: UserInfo) {
  try {
    Taro.setStorageSync(userInfoKey, JSON.stringify(useInfo));
    userInfoStore.data = useInfo;
  } catch (error) {}
}

export function getUserInfo() {
  if (userInfoStore.data) return userInfoStore.data;
  try {
    const userInfoString = Taro.getStorageSync(userInfoKey);
    userInfoStore.data = JSON.parse(userInfoString);
    return userInfoStore.data;
  } catch (error) {}
}

export function removeUserInfo() {
  try {
    Taro.removeStorageSync(userInfoKey);
    userInfoStore.data = null;
  } catch (error) {}
}

export function isUserLogin() {
  return !!getUserInfo();
}
