import { View, ScrollView } from '@tarojs/components';
import ListCard from '@/components/ListCard';
import BottomDivider from '@/components/BottomDivider';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import { templateSearchPage } from '@/api/template'
import './index.scss';
import { TemplateListItem } from '@/types/template';
import { useEffect, useRef } from 'react';
import SearchBar from '@/components/SearchBar';
import Waterfall, { WaterfallItem } from '@/components/Waterfall';
import { px } from '@/utils/px';

const List = ({ visible }) => {
  const isFirstRef = useRef(true);
  const {
    state: { data, loading, hasMore, refresherTriggered },
    onScrollToLower,
    onRefresherRefresh,
    fetchData,
    hidePullDownLoading,
  } = useInfiniteScroll<TemplateListItem>(({ pageNum, pageSize }) => {
    return templateSearchPage({
      pageSize,
      pageNum,
    })
  }, {
    defaultPageSize: 20,
  });
  useEffect(() => {
    if (visible) {
      if (!isFirstRef.current) {
        fetchData()
      }
      isFirstRef.current = false;
    }
  }, [visible]);
  return (
    <View className={classNames('index-list', visible ? 'list-visible' : 'list-hidden')}>
      <div className="search-bar-container">
        <SearchBar disabled onClick={() => {
          Taro.navigateTo({
            url: '/pages/search/index',
          })
        }} />
      </div>
      <div className="scroll-container">
        <ScrollView
          onScrollToLower={onScrollToLower}
          refresherEnabled
          refresherTriggered={refresherTriggered}
          refresherBackground="transparent"
          onRefresherRefresh={() => {
            if (visible) {
              onRefresherRefresh();
            } else {
              hidePullDownLoading()
            }
          }}
          scrollY
          style={{ height: '100%' }}
        >
          <Waterfall col={2} colWidth={px(182)} leftGap={px(4)} topGap={px(4)} className="list-container">
            {data &&
              data.map((item, index) => {
                return (
                  <WaterfallItem index={index} key={item.materialCode} className="list-item">
                    <ListCard itemData={item} onClick={() => {
                      Taro.navigateTo({
                        url: `/pages/tagDetailPage/index?type=${item.type}&materialCode=${item.materialCode}&templateCode=${item.templateCode}&templateName=${item.templateName}`
                      })
                    }} />
                  </WaterfallItem>
                );
              })}
          </Waterfall>
          <BottomDivider dataLength={data?.length || 0} loading={loading} hasMore={hasMore} />
        </ScrollView>
      </div>
    </View>
  );
};
export default List;
