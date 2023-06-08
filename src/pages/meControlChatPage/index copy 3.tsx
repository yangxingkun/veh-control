import { useState, useRef, useEffect, useReducer, useCallback } from 'react';
import { View, ScrollView, Text, Textarea } from '@tarojs/components';
import Taro, { getSystemInfoSync, createSelectorQuery } from '@tarojs/taro';
import PromptDialog from "./components/PromptDialog"
import OverlayLoading from "./components/OverlayLoading"
import { Icon } from '@nutui/nutui-react-taro';
import useStateWithCall from "./hooks/useStateWithCall"

import { questionBychat } from '@/api/chat'
import classNames from 'classnames';

import './index.scss';
const messagesInit: any = [
  // { "role": "assistant", "content": "You are a helpful assistant." },
  // { "role": "user", "content": "Who won the world series in 2020?Who won the world series in 2020?Who won the world series in 2020?Who won the world series in 2020?" },
  // { "role": "assistant", "content": "You are a helpful assistant." },
  // { "role": "user", "content": "Who won the world series in 2020?Who won the world series in 2020?Who won the world series in 2020?Who won the world series in 2020?" },
  // { "role": "assistant", "content": "You are a helpful assistant." },
  // { "role": "user", "content": "Who won the world series in 2020?Who won the world series in 2020?Who won the world series in 2020?Who won the world series in 2020?" },
  // { "role": "assistant", "content": "You are a helpful assistant." },
  // { "role": "user", "content": "Who won the world series in 2020?Who won the world series in 2020?Who won the world series in 2020?Who won the world series in 2020?" },
  // { "role": "assistant", "content": "You are a helpful assistant." },
  // { "role": "user", "content": "Who won the world series in 2020?Who won the world series in 2020?Who won the world series in 2020?Who won the world series in 2020?" },
  // { "role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020." },
  // { "role": "user", "content": "Where was it played?" }
]
const Index = () => {
  const [showObj, setShowObj] = useState({
    showLoading: true,
    showPrompt: false
  })
  const [messages, setMessages] = useState(messagesInit)
  const [state, setState] = useState({
    list: [],
    newMessageList: [],
    mediaTypes: [
      {
        type: "camera",
        name: "拍照"
      },
      {
        type: "album",
        name: "照片"
      }
    ],
    messageContent: "",
    addMediaModal: false,
    animated: false,
    scrollHeight: "100vh",
    inputBottom: 0,
    placeBottom: '',
    listScrollTop: 14999,
  })
  const windowHeight = Taro.getSystemInfoSync().windowHeight;
  // let keyHeight = 0;
  const [value, setValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const timerRef = useRef<any>();
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const methods = {
    handleFocusScrollToEnd() {
      Taro.createSelectorQuery()
        .select('#chat_panel_div_class_find_id')
        .node()
        .exec((res) => {
          const scrollView = res[0].node
          // scrollView.scrollTo({
          //   top:100
          // })
          scrollView.scrollIntoView('#chat_panel_last_view_id')
        })
    },
    handleSetClipboardData({ content }) {
      Taro.setClipboardData({
        data: content,
      }).then(() => {
        Taro.showToast({
          title: '已复制到剪切板',
          icon: 'none'
        })
      })
    },
    handleKeyboardHeightChange(e) {
      // console.log(e.detail.height + 'px')
      console.log(e, "handleKeyboardHeightChange")
    },
    handleFocusHeight(e) {
      console.log(e.detail.height, "handleFocusHeight")
      let keyHeight: any = e.detail.height;
      let keyHeightPx: any = e.detail.height + 'px';
      // state.listScrollTop < windowHeight ? windowHeight - state.listScrollTop > 94 + keyHeight ? setState((pre) => ({ ...pre, ...{ placeBottom: `${94 + keyHeight}px` } })) : null
      // state.listScrollTop+keyHeight+94
      let str= windowHeight - keyHeight -94
      console.log(str,"获取scrollHeight高度123456")
      setState((pre) => ({ ...pre, ...{ placeBottom: `${keyHeight + 94}px`, inputBottom: keyHeightPx, scrollHeight: `${windowHeight - keyHeight -94}px` } }))
      Taro.nextTick(() => {
        scrollBottom()
      })
    },
    handleBlur(e) {
      console.log(e, "handleBlur")
      setState((pre) => ({ ...pre, ...{placeBottom: `${94}px`, inputBottom: 0, scrollHeight: `${100}vh` } }))
      Taro.nextTick(() => {
        scrollBottom()
      })
    }
  }

  // useEffect(() => {
   
  // }, [state.scrollHeight])
  
  const scrollBottom = () => {
    var query = Taro.createSelectorQuery().select('#chat-list').boundingClientRect()
    query.exec(function (res) {

      console.log(res[0].height,state.scrollHeight,windowHeight,"元素高，滚动高,页面高")
      
      setState((pre) => ({ ...pre, ...{ listScrollTop: res[0].height} }))
    });
  }

  const sendMessageService = async () => {
    if (!/^\s*$/.test(value)) {
      setMessages((prev) => ([...prev, ...[{ "role": "user", "content": value }, { "role": "assistant", "content": '...' }]]))
      setValue('')
      // methods.handleFocusScrollToEnd()
      scrollBottom()
      setIsLoading(true)
      let { message } = await questionBychat({ question: value })
      if (message) {
        setMessages((prev) => {
          prev[prev.length - 1] = { "role": "assistant", "content": message }
          return [...prev]
        })
        Taro.nextTick(() => {
          // methods.handleFocusScrollToEnd()
          scrollBottom()
        })
        setIsLoading(false)
      }
    } else {
      Taro.showToast({
        title: '输入不可为空',
        duration: 500,
        icon: 'none'
      });
    }
  }

  const onRefresh = (e) => {
    setRefreshTrigger(true); // 在下拉刷新被触发时重新设置下拉刷新状态
    console.log(e, '自定义下拉刷新被触发')
    setTimeout(() => {
      setRefreshTrigger(false);
    }, 2000)
  };

  const handleScrollToUpper = (e) => {
    console.log(e, '滚动到🆙部上拉加载')
  }
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setShowObj((pre) => ({ ...pre, ...{ showLoading: false, showPrompt: true } }))
      Taro.nextTick(() => {
        // methods.handleFocusScrollToEnd()
      })
    }, 2000);
    return () => {
      clearTimeout(timerRef.current);
    }
  }, [])
  return (

    <>
      <View className={classNames('mechat-page', showObj.showLoading ? 'mechat-hidden' : 'mechat-visible')}>
        <ScrollView
          enhanced={true}
          scrollIntoView={"chat_panel_last_view_id"}
          scrollY
          // upperThreshold={200}
          // lowerThreshold={200}
          // refresherEnabled={false}
          // refresherTriggered={refreshTrigger}
          // onRefresherRefresh={onRefresh}
          // onScrollToUpper={handleScrollToUpper}
          scrollTop={state.listScrollTop}
          id="chat_panel_div_class_find_id"
          style={{ height: state.scrollHeight }} className="chat">
          <div id='chat-list'>
            {messages.map((item, index) => {
              return (
                <View key={index} style={{ margin: '40px 0' }}>
                  {
                    item.role == 'user' && <View className="user" >
                      <img className="user-avatar" src="http://152.136.205.136:9000/vehicle-control/font/Shape.svg"></img>
                      <Text className="content" onClick={() => {
                        methods.handleSetClipboardData(item)
                      }}>{item.content}</Text>
                    </View>
                  }
                  {
                    item.role == 'assistant' && <View className="assistant" >
                      <img className="avatar" src="http://152.136.205.136:9000/vehicle-control/font/Shape.svg"></img>
                      <Text className="content" onClick={() => {
                        methods.handleSetClipboardData(item)
                      }}>{item.content}</Text>
                    </View>
                  }
                </View>
              );
            })}
          </div>
          <div style={{ height: '94px', background: 'red' }} id="chat_panel_last_view_id"></div>
        </ScrollView>
        <View className="chatbox" style={{ bottom: state.inputBottom }} onTouchStart={(e) => {
          e.preventDefault()
        }}>
          <View className='chatbox-message'>
            <Textarea
              className="input"
              // cursorSpacing={0}
              adjustPosition={false}
              // fixed={true}
              onFocus={methods.handleFocusHeight}
              onBlur={methods.handleBlur}
              //  onFocus={() => {
              //   methods.handleFocusScrollToEnd()
              // }}
              onInput={(e) => {
                setValue(e.detail.value)
              }} value={value}
              show-confirm-bar={false}
              onKeyboardHeightChange={() => { methods.handleKeyboardHeightChange }}
              maxlength={200} />
            {
              isLoading ? <Icon name="loading"></Icon> : <img className="send" src="http://152.136.205.136:9000/vehicle-control/font/send.svg" onTouchStart={(e) => {
                e.preventDefault()
                sendMessageService()
              }} > </img>
            }

          </View>
        </View>
      </View>
      <PromptDialog showPrompt={showObj.showPrompt} setShowObj={setShowObj}></PromptDialog>
      <OverlayLoading showLoading={showObj.showLoading}></OverlayLoading>
    </>

  )
}
export default Index;
