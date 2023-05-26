import { View, Text, Input, Button } from '@tarojs/components';

import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import { templateSearchPage } from '@/api/template'
import './index.scss';
import { TemplateListItem } from '@/types/template';
import { useEffect, useRef, useState } from 'react';

import { Dialog } from '@nutui/nutui-react-taro';
const List = ({ visible }) => {
  console.log(visible, "7987")
  const isFirstRef = useRef(true);
  const [visible1, setVisible] = useState(false);
  const {
    state: { data, loading, hasMore, refresherTriggered },
    onScrollToLower,
    onRefresherRefresh,
    fetchData,
    hidePullDownLoading,
  } = useInfiniteScroll<TemplateListItem>(({ pageNum, pageSize }) => {
    return templateSearchPage({
      pageSize,
      pageNum,
    })
  }, {
    defaultPageSize: 20,
  });
  useEffect(() => {
    if (visible) {
      if (!isFirstRef.current) {
        fetchData()
      }
      isFirstRef.current = false;
    }
  }, [visible]);
  const handleModal = () => {
    setVisible(true)
  }
  const jumpLoadingAnimate = () => {
  }
  return (
    <View className={classNames('index-list', visible ? 'list-visible' : 'list-hidden')}>
      {/* Taro.navigateTo({
                        url: `/pages/tagDetailPage/index?type=${item.type}&materialCode=${item.materialCode}&templateCode=${item.templateCode}&templateName=${item.templateName}`
      }) */}
      <div>
        <img className="logo" src="http://152.136.205.136:9000/vehicle-control/font/Shape.svg" />
        <div className="title">
          <span>最懂车的AI助手</span>
        </div>``
        <div className="desc">
          <span>功能内测中请输入内测码使用</span>
        </div>
        <Input
          className="wrapper-input"
          type="text"
          placeholder="请输入内侧码"
          placeholderStyle="color:#95969F;font-size:12px"
        />
        <Button className="wrapper-button" onClick={handleModal}>
          确定
        </Button>
        <View className="mark">
          <Text>暂无内测码</Text>
          <Text className="herf" onClick={jumpLoadingAnimate}>
            联系我们
          </Text>
        </View>
      </div>
      <Dialog
        title="内侧码错误"
        textAlign="center"
        noCancelBtn={true}
        visible={visible1}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        okText="我知道了"
        footerDirection='vertical'
      >
        <div><div>请重新输入联系我们</div><div>获取内测码</div></div>
      </Dialog>
    </View>
  );
};
export default List;
