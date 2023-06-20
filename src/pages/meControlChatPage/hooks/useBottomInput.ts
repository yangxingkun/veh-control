import { useRef, useState,useEffect } from "react";
import {
  getSystemInfoSync,
  getCurrentPages,
  createSelectorQuery,
} from "@tarojs/taro";
import { useDebouncedFn } from "@/hooks/useDebouncedFn";
interface IProps {
  chatHeight: number;
  chatBottom: number;
  chatBlurPd: number;
  chatPb: number;
  chatFocusPd: number;
  inputPd: number;
  scrollHeight: number;
  inputHeight: number;
  listScrollTop: number;
  keyHeight: number;
  placeHeight: number;
}
let key = 1;
const windowHeight = getSystemInfoSync().windowHeight;
export function useBottomInput() {
  const pages = getCurrentPages();
  const [, setForceUpdate] = useState<any>(1);
  const chatBoxRef = useRef<IProps>({
    chatHeight: 94,
    chatBottom: 0,

    chatPb: 40,
    chatFocusPd: 12,

    inputPd: 16 /*上下padding常量  */,

    chatBlurPd: 46 /*上下padding常量  */,
    scrollHeight: 100,
    inputHeight: 48 /* 32 */,
    listScrollTop: 14999,
    keyHeight: 0,

    placeHeight: 0,
  });

  const getInputHeight = async (): Promise<any> => {
    // debugger;
    return createSelectorQuery()
      .select("#input-Id")
      .boundingClientRect((res) => {
        let { height } = res;
        return height;
      })
      .exec();
  };
  const { run: handleFocusScrollToEnd } = useDebouncedFn(
    () => {
      createSelectorQuery()
        .select("#chat_panel_div_class_find_id")
        .node((res) => {
          //debugger;
          const scrollView = res.node;
          console.log("handleFocusScrollToEnd");
          //   console.log(scrollView, "getScrollView节点");
          scrollView.scrollIntoView("#chat_panel_last_view_id");
        })
        .exec();
    },
    { wait: 30 }
  );
  const methods = {
    handleScrollTop() {
      console.log(pages[pages.length - 1], "woca");
      createSelectorQuery()
        .in(pages[pages.length - 1])
        .select("#chat_panel_div_class_find_id")
        .boundingClientRect((res) => {
          //   console.log(res.height, "卧槽2");
          //   debugger;
          const length = 4;
          const randomNum =
            Math.floor(Math.random() * (10 ** length - 1)) + 10 ** (length - 1);
          chatBoxRef.current = {
            ...chatBoxRef.current,
            ...{ listScrollTop: 1499999 + randomNum },
          };
          setForceUpdate(key++);
        })
        .exec();

      setForceUpdate(key++);
    },
    handleKeyboardHeightChange(e) {
      chatBoxRef.current = {
        ...chatBoxRef.current,
        ...{ keyHeight: e.detail.height },
      };
      setForceUpdate(key++);
    },
    handleFocusCalcHeight(e) {
      createSelectorQuery()
        .select("#input-Id")
        .boundingClientRect((res) => {
          let { height } = res;
          console.log(height);
          let keyHeight = e.detail.height;
          chatBoxRef.current = {
            ...chatBoxRef.current,
            ...{
              keyHeight: keyHeight,
              inputHeight: height,
              chatBottom: keyHeight,
              chatPb: 6,
              chatHeight: height + 12,
              placeHeight: height + 12 + keyHeight,
            },
          };
          handleFocusScrollToEnd();
          setForceUpdate(key++);
        })
        .exec();
    },
    handleBlurCalcHeight(e) {
      createSelectorQuery()
        .select("#input-Id")
        .boundingClientRect((res) => {
          let { height } = res;
          //   debugger;
          chatBoxRef.current = {
            ...chatBoxRef.current,
            ...{
              inputHeight: height,
              chatBottom: 0,
              chatPb: 40,
              chatHeight: height + 46,
              placeHeight: height + 46,
            },
          };
          setForceUpdate(key++);
        })
        .exec();
    },
    handleLineChangeHeight(e) {
      let line = e.detail.lineCount;
      if (line > 1 && line < 9) {
        // let totalInputHeight1 = 48 * line - (line - 1) * 16;
        let totalInputHeight = e.detail.height;
        let chatHeightLastest =
          chatBoxRef.current.keyHeight === 0
            ? totalInputHeight + 46
            : totalInputHeight + 12;
        let placeHeightLastest =
          chatBoxRef.current.keyHeight === 0
            ? totalInputHeight + 46
            : totalInputHeight + 12 + chatBoxRef.current.keyHeight;
        chatBoxRef.current = {
          ...chatBoxRef.current,
          ...{
            inputHeight: totalInputHeight,
            chatHeight: chatHeightLastest,
            placeHeight: placeHeightLastest,
          },
        };
        handleFocusScrollToEnd();
        setForceUpdate(key++);
      }
    },
    handleSendCalcHeight() {
      let chatHeightLastest = chatBoxRef.current.keyHeight === 0 ? 94 : 60;
      let placeHeightLastest =
        chatBoxRef.current.keyHeight === 0
          ? 94
          : 60 + chatBoxRef.current.keyHeight;
      let chatPbLastest = chatBoxRef.current.keyHeight === 0 ? 40 : 6;
      chatBoxRef.current = {
        ...chatBoxRef.current,
        ...{
          inputHeight: 48,
          chatPb: chatPbLastest,
          chatHeight: chatHeightLastest,
          placeHeight: placeHeightLastest,
        },
      };
      // console.log(key,'调用次数o')
      key>5&&handleFocusScrollToEnd();
      setForceUpdate(key++);
    },
  };
  useEffect(() => {
    key=1
    return () => {
      key=1
      setForceUpdate(key)
    }
  }, [])
  
  return {
    chatBoxRef,
    methods,
    getInputHeight,
  };
}
