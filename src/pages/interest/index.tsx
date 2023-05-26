import Avatar from './components/Avatar';
import { Button } from '@nutui/nutui-react-taro';
import './index.scss';
import { createAsyncEffect, useModel } from '@/hooks/react-store/useModel';
import { categoryList } from '@/api/category';
import Taro from '@tarojs/taro';
import { useEffect } from 'react';
import { objectToArray } from '@/utils/object';
import { templateCollectByLabel } from '@/api/template'
import { useHideHomeButton } from '@/hooks/useHideHomeButton';

interface IInteresetItem {
  categoryName: string;
  categoryCode: string;
  icon: string;
}
interface IState {
  interestList: IInteresetItem[];
  loading: boolean;
  categoryCodes: string[];
  categoryCodesMap: Record<string, string>;
}
interface IEffects {
  fetchData: () => Promise<Partial<IState>>;
  setSelectCode: (code: string) => void;
}
const Interest = () => {
  useHideHomeButton();
  const model = useModel<IState, IEffects>({
    state: {
      interestList: [],
      loading: false,
      categoryCodes: [],
      categoryCodesMap: {},
    },
    computed: [
      {
        keys: ['categoryCodesMap'],
        hander: ({ categoryCodesMap }) => {
          return {
            categoryCodes: objectToArray(categoryCodesMap),
          };
        },
      },
    ],
    effects: {
      fetchData: createAsyncEffect(
        () => {
          Taro.showLoading();
          return categoryList()
            .then((interestList) => {
              Taro.hideLoading();
              return {
                interestList: interestList || [],
              };
            })
            .catch(() => {
              return {
                interestList: false,
              };
            });
        },
        { loadingKey: 'loading' }
      ),
      setSelectCode: (code: string) => {
        const { categoryCodesMap } = model.getState();
        const newCodeMap = { ...categoryCodesMap };
        if (newCodeMap[code]) {
          delete newCodeMap[code];
        } else {
          newCodeMap[code] = code;
        }
        model.setState({
          categoryCodesMap: newCodeMap,
        });
      },
    },
  });
  useEffect(() => {
    model.getEffect('fetchData')();
  }, []);
  const { interestList, categoryCodesMap, categoryCodes } = model.useGetState();
  return (
    <div className="interest-page">
      <div className="tittle">选择感兴趣的标签</div>
      <div className="subtitle">我们将保护你的个人信息</div>
      <div className="grid">
        <div className="row">
          {interestList.map((item) => {
            return (
              <div key={item.categoryCode} className="col">
                <Avatar
                  onClick={() => {
                    model.getEffect('setSelectCode')(item.categoryCode)
                  }}
                  icon={item.icon}
                  selected={!!categoryCodesMap[item.categoryCode]}
                  name={item.categoryName}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="select-button">
        <Button onClick={() => {
          Taro.showLoading();
          templateCollectByLabel({
            categoryCodes,
          }).then(() => {
            Taro.redirectTo({
              url: '/pages/index/index'
            })
            Taro.hideLoading();
          })
        }} disabled={categoryCodes.length < 4} type="primary" block size="large">
          至少选择4个标签
        </Button>
      </div>
    </div>
  );
};

export default Interest;
