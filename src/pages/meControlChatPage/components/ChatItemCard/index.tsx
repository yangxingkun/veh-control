import { ReactNode, useEffect, useLayoutEffect } from 'react';
import { View, RichText, Text } from '@tarojs/components';
import handIconSvg from '@/assets/svg/hand_icon.svg';
import handaIconSvg from '@/assets/svg/handa_icon.svg';
import verhandIconSvg from '@/assets/svg/verhand_icon.svg';
import verhandaIconSvg from '@/assets/svg/verhanda_icon.svg';
import classNames from 'classnames';
import Taro from '@tarojs/taro';
import '@tarojs/taro/html.css'; // 引入taro内置样式文件
import { updateBychat } from '@/api/chat'
import HightLightContent from './HightLightContent'
const Index = ({ index, item, messages, setMessages }) => {
  const supportClick = (e, index, item) => {
    if (!item.rowId) return;
    let id = e.target.dataset?.id;
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
  // 点击图片放大
  const imgClick = (e) => {
    console.log(e, '点击放大')
    if (!e) return false;
    Taro.previewImage({
      current: e,
      urls: [e]
    });
  }
  // 点击图片放大
  // const imgClick = (e) => {
  //   console.log(e, '点击放大')
  //   if (!e) return false;
  //   Taro.previewImage({
  //     current: e,
  //     urls: [e]
  //   });
  // }

  // useEffect(() => {
  //   const el = document.getElementById('test-04d8328fbe064c0fae674d7246d78bb2') as HTMLElement
  //   console.log(el, "-=-=-=el")
  //   function testOnTap(event) {
  //     // do something
  //     console.log(
  //       event
  //     )
  //   }
  //   el.addEventListener('tap', testOnTap)
  //   return () => {
  //     el.removeEventListener('tap', testOnTap)
  //   }
  // }, [messages])

  // const nodeHtml = `<span class='hightColor' id='test-04d8328fbe064c0fae674d7246d78bb2' data-key='04d8328fbe064c0fae674d7246d78bb2'>理想ONE</span> 真牛逼啊`
  

  return (
    <>
      <View key={index} style={{ margin: '40px 0' }}>
        {
          item.role == 'user' && <View className="user" >
            {/* <Text className="content" >{item.content}</Text> */}
            {/* <RichText className="content" nodes={item.content}></RichText>
                         */}
            {/* npm install mp-html  import parse from 'mini-html-parser2'; */}
            <View className="taro_html k_html content" dangerouslySetInnerHTML={{ __html: item.content }}>
            </View>
          </View>
        }
        {
          item.role == 'assistant' && <View className="assistant" >
            <img className="avatar" src="http://152.136.205.136:9000/vehicle-control/font/Avatar%20ChatGPT.svg"></img>
            <View className="content" >
              {/* <Text userSelect={true} decode> {item.content}</Text> */}
              {/* <View className="taro_html k_html content" dangerouslySetInnerHTML={{ __html: item.content }}>
              </View> */}
              <HightLightContent imgClick={imgClick} node={item.content}> </HightLightContent>
              <View className='footer' onClick={(e) => {
                supportClick(e, index, item)
              }}>
                <img data-id="1" className={classNames('footer-img')} src={item.ishand ? handaIconSvg : handIconSvg} style={{ marginRight: '24px' }} />
                <img data-id="2" className={classNames('footer-img')} src={item.isverhand ? verhandaIconSvg : verhandIconSvg} />
              </View>
            </View>
          </View>
        }
      </View>
    </>
  )
}
export default Index