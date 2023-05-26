import TagHeader from '@/components/TagHeader';
import ListCard from '@/components/ListCard';
import { ScrollView, View } from '@tarojs/components';
import './index.scss';
import classNames from 'classnames';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { templateSearchCurrentUserCollectPage } from '@/api/template';
import { TemplateListItem } from '@/types/template';
import BottomDivider from '@/components/BottomDivider';
import { DetailProps } from '../../type';
import Taro from '@tarojs/taro';
import Waterfall, { WaterfallItem } from '@/components/Waterfall';
import { px } from '@/utils/px';

const OtherUser = ({ detailData, openTagPopup, detailModel }: DetailProps) => {
  // 收藏列表
  const {
    state: { data: dataList, loading, hasMore, refresherTriggered },
    onScrollToLower,
    onRefresherRefresh,
  } = useInfiniteScroll<TemplateListItem>(
    ({ pageNum, pageSize }) => {
      if (!detailData) return Promise.resolve(null);
      return templateSearchCurrentUserCollectPage({
        pageSize,
        pageNum,
        con: {
          userCode: detailData.userCode,
        },
      });
    },
    {
      defaultPageSize: 20,
      deps: [detailData?.userCode],
      autoRequest: false,
    }
  );
  return (
    <View className={classNames('otherUser-page')}>
      <ScrollView
        onScrollToLower={onScrollToLower}
        refresherEnabled
        refresherTriggered={refresherTriggered}
        refresherBackground="transparent"
        onRefresherRefresh={onRefresherRefresh}
        scrollY
        style={{ height: '100%' }}
      >
        <TagHeader
          className="otherUser-header"
          icon={detailData?.icon}
          collectButton={{
            colorType: 'pink',
            onClick: () => {
              detailModel.getEffect('handleCollect')();
            },
            collected: detailData?.collect,
          }}
          buttonText={detailData?.collect ? `${detailData.size}人收藏` :`收藏用户`}
          title={detailData?.userName}
          desc={detailData?.userDesc}
          showRightButton={false}
        />
        <div className="otherUser-collect-header">收藏</div>
        <div className="scroll-container">
          <Waterfall
            col={2}
            colWidth={px(182)}
            leftGap={px(4)}
            topGap={px(4)}
            className="list-container"
          >
            {dataList &&
              dataList.map((item, index) => {
                return (
                  <WaterfallItem
                    index={index}
                    key={item.materialCode}
                    className="list-item"
                  >
                    <ListCard
                      itemData={item}
                      onClick={() => {
                        Taro.navigateTo({
                          url: `/pages/tagDetailPage/index?type=${item.type}&materialCode=${item.materialCode}&templateCode=${item.templateCode}&templateName=${item.templateName}`,
                        });
                      }}
                    />
                  </WaterfallItem>
                );
              })}
          </Waterfall>
          <BottomDivider
            dataLength={dataList?.length || 0}
            loading={loading}
            hasMore={hasMore}
          />
        </div>
      </ScrollView>
    </View>
  );
};
export default OtherUser;
