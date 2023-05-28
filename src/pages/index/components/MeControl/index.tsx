import { View, Text, Input, Button } from '@tarojs/components';

import Taro from '@tarojs/taro';
import classNames from 'classnames';
import './index.scss';
import { useEffect, useRef, useState } from 'react';
import AddFriend from '@/components/AddFriend';

import { Dialog, Icon } from '@nutui/nutui-react-taro';
const List = ({ visible }) => {
  console.log(visible, '7987');
  const [visible1, setVisible] = useState(false);

  // useEffect(() => {
  //   if (visible) {
  //     if (!isFirstRef.current) {
  //       fetchData();
  //     }
  //     isFirstRef.current = false;
  //   }
  // }, [visible]);
  const handleModal = () => {
    // setVisible(true)
    // Taro.navigateTo({
    //   url: `/pages/meControlChat/index`,
    // });
  };
  return (
    <View className={classNames('index-meControl')}>
      <div>
        <img
          className="logo"
          src="http://152.136.205.136:9000/vehicle-control/font/Shape.svg"
        />
        <div className="title">
          <span>最懂车的AI助手</span>
        </div>
        ``
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
          <Text className="mark-text">暂无内测码</Text>
          <View className="mark-service">
            <AddFriend
              text="客服中心"
              showDivider={false}
              icon={
                <Icon className="customer-service-icon" name="triangle-up" />
              }
              className={'customer-service'}
            />
          </View>
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
        footerDirection="vertical"
      >
        <div>
          <div>请重新输入联系我们</div>
          <div>获取内测码</div>
        </div>
      </Dialog>
    </View>
  );
};
export default List;
