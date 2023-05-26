import { useCountDown } from '@/hooks/useCountDown';
import FormInput, { IFormInputProps } from '../FormInput';
import './index.scss';

interface IVerificationCodeInputProps extends IFormInputProps {
  onSubmit?: (val: string | undefined) => any;
  duration?: number;
}

const VerificationCodeInput = (props: IVerificationCodeInputProps) => {
  const { value, onSubmit, duration = 59, ...rest } = props;
  const { canSubmit, remain, startCountDown } = useCountDown({
    duration,
  })
  const suffix = canSubmit ? (
    <span
      onClick={() => {
        if (canSubmit) {
          if (onSubmit) {
            const val = onSubmit(value);
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
      }}
      className="verification-code-button"
    >
      获取验证码
    </span>
  ) : (
    <span className="verification-code-remain">{remain}秒后重新获取验证码</span>
  );
  return <FormInput type="digit" value={value} {...rest} suffix={suffix} />;
};

export default VerificationCodeInput;
