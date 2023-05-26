import TagCard from '@/components/TagCard';
import F2 from '@/components/F2';
import { px } from '@/utils/px';
import { Image, CoverView, CoverImage } from '@tarojs/components';
import './index.scss';
import { useMemo } from 'react';
import { formatValue } from '@/utils/formatValue';
import { toFixed } from '@/utils/number';

const Endurance = ({ detailData }) => {
  const data = useMemo(() => {
    const defaultData = {
      TotalActualOdometer: '--',
      TotalHMIOdometer: '--',
      percent: 0,
    };
    if (!detailData?.motionDetailData) return defaultData;
    const {TotalActualOdometer, TotalHMIOdometer, BatteryAccuracy} = detailData?.motionDetailData;
    defaultData.TotalActualOdometer = toFixed(TotalActualOdometer, 0)
    defaultData.TotalHMIOdometer = toFixed(TotalHMIOdometer, 0);
    defaultData.percent = +BatteryAccuracy || 0
    return defaultData;
  }, [detailData]);
  return (
    <TagCard className="industrial-detail-page-Endurance" title="续航表现">
      <div className="industrial-detail-page-Endurance-content">
        <EnduranceChart percent={data?.percent} />
        <div className="industrial-detail-page-Endurance-right">
          <div className="industrial-detail-page-Endurance-label">
            <div className="label-title">实际行驶续航里程</div>
            <div className="label-value">
              {data.TotalActualOdometer} <text className="label-value-small">km</text>
            </div>
          </div>
          <div className="industrial-detail-page-Endurance-label">
            <div className="label-title">官方屏显续航里程</div>
            <div className="label-value">
              {data.TotalHMIOdometer} <text className="label-value-small">km</text>
            </div>
          </div>
        </div>
      </div>
    </TagCard>
  );
};

function EnduranceChart({ percent = 80 }) {
  const center = {
    x: px(78),
    y: px(89),
  };
  const pointerRect = {
    width: px(9),
    height: px(39),
  };
  const rotate = useMemo(() => {
    return (Math.max(percent, 100) / 100 * 3 / 2) * 180 + 225;
  }, [percent]);
  return (
    <div className="industrial-detail-page-Endurance-chart">
      <div className="chart-pointer-container">
        <Image
          style={{
            transform: `rotate(${rotate}deg)`,
          }}
          className="chart-pointer"
          src={require('@/assets/pointer.svg')}
        />
      </div>
      <div className="chart-text">{toFixed(percent, 1)}%</div>
      <div className="chart-name">续航准确率</div>
      <F2
        render={
          <group>
            <arc
              attrs={{
                x: center.x,
                y: center.y,
                r: 55,
                lineWidth: 10,
                lineCap: 'round',
                stroke: 'l(0) 0:#D377CD 0.5:#1B99FF 1:#46EBD5',
                startAngle: Math.PI / 4,
                endAngle: (Math.PI * 3) / 4,
                anticlockwise: true,
              }}
            />
          </group>
        }
      />
    </div>
  );
}
export default Endurance;
