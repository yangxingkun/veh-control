import { useModel } from '@/hooks/react-store/useModel';

interface TabItem {
  title: string;
  panelKey: string;
  tag: 1 | 2;
}
interface IState {
  activePanel: string;
  tabItems: TabItem[];
  selectedTabItem: TabItem | null;
}
export function useTabsModel() {
  const model = useModel<IState>({
    state: {
      activePanel: '1',
      tabItems: [
        {
          title: '标签',
          panelKey: '1',
          tag: 1,
        },
        {
          title: '用户',
          panelKey: '2',
          tag: 2,
        },
      ],
      selectedTabItem: null,
    },
    computed: [
      {
        keys: ['activePanel'],
        hander: ({ activePanel, tabItems }) => {
          debugger
          return {
            selectedTabItem: tabItems.find(
              (item) => item.panelKey === activePanel
            ),
          };
        },
      },
    ],
  });
  return model;
}
