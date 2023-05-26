import { templateMy } from '@/api/template';
import { createAsyncEffect, useModel } from '@/hooks/react-store/useModel';
import { UserInfo } from '@/types/user';
import { setToken } from '@/utils/token';
import { setUserInfo } from '@/utils/user';
import Taro from '@tarojs/taro';

interface IState {
  isLogin: boolean;
  loginChecking: boolean;
  userInfo: UserInfo;
  showPopup: boolean;
}
interface IEffects {
  checkLogin: () => Promise<any>;
  fetchData: () => Promise<any>;
}

export function useMyModel() {
  const myModel = useModel<IState, IEffects>({
    state: {
      isLogin: false,
      loginChecking: true,
      userInfo: {} as UserInfo,
      showPopup: false,
    },
    effects: {
      fetchData: createAsyncEffect(() => {
        Taro.showLoading();
        return templateMy().then((data: UserInfo) => {
          Taro.hideLoading();
          if (data) {
            if (data.token) {
              setToken(data.token)
            }
            setUserInfo(data);
          }
          return {
            isLogin: true,
            userInfo: data,
          }
        }).catch(() => {
          console.log('error')
          Taro.hideLoading();
          return {
            isLogin: false,
            userInfo: {},
          }
        })
      }, {
        loadingKey: 'loginChecking',
      }),
    }
  })
  return myModel;
}

