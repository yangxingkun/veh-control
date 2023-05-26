import { templateSearchPage } from '@/api/template';
import BottomDivider from '@/components/BottomDivider';
import { FormInstance } from '@/components/Form/FormInstance';
import ListCard from '@/components/ListCard';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { TemplateListItem, TemplateType } from '@/types/template';
import { filterObject } from '@/utils/object';
import { ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import Empty from '@/components/Empty';
import './index.scss';
import Waterfall, { WaterfallItem } from '@/components/Waterfall';
import { px } from '@/utils/px';

interface SearchListProps {
  tag?: 1 | 2;
  form: FormInstance;
}
function SearchList({ tag = 1, form }: SearchListProps, ref) {
  const {
    state: { data, loading, hasMore, refresherTriggered },
    onScrollToLower,
    onRefresherRefresh,
    refresh,
    model,
  } = useInfiniteScroll<TemplateListItem>(
    ({ pageNum, pageSize }) => {
      const searchValue = form.getFieldValue('searchValue');
      return templateSearchPage({
        pageSize,
        pageNum,
        con: filterObject({
          tag,
          templateName: searchValue,
        }),
      });
    },
    {
      defaultPageSize: 20,
      autoRequest: false,
    }
  );
  useEffect(() => {
    model.setState({
      data: [],
    });
    refresh({
      showPullDownLoading: false,
    });
  }, [tag]);
  useImperativeHandle(ref, () => {
    return {
      model,
      refresh,
    };
  });
  return (
    <ScrollView
      onScrollToLower={onScrollToLower}
      refresherEnabled
      refresherTriggered={refresherTriggered}
      refresherBackground="transparent"
      onRefresherRefresh={onRefresherRefresh}
      scrollY
      style={{ height: '100%' }}
      className={'search-list'}
    >
      <Waterfall
        col={2}
        colWidth={px(182)}
        leftGap={px(4)}
        topGap={px(4)}
        className="list-container"
      >
        {data &&
          data.map((item, index) => {
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
        dataLength={data?.length || 0}
        loading={loading}
        hasMore={hasMore}
      />
    </ScrollView>
  );
}

export default forwardRef(SearchList);
