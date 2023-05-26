import TagHeader from '@/components/TagHeader';
import ListCard from '@/components/ListCard';
import UserFormPopup from '@/pages/index/components/My/components/UseFormPopup';
import { ScrollView, View } from '@tarojs/components';
import './index.scss';
import classNames from 'classnames';
import { getToken } from '@/utils/token';
import Redirect from '@/components/Redirect';
import { useEffect, useRef } from 'react';
import Form from '@/components/Form';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { templateSearchCurrentUserCollectPage } from '@/api/template';
import { TemplateListItem } from '@/types/template';
import BottomDivider from '@/components/BottomDivider';
import Taro from '@tarojs/taro';
import Waterfall, { WaterfallItem } from '@/components/Waterfall';
import { px } from '@/utils/px';

const My = ({ visible, myModel }) => {
  const token = getToken();
  const form = Form.useForm();
  const isFirstRef = useRef(true);
  const { isLogin, loginChecking, userInfo, showPopup, refresherEnabled } =
    myModel.useGetState();

  // 收藏列表
  const {
    state: { data: dataList, loading, hasMore, refresherTriggered },
    onScrollToLower,
    onRefresherRefresh,
    fetchData,
    refresh,
  } = useInfiniteScroll<TemplateListItem>(
    ({ pageNum, pageSize }) => {
      if (!userInfo?.userCode) return Promise.resolve(null);
      return templateSearchCurrentUserCollectPage({
        pageSize,
        pageNum,
        con: {
          userCode: userInfo.userCode,
        },
      });
    },
    {
      defaultPageSize: 20,
      deps: [userInfo?.userCode],
    }
  );
  useEffect(() => {
    if (visible) {
      if (token) {
        myModel.getEffect('fetchData')({
          showLoading: isFirstRef.current ? true : false,
        });
      }
      if (!isFirstRef.current) {
        fetchData();
      }
      isFirstRef.current = false;
    }
  }, [visible]);
  if (!token || (!loginChecking && !isLogin)) {
    return <Redirect to="/pages/auth/index" />;
  }
  return (
    <View
      className={classNames('my-page', visible ? 'my-visible' : 'my-hidden')}
    >
      <ScrollView
        onScrollToLower={onScrollToLower}
        refresherEnabled={refresherEnabled}
        refresherTriggered={refresherTriggered}
        refresherBackground="transparent"
        onRefresherRefresh={onRefresherRefresh}
        scrollY
        style={{ height: '100%' }}
      >
        <TagHeader
          className="my-header"
          icon={userInfo?.icon}
          collectButton={{
            collected: userInfo?.collectNum > 0,
            colorType: 'pink',
          }}
          rightButtonText="设置"
          onRightButtonClick={() => {
            myModel.setState({
              showPopup: true,
              refresherEnabled: false,
            });
            form.setFieldsValue({
              userName: userInfo.userName,
              userDesc: userInfo.userDesc,
              userCode: userInfo.userCode,
            });
          }}
          buttonText={`${userInfo?.collectNum || 0}人收藏过`}
          title={userInfo?.userName}
          desc={userInfo?.userDesc}
        />
        <div className="my-collect-header">收藏</div>
        <div className="scroll-container">
          <div className="scroll-contaner-wrapper">
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
        </div>
      </ScrollView>
      <UserFormPopup
        form={form}
        onClosed={() => {
          setTimeout(() => {
            myModel.setState({
              refresherEnabled: true,
            });
          }, 0);
        }}
        onClose={(data) => {
          myModel.setState({
            showPopup: false,
          });
          form.clearFields();
          if (data?.changeForm) {
            myModel.getEffect('fetchData')({
              showLoading: false,
            });
          }
        }}
        onAvartarUpdate={() => {
          myModel.getEffect('fetchData')({
            showLoading: false,
          });
        }}
        visible={showPopup}
      />
    </View>
  );
};
export default My;
