import classNames from 'classnames';
import { ReactNode } from 'react';
import './index.scss';

interface IProps {
  text: string;
  showDivider?: boolean;
  icon?: ReactNode;
  className?: string;
}
const AddFriend = ({ text, icon, showDivider = true, className }: IProps) => {
  return (
    <div className={classNames('car-control-add-friend', className)}>
      {showDivider && <div className="car-control-add-friend-divider"></div>}
      <div className="car-control-add-friend-tip">
        <div className="car-control-add-button">
          <cell
            styleType={1}
            onStartmessage="startmessage"
            onCompletemessage="completemessage"
            plugid="689e7fc09d86da7200d62262f489b09b"
          ></cell>
        </div>
        <div>{text}</div>
        {!icon || typeof icon === 'string' ? (
          <div
            className={classNames(
              'car-control-add-friend-tip-icon',
              icon ? icon : 'iconfont-edit_icon'
            )}
          />
        ) : (
          icon
        )}
      </div>
    </div>
  );
};

export default AddFriend;
