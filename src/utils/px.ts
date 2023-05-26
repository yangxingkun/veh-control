import Taro from '@tarojs/taro'
const windowInfo = Taro.getWindowInfo();

export function px(val: number) {
  return val / 375 * windowInfo.windowWidth;
}
