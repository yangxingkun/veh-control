import { Input, InputProps } from '@tarojs/components';
import classNames from 'classnames';
import './index.scss';

interface IProps extends InputProps {
  onChange?: (val) => any;
  onClear?: () => any;
}
const SearchBar = ({
  placeholder = '搜索',
  className,
  value,
  onChange,
  onClear,
  ...props
}: IProps) => {
  return (
    <div className={classNames('car-control-search-bar', className)}>
      <div className="car-control-search-bar-wrapper">
        <div className="iconfont-search_icon"></div>
        <Input
          value={value}
          onInput={(e) => {
            onChange && onChange(e.detail.value);
          }}
          confirmType="search"
          {...props}
          placeholderClass="car-control-search-bar-input-placeholder"
          placeholder={placeholder}
          className="car-control-search-bar-input"
        />
        <div
          onClick={() => {
            if (value) {
              onChange && onChange('');
              onClear && onClear();
            }
          }}
          className={classNames('close-icon', value && 'show-close')}
        >
          <div className={classNames('iconfont-close_icon')} />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
