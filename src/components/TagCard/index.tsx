import classNames from 'classnames';
import { HTMLAttributes, ReactNode } from 'react';
import './index.scss';

interface IProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
}
const TagCard = ({ className, title, footer, children, ...props }: IProps) => {
  return (
    <div {...props} className={classNames('tag-card', className)}>
      {title !== undefined && title !== null && (
        <div className="tag-card-title">{title}</div>
      )}
      {children}
      {
        footer && <div className="tag-card-footer">{footer}</div>
      }
    </div>
  );
};

export default TagCard;
