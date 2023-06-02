import { useState, useRef, useEffect, useReducer, useCallback } from 'react';
import { View, ScrollView, Text, Textarea } from '@tarojs/components';
import Taro, {  } from '@tarojs/taro';
import PromptDialog from "./components/PromptDialog"
import OverlayLoading from "./components/OverlayLoading"
import './index.scss';
const messagesInit = [
  { "role": "assistant", "content": "You are a helpful assistant." },
  { "role": "user", "content": "Who won the world series in 2020?Who won the world series in 2020?Who won the world series in 2020?Who won the world series in 2020?" },
  { "role": "assistant", "content": "You are a helpful assistant." },
  { "role": "user", "content": "Who won the world series in 2020?Who won the world series in 2020?Who won the world series in 2020?Who won the world series in 2020?" },
  { "role": "assistant", "content": "You are a helpful assistant." },
  { "role": "user", "content": "Who won the world series in 2020?Who won the world series in 2020?Who won the world series in 2020?Who won the world series in 2020?" },
  { "role": "assistant", "content": "You are a helpful assistant." },
  { "role": "user", "content": "Who won the world series in 2020?Who won the world series in 2020?Who won the world series in 2020?Who won the world series in 2020?" },
  { "role": "assistant", "content": "You are a helpful assistant." },
  { "role": "user", "content": "Who won the world series in 2020?Who won the world series in 2020?Who won the world series in 2020?Who won the world series in 2020?" },
  { "role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020." },
  { "role": "user", "content": "Where was it played?" }
]
const Index = () => {
  const [showObj, setShowObj] = useState({
    showLoading: true,
    showPrompt: false
  })
  const [messages, setMessages] = useState(messagesInit)
  const [value, setValue] = useState('')
  const timerRef = useRef<any>();
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const methods = {
    handleFocusScrollToEnd() {
      Taro.createSelectorQuery()
        .select('#chat_panel_div_class_find_id')
        .node()
        .exec((res) => {
          const scrollView = res[0].node
          scrollView.scrollIntoView('#chat_panel_last_view_id')
        })
    },
    handleCopyText(e) {
      // visibleRef.current = false
    }
  }
  const sendMessageService = () => {
    if (!/^\s*$/.test(value)) {
      setMessages((prev) => ([...prev, { "role": "user", "content": value }]))
      setValue('')
      methods.handleFocusScrollToEnd()
    } else {
      Taro.showToast({
        title: '输入不可为空',
        duration: 500,
        icon: 'none'
      });
    }
  }

  const onRefresh = (e) => {
    if (refreshTrigger) {
      return;
    }
    setRefreshTrigger(true);
    console.log(e)
  };
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setShowObj((pre) => ({ ...pre, ...{ showLoading: false, showPrompt: true } }))
    }, 3000);
    return () => {
      clearTimeout(timerRef.current);
    }
  }, [])
  return (
    <>
      {!showObj.showLoading && (<View className='mechat-page'>
        <ScrollView
          enhanced={true}
          // scrollIntoView={"chat_panel_last_view_id"}
          scrollY
          refresherEnabled={true}
          refresherTriggered={refreshTrigger}
          onRefresherRefresh={onRefresh}
          id="chat_panel_div_class_find_id"
          style={{ height: '100%' }} className="chat">
          {messages.map((item, index) => {
            return (
              <View key={index} style={{ margin: '40px 0' }}>
                {
                  item.role == 'user' && <View className="user" >
                    <img className="user-avatar" src="http://152.136.205.136:9000/vehicle-control/font/Shape.svg"></img>
                    <Text className="content" onClick={(e) => { methods.handleCopyText(e) }} >{item.content}</Text>
                  </View>
                }
                {
                  item.role == 'assistant' && <View className="assistant" >
                    <img className="avatar" src="http://152.136.205.136:9000/vehicle-control/font/Shape.svg"></img>
                    <Text className="content" onClick={(e) => { methods.handleCopyText(e) }}>{item.content}</Text>
                  </View>
                }
              </View>
            );
          })}
          <div style={{ height: '100px', background: 'red' }} id="chat_panel_last_view_id"></div>

        </ScrollView>
        <View className="chatbox">
          <Textarea className="input" cursorSpacing={50} fixed={true} onFocus={() => {
            methods.handleFocusScrollToEnd()
          }} onInput={(e) => {
            setValue(e.detail.value)
          }} value={value} show-confirm-bar={false} maxlength={200} />
          <img className="send" src="http://152.136.205.136:9000/vehicle-control/font/send.svg" onTouchStart={(e) => {
            // e.preventDefault()
            e.defaultPrevented = true
            console.log(
              e
            )
            sendMessageService()
          }} > </img>
        </View>
      </View>)}
      <PromptDialog showPrompt={showObj.showPrompt} setShowObj={setShowObj}></PromptDialog>
      <OverlayLoading showLoading={showObj.showLoading}></OverlayLoading>
    </>

  )
}
export default Index;
