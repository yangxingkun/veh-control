import { Button } from '@nutui/nutui-react-taro'
import Taro from '@tarojs/taro';
import { loginWechat } from '@/api/login'
import './index.scss';
import { UserInfo } from '@/types/user';
import { setToken } from '@/utils/token';
import { setUserInfo } from '@/utils/user';
import Transition from '@/components/Transition';
import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import closeIconSvg from '@/assets/svg/close_icon_circle.svg';
import { Image } from '@tarojs/components';

const Login = () => {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<any>();
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setVisible(true);
    }, 300);
    return () => {
      clearTimeout(timerRef.current);
    }
  }, [])
  return (
    <div className="auth-page">
      <div className="auth-logo-container">
        <img className="auth-logo" src="http://152.136.205.136:9000/vehicle-control/font/CHEK_Logo_Black_Vertical_RGB.svg" alt="" />
      </div>
      <div className="auth-footer-container">
        <Button onGetPhoneNumber={(e) => {
          console.log(e,"-=-=-")
          Taro.showLoading();
          loginWechat({
            code: e.detail.code,
          }).then((userInfo: UserInfo) => {
            setToken(userInfo.token);
            setUserInfo(userInfo);
            if (userInfo.first === 0) {
              Taro.redirectTo({
                url: '/pages/index/index'
              })
            } else {
              Taro.redirectTo({
                url: '/pages/interest/index'
              })
            }
          }).finally(() => {
            Taro.hideLoading();
          })
        }} openType="getPhoneNumber" size="large" block type="primary">一键登录</Button>
        <div onClick={() => {
          Taro.navigateTo({
            url: '/pages/login/index'
          })
        }} className="button-text">手机号码登录/注册</div>
        <div className="info-tip">
          <div>点击登录代表你已阅读并同意</div>
          <div>《<text className="info-button" onClick={() => {
            Taro.navigateTo({
              url: '/pages/userAgreement/index?type=userAgreement',
            })
          }}>用户协议</text>》《<text onClick={() => {
            Taro.navigateTo({
              url: '/pages/userAgreement/index?type=privacy',
            })
          }} className="info-button">隐私政策</text>》</div>
        </div>
      </div>
      <Transition visible={visible} transitionName="fade-in">
        {
          (_, transitionClassName) => {
            return (
              <div className={classNames('auth-popup', transitionClassName)}>
                <div className="auth-popup-img-container">
                  <div className="auth-popup-text">
                    <div className="auth-popup-title">首次注册</div>
                    <div className="auth-popup-subtitle">即送装备徽章</div>
                  </div>
                  <Image mode="aspectFit" className="auth-popup-img" src="http://152.136.205.136:9000/vehicle-control/font/huodong%402x.png" alt="" />
                  <div onClick={() => {
                    setVisible(false);
                  }} className="auth-popup-close">
                    <img className="close-icon" src={closeIconSvg} />
                  </div>
                </div>
              </div>
            )
          }
        }
      </Transition>
    </div>
  )
}

export default Login;
