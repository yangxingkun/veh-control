import TagCard from '@/components/TagCard';
import './index.scss';

interface IMotorcycleDataItem {
  name: string;
  code: string;
  value: string;
  childrenNodes?: IMotorcycleDataItem[];
}
interface IProps {
  motorcycleData?: IMotorcycleDataItem[];
}
const ParamsCard = ({ motorcycleData }: IProps) => {
  return (
    <>
      {motorcycleData?.map((motorcycleDataItem) => {
        if (!motorcycleDataItem.childrenNodes || !motorcycleDataItem.childrenNodes.length) return null;
        const subNodes = motorcycleDataItem.childrenNodes?.map((childItem) => {
          if (childItem.value === '' || childItem.value === undefined || childItem.value === null) return null;
          return (
            <div key={childItem.code} className="detail-params-item">
              <div className="params-label">{ childItem.name }</div>
              <div className="params-text">
                {childItem.value}
              </div>
            </div>
          );
        }).filter(Boolean)
        if (!subNodes.length) return null;
        return (
          <TagCard key={motorcycleDataItem.code} className="detail-params-card">
            <div className="detail-params-card-title">
              {motorcycleDataItem.name}
            </div>
            {subNodes}
          </TagCard>
        );
      })}
    </>
  );
};

export default ParamsCard;
