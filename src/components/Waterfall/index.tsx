import { Model, useModel } from '@/hooks/react-store/useModel';
import { useCreation } from '@/hooks/useCreation';
import { useDebouncedFn } from '@/hooks/useDebouncedFn';
import EventEmitter from '@/utils/EventEmitter';
import { uuid } from '@/utils/uuid';
import Taro from '@tarojs/taro';
import {
  HTMLAttributes,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import './index.less';
import classNames from 'classnames';

interface WaterfallItemData {
  left: number;
  top: number;
  show: boolean;
  height: number;
  colIndex: number;
}

interface IState {
  itemInfos: Record<number, WaterfallItemData>;
  updateSignal: string;
  containerHeight: number;
}

interface IEffects {}

interface IWaterfallProps extends HTMLAttributes<HTMLDivElement> {
  col: number;
  colWidth: number;
  leftGap?: number;
  topGap?: number;
}

interface WaterfallContext extends IState {
  model: Model<IState, IEffects>;
  signal: EventEmitter<'sizeChange' | 'addItem' | 'removeItem' | 'indexChange'>;
}

const WaterfallContext = createContext<WaterfallContext>(
  {} as WaterfallContext
);

function findMinIndex(arr: number[]) {
  let min = Infinity;
  let index = 0;
  for (let i = 0, len = arr.length; i < len; i++) {
    if (arr[i] < min) {
      min = arr[i];
      index = i;
    }
  }
  return index;
}

const Waterfall = ({
  col,
  colWidth,
  leftGap = 0,
  topGap = 0,
  className,
  children,
}: IWaterfallProps) => {
  const idRef = useRef<any>();
  if (!idRef.current) {
    idRef.current = uuid();
  }
  const countRef = useRef<number>(0);
  const signal = useCreation(() => {
    return new EventEmitter<'sizeChange' | 'addItem' | 'removeItem' | 'indexChange'>();
  });
  const model = useModel<IState>({
    state: {
      itemInfos: {},
      updateSignal: '',
      containerHeight: 0,
    },
  });
  const { run: updateLayout } = useDebouncedFn(
    () => {
      const itemInfos = model.getState().itemInfos;
      const count = countRef.current;
      const colHeights: number[] = new Array(col).fill(0);
      for (let i = 0; i < count; i++) {
        const itemInfo = itemInfos[i];
        if (!itemInfo) continue;
        const index = findMinIndex(colHeights);
        const left = (colWidth + leftGap) * index;
        const top = colHeights[index];
        colHeights[index] += itemInfo.height + topGap;
        Object.assign(itemInfo, {
          left,
          top,
          colIndex: index,
        });
      }
      const containerHeight = Math.max(...colHeights);
      model.setState({
        updateSignal: uuid(),
        containerHeight,
      });
    },
    { wait: 30 }
  );
  useEffect(() => {
    const addItem = signal.on('addItem', (index) => {
      model.getState().itemInfos[index] = {
        left: 0,
        top: 0,
        show: false,
        height: 0,
        colIndex: 0,
      };
      countRef.current++;
      updateLayout();
    });
    const removeItem = signal.on('removeItem', (index) => {
      countRef.current--;
      delete model.getState().itemInfos[index];
      updateLayout();
    });
    const offSizeChange = signal.on('sizeChange', ({ height }, index) => {
      model.getState().itemInfos[index]!.height = height;
      model.getState().itemInfos[index]!.show = true;
      updateLayout();
    });
    const offIndexChange = signal.on('indexChange', ({ lastIndex, index }) => {
      const itemInfos = model.getState().itemInfos;
      const itemInfo = itemInfos[lastIndex];
      delete itemInfos[lastIndex]
      itemInfos[index] = itemInfo;
      updateLayout();
    });
    return () => {
      addItem();
      removeItem();
      offSizeChange();
      offIndexChange();
    };
  }, []);
  const modelState = model.useGetState();
  const contextValue = useMemo(() => {
    return {
      signal,
      model,
      ...modelState,
    };
  }, [signal, model, modelState]);
  return (
    <WaterfallContext.Provider value={contextValue}>
      <div
        id={idRef.current}
        style={{
          height: modelState.containerHeight,
        }}
        className={classNames('car-control-waterfall', className)}
      >
        {children}
      </div>
    </WaterfallContext.Provider>
  );
};

interface IWaterfallItemProps extends HTMLAttributes<HTMLDivElement> {
  index: number;
}
export const WaterfallItem = ({
  index,
  children,
  className,
}: IWaterfallItemProps) => {
  const { signal, itemInfos } = useContext(WaterfallContext);
  const idRef = useRef<any>();
  const lastIndexRef = useRef<any>();
  if (!idRef.current) {
    idRef.current = uuid();
  }
  useEffect(() => {
    signal.emit('addItem', index);
    setTimeout(() => {
      Taro.createSelectorQuery()
        .select(`.waterfall-item-${idRef.current}`)
        .boundingClientRect((res) => {
          signal.emit('sizeChange', { height: res.height }, index);
        })
        .exec();
    });
    return () => {
      signal.emit('removeItem', index);
    };
  }, []);
  useEffect(() => {
    if (lastIndexRef.current !== index && lastIndexRef.current) {
      signal.emit('indexChange', {
        lastIndex: lastIndexRef.current,
        index,
      })
    }
    lastIndexRef.current = index;
  }, [index])
  const itemInfo = itemInfos[index];
  const style = itemInfo
    ? {
        left: itemInfo.left,
        top: itemInfo.top,
        opacity: itemInfo.show ? undefined : '0',
      }
    : {
        opacity: '0',
      };
  return (
    <div
      style={style}
      className={classNames(
        'car-control-waterfall-item',
        `waterfall-item-${idRef.current}`,
        className
      )}
    >
      {children}
    </div>
  );
};

export default Waterfall;
