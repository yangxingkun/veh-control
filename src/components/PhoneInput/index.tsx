import { Input } from '@tarojs/components';
import { Icon } from '@nutui/nutui-react-taro';
import './index.scss';
import classNames from 'classnames';
import Taro from '@tarojs/taro';

interface IProps {
  value?: string;
  onInput?: (e: any) => void;
  onBlur?: (e: any) => any;
  error?: { message: string };
}
const PhoneInput = ({ value, onInput, error, onBlur }: IProps) => {
  return (
    <div className={classNames('phone-input-container', error && 'error')}>
      <div className="phone-input-wrapper">
        <div onClick={() => {
          Taro.showActionSheet({
            itemList: ['+86'],
            success: function (res) {
              console.log(res.tapIndex)
            }
          })
        }} className="phone-input-prefix">
          <text>+86</text>
          <Icon className="phone-input-icon" name="triangle-down" />
        </div>
        <Input
          placeholder="请输入手机号"
          placeholderClass="phone-input-placeholder"
          className="phone-input"
          type="digit"
          value={value}
          onInput={onInput}
          onBlur={onBlur}
        />
      </div>
    </div>
  );
};

export default PhoneInput;
