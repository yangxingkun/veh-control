import { useRef, useState, useEffect } from 'react';
/* 可以异步调用 */
const useStateWithCall = (initValue) => {
  const ref = useRef(0);
  const callFRef = useRef();
  const setFuncRef = useRef();
  let [state, setState] = useState(initValue);
  if (!ref.current) {
    /*1. 进来之后添函数 */
    ref.current = 1;
    setFuncRef.current = (newData, callF) => {
      callFRef.current = callF;
      setState(newData);
      return Promise.resolve(newData);
    };
  }
  useEffect(() => {
    /* 2.变化的时候在走一次 ，然后进行 回调 和异步获取之 ，然而子组件的变化会提前于父组件 ，从而父组件的 */
    callFRef.current?.(state);
  }, [state]);
  return [state, setFuncRef.current];
};

export default useStateWithCall;
