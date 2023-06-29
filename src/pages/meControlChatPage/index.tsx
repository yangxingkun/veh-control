import { useState, useRef, useEffect, ReactNode } from 'react';
import { View, ScrollView, Text, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import PromptDialog from "./components/PromptDialog"
import OverlayLoading from "./components/OverlayLoading"
import ChatItemCard from "./components/ChatItemCard"
// import HighlightText from "./components/HighlightText"
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
  isverhand?: boolean
}
const messagesInit: IProps[] = [
  // { "rowId": 1, "role": "user", "content": `<span class='hightColor' id='test-04d8328fbe064c0fae674d7246d78bb2' data-code='04d8328fbe064c0fae674d7246d78bb2'>理想ONE</span> 真牛逼啊`, ishand: false, isverhand: false },
  // { "rowId": 1, "role": "user", "content": "Who won the world series in 2020?Who won the world series in 2020?Who won the world series in 2020?Who won the world series in 2020?", ishand: false, isverhand: false },
  // { "rowId": 1, "role": "assistant", "content": "You are a helpful assistant7897897897897897897987.", ishand: false, isverhand: false },
]
const regAtom = '^\\$.\\*+-?=!:|\\/()[]{}';
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

  const handleText = (text, hightKeyWords) => {
    let keywordRegExp, keywords = Object.keys(hightKeyWords), ignoreCase = true;
    if (!text) {
      return '';
    }
    // 把字符串类型的关键字转换成正则
    if (keywords) {
      if (keywords instanceof Array) {
        if (keywords.length === 0) {
          return text;
        }
        keywordRegExp = new RegExp(
          (keywords as string[])
            .filter(item => !!item)
            .map(item => (regAtom.includes(item) ? '\\' + item : item))
            .join('|'),
          ignoreCase ? 'ig' : 'g'
        );
      } else if (typeof keywords === 'string') {
        keywordRegExp = new RegExp(keywords, ignoreCase ? 'ig' : 'g');
      }
    }
    if (text && keywordRegExp) {
      const newData = text.split(keywordRegExp); //  通过关键字的位置开始截取，结果为一个数组
      console.log(newData, "[][newData")
      const matchWords = text.match(keywordRegExp); // 获取匹配的文本
      console.log(matchWords, "[][matchWords")
      const len = newData.length;
      let str = ``
      newData.map((item: any, index: number) => {
        if (index !== len - 1) {
          let value = hightKeyWords[matchWords?.[index]]
          str += `${item}<Text className='hightColor' data-type=1 data-materialCode=${value}  data-templateCode=${value}    id="tagId-${value}" >${matchWords?.[index]}</Text>`
        } else {
          str += item
        }
      })
      return  `<View>${str}</View>`
    } else {
      return text
    }
  }
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
        let message0 = JSON.parse(JSON.stringify(message))
        let highLight0 = JSON.parse(JSON.stringify(high_light))
        let content=handleText(message0,highLight0)
        // let wwwLight = {
        //   蔚来EC6: "9d0e52b49d4b4637b1998acc184bf0ca",
        //   蔚来ES7: "ecfd143a30d549e0921671d720dc4f99",
        //   蔚来ES8: "d030604d60d3490a992e8b7a8ce16b65",
        //   蔚来ET5: "ff2e6ae481fa463b95e6efd9459063d8",
        //   蔚来ET7: "74293524ffe145328814e0a3e3c64912",
        // }
        // let wwwmessage = "咪控回答：“蔚来ET5是一款蔚来汽车旗下的轿跑车型喵~它完美融合了蔚来超跑基因与为自动驾驶而设计的理念，蔚来ES7具有时尚外观和先进的自动驾驶技术蔚来ES8。但是，在推荐车型之前，我还需要了解您的具体需求和想法喵~您有什么其他的需求或者想法吗？我会根据您的回答，为您推荐更适合您的车型喵~"

        // let yyy = highlightText(wwwmessage, Object.keys(wwwLight), { color: '#ffa22d', backgroundColor: 'transparent', padding: 0 })
        // console.log(yyy, "结果")
        // Object.keys(highLight0).forEach(key => {
        //   let value = highLight0[key]
        //   const regex = new RegExp(key, 'g');
        //   // data-templateDesc=${message}  data-templateName=${key}
        //   message0 = message0.replace(regex, `<Text className='hightColor' data-type=1 data-materialCode=${value}  data-templateCode=${value}    id="tagId-${value}" >${key}</Text>`)
        // })
        // let content = `<View>${message0}</View>`
        // console.log(message0, "keymessage0")
        setMessages((prev) => {
          prev[prev.length - 1] = { rowId: msg_id, role: "assistant", content: content, ishand: false, isverhand: false }
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
        <View className="chatbox" onTouchStart={(e) => {
          e.preventDefault()
        }} style={{
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
