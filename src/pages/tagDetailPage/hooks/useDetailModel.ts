import { createAsyncEffect, useModel } from '@/hooks/react-store/useModel';
import { templateQueryByCode, templateCollect, templateCancleCollect } from '@/api/template';
import Taro, { useRouter } from '@tarojs/taro';
import { isUserLogin } from '@/utils/user';

interface IState {
  detailData: any;
  loading: boolean;
}

interface IEffects {
  fetchData: () => Promise<Partial<IState>>;
  handleCollect: () => Promise<any>;
}
interface IConfig {
  params: {
    type: string;
    materialCode: string;
    templateCode: string;
  }
}
export function useDetailModel({ params }: IConfig) {
  const model =  useModel<IState, IEffects>({
    state: {
      detailData: {},
      loading: false,
    },
    effects: {
      fetchData: createAsyncEffect(
        () => {
          Taro.showLoading();
          return templateQueryByCode({
            type: params.type as any,
            materialCode: params.materialCode,
            templateCode: params.templateCode,
          })
            .then((detailData) => {
              Taro.hideLoading();
              return {
                detailData: detailData || {},
              };
            })
            .catch(() => {
              return {
                detailData: {},
              };
            });
        },
        {
          loadingKey: 'loading',
        }
      ),
      handleCollect: () => {
        if (!isUserLogin()) {
          Taro.redirectTo({
            url: '/pages/auth/index'
          });
          return Promise.reject();
        }
        const { detailData } = model.getState();
        const requestFunc = detailData.collect ? templateCancleCollect : templateCollect;
        return requestFunc({
          templateCode: params.templateCode,
        }).then(() => {
          model.getEffect('fetchData')().then(() => {
            Taro.showToast({
              title: detailData.collect ? '取消收藏成功' : '收藏成功',
              icon: 'success',
            })
          });
        })
      }
    },
  });
  return model;
}
