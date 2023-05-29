import { useState, useRef, useEffect, useReducer, useCallback } from 'react';
import { Button, Overlay, Animate } from '@nutui/nutui-react-taro';
import { ScrollView, View, Textarea, Text ,Image} from '@tarojs/components';
import Taro, { useReady } from '@tarojs/taro';
import Transition from '@/components/Transition';
import closeIconSvg from '@/assets/svg/close_icon_circle.svg';
import classNames from 'classnames';

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
  const [value, setValue] = useState('')
  // const [visible, setVisible] = useState(true)
  const [messages, setMessages] = useState(messagesInit)
  // const [state, toDispatch] = useReducer(reducer, initialState);
  // const visibleRef = useRef(true)
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<any>();
  console.log('render')
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
      console.log(e)
      // visibleRef.current = false
    },
    // handleOverLay: useCallback(()=> {
    //     setVisible(false)
    // },[visible])
  }


  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setVisible(true);
    }, 300);
    return () => {
      clearTimeout(timerRef.current);
    }
  }, [])

  // useEffect(() => {
  //   if (visible) {
  //     setVisible(false)
  //   }
  // }, [visible])

  const sendMessageService = () => {
    if (!/^\s*$/.test(value)) {
      setMessages((prev) => ([...prev, { "role": "user", "content": value }]))
      setValue('')
      methods.handleFocusScrollToEnd()
      // Taro.request({
      //   url: 'http://127.0.0.1:8080/chat',
      //   method: 'POST',
      //   data: {
      //     content: this.data.messages,
      //   },
      //   header: {
      //     'content-type': 'application/json'
      //   },
      //   success: (res) => {
      //     this.data.messages.push(res.data.message)
      //     this.setData({
      //       messages: this.data.messages
      //     });
      //   }
      // })
    } else {
      Taro.showToast({
        title: '输入不可为空',
        duration: 500,
        icon: 'none'
      });
    }
  }
  // useEffect(() => {
  //   console.log("first", visibleRef.current)
  // }, [])
  // useReady(() => {
  //   methods.handleFocusScrollToEnd()
  //   // visibleRef.current = true
  //   // setTimeout(() => {
  //   //   visibleRef.current = false
  //   // }, 3000)
  // })
  useEffect(() => {
    Taro.nextTick(() => {
      methods.handleFocusScrollToEnd()
    })
  }, [])
  return (

    <View className='mechat-page'>

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
      {/* <Overlay visible={visible} closeOnClickOverlay={true} onClick={() => {
        methods.handleOverLay()
      }} overlayClass={'breath-waper'}>
        <Animate type="breath" loop={true}>

          <img
            className="logo"
            src="http://152.136.205.136:9000/vehicle-control/font/Shape.svg"
          />
        </Animate>
      </Overlay> */}
      <Transition visible={visible} transitionName="fade-in">
        {
          (_, transitionClassName) => {
            return (
              <div className={classNames('auth-popup', transitionClassName)}>
                <div className="auth-popup-img-container">
                  <div className="auth-popup-text">
                    <div className="auth-popup-title">首次注册</div>
                    <div className="auth-popup-subtitle">即送装备徽章</div>
                  </div>
                  <Image mode="aspectFit" className="auth-popup-img" src="http://152.136.205.136:9000/vehicle-control/font/huodong%402x.png" alt="" />
                  <div onClick={() => {
                    setVisible(false);
                  }} className="auth-popup-close">
                    <img className="close-icon" src={closeIconSvg} />
                  </div>
                </div>
              </div>
            )
          }
        }
      </Transition>
    </View>
  );
};
export default Index;
