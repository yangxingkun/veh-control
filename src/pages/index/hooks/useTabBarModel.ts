import { useModel } from '@/hooks/react-store/useModel';
import Taro, { useRouter } from '@tarojs/taro';

interface IState {
  activeIndex: number;
  tabRenderedMap: {
    [key: string]: boolean;
  }
}
const TITLES = [
  '发现',
  '咪控',
  '我的',
]
export function useTabBarModel() {
  const router = useRouter();
  const model = useModel<IState>({
    state: {
      activeIndex: router.params.activeMy ? 2 : 0,
      tabRenderedMap: {}
    },
    computed: [
      {
        keys: ['activeIndex'],
        hander: ({ activeIndex, tabRenderedMap }) => {
          // console.log({ ...tabRenderedMap, [activeIndex]: true },"{ ...tabRenderedMap, [activeIndex]: true }")
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
          // console.log(activeIndex,"[][watch][[5]")
          Taro.setNavigationBarTitle({
            title: TITLES[activeIndex],
          })
        }
      }
    ]
  });
  return model;
}
