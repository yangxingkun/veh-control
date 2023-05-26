import TagCard from '@/components/TagCard';
import './index.scss';
import { toFixed } from '@/utils/number';

const Params = ({ motionDetailData }) => {
  return (
    <TagCard className="industrial-waste-detail-params">
      <div className="param-item">
        <div className="param-title">
          不焦虑指数 | <text className="param-title-gray">续航表现</text>
        </div>
        <div className="param-value">{toFixed(motionDetailData?.BatteryPerform, 1)}</div>
      </div>
      <div className="param-item">
        <div className="param-title">
          操纵指数 | <text className="param-title-gray">动力表现</text>
        </div>
        <div className="param-value">{toFixed(motionDetailData?.DynamicPerform, 1)}</div>
      </div>
      <div className="param-item">
        <div className="param-title">
          靠谱指数 | <text className="param-title-gray">智驾表现</text>
        </div>
        <div className="param-value">{toFixed(motionDetailData?.AutoPerform, 1)}</div>
      </div>
      <div className="param-item">
        <div className="param-title">
          匠心指数 | <text className="param-title-gray">内外饰表现</text>
        </div>
        <div className="param-value">
          {toFixed(motionDetailData?.DecorationPerform, 1)}
        </div>
      </div>
      <div className="param-item">
        <div className="param-title">
          躺平指数 | <text className="param-title-gray">智舱表现</text>
        </div>
        <div className="param-value">{toFixed(motionDetailData?.CockpitPerform, 1)}</div>
      </div>
      <div className="param-item">
        <div className="param-title">
          值得指数 | <text className="param-title-gray">售后表现</text>
        </div>
        <div className="param-value">
          {toFixed(motionDetailData?.AfterSalesPerform, 1)}
        </div>
      </div>
    </TagCard>
  );
};

export default Params;
