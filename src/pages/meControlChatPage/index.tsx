import { useState, useRef, useEffect, useReducer, useCallback } from 'react';
import { View, ScrollView, Text, Textarea } from '@tarojs/components';
import Taro, { getSystemInfoSync, createSelectorQuery, preload } from '@tarojs/taro';
import PromptDialog from "./components/PromptDialog"
import OverlayLoading from "./components/OverlayLoading"
import { Icon } from '@nutui/nutui-react-taro';
import useStateWithCall from "./hooks/useStateWithCall"
import handIconSvg from '@/assets/svg/hand_icon.svg';
import handaIconSvg from '@/assets/svg/handa_icon.svg';
import verhandIconSvg from '@/assets/svg/verhand_icon.svg';
import verhandaIconSvg from '@/assets/svg/verhanda_icon.svg';

import { questionBychat, updateBychat } from '@/api/chat'
import classNames from 'classnames';

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
    inputBottom: '0px',
    placeBottom: '86px',
    inputHeight: '86px',
    autoHeight: false,
    pdBm: '40px',
    keyHeight: 0,
    focus: false,
    listScrollTop: 14999,
  })
  const windowHeight = Taro.getSystemInfoSync().windowHeight;
  const [value, setValue] = useStateWithCall('')
  const [isLoading, setIsLoading] = useState(false)
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
      setState((pre) => ({ ...pre, ...{ keyHeight: e.detail.height } }))
    },
    handleFocusHeight(e) {
      console.log(e.detail.height, "handleFocusHeight")
      setShowObj((pre) => ({ ...pre, ...{ showPrompt: false } }))
      let keyHeight: any = e.detail.height;
      let keyHeightPx: any = e.detail.height + 'px';
      createSelectorQuery().select('#input-Id').boundingClientRect()
        .exec(function (res) {
          let inputHeightlast = res[0].height + 12 + 20
          let placeBottomlast = res[0].height + 12 + 20 + keyHeight
          setState((pre) => ({ ...pre, ...{ autoHeight: true, keyHeight: e.detail.height, inputHeight: `${inputHeightlast}px`, placeBottom: `${placeBottomlast}px`, pdBm: `${6}px`, inputBottom: keyHeightPx, scrollHeight: `${windowHeight - keyHeight - 58}px` } }))
          Taro.nextTick(() => {
            methods.handleFocusScrollToEnd()
          })
        })
    },
    handleBlur(e) {
      console.log(e, "handleBlur")
      createSelectorQuery().select('#input-Id').boundingClientRect()
        .exec(function (res) {
          console.log(res[0].height, "元素高0000000000")
          let inputHeightlast = res[0].height + 46 + 20
          let placeBottomlast = 46 + 20 + res[0].height
          setState((pre) => ({ ...pre, ...{ focus: false, autoHeight: true, keyHeight: 0, inputHeight: `${inputHeightlast}px`, placeBottom: `${placeBottomlast}px`, pdBm: `${40}px`, inputBottom: '0px', scrollHeight: `${100}vh` } }))
          // Taro.nextTick(() => {
          //   methods.handleFocusScrollToEnd()
          // })
        });
    },
    handleInput(e) {
      setValue(e.detail.value).then(() => {
        Taro.nextTick(() => {
          createSelectorQuery().select('#input-Id').boundingClientRect()
            .exec(function (res) {
              console.log(res[0].height, "元素高0000000000")
              let inputHeightlast = res[0].height + 12 + 20
              let placeBottomlast = state.keyHeight + 12 + 20 + res[0].height
              setState((pre) => ({ ...pre, ...{ placeBottom: `${placeBottomlast}px`, inputHeight: `${inputHeightlast}px`, pdBm: `${6}px` } }))
              Taro.nextTick(() => {
                methods.handleFocusScrollToEnd()
              })
            });
        })
      })
    }
  }

  


  const sendMessageService = async () => {
    if (!/^\s*$/.test(value)) {
      setMessages((prev) => ([...prev, ...[{ "role": "user", "content": value, ishand: false, isverhand: false }, { "role": "assistant", "content": '...', ishand: false, isverhand: false }]]))
      setValue('').then(() => {
        Taro.nextTick(() => {
          createSelectorQuery().select('#input-Id').boundingClientRect()
            .exec(function (res) {
              console.log(res[0].height, state.keyHeight, "元素高sendMessageService")
              let inputHeightlast = state.keyHeight == 0 ? 46 + 20 + res[0].height : res[0].height + 12 + 20
              let placeBottomlast = state.keyHeight == 0 ? 46 + 20 + res[0].height : res[0].height + 12 + 20 + state.keyHeight
              let pdBmlast = state.keyHeight == 0 ? 40 : 6
              setState((pre) => ({ ...pre, ...{ focus: true, autoHeight: true, inputBottom: `${state.keyHeight}px`, inputHeight: `${inputHeightlast}px`, placeBottom: `${placeBottomlast}px`, pdBm: `${pdBmlast}px`, scrollHeight: `${100}vh` } }))
              Taro.nextTick(() => {
                methods.handleFocusScrollToEnd()
              })
            });
        })
      })
      setIsLoading(true)
      let { message, msg_id } = await questionBychat({ question: value })
      if (message) {
        setMessages((prev) => {
          prev[prev.length - 1] = { rowId: msg_id, "role": "assistant", "content": message, ishand: false, isverhand: false }
          return [...prev]
        })
        Taro.nextTick(() => {
          methods.handleFocusScrollToEnd()
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
    if(!item.rowId) return;
    let id = e.target.dataset?.id;
    // let itemObj=
    if (id == 1) {
      setMessages((pre) => {
        pre[index] = { ...item, ...{ ishand: !item.ishand, isverhand: false } }
        console.log(pre[index], " pre[index]1")
        return [...pre]
      }
      )
    } else if (id == 2) {
      setMessages((pre) => {
        pre[index] = { ...item, ...{ ishand: false, isverhand: !item.isverhand } }
        console.log(pre[index], " pre[index]2")
        return [...pre]
      })
    }
    Taro.nextTick(() => {
      let status = messages[index].ishand ? 1 : messages[index].isverhand ? 2 : 0
      console.log(status)
      updateBychat(item.rowId, status).then(({successed}) => {
        if(!successed){
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
          id="chat_panel_div_class_find_id"
          style={{ height: '100%' }} className="chat">
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
          <div style={{ height: state.placeBottom, }} id="chat_panel_last_view_id"></div>
        </ScrollView>
        <View className="chatbox" style={{ bottom: state.inputBottom, paddingBottom: state.pdBm, height: state.inputHeight }} onTouchStart={(e) => {
          e.preventDefault()
        }}>
          <View className='chatbox-message'>
            <Textarea
              className="input"
              id='input-Id'
              // autoHeight={state.autoHeight}
              autoHeight
              placeholder='请输入问题'
              placeholderStyle="color:#999;font-size:14px"
              // cursorSpacing={0}
              adjustPosition={false}
              // fixed={true}
              // focus={state.focus}
              onFocus={methods.handleFocusHeight}
              onBlur={methods.handleBlur}
              onInput={(e) => {
                methods.handleInput(e)
              }} value={value}
              show-confirm-bar={false}
              onKeyboardHeightChange={(e) => {
                methods.handleKeyboardHeightChange(e)
              }}
              maxlength={150} />
            {
              isLoading ? <Icon name="loading" className="send" ></Icon> : <img className="send" src="http://152.136.205.136:9000/vehicle-control/font/send.svg" onTouchStart={(e) => {
                e.preventDefault()
                // setState((pre) => ({ ...pre, ...{ focus: true } }))
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
