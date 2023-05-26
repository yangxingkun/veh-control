import Params from './components/Params';
import Mileage from './components/Mileage';
import Endurance from './components/Endurance';
import EmergencyBrake from './components/EmergencyBrake';
import ArtificialTakeover from './components/ArtificialTakeover';
import ValueCard from './components/ValueCard';
import DrivingEfficiency from './components/DrivingEfficiency';
import './index.scss';
import Taro, { useRouter } from '@tarojs/taro';
import { createAsyncEffect, useModel } from '@/hooks/react-store/useModel';
import { templateVehicleDynamics } from '@/api/template'
import { useEffect } from 'react';
import { formatKm, toFixed } from '@/utils/number';
import BottomTip from '@/components/BottomTip';
import { useShareMenu } from '@/hooks/useShareMenu';

interface IState {
  detailData: any;
  loading: boolean;
}
interface IEffects {
  fetchData: () => Promise<any>;
}
const IndustrialWasteDetailPage = () => {
  const router = useRouter();
  const params = router.params as {
    materialCode: string;
    templateName: string;
  }
  useShareMenu();
  const model = useModel<IState, IEffects>({
    state: {
      detailData: {},
      loading: false,
    },
    effects: {
      fetchData: createAsyncEffect(() => {
        return templateVehicleDynamics({
          materialCode: params.materialCode,
        }).then((detailData) => {
          return {
            detailData: detailData ||  {}
          }
        })
      }, {
        loadingKey: 'loading'
      })
    }
  })
  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: params.templateName,
    })
    model.getEffect('fetchData')();
  }, []);
  const { detailData } = model.useGetState();
  Taro.useShareAppMessage(() => {
    return {
      title: `我发现了${params.templateName}的秘密`,
      path: `/pages/industrialWasteDetailPage/index?materialCode=${params.materialCode}&templateName=${params.templateName}`,
      imageUrl: detailData.icon,
    };
  });
  const motionDetailData = detailData?.motionDetailData
  return (
    <div className="industrial-waste-detail-page">
      <div className="industrail-waste--detail-tip">
        <div>基于 车控AI跑分算法™</div>
        <div>已学习 <text className="industrail-waste--detail-tip-value">{formatKm(motionDetailData?.TotalLearningOdometer || 0)}</text> km人类驾驶数据</div>
      </div>
      <Params motionDetailData={detailData?.motionDetailData} />
      <Mileage detailData={detailData} />
      <Endurance detailData={detailData} />
      <EmergencyBrake detailData={detailData} />
      <ArtificialTakeover detailData={detailData} />
      <ValueCard title="坡起溜车" img="http://152.136.205.136:9000/vehicle-control/font/pqlc.jpeg" items={[
        {
          label: '溜车次数',
          value: toFixed(motionDetailData?.SlipCount, 1),
          unit: '次',
        },
        {
          label: '溜车平均距离',
          value: toFixed(motionDetailData?.AverageSlipMeters, 2),
          unit: 'm'
        },
        {
          label: '溜车平均时长',
          value: toFixed(motionDetailData?.AverageSlipTime, 2),
          unit: 's'
        },
      ]} />
      <ValueCard img="http://152.136.205.136:9000/vehicle-control/font/hualong%402x.png" title="急转弯" items={[
        {
          label: '急转弯频次',
          value: toFixed(motionDetailData?.KmPerBadTurn, 1),
          unit: 'km/次'
        },
        {
          label: '急转弯平均距离',
          value: toFixed(motionDetailData?.AverageBadTurnMeters, 2),
          unit: 'm'
        },
        {
          label: '急转弯平均时长',
          value: toFixed(motionDetailData?.AverageBadTurnTime, 2),
          unit: 's'
        },
      ]} />
      <ValueCard img="http://152.136.205.136:9000/vehicle-control/font/ds.jpeg" title="点刹" items={[
        {
          label: '点刹次数',
          value: toFixed(motionDetailData?.SnubCount, 1),
          unit: '次'
        },
        {
          label: '点刹平均距离',
          value: toFixed(motionDetailData?.AverageSnubMeters, 2),
          unit: 'm'
        },
        {
          label: '点刹平均时长',
          value: toFixed(motionDetailData?.AverageSnubTime, 2),
          unit: 's'
        },
      ]} />
      <DrivingEfficiency motionDetailData={motionDetailData} />
      <div className="bottom-tip">
        <BottomTip text="更多指标敬请期待" />
      </div>
    </div>
  )
}

export default IndustrialWasteDetailPage;
