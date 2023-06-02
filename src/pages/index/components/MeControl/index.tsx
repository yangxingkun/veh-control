import { useEffect, useRef, useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Input,Button } from '@tarojs/components';
import AddFriend from '@/components/AddFriend';
import { Dialog, Radio,Icon } from '@nutui/nutui-react-taro';
import classNames from 'classnames';
import { getToken } from '@/utils/token';
import Redirect from '@/components/Redirect';
import './index.scss';

const List = ({ visible, myModel }) => {
  const [visible1, setVisible] = useState(false);
  const [radioVal] = useState('1');
  const { isLogin, loginChecking} =
    myModel.useGetState();
    const token = getToken();
  useEffect(() => {}, [radioVal]);
  const handleModal = () => {
    switch (radioVal) {
      case '1':
        Taro.navigateTo({
          url: `/pages/meControlChatPage/index?code=${'1'}`,
        });
        break;
      case '2':
        setVisible(true);
        break;
      default:
        break;
    }
  };
  if (!token || (!loginChecking && !isLogin)) {
    return <Redirect to="/pages/auth/index" />;
  }
  return (
    <View
      className={classNames(
        'index-meControl',
        visible ? 'meControl-visible' : 'meControl-hidden'
      )}
    >
      <div>
        <img
          className="logo"
          src="http://152.136.205.136:9000/vehicle-control/font/Shape.svg"
        />
        <div className="title">
          <span>最懂车的AI助手</span>
        </div>
        <div className="desc">
          <span>功能内测中请输入内测码使用</span>
        </div>
        <Input
          className="wrapper-input"
          type="text"
          placeholder="请输入内测码"
          placeholderStyle="color:#95969F;font-size:12px"
        />
        <Button type="primary" className="wrapper-button" onClick={handleModal}>
          确定
        </Button>
        <View className="mark">
          {/* <Text className="mark-text"></Text> */}
          <AddFriend
            text="暂无内测码 请联系我们"
            showDivider={false}
            className="mark-customer-service"
            icon={<Icon name="triangle-up" />}
          />
        </View>
        {/* <Radio.RadioGroup value={radioVal} direction='horizontal'>
          <Radio value="1">是</Radio>
          <Radio value="2">否</Radio>
        </Radio.RadioGroup> */}
      </div>
      <Dialog
        title="内测码错误"
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
