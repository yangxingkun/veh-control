import TagCard from '@/components/TagCard';
import './index.scss';

interface ValueCardProps {
  img?: string;
  title?: string;
  items: Array<{
    label: string;
    value: any;
    unit: string;
  }>;
}
const ValueCard = ({ items, title, img }: ValueCardProps) => {
  return (
    <TagCard className="value-card" title={title}>
      <div className="content">
        <div className="content-wrapper">
          <div style={{
            backgroundImage: `url("${img}")`
          }} className="content-left"></div>
          <div className="content-right">
            {items?.map((item) => {
              return (
                <div className="right-item">
                  <div className="right-text">{item.label}</div>
                  <div className="right-value">
                    {item.value}<text className="right-value-small"> {item.unit}</text>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </TagCard>
  );
};

export default ValueCard;
