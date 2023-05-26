import TagCard from '@/components/TagCard';
import ProgressBar from '@/components/ProgressBar';
import './index.scss';
import { toFixed } from '@/utils/number';

const DrivingEfficiency = ({ motionDetailData }) => {
  return (
    <TagCard className="driving-efficienty" title="行车效率">
      <div className="content">
        <ProgressBar percent={motionDetailData?.OverPercent || 0} />
        <div className="content-text content-text1">
          <div>
            该车型智驾百公里耗时为 <text className="content-value">{toFixed(motionDetailData?.TimePerHundredKm, 2)}</text>
            <text className="color-primary"> h</text>
          </div>
        </div>
        <div className="content-text">
          <div>
            超过 <text className="content-value">{toFixed(motionDetailData?.OverPercent, 1)}</text>
            <text className="color-primary">%</text> 其他车型
          </div>
        </div>
      </div>
    </TagCard>
  );
};

export default DrivingEfficiency;
