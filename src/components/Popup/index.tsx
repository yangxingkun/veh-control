import { Popup as BasePopup, PopupProps, Icon } from '@nutui/nutui-react-taro';
import { View } from '@tarojs/components';
import classNames from 'classnames';
import { HTMLAttributes } from 'react';
import Transition from '../Transition';
import './index.scss';

export interface IPopupProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  onClose?: (...args: any) => void;
  visible?: boolean;
  height?: string | number;
  lockScroll?: boolean;
  onClosed?: () => any;
  onOpened?: () => any;
}
const Popup = ({ children, height, onOpened, onClosed, title, visible, lockScroll = true, className, onClose, ...props }: IPopupProps) => {
  return (
    <Transition onEntered={onOpened} onExited={onClosed} transitionName={['fade-in', 'slide-to-top']} visible={visible}>
      {(_, transtionName, transitionNames) => {
        return (
          <View catchMove={lockScroll} className={classNames('carControl-popup', className)} {...props}>
            <div onClick={onClose} className={classNames('carControl-popup-marsk', transtionName)}></div>
            <div style={{
              height,
            }} className={classNames('carControl-popup-wrapper', transitionNames[1])}>
              <div className="carControl-popup-header">
                <div className="carControl-popup-header-text">{title}</div>
                <div
                  onClick={() => {
                    onClose && onClose();
                  }}
                  className="iconfont-close_icon carControl-popup-header-close-icon"
                />
              </div>
              <View className="carControl-popup-content">{children}</View>
            </div>
          </View>
        );
      }}
    </Transition>
  );
};

export default Popup;
