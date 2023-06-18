import { useState, useRef, useEffect} from 'react';
import { View, ScrollView, Text, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import PromptDialog from "./components/PromptDialog"
import OverlayLoading from "./components/OverlayLoading"
import { Icon } from '@nutui/nutui-react-taro';
// import useStateWithCall from "./hooks/useStateWithCall"
import handIconSvg from '@/assets/svg/hand_icon.svg';
import handaIconSvg from '@/assets/svg/handa_icon.svg';
import verhandIconSvg from '@/assets/svg/verhand_icon.svg';
import verhandaIconSvg from '@/assets/svg/verhanda_icon.svg';
import { useBottomInput } from "./hooks/useBottomInput"
import { questionBychat, updateBychat } from '@/api/chat'
import classNames from 'classnames';
import { getUserInfo } from '@/utils/user';

import './index.scss';


interface IProps {
  rowId?: number | string,
  id?: string,
  role: string,
  content: string,
  ishand?: boolean,
  isverhand?: boolean
}
const messagesInit: IProps[] = [
  // { "rowId": 1, "role": "assistant", "content": "You are a helpful assistant.", ishand: false, isverhand: false },
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
    methods:{
      handleSendCalcHeight,
      handleLineChangeHeight,
      handleBlurCalcHeight,
      handleFocusCalcHeight,
      handleKeyboardHeightChange
    },
    ...rest
  } = useBottomInput()
  const sendMessageService = async () => {
    if (!/^\s*$/.test(value)) {
      setMessages((prev) => ([...prev, ...[{ "role": "user", "content": value, ishand: false, isverhand: false }, { "role": "assistant", "content": '...', ishand: false, isverhand: false }]]))
      setValue('')
      Taro.nextTick(() => {
        handleSendCalcHeight()
      })
      setIsLoading(true)
      let { message, msg_id } = await questionBychat({ user: userInfo.userCode, question: value })
      if (message) {
        setMessages((prev) => {
          prev[prev.length - 1] = { rowId: msg_id, "role": "assistant", "content": message, ishand: false, isverhand: false }
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
  const switchImg = (e, index, item) => {
    if (!item.rowId) return;
    let id = e.target.dataset?.id;
    // let itemObj=
    if (id == 1) {
      setMessages((pre) => {
        pre[index] = { ...item, ...{ ishand: !item.ishand, isverhand: false } }
        return [...pre]
      }
      )
    } else if (id == 2) {
      setMessages((pre) => {
        pre[index] = { ...item, ...{ ishand: false, isverhand: !item.isverhand } }
        return [...pre]
      })
    }
    Taro.nextTick(() => {
      let status = messages[index].ishand ? 1 : messages[index].isverhand ? 2 : 0
      console.log(status)
      updateBychat(item.rowId, status).then(({ successed }) => {
        if (!successed) {
          Taro.showToast({
            title: '失败',
            icon: 'none'
          })
        }
      })
    })
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
            {/* <View style={{height:'9px'}}></View> */}
            {messages.map((item, index) => {
              return (
                <View key={index} style={{ margin: '40px 0' }}>
                  {
                    item.role == 'user' && <View className="user" >
                      <Text className="content" >{item.content}</Text>
                    </View>
                  }
                  {
                    item.role == 'assistant' && <View className="assistant" >
                      <img className="avatar" src="http://152.136.205.136:9000/vehicle-control/font/Avatar%20ChatGPT.svg"></img>
                      <View className="content" >

                        <Text userSelect={true} decode> {item.content}</Text>
                        <View className='footer' onClick={(e) => {
                          switchImg(e, index, item)
                        }}>
                          <img data-id="1" className={classNames('footer-img')} src={item.ishand ? handaIconSvg : handIconSvg} style={{ marginRight: '24px' }} />
                          <img data-id="2" className={classNames('footer-img')} src={item.isverhand ? verhandaIconSvg : verhandIconSvg} />
                        </View>
                      </View>
                    </View>
                  }
                </View>
              );
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
