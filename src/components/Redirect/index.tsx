import Taro, { useDidShow } from '@tarojs/taro';
import { useEffect } from 'react';

interface IProps {
  to: string;
}
const Redirect = ({ to }: IProps) => {
  useEffect(() => {
    Taro.nextTick(() => {
      Taro.redirectTo({
        url: to,
      })
    })
  }, [])
  return null;
}

export default Redirect;
