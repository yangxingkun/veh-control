import './index.scss';

interface IProps {
  percent: number;
}
const ProgressBar = ({ percent }: IProps) => {
  return (
    <div className="carControl-progress-bar">
      <div style={{
        width: `${percent}%`
      }} className="carControl-progress-bar-upper"></div>
    </div>
  )
}

export default ProgressBar;

