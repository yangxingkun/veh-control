import PhoneInput from '@/components/PhoneInput';
import LoginVerificationCodeInput from './components/LoginVerificationCodeInput';
import { Button } from '@nutui/nutui-react-taro';
import './index.scss';
import Form from '@/components/Form';
import { loginPhone, loginSendLoginMessage } from '@/api/login'
import Taro from '@tarojs/taro';
import { setToken } from '@/utils/token';
import { setUserInfo } from '@/utils/user';
import { UserInfo } from '@/types/user';
import { useHideHomeButton } from '@/hooks/useHideHomeButton';

const Login = () => {
  useHideHomeButton();
  const form = Form.useForm();
  const { errors, formData } = form.useGetState(['errors', 'formData']);
  let disabled = true;
  if (formData.phone && formData.code && errors.length === 0) {
    disabled = false;
  }
  return (
    <div className="login-page">
      <div className="login-header">
        <div className="login-title">登录后更精彩</div>
        <div className="login-subtitle">我们将保护你的个人隐私</div>
      </div>
      <Form
        form={form}
        onFormSubmit={(values) => {
          Taro.showLoading();
          loginPhone(values as any).then((data: UserInfo) => {
            setToken(data.token);
            setUserInfo(data);
            if (data.first === 0) {
              Taro.redirectTo({
                url: '/pages/index/index'
              })
            } else {
              Taro.redirectTo({
                url: '/pages/interest/index'
              })
            }
            Taro.hideLoading();
          })
        }}
        rules={{
          phone: [
            {
              required: true,
              message: '请输入手机号',
            },
            {
              type: 'phone',
              message: '手机号格式不正确',
            },
          ],
          code: [
            {
              required: true,
              message: '请输入验证码',
            },
          ],
        }}
        className="login-form"
      >
        <Form.Item field="phone">
          <PhoneInput />
        </Form.Item>
        <Form.Item field="code" className="login-code-form-item">
          <LoginVerificationCodeInput onSendCode={() => {
            const errors = form.validate(['phone']);
            if (errors.length) return Promise.reject();
            if (!form.getFieldValue('phone')) {
              Taro.showToast({
                title: '请输入手机号',
                icon: 'error',
              })
              return Promise.reject();
            }
            Taro.showLoading({
              title: '正在发送验证码'
            });
            return loginSendLoginMessage({
              phone: form.getFieldValue('phone'),
            }).then(() => {
              Taro.showToast({
                title: '验证码发送成功',
                icon: 'success'
              })
            }).finally(() => {
              Taro.hideLoading();
            })
          }} />
        </Form.Item>
        <div className="login-button">
          <Button disabled={disabled} block size="large" type="primary" formType="submit">
            登录
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Login;
