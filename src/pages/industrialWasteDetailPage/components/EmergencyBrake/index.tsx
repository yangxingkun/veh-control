import TagCard from '@/components/TagCard';
import F2 from '@/components/F2';
import './index.scss';
import { useMemo, useState } from 'react';
import { Chart, Line, withGuide } from '@antv/f2';
import ScrollContainer from '@/components/ScrollContainer';
import { updateObject } from '@/utils/object';
import { addNumberSign, toFixed } from '@/utils/number';
import classNames from 'classnames';

const EmergencyBrake = ({ detailData }) => {
  const data = useMemo(() => {
    const defaultData = {
      AverageBadDcc: 0,
      AverageBadDccChange: 0,
      KmPerBadDcc: 0,
      KmPerBadAcc: 0,
      AverageBadAcc: 0,
      AverageBadAccChange: 0,
      AverageBadDccTime: 0,
      AverageBadAccTime: 0,
      AverageBadDccTimeChange: 0,
      AverageBadAccTimeChange: 0,
      RecentAverageBadDccs: [],
      RecentAverageBadAccs: [],
    };
    if (!detailData?.motionDetailData) return defaultData;
    updateObject(defaultData, detailData.motionDetailData);
    return defaultData;
  }, [detailData]);
  return (
    <TagCard className="emergency-brake" title="急刹和急行">
      <ScrollContainer>
        <div className="content">
          <div className="content-item">
            <LeftChart
              chartData={data.RecentAverageBadDccs}
              title="急刹车一次"
              avg={data.KmPerBadDcc}
              lastPercent={data.AverageBadDccChange}
            />
            <div className="content-right">
              <div className="vehicle-index">
                <div className="vehicle-index-text">
                  <text className="vehicle-index-value">{toFixed(data.AverageBadDcc, 2)}</text>{' '}
                  m/s²
                  <div>急刹车有多猛</div>
                </div>
                <div className={classNames('vehicle-index-percent', data.AverageBadDccChange >= 0 ? 'percent-rise' : 'percent-down')}>
                  <div className={`iconfont-${data.AverageBadDccChange >= 0 ? 'rise' : 'down'}_icon percent-icon`} />
                  <div className="percent-text">{toFixed(data.AverageBadDccChange, 1)}%</div>
                </div>
              </div>
              <div className="vehicle-index">
                <div className="vehicle-index-text">
                  <text className="vehicle-index-value">
                    {toFixed(data.AverageBadDccTime, 2)}
                  </text>{' '}
                  s<div>急刹车有多久</div>
                </div>
                <div className={classNames('vehicle-index-percent', data.AverageBadDccTimeChange >= 0 ? 'percent-rise' : 'percent-down')}>
                  <div className={`iconfont-${data.AverageBadDccTimeChange >= 0 ? 'rise' : 'down'}_icon percent-icon`} />
                  <div className="percent-text">{toFixed(data.AverageBadDccTimeChange, 1)}%</div>
                </div>
              </div>
            </div>
          </div>
          <div className="content-item">
            <LeftChart
              chartData={data.RecentAverageBadAccs}
              title="急加速一次"
              avg={data.KmPerBadAcc}
              lastPercent={data.AverageBadAccChange}
            />
            <div className="content-right">
              <div className="vehicle-index">
                <div className="vehicle-index-text">
                  <text className="vehicle-index-value">{toFixed(data.AverageBadAcc, 2)}</text>{' '}
                  m/s²
                  <div>急加速有多猛</div>
                </div>
                <div className={classNames('vehicle-index-percent', data.AverageBadAccChange >= 0 ? 'percent-rise' : 'percent-down')}>
                  <div className={`iconfont-${data.AverageBadAccChange >= 0 ? 'rise' : 'down'}_icon percent-icon`} />
                  <div className="percent-text">{toFixed(data.AverageBadAccChange, 1)}%</div>
                </div>
              </div>
              <div className="vehicle-index">
                <div className="vehicle-index-text">
                  <text className="vehicle-index-value">
                    {toFixed(data.AverageBadAccTime, 2)}
                  </text>{' '}
                  s<div>急加速有多久</div>
                </div>
                <div className={classNames('vehicle-index-percent', data.AverageBadAccTimeChange >= 0 ? 'percent-rise' : 'percent-down')}>
                  <div className={`iconfont-${data.AverageBadAccTimeChange >= 0 ? 'rise' : 'down'}_icon percent-icon`} />
                  <div className="percent-text">{toFixed(data.AverageBadAccTimeChange, 1)}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollContainer>
    </TagCard>
  );
};

function LeftChart({ title, avg, chartData, lastPercent }) {
  const data = useMemo(() => {
    if (!chartData) {
      return {
        lastPercent,
        data: [],
      };
    }
    if (!Array.isArray(chartData)) {
      return {
        lastPercent,
        data: [],
      };
    }
    return {
      lastPercent,
      data: chartData.map((v, i) => {
        return {
          type: i,
          value: v,
        };
      }),
    };
  }, [chartData, lastPercent]);
  const scale = {
    type: {
      type: 'cat',
      tickCount: 3,
      range: [0, 1],
    },
    value: {
      tickCount: 5,
    },
  };
  const chartArr = data.data;
  return (
    <div className="left-container">
      <div className="left-title">
        <div>
          每 <text className="left-val">{toFixed(avg, 2)}</text> km
        </div>
        <div>{title}</div>
      </div>
      <div className="left-chart">
        <F2
          theme={{
            chart: {
              padding: [20, 10, 10, 0],
            },
          }}
          render={
            chartArr.length && (
              <Chart padding={0} data={chartArr} scale={scale}>
                <Line x="type" y="value" shape="smooth" color="#fff" />
                <LastGuid
                  percent={data.lastPercent}
                  records={[chartArr[chartArr.length - 1]]}
                />
              </Chart>
            )
          }
        />
      </div>
    </div>
  );
}

const LastGuid = withGuide((props) => {
  const { points, percent } = props;
  const point = points[0] || {};
  const percentString = `${addNumberSign(percent)}%`;
  const textRect = props.chart.context.measureText(percentString, {
    fontSize: 12,
    fontWeight: 600,
  });
  const textContainerWidth = textRect.width + 10;
  return (
    <group>
      <rect
        attrs={{
          width: textContainerWidth,
          height: 14,
          x: point.x - textContainerWidth + 5,
          y: point.y - 18,
          fill: '#fff',
          radius: 2,
        }}
      />
      <text
        attrs={{
          text: percentString,
          fill: percent >= 0 ? '#46EBD5' : '#D377CD',
          fontSize: 12,
          fontWeight: 600,
          textAlign: 'center',
          textBaseline: 'middle',
          fontFamily: `PingFangSC-Semibold, 
          PingFang SC, -apple-system, BlinkMacSystemFont, 
          'Segoe UI', Roboto, 'Helvetica Neue', Arial, 
          'Noto Sans', sans-serif, 'Apple Color Emoji', 
          'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
          x: point.x - textContainerWidth / 2 + 5,
          y: point.y - 11,
        }}
      />
      <rect
        attrs={{
          width: 10,
          height: 17,
          x: point.x - 5,
          y: point.y,
          fill: 'l(90) 0:rgba(255,255,255,0.5) 1:rgba(255,255,255,0)',
          radius: 2,
        }}
      />
    </group>
  );
});

export default EmergencyBrake;
