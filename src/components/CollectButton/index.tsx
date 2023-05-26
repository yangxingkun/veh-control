import { Icon } from '@nutui/nutui-react-taro';
import classNames from 'classnames';
import './index.scss';
import { HTMLAttributes, ReactNode } from 'react';

export interface CollectButtonProps extends HTMLAttributes<HTMLDivElement> {
  collected?: boolean;
  colorType?: 'primary' | 'pink';
  children?: ReactNode;
  className?: string;
}
const CollectButton = ({
  children,
  className,
  colorType = 'primary',
  collected,
  ...props
}: CollectButtonProps) => {
  return (
    <div
      className={classNames(
        className,
        'collect-button',
        colorType && `collect-button--${colorType}`,
        collected && 'collect-button--collected'
      )}
      {...props}
    >
      <Icon className="collect-button-icon" name={collected ? 'star-fill-n' : 'star-n'} />
      {children}
    </div>
  );
};

export default CollectButton;
