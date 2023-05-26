import Taro, { useDidShow } from '@tarojs/taro';

export function useHideHomeButton() {
  useDidShow(() => {
    Taro.hideHomeButton();
  })
}
