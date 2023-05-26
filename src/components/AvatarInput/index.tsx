import { Icon } from '@nutui/nutui-react-taro'
import Taro from '@tarojs/taro'
import classNames from 'classnames';
import './index.scss'

interface IProps {
  value?: string;
  onChange?: (val: string) => void;
  showMargin?: boolean;
}
const AvatarInput = ({ onChange, showMargin = true }: IProps) => {
  return (
    <div className={classNames("avatar-input", showMargin && 'avatar-input-margin-bottom')}>
      <div className="avatar-placeholder">个人头像</div>
      <div onClick={() => {
        Taro.chooseImage({
          count: 1,
          success: (res) => {
            onChange && onChange(res.tempFilePaths[0]);
          }
        })
      }} className="avatar-upload">
        <span>请上传</span>
        <Icon className="avatar-upload-icon" name="triangle-up"></Icon>
      </div>
    </div>
  )
}

export default AvatarInput;
