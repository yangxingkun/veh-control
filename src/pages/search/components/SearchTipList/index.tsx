import { FormInstance } from '@/components/Form/FormInstance';
import Transition from '@/components/Transition';
import classNames from 'classnames';
import { useSearchTipModel } from '../../hooks/useSearchTipModel';
import './index.scss';

interface IProps {
  visible?: boolean;
  onClose?: () => void;
  onSearch?: (val: string) => void;
  searchTipModel: ReturnType<typeof useSearchTipModel>;
  form: FormInstance;
}

const SearchTipList = ({ visible, onClose, onSearch, searchTipModel, form }: IProps) => {
  const { searchList } = searchTipModel.useGetState();
  return (
    <Transition transitionName="fade-in" duration={300} visible={visible}>
      {(_, transitionClassName) => {
        console.log(transitionClassName)
        return (
          <div className={classNames('search-tip-list', transitionClassName)}>
            <div className="wrapper">
              {searchList.map((item) => {
                return (
                  <div
                    key={item}
                    onClick={() => {
                      onClose && onClose();
                      form.setFieldValue('searchValue', item);
                      onSearch && onSearch(item);
                    }}
                    className="tip-list-item"
                  >
                    {item}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    </Transition>
  );
};

export default SearchTipList;
