import { View } from '@tarojs/components';
import { Tabbar, TabbarItem,Icon } from '@nutui/nutui-react-taro';
import List from './components/List';
import MeControl from './components/MeControl';
import My from './components/My';
import { useTabBarModel } from './hooks/useTabBarModel';
import './index.scss';
import Taro from '@tarojs/taro';
import { useShareMenu } from '@/hooks/useShareMenu';
import { useMyModel } from './components/My/hooks/useMyModel';
import { TemplateType } from '@/types/template';

const Index = () => {
  const myModel = useMyModel();
  useShareMenu();
  Taro.useShareAppMessage(() => {
    if (activeIndex == 0) {
      return {
        title: '车控·智能汽车体验，车主说了算',
        path: `/pages/index/index`,
      };
    }
    const userInfo = myModel.getState().userInfo!;
    return {
      title: '',
      path: `/pages/tagDetailPage/index?type=${TemplateType.user}&materialCode=${userInfo.materialCode}&templateCode=${userInfo.templateCode}&templateName=${userInfo.templateName}`,
    };
  });
  const tabbarModel = useTabBarModel();
  const { activeIndex, tabRenderedMap } = tabbarModel.useGetState();
  const tabPannels = [List, MeControl, My];

  return (
    <View className="index-page page">
      {tabPannels.map((Comp, index) => {
        if (!tabRenderedMap[index]) return null;
        // @ts-ignore
        return (
          <Comp key={index} myModel={myModel} visible={activeIndex === index} />
        );
      })}

      <View className="index-tabbar-container">
        <Tabbar
          visible={activeIndex}
          onSwitch={(_, idx) => {
            tabbarModel.setState({
              activeIndex: idx,
            });
          }}
          className="index-tabbar"
        >
          <TabbarItem tabTitle="发现" />
          <TabbarItem tabTitle="咪控" />
          <TabbarItem tabTitle="我的" />
        </Tabbar>
      </View>
    </View>
  );
};
export default Index;
