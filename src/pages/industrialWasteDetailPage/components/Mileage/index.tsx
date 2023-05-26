import TagCard from '@/components/TagCard';
import ProgressBar from '@/components/ProgressBar';
import './index.scss'
import { useMemo } from 'react';
import { toFixed } from '@/utils/number';

const Mileage = ({ detailData }) => {
  const data = useMemo(() => {
    const defaultData = {
      percent: 0,
      TotalAutoOdometer: '0',
      TotalTestingOdometer: '0',
    }
    if(!detailData?.motionDetailData) return defaultData;
    const {TotalAutoOdometer,TotalTestingOdometer} = detailData.motionDetailData;
    if (!TotalTestingOdometer) return defaultData;
    defaultData.TotalAutoOdometer = toFixed(TotalAutoOdometer, 2);
    defaultData.TotalTestingOdometer = toFixed(TotalTestingOdometer, 2);
    defaultData.percent = (+TotalAutoOdometer / +TotalTestingOdometer * 100) || 0;
    return defaultData;
  }, [detailData])
  return (
    <TagCard className="industrial-waste-detail-mileage" title="智驾里程 / 总测试里程">
      <div className="progress-bar-container">
        <ProgressBar percent={data.percent} />
        <div className="mileage-text">
          <text className="mileage-value">{data.TotalAutoOdometer} km</text>
          <text className="mileage-total"> / {data.TotalTestingOdometer} km</text>
        </div>
      </div>
    </TagCard>
  )
}

export default Mileage;
