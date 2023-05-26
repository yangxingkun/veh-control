import TagCard from '@/components/TagCard';
import F2 from '@/components/F2';
import {} from '@antv/f2';
import './index.scss';
import { px } from '@/utils/px';
import { useMemo } from 'react';
import { updateObject } from '@/utils/object';
import { toFixed } from '@/utils/number';

const ArtificialTakeover = ({ detailData }) => {
  const data = useMemo(() => {
    const defaultData = {
      KmPerRiskIntervention: 0,
      RiskInterventionCount: 0,
      KmPerHumanIntervention: 0,
      HumanInterventionCount: 0,
      RiskPercent: 0,
    }
    if (!detailData?.motionDetailData) return defaultData;
    updateObject(defaultData, detailData?.motionDetailData);
    return defaultData;
  }, [detailData])
  return (
    <TagCard className="artificial-takeover" title="人为接管">
      <div className="content">
        <div className="content-left">
          <PercentChart percent={data.RiskPercent || 0} />
          <div className="chart-title">危险接管占比</div>
        </div>
        <div className="content-right">
          <div className="gray-divider"></div>
          <div className="right-item item1">
            <div>每 <text className="right-value">{toFixed(data.KmPerRiskIntervention, 2)}</text> <text className="color-primary">km</text></div>
            <div>危险接管一次</div>
            <div>共 <text className="right-value">{toFixed(data.RiskInterventionCount, 2)}</text><text className="color-primary"> 次</text></div>
          </div>
          <div className="right-item item2">
            <div>每 <text className="right-value">{toFixed(data.KmPerHumanIntervention, 2)}</text> <text className="color-primary">km</text></div>
            <div>人为接管一次</div>
            <div>共 <text className="right-value">{toFixed(data.HumanInterventionCount, 2)}</text><text className="color-primary"> 次</text></div>
          </div>
        </div>
      </div>
    </TagCard>
  );
};

interface PercentChartProps {
  percent: number;
}
function PercentChart({ percent }: PercentChartProps) {
  const center = {
    x: px(65),
    y: px(65),
  }
  const endAngle = Math.PI * 2 * percent / 100;
  return (
    <div className="percent-chart">
      <F2
        theme={{
          padding: [0, 0]
        }}
        render={
          <group>
            <arc
              attrs={{
                x: center.x,
                y: center.y,
                r: 55,
                lineWidth: 10,
                lineCap: 'round',
                stroke: '#F5F5F5',
                startAngle: 0,
                endAngle: Math.PI * 2,
              }}
            />
            <arc
              attrs={{
                x: center.x,
                y: center.y,
                r: 55,
                lineWidth: 10,
                lineCap: 'round',
                stroke: 'l(0) 0:#D377CD 0.5:#1B99FF 1:#46EBD5',
                startAngle: 0,
                endAngle: endAngle,
                // anticlockwise: true,
              }}
            />
            {/* @ts-ignore */}
            <text attrs={{
              x: center.x,
              y: center.y,
              text: `${toFixed(percent, 1)}%`,
              fontSize: 16,
              fontWeight: 'bold',
              fill: '#3388FF',
              textAlign: 'center',
              textBaseline: 'middle',
            }} />
          </group>
        }
      />
    </div>
  );
}

export default ArtificialTakeover;
