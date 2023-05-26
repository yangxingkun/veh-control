import Popup from '@/components/Popup';
import { useTagPopupModel } from '@/pages/tagDetailPage/hooks/useTagPopup';
import Empty from '@/components/Empty';
import AddFriend from '@/components/AddFriend';
import './index.scss';
import Taro from '@tarojs/taro';

interface IProps {
  tagPopupModel: ReturnType<typeof useTagPopupModel>;
}
const TagPopup = ({ tagPopupModel }: IProps) => {
  const { visible, data } = tagPopupModel.useGetState();
  const parentList = data?.parentList || [];
  const childrenList = data?.childrenList || [];
  return (
    <Popup
      visible={visible}
      onClose={() => {
        tagPopupModel.setState({
          visible: false,
        });
      }}
      lockScroll={false}
      title="标签详情"
      className="industrial-waster-tag-popup"
    >
      <div className="wrapper">
        <div className="content">
          <div className="desc">{data?.templateDesc}</div>
        </div>
        <div className="tag-title">母标签</div>
        <div className="tags-container">
          {parentList.map((item) => {
            return (
              <div key={item.templateCode} className="tag-item">
                <Tag
                  onClick={() => {
                    Taro.navigateTo({
                      url: `/pages/tagDetailPage/index?type=${item.type}&materialCode=${item.materialCode}&templateCode=${item.templateCode}&templateName=${item.templateName}`,
                    });
                  }}
                  tagName={item.templateName}
                />
              </div>
            );
          })}
          {!parentList.length && <Empty text="暂无标签" />}
        </div>
        <div className="tag-title">子标签</div>
        <div className="tags-container tags-container2">
          {childrenList.map((item) => {
            return (
              <div key={item.templateCode} className="tag-item">
                <Tag
                  onClick={() => {
                    Taro.navigateTo({
                      url: `/pages/tagDetailPage/index?type=${item.type}&materialCode=${item.materialCode}&templateCode=${item.templateCode}&templateName=${item.templateName}`,
                    });
                  }}
                  tagName={item.templateName}
                />
              </div>
            );
          })}
          {!childrenList.length && <Empty text="暂无标签" />}
        </div>
        <AddFriend text="添砖加瓦" />
      </div>
    </Popup>
  );
};

function Tag({ tagName, onClick }) {
  return (
    <div onClick={onClick} className="tag-container">
      <text className="iconfont-tag_icon2"></text>
      <div className="tag-text">{tagName}</div>
    </div>
  );
}

export default TagPopup;
