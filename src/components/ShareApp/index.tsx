import { useLatest } from '@/hooks/useLatest';
import Taro, { useShareAppMessage } from '@tarojs/taro';
import { useEffect } from 'react';

interface ShareAppProps {
  disabled?: boolean;
  getShareData: () => ({
    title: string;
    path: string;
    imageUrl?: string;
  })
}
const ShareApp = (props: ShareAppProps) => {
  const propsRef = useLatest(props);
  useEffect(() => {
    if (props.disabled) {
      Taro.hideShareMenu()
    } else {
      Taro.showShareMenu({
        withShareTicket: true,
        showShareItems: ['wechatFriends', 'wechatMoment'],
      })
    }
  }, [props.disabled]);
  useShareAppMessage(() => {
    return propsRef.current.getShareData();
  })
  return null;
}

export default ShareApp;
