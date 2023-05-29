import { useState, useRef, useEffect,useReducer } from 'react';
import { Button, Overlay, Animate } from '@nutui/nutui-react-taro';
import { ScrollView, View, Textarea, Text } from '@tarojs/components';
import Taro,{useDidShow}from '@tarojs/taro';
import './index.scss';

const initialState={
  
}
const methodType = {
  /** 导入 */
  import: 'import',
  /* 详情 */
  detail: 'detail',
  /** 导出 */
  export: 'export',
  /** 下载模板 */
  download: 'download',
};
const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case reducerType.renderPermission: {
      return { ...state, columns: getCols(initColumns, payload.methods, payload.permission) };
    }
    default: {
      return state;
    }
  }
};
const Index = () => {
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
  const [value, setValue] = useState('')
  const [messages, setMessages] = useState(messagesInit)
  const [state, toDispatch] = useReducer(reducer, initialState);

  const methods = (type, payload) => {
    switch (type) {
      /** 不能返回 promise, upload 组件不支持 */
      case methodType.import: {
       
        return [];
      }
      case methodType.download: {
    
        return null;
      }

      default:
        return null;
    }
  };
  
  const visibleRef = useRef(false)
  const copyText = (first) => {
    console.log(first)
    // visibleRef.current = false
  }
  const sendMessageService = (e) => {
    // console.log("333", e, value)
    if (!/^\s*$/.test(value)) {
      setMessages((prev)=>([...prev, { "role": "user", "content": value}]))
      setValue('')
      // wx.request({
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
  const handleInput = (e) => {
    setValue(e.detail.value)
  }
  useEffect(() => {

    visibleRef.current = true
    setTimeout(() => {
      visibleRef.current = false
    }, 3000)
  }, [])
  useEffect(() => {
    console.log("first", visibleRef.current)

  }, [])

  useDidShow(()=>{

  })

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
                  <Text className="content" onClick={() => { copyText }} >{item.content}</Text>
                </View>
              }
              {
                item.role == 'assistant' && <View className="assistant" >
                  <img className="avatar" src="http://152.136.205.136:9000/vehicle-control/font/Shape.svg"></img>
                  <Text className="content" onClick={() => { copyText }}>{item.content}</Text>
                </View>
              }
            </View>
          );
        })}
        <div style={{ height: '100px' }}  id="chat_panel_last_view_id"></div>

      </ScrollView>
      <View className="chatbox">
        {/* adjustPosition={true} */}
        {/* autoHeight */}
        {/* closeOnClickOverlay={true}  */}
        <Textarea className="input" cursorSpacing={50} fixed={true} onFocus={(e) => {
          console.log(e)
          Taro.createSelectorQuery()
          .select('#chat_panel_div_class_find_id')
          .node()
          .exec((res) => {
            const scrollView = res[0].node
            scrollView.scrollIntoView('#chat_panel_last_view_id')
          })
        
        }} onInput={(e) => {
          handleInput(e)
        }} value={value} show-confirm-bar={false} maxlength={200} />
        <img className="send" src="http://152.136.205.136:9000/vehicle-control/font/send.svg" onClick={(e) => {
          sendMessageService(e)
        }}> </img>
      </View>
      {visibleRef.current && <Overlay visible={visibleRef.current} closeOnClickOverlay={true} onClick={() => {
        visibleRef.current = false
      }} overlayClass={'breath-waper'}>
        <Animate type="breath" loop={true}>
          <img
            className="logo"
            src="http://152.136.205.136:9000/vehicle-control/font/Shape.svg"
          />
        </Animate>
      </Overlay>}
    </View>
  );
};
export default Index;
