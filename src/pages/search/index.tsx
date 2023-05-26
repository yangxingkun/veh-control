import classNames from 'classnames';
import { useTabsModel } from './hooks/useTabsModel';
import { useRef, useState } from 'react';
import SearchList from './components/SearchList';
import SearchTipList from './components/SearchTipList';
import Form from '@/components/Form';
import './index.scss';
import { useSearchTipModel } from './hooks/useSearchTipModel';
import { useDebouncedFn } from '@/hooks/useDebouncedFn';
import SearchBar from '@/components/SearchBar';

const Search = () => {
  const tabsModel = useTabsModel();
  const form = Form.useForm();
  const { activePanel, tabItems, selectedTabItem } = tabsModel.useGetState();
  const [tipListVisible, setTipListVisible] = useState(false);
  const searchTipModel = useSearchTipModel();
  const searchListRef = useRef<any>();
  const onSearch = () => {
    searchListRef.current.refresh();
  };
  const { run } = useDebouncedFn(
    (_, value) => {
      searchTipModel.getEffect('fetchData')(value);
    },
    {
      wait: 500,
    }
  );
  return (
    <div className="search-page">
      <Form
        form={form}
        onFieldChange={(field, value) => {
          run(field, value);
          console.log(field, value);
        }}
      >
        <Form.Item
          getInputValue={(v) => v}
          onChangeName="onChange"
          field="searchValue"
          className="search-form-item"
        >
          <SearchBar
            onFocus={() => {
              setTipListVisible(true);
              if (form.getFieldValue('searchValue')) {
                searchTipModel.getEffect('fetchData')(form.getFieldValue('searchValue'));
              }
            }}
            onConfirm={() => {
              setTipListVisible(false);
              onSearch();
            }}
            onClear={() => {
              onSearch();
            }}
            onBlur={() => {
              setTipListVisible(false);
            }}
            className="search-bar"
          />
        </Form.Item>
      </Form>
      <div className="wrapper">
        <div className="tabs">
          <div className="tabs-title">
            {tabItems.map((item) => {
              return (
                <div
                  className={classNames(
                    'tab-title-item',
                    activePanel === item.panelKey && 'tab-title-item-active'
                  )}
                  onClick={() => {
                    tabsModel.setState({
                      activePanel: item.panelKey,
                    });
                  }}
                >
                  {item.title}
                </div>
              );
            })}
          </div>
          <div className="tabs-panel">
            <SearchList
              form={form}
              ref={searchListRef}
              tag={selectedTabItem?.tag}
            />
          </div>
        </div>
      </div>
      <SearchTipList
        form={form}
        onClose={() => {
          setTipListVisible(false);
        }}
        visible={tipListVisible}
        searchTipModel={searchTipModel}
        onSearch={onSearch}
      />
    </div>
  );
};

export default Search;
