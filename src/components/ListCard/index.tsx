import { TemplateListItem } from '@/types/template';
import classNames from 'classnames';
import { HTMLAttributes } from 'react';
import './index.scss';

interface IProps extends HTMLAttributes<HTMLDivElement> {
  itemData?: TemplateListItem;
}

const ListCard = ({ itemData, ...props }: IProps) => {
  return (
    <div {...props} className="list-card">
      <div className="list-card-icon">
        <div className={classNames(`iconfont-${itemData?.type === 4 ? 'user' : 'tag'}`)} />
      </div>
      <div className="list-img" style={{
        backgroundImage: `url("${itemData?.icon}")`,
      }}></div>
      <div className="list-desc">
        <div className="list-desc-wrapper">
          { itemData?.templateName }
        </div>
      </div>
    </div>
  )
}

export default ListCard;
