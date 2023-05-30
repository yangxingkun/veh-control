import { useState, useRef, useEffect, useReducer, useCallback } from 'react';
import { Button, Overlay, Animate, Dialog } from '@nutui/nutui-react-taro';
import { View, ScrollView, Text, Textarea } from '@tarojs/components';
import Taro, { useReady } from '@tarojs/taro';
import Transition from '@/components/Transition';
import closeIconSvg from '@/assets/svg/close_icon_circle.svg';
import classNames from 'classnames';
import './index.scss';
const WrapperStyle = {
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor:'#fff'
}
const metionPropmtList = [
  '”我的预算范围是20-30万，日常自己开,有推荐的电动车吗？“',
  '“30万，买比亚迪海豹还是特斯拉Model3?"',
  '“帮我设计一款30万、适合家庭的轿车吧。"',
]
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

const OverlayComponent = ({ visible }) => {
  return (
    <Overlay visible={visible} >
      <div style={WrapperStyle}>
        <Animate type="breath" loop={true}>
          <img
            style={
              {
                display: 'block',
                width: '51px',
                height: '51px'
              }
            }
            src="http://152.136.205.136:9000/vehicle-control/font/Shape.svg"
          />
        </Animate>
      </div>
    </Overlay>
  )
}


const DialogComponent = ({ visible2, setVisible2 }) => {
  return (
    <Dialog
      title={<div className='propmtTit'>提问示例</div>}
      visible={visible2}
      footerDirection='vertical'
      mask={true}
      noOkBtn={true}
      noCancelBtn={true}
      onCancel={() => setVisible2(false)}
    >
      {
        metionPropmtList.map(item => {
          return (<div key={item} className='propmtBox'>{item}</div>)
        })
      }
    </Dialog>
  )
}


const Index = () => {
  const [visible, setVisible] = useState(true)
  const [visible2, setVisible2] = useState(false)
  const [messages, setMessages] = useState(messagesInit)
  const [value, setValue] = useState('')
  const timerRef = useRef<any>();
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
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setVisible(false);
      setVisible2(true)
    }, 3000);
    return () => {
      clearTimeout(timerRef.current);
    }
  }, [])
  return (
    <>
      {!visible && (<View className='mechat-page'>
        <ScrollView
          enhanced={true}
          scrollIntoView={"emptyC"}
          scrollY
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
          <div style={{ height: '100px' }} id="chat_panel_last_view_id"></div>

        </ScrollView>
        <View className="chatbox">
          {/* adjustPosition={true} */}
          {/* autoHeight */}
          {/* closeOnClickOverlay={true}  */}
          <span>{visible}</span>
          <Textarea className="input" cursorSpacing={50} fixed={true} onFocus={() => {
            methods.handleFocusScrollToEnd()
          }} onInput={(e) => {
            setValue(e.detail.value)
          }} value={value} show-confirm-bar={false} maxlength={200} />
          <img className="send" src="http://152.136.205.136:9000/vehicle-control/font/send.svg" onClick={() => {
            sendMessageService()
          }}> </img>
        </View>
      </View>)}
      <DialogComponent visible2={visible2} setVisible2={setVisible2}></DialogComponent>
      <OverlayComponent visible={visible}></OverlayComponent>
    </>

  )
}
export default Index;
