import Taro from '@tarojs/taro';

const verifyStore: {
  verify: string | null;
} = {
  verify: null,
}

export function setVerify(verify: string) {
  try {
    Taro.setStorageSync('verify', verify);
    verifyStore.verify = verify;
  } catch (error) {}
}

export function getVerify() {
  if (verifyStore.verify) return verifyStore.verify;
  try {
    const verify = Taro.getStorageSync('verify');
    verifyStore.verify = verify;
  } catch (error) {
    return null;
  }
}
export function removeVerify() {
  try {
    Taro.removeStorageSync('verify')
    verifyStore.verify = null;
  } catch (e) {}
}
