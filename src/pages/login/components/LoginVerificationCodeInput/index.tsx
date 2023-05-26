import { useCountDown } from '@/hooks/useCountDown';
import { Input } from '@tarojs/components'
import classNames from 'classnames';
import './index.scss';

interface IProps {
  value?: string;
  onInput?: (val: any) => void;
  onBlur?: () => any;
  onSendCode?: () => any;
}
const LoginVerificationCodeInput = ({ value, onInput, onBlur, onSendCode }: IProps) => {
  const { remain, canSubmit, startCountDown } = useCountDown({
    duration: 59,
  })
  return (
    <div className="login-verificationCodeInput">
      <Input onBlur={onBlur} value={value} onInput={onInput} placeholderClass="input-placeholder" className="input" placeholder="请输入验证码" />
      <div onClick={() => {
        if (canSubmit) {
          if (onSendCode) {
            const val = onSendCode();
            if (val instanceof Promise) {
              val.then(() => {
                startCountDown();
              })
            } else {
              startCountDown()
            }
          } else {
            startCountDown();
          }
        }
      }} className={classNames('verification-button', remain !== 0 && 'disabled')}>{remain === 0 ? '获取验证码' : `重新发送${remain}s`}</div>
    </div>
  )
}

export default LoginVerificationCodeInput;
