import './index.scss';

interface EmptyProps {
  text?: string;
}
const Empty = ({ text }: EmptyProps) => {
  return (
    <div className="carControl-empty">
      <text>{text || '暂无数据'}</text>
    </div>
  )
}

export default Empty;
