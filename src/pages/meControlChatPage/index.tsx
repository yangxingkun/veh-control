import { useState, useRef, useEffect } from 'react';
import { Button, Overlay, Animate } from '@nutui/nutui-react-taro';
import { ScrollView, View, Textarea, Text } from '@tarojs/components';

import './index.scss';
const Index = () => {
  const messages = [
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
  const [value, setValue] = useState(null)
  const visibleRef = useRef(false)
  const copyText = (first) => {
    console.log(first)
    // visibleRef.current = false
  }
  const send = () => {

  }
  const handleInput = () => {

  }
  // useEffect(()=>{
  //   if(visible){
  //    setVisible(false)
  //   }
  // },[visible])
  return (
    <View className='mechat-page'>
      <ScrollView
        scrollY
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
        <View style={{ height: '100px' }}></View>
        
      </ScrollView>
      <View className="chatbox">
        {/* adjustPosition={true} */}
        {/* autoHeight */}
        {/* closeOnClickOverlay={true}  */}
        <Textarea className="input" cursorSpacing={40} fixed={true} onInput={() => {
          handleInput()
        }} value={value} show-confirm-bar={false} limitshow maxlength={200} />
        <img className="send" src="http://152.136.205.136:9000/vehicle-control/font/send.svg" onClick={() => {
          send()
        }}> </img>
      </View>
      {visibleRef.current && <Overlay visible={visibleRef.current} closeOnClickOverlay={true} onClick={() => {
        // console.log(visible)
        // setVisible(false)
        // copyText
        visibleRef.current=false
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
