import { Icon } from '@nutui/nutui-react-taro';
import Empty from '../Empty';
import './index.scss';

interface IProps {
  loading?: boolean;
  hasMore?: boolean;
  dataLength?: number;
  text?: string;
}
const BottomDivider = ({ loading, hasMore = true, text, dataLength = 0 }: IProps) => {
  return (
    <div className="bottom-divider">
      {loading && (
        <div className="bottom-loading">
          <Icon name="loading"></Icon>
          加载中...
        </div>
      )}
      {
        !loading && dataLength === 0 &&
        <Empty />
      }
      {!loading && !hasMore && dataLength > 0 && (
        <div className="no-more">
          <div className="divider-line"></div>
          <div className="text">{text || '我是有底线的'}</div>
        </div>
      )}
    </div>
  );
};

export default BottomDivider;
