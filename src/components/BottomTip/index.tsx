import { HTMLAttributes } from 'react';
import './index.scss';

interface IProps extends HTMLAttributes<HTMLDivElement> {
  text: string;
}
const BottomTip = ({ text }: IProps) => {
  return (
    <div className="car-control-bottom-tip">
      <div className="car-control-bottom-tip-divider"></div>
      <div className="car-control-bottom-tip-tip">
        <div>{text}</div>
      </div>
    </div>
  );
};

export default BottomTip;
