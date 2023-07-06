import { useEffect, useState } from 'react';
import Taro  from '@tarojs/taro';
import { View, Text, Button, Input } from '@tarojs/components';
import { Dialog} from '@nutui/nutui-react-taro';
import classNames from 'classnames';
import { getToken } from '@/utils/token';
import Redirect from '@/components/Redirect';
import { verifyChatCode } from '@/api/chat'
import { getUserInfo } from '@/utils/user';
import { setVerify, getVerify } from '@/utils/chatVerify';
import './index.scss';
const CustomDialog = ({ isShow, setIsShow }) => {
  return (
    <Dialog
      className='custom-dialog'
      title="内测码错误"
      textAlign="center"
      noCancelBtn={true}
      noOkBtn={true}
      visible={isShow.show}
    >
      <div className='dialog-flex'>
        <div style={{ marginTop: '11px' }}>请重新输入联系我们</div>
        <div style={{ marginBottom: '26px' }}>获取内测码</div>
        <Button onClick={() => setIsShow((pre) => ({ ...pre, ...{ show: false } }))}>我知道了</Button>
      </div>
    </Dialog>
  )
}
const List = ({ visible, myModel }) => {
  const { isLogin, loginChecking } = myModel.useGetState();
  const token = getToken();
  const verify = getVerify();
  const userInfo: any = getUserInfo()
  const [isShow, setIsShow] = useState({
    show: false,
    message: ''
  });
  const [value, setValue] = useState('');
  // 8M6fzH
  useEffect(() => {
    if (visible&&verify) {
      Taro.redirectTo({
        url: `/pages/meControlChatPage/index?code=${verify}`,
      });
    }
  }, [visible]);
  const handleModal = async () => {
    let { verified, message } = await verifyChatCode({ code: value, user: userInfo.userCode })
    switch (verified) {
      case true:
        setVerify(verified)
        Taro.redirectTo({
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
        <Button type="primary" className="wrapper-button" onClick={handleModal} hoverClass="wrapper-button-active">
          确 定
        </Button>
        <View className={classNames('contact')}>
          <View className={classNames('contact-button')}>
            <cell
              styleType={1}
              onStartmessage="startmessage"
              onCompletemessage="completemessage"
              plugid="689e7fc09d86da7200d62262f489b09b"
            ></cell>
          </View>
          <Text className='contact-text'>暂无内测码?</Text>
          <Text className='contact-customer_service'>联系我们</Text>
        </View>
      </div>
      <CustomDialog isShow={isShow} setIsShow={setIsShow} ></CustomDialog>
    </View>
  );
};
export default List;
