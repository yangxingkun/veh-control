import TagHeader from '@/components/TagHeader';
import { TemplateType } from '@/types/template';
import Taro, { usePageScroll, useRouter } from '@tarojs/taro';
import { useEffect, useRef } from 'react';
import IndustrialWaste from './components/IndustrialWaste';
import ParamsCard from './components/ParamsCard';
import { useDetailModel } from './hooks/useDetailModel';
import TagPopup from './components/TagPopup';
import { useTagPopupModel } from './hooks/useTagPopup';
import OtherUser from './components/OtherUser';
import { DetailProps } from './type';
import './index.scss';
import classNames from 'classnames';
import AddFriend from '@/components/AddFriend';
import { useShareMenu } from '@/hooks/useShareMenu';

const TagDetailPage = () => {
  const scrollTopRef = useRef<any>(0);
  const lastScrollTopRef = useRef<any>(0);
  usePageScroll((res) => {
    scrollTopRef.current = res.scrollTop;
  })
  const router = useRouter();
  const routerParams = router.params as any as {
    type: TemplateType;
    materialCode: string;
    templateCode: string;
    templateName: string;
  };
  useShareMenu();
  const tagPopupModel = useTagPopupModel({
    routerParams,
  });
  const { visible } = tagPopupModel.useGetState();
  useEffect(() => {
    if (visible) {
      lastScrollTopRef.current = scrollTopRef.current;
    } else {
      const scrollTop = lastScrollTopRef.current;
      setTimeout(() => {
        Taro.pageScrollTo({
          scrollTop,
          duration: 0,
        })
      }, 0)
      lastScrollTopRef.current = scrollTopRef.current;
    }
  }, [visible])
  const openTagPopup = () => {
    tagPopupModel.setState({
      visible: true,
    });
  };

  const detailModel = useDetailModel({
    params: router.params as any,
  });
  const { detailData, loading } = detailModel.useGetState();
  Taro.useShareAppMessage(() => {
    const shareData = {
      title: routerParams.templateName,
      path: `/pages/tagDetailPage/index?type=${routerParams.type}&materialCode=${routerParams.materialCode}&templateCode=${routerParams.templateCode}&templateName=${routerParams.templateName}`,
    };
    if (+routerParams.type === TemplateType.user) {
      return shareData;
    }
    return {
      ...shareData,
      imageUrl: detailData.icon,
    };
  });
  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: routerParams.templateName,
    });
    detailModel.getEffect('fetchData')();
  }, []);
  const DetailComponentMap = {
    [TemplateType.car]: CarDetail,
    [TemplateType.part]: ParDetail,
    [TemplateType.tag]: TagDetail,
    [TemplateType.user]: OtherUser,
  };
  const DetailComponent = DetailComponentMap[routerParams.type];
  return (
    <div className={classNames('tag-detail-page')} style={visible ? {
      position: 'fixed',
      left: 0,
      top: -scrollTopRef.current,
      width: '100%',
    }: undefined}>
      {DetailComponent && (
        <DetailComponent
          detailModel={detailModel}
          tagPopupModel={tagPopupModel}
          loading={loading}
          openTagPopup={openTagPopup}
          detailData={detailData}
          visible={visible}
        />
      )}
      <TagPopup tagPopupModel={tagPopupModel} />
    </div>
  );
};

function CarDetail({
  detailData,
  loading,
  openTagPopup,
  visible,
  detailModel,
}: DetailProps) {
  return (
    <>
      <TagHeader
        title={detailData.carName}
        desc={detailData.carDesc}
        icon={detailData.icon}
        buttonText={detailData?.collect ? `${detailData.size}人收藏` :`收藏车型`}
        collectButton={{
          onClick: () => {
            detailModel.getEffect('handleCollect')();
          },
          collected: detailData?.collect,
        }}
        onRightButtonClick={openTagPopup}
      />
      <div className="tag-detail-content">
        <IndustrialWaste
          hidden={visible}
          loading={loading}
          detailData={detailData}
        />
        <div className="detail-title">参数</div>
        <ParamsCard motorcycleData={detailData.motorcycleData} />
        <div className="error-feedback">
          <AddFriend text="错误反馈" />
        </div>
      </div>
    </>
  );
}

function ParDetail({ detailData, openTagPopup, detailModel }: DetailProps) {
  return (
    <>
      <TagHeader
        title={detailData.componentName}
        desc={detailData.componentDesc}
        buttonText={detailData?.collect ? `${detailData.size}人收藏` :`收藏部件`}
        icon={detailData.icon}
        collectButton={{
          onClick: () => {
            detailModel.getEffect('handleCollect')();
          },
          collected: detailData?.collect,
        }}
        onRightButtonClick={openTagPopup}
      />
      <div className="tag-detail-content">
        <div className="detail-title">参数</div>
        <ParamsCard motorcycleData={detailData.componentData} />
        <div className="error-feedback">
          <AddFriend text="错误反馈" />
        </div>
      </div>
    </>
  );
}

function TagDetail({ detailData, openTagPopup, detailModel }: DetailProps) {
  return (
    <>
      <TagHeader
        title={detailData.labelName}
        desc={detailData.labelDesc}
        buttonText={detailData?.collect ? `${detailData.size}人收藏` :`收藏标签`}
        icon={detailData.icon}
        collectButton={{
          onClick: () => {
            detailModel.getEffect('handleCollect')();
          },
          collected: detailData?.collect,
        }}
        onRightButtonClick={openTagPopup}
      />
      <div className="tag-detail-content">
        <div>更多模块即将开放，敬请期待…</div>
      </div>
    </>
  );
}

export default TagDetailPage;
