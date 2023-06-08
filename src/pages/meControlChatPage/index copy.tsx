import { useState, useRef, useEffect, useReducer, useCallback } from 'react';
import { View, ScrollView, Text, Textarea } from '@tarojs/components';
import Taro, { } from '@tarojs/taro';
import PromptDialog from "./components/PromptDialog"
import OverlayLoading from "./components/OverlayLoading"
import { Icon } from '@nutui/nutui-react-taro';
import { questionBychat } from '@/api/chat'
import classNames from 'classnames';

import './index.scss';
const messagesInit :any = [
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
    handleFocusHeight(e) {
      console.log(e.detail.height + 'px')
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
    }
  }
  const scrollBottom = () => {
    var query = Taro.createSelectorQuery().select('#chat-list').boundingClientRect()
    query.exec(function (res) {
      console.log(res[0].height, "0000")
      // that.setState({
      //     scrollTopValue: res[0].height
      // })
    });
  }
  const sendMessageService = async () => {
    if (!/^\s*$/.test(value)) {
      setMessages((prev) => ([...prev, ...[{ "role": "user", "content": value }, { "role": "assistant", "content": '...' }]]))
      setValue('')
      methods.handleFocusScrollToEnd()
      setIsLoading(true)
      let { message } = await questionBychat({ question: value })
      if (message) {
        setMessages((prev) => {
          prev[prev.length - 1] = { "role": "assistant", "content": message }
          return [...prev]
        })
        Taro.nextTick(() => {
          methods.handleFocusScrollToEnd()
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
        methods.handleFocusScrollToEnd()
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
          upperThreshold={200}
          lowerThreshold={200}
          refresherEnabled={true}
          refresherTriggered={refreshTrigger}
          onRefresherRefresh={onRefresh}
          onScrollToUpper={handleScrollToUpper}
          id="chat_panel_div_class_find_id"
          style={{ height: '100%' }} className="chat">
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
        <View className="chatbox">
          <View className='chatbox-message'>
            <Textarea
             className="input"
             cursorSpacing={50}
             adjustPosition={true}
             fixed={true} 
             onFocus={() => {
              methods.handleFocusScrollToEnd()
            }} onInput={(e) => {
              setValue(e.detail.value)
            }} value={value} show-confirm-bar={false} onKeyboardHeightChange={() => { methods.handleFocusHeight }} maxlength={200} />
            {
              isLoading?<Icon name="loading"></Icon>:<img className="send" src="http://152.136.205.136:9000/vehicle-control/font/send.svg" onTouchStart={(e) => {
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
