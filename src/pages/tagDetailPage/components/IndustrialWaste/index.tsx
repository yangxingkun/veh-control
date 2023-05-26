import TagCard from '@/components/TagCard';
import F2 from '@/components/F2';
import { Chart, Axis, Line, withAxis, Area } from '@antv/f2';
import './index.scss';
import PolarX from './PolarX';
import Taro, { useRouter } from '@tarojs/taro';
import classNames from 'classnames';
import { useMemo } from 'react';
import { TemplateType } from '@/types/template';
import { toFixed } from '@/utils/number';

const AxisPolarX = withAxis(PolarX);
const IndustrialWaste = ({ detailData, loading, hidden }) => {
  const motionDetailData = detailData?.motionDetailData;
  const router = useRouter();
  const routerParams = router.params as any as {
    type: TemplateType;
    materialCode: string;
    templateCode: string;
    templateName: string;
  };
  const chartData = useMemo(() => {
    if (!motionDetailData)
      return {
        data: [],
        maxValue: 0,
      };
    // return motionData?.childrenNodes.map(item => {
    //   item.value = +item.value || 0;
    //   item.valueStr = +item.value.toFixed(2)
    //   return item;
    // })
    let maxValue = 0;
    const data = [
      {
        name: '不焦虑指数',
        field: 'BatteryPerform',
        value: 0,
        valueStr: '',
      },
      {
        name: '躺平指数',
        field: 'CockpitPerform',
        value: 0,
        valueStr: '',
      },
      {
        name: '匠心指数',
        field: 'DecorationPerform',
        value: 0,
        valueStr: '',
      },
      {
        name: '值得指数',
        field: 'AfterSalesPerform',
        value: 0,
        valueStr: '',
      },
      {
        name: '操纵指数',
        field: 'DynamicPerform',
        value: 0,
        valueStr: '',
      },
      {
        name: '靠谱指数',
        field: 'AutoPerform',
        value: 0,
        valueStr: '',
      },
    ].map((item) => {
      item.value = +motionDetailData[item.field] || 0;
      item.valueStr = item.value.toFixed(1);
      maxValue = Math.max(item.value, maxValue);
      return item;
    });
    return {
      data,
      maxValue,
    };
  }, [motionDetailData]);
  return (
    <TagCard
      className="industrial-waste-card"
      title={
        <>
          <div>车控指数™</div>
          {chartData.data.length ? (
            <div className="industrial-waste-percent">
              {toFixed(motionDetailData?.ChekPerform, 1)}
            </div>
          ) : (
            <div className="no-data-text-2">评测中…</div>
          )}
        </>
      }
      footer={
        chartData.data.length ? (
          <>
            <div>
              {toFixed(motionDetailData?.TotalTestingOdometer, 2)} 公里测试里程
            </div>
            <div
              onClick={() => {
                Taro.navigateTo({
                  url: `/pages/industrialWasteDetailPage/index?materialCode=${routerParams.materialCode}&templateName=${routerParams.templateName}`,
                });
              }}
              className="industrial-button"
            >
              <span>查看详情</span>
            </div>
          </>
        ) : null
      }
    >
      <InDustrialChart
        loading={loading}
        data={chartData.data}
        maxValue={chartData.maxValue}
        hidden={hidden}
        detailData={detailData}
      />
    </TagCard>
  );
};

function InDustrialChart({ data, maxValue, loading, detailData, hidden }) {
  if (!data.length) {
    return (
      <div className="no-data">
        <div className="iconfont-tag_icon3"></div>
        <div className="no-data-text">{detailData?.size || 0}人关注该车型</div>
      </div>
    );
  }
  return (
    <div className={classNames('industrial-chart', hidden && 'chart-hidden')}>
      <F2
        render={
          data.length && (
            <Chart
              data={data}
              coord={{
                type: 'polar',
              }}
              scale={{
                value: {
                  min: 0,
                  max: 5,
                  nice: false,
                  tickCount: 6,
                },
              }}
            >
              <AxisPolarX
                field="name"
                grid="line"
                style={{
                  grid: {
                    lineDash: null as any,
                    strokeStyle: '#3388FF',
                  },
                  label: {
                    fontSize: 12,
                  },
                  labelOffset: 25,
                }}
              />
              <Axis
                field="value"
                grid="line"
                style={{
                  label: {
                    strokeOpacity: 0,
                    fillOpacity: 0,
                  },
                  grid: {
                    lineDash: null as any,
                    strokeStyle: '#3388FF',
                  },
                }}
              />
              <Area x="name" y="value" color="#D377CD" />
              <Line x="name" y="value" color="#D377CD" />
            </Chart>
          )
        }
      />
    </div>
  );
}

export default IndustrialWaste;
