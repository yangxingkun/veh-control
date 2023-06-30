import { useState, useRef, useEffect, ReactNode } from 'react';
import { View, ScrollView, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import PromptDialog from "./components/PromptDialog"
import OverlayLoading from "./components/OverlayLoading"
// import HighlightText from "./components/ChatItemCard/HighlightText"
import ChatItemCard from "./components/ChatItemCard"
import { Icon } from '@nutui/nutui-react-taro';
// import useStateWithCall from "./hooks/useStateWithCall"

import { useBottomInput } from "./hooks/useBottomInput"
import { questionBychat } from '@/api/chat'
import classNames from 'classnames';
import { getUserInfo } from '@/utils/user';
// import { highlightText } from "./utils"
import './index.scss';


interface IProps {
  rowId?: number | string,
  id?: string,
  role: string,
  content: string | ReactNode,
  ishand?: boolean,
  isverhand?: boolean,
  keywords?:Object
}
const messagesInit: IProps[] = [
  // { "rowId": 1, "role": "user", "content": `<span class='hightColor' id='test-04d8328fbe064c0fae674d7246d78bb2' data-code='04d8328fbe064c0fae674d7246d78bb2'>理想ONE</span> 真牛逼啊`, ishand: false, isverhand: false },
  // { "rowId": 1, "role": "user", "content": "Who won the world series in 2020?Who won the world series in 2020?Who won the world series in 2020?Who won the world series in 2020?", ishand: false, isverhand: false },
  // { "rowId": 1, "role": "assistant", "content": "You are a helpful assistant7897897897897897897987.", ishand: false, isverhand: false },
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
  const userInfo: any = getUserInfo()
  const {
    chatBoxRef,
    methods: {
      handleSendCalcHeight,
      handleLineChangeHeight,
      handleBlurCalcHeight,
      handleFocusCalcHeight,
      handleKeyboardHeightChange
    }
  } = useBottomInput()

  const sendMessageService = async () => {
    if (!/^\s*$/.test(value)) {
      setMessages((prev) => ([...prev, ...[{ "role": "user", "content": value, ishand: false, isverhand: false }, { "role": "assistant", "content": '...', ishand: false, isverhand: false }]]))
      setValue('')
      Taro.nextTick(() => {
        handleSendCalcHeight()
      })
      setIsLoading(true)
      let { message, msg_id, high_light } = await questionBychat({ user: userInfo.userCode, question: value })
      if (message) {
        
        setMessages((prev) => {
          prev[prev.length - 1] = { rowId: msg_id, role: "assistant", content: message, keywords:high_light, ishand: false, isverhand: false }
          return [...prev]
        })
        Taro.nextTick(() => {
          handleSendCalcHeight()
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
      <View className={classNames('mechat-page', showObj.showLoading ? 'mechat-hidden' : 'mechat-visible')}>
        <ScrollView
          enhanced={true}
          scrollIntoView={"chat_panel_last_view_id"}
          scrollY
          scrollTop={chatBoxRef.current.listScrollTop}
          id="chat_panel_div_class_find_id"
          style={{ height: '100%' }}
          className="chat">
          <div id='chat-list'>
            {messages.map((item, index) => {
              return (<ChatItemCard item={item} index={index} messages={
                messages} setMessages={setMessages} />)
            })}
          </div>
          <div style={{ height: `${chatBoxRef.current.placeHeight}px`, }} id="chat_panel_last_view_id"></div>
        </ScrollView>
        <View className="chatbox" style={{
          height: `${chatBoxRef.current.chatHeight}px`,
          bottom: `${chatBoxRef.current.chatBottom}px`,
          paddingBottom: `${chatBoxRef.current.chatPb}px`,
        }}>
          <View className='chatbox-message'>
            <Textarea
              className="input"
              id='input-Id'
              style={{ height: `${chatBoxRef.current.inputHeight}px` }}
              onLineChange={handleLineChangeHeight}
              placeholder='请输入问题'
              placeholderStyle="color:#999;font-size:14px"
              adjustPosition={false}
              onFocus={handleFocusCalcHeight}
              onBlur={handleBlurCalcHeight}
              onInput={(e) => {
                setValue(e.detail.value)
              }}
              value={value}
              show-confirm-bar={false}
              onKeyboardHeightChange={handleKeyboardHeightChange}
              maxlength={550} />
            {
              isLoading ? <Icon name="loading" className="send" ></Icon> : <img className="send" src="http://152.136.205.136:9000/vehicle-control/font/send.svg" onTouchStart={(e) => {
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
