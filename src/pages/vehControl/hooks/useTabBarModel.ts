import { useModel } from '@/hooks/react-store/useModel';
import Taro, { useRouter } from '@tarojs/taro';

interface IState {
  activeIndex: number;
  tabRenderedMap: {
    [key: string]: boolean;
  }
}
const TITLES = [
  '首页',
  '我的',
]
export function useTabBarModel() {
  const router = useRouter();
  const model = useModel<IState>({
    state: {
      activeIndex: router.params.activeMy ? 1 : 0,
      tabRenderedMap: {}
    },
    computed: [
      {
        keys: ['activeIndex'],
        hander: ({ activeIndex, tabRenderedMap }) => {
          return {
            tabRenderedMap: { ...tabRenderedMap, [activeIndex]: true },
          }
        }
      }
    ],
    watch: [
      {
        keys: ['activeIndex'],
        hander: ({ activeIndex }) => {
          Taro.setNavigationBarTitle({
            title: TITLES[activeIndex],
          })
        }
      }
    ]
  });
  return model;
}
