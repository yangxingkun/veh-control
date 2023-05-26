import classNames from 'classnames';
import { HTMLAttributes } from 'react';
import './index.scss';

interface IProps extends HTMLAttributes<HTMLDivElement> {
  icon?: string;
  name: string;
  selected?: boolean;
}
const Avatar = ({ name, icon, selected, ...props }: IProps) => {
  return (
    <div className={classNames('avatar', selected && 'selected')} {...props}>
      <div className="avatar-img" style={{
        backgroundImage: icon ? `url("${icon}")` : undefined,
      }}></div>
      <div className="avatar-text">{name}</div>
    </div>
  )
}

export default Avatar;
