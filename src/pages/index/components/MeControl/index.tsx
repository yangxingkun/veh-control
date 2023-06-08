import { useEffect, useRef, useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Input, Button } from '@tarojs/components';
import AddFriend from '@/components/AddFriend';
import { Dialog, Radio, Icon } from '@nutui/nutui-react-taro';
import classNames from 'classnames';
import { getToken } from '@/utils/token';
import Redirect from '@/components/Redirect';
import { verifyChatCode } from '@/api/chat'
import { getUserInfo } from '@/utils/user';
import './index.scss';
const CustomDialog = ({ isShow, setIsShow }) => {
  return (
    <Dialog
      className='custom-dialog'
      title="内测码错误"
      textAlign="center"
      noCancelBtn={true}
      visible={isShow.show}
      onOk={() => setIsShow((pre) => ({ ...pre, ...{ show: false } }))}
      // onCancel={() => setIsShow((pre) => ({ ...pre, ...{ show: false } }))}
      okText="我知道了"
    // footerDirection="vertical"
    >
      <div>
        <div>请重新输入联系我们</div>
        <div>获取内测码</div>
      </div>
    </Dialog>
  )
}
const List = ({ visible, myModel }) => {
 
  const { isLogin, loginChecking } = myModel.useGetState();
  const token = getToken();
  const userInfo: any = getUserInfo()
  const [isShow, setIsShow] = useState({
    show: false,
    message: ''
  });
  const [value, setValue] = useState('8M6fzH');
  const handleModal = async () => {
    let { verified, message } = await verifyChatCode({ code: value, user: userInfo.userCode })
    switch (verified) {
      case true:
        Taro.navigateTo({
          url: `/pages/meControlChatPage/index?code=${'1'}`,
        });
        break;
      case false:
        setIsShow((pre) => ({ ...pre, ...{ show: true, message } }))
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
          value={value}
          onInput={(e) => {
            setValue(e.detail.value);
          }}
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
      </div>
      <CustomDialog isShow={isShow} setIsShow={setIsShow} ></CustomDialog>
    </View>
  );
};
export default List;
