import classNames from 'classnames';
import CollectButton, { CollectButtonProps } from '../CollectButton';
import './index.scss';

interface IProps {
  title?: string;
  desc?: string;
  collectButton?: Partial<CollectButtonProps>;
  buttonText?: string;
  icon?: string;
  rightButtonText?: string;
  onRightButtonClick?: () => void;
  className?: string;
  showRightButton?: boolean;
}
const TagHeader = ({
  title,
  desc,
  className,
  showRightButton = true,
  rightButtonText = '详情',
  onRightButtonClick,
  icon,
  collectButton = {},
  buttonText,
}: IProps) => {
  return (
    <div className={classNames('tag-header', className)}>
      <div
        className="tag-header-left"
        style={{
          backgroundImage: `url("${icon}")`,
        }}
      ></div>
      <div className="tag-header-right">
        <div>
          <div className="tag-header-text">{title}</div>
          <CollectButton {...collectButton}>{buttonText}</CollectButton>
        </div>
        <div className="tag-desc-container">
          <div className="tag-header-desc">{desc}</div>
          {showRightButton && (
            <span onClick={onRightButtonClick} className="tag-setting-button">
              {rightButtonText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagHeader;
