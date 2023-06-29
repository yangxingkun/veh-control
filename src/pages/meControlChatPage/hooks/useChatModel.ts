import { templateMy } from '@/api/template';
import { createAsyncEffect, useModel } from '@/hooks/react-store/useModel';
import { UserInfo } from '@/types/user';
import { setToken } from '@/utils/token';
import { getUserInfo, isUserLogin, setUserInfo } from '@/utils/user';
import Taro from '@tarojs/taro';

interface IState {
  isLogin: boolean;
  loginChecking: boolean;
  userInfo: UserInfo;
  showPopup: boolean;
  refresherEnabled: boolean;
}
interface IEffects {
  checkLogin: () => Promise<any>;
  fetchData: (options?: {showLoading?: boolean}) => Promise<any>;
}

export function useMyModel() {
  const myModel = useModel<IState, IEffects>({
    state: {
      isLogin: false,
      loginChecking: true,
      userInfo: {} as UserInfo,
      showPopup: false,
      refresherEnabled: true,
    },
    effects: {
      fetchData: createAsyncEffect((options) => {
        if (options?.showLoading !== false) {
          Taro.showLoading();
        }
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

