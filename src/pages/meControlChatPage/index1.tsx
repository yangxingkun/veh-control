import { useState, useRef, useEffect, useReducer, useCallback } from 'react';
import { Button, Overlay, Animate, Dialog } from '@nutui/nutui-react-taro';
import { View, ScrollView, Text, Textarea } from '@tarojs/components';
import Taro, { getSystemInfoSync, createSelectorQuery } from '@tarojs/taro';
import Transition from '@/components/Transition';
import closeIconSvg from '@/assets/svg/close_icon_circle.svg';
import classNames from 'classnames';
import './index.scss';


let countId = 0;
const Index = () => {
  const _instance = useRef({
    idCount: (countId += 1),
    windowHeight: getSystemInfoSync().windowHeight,
    isScrolling: false,
    pageParams: {
      current: 1,
      size: 10,
    },
    scrollTop: 0,
    // 吸顶头部距离顶部的距离
    stickyHeaderDistanceToTop: 0,
    listWrapperHeights: [],
    observers: [],
    stickyHeaderHeight: -1,
    headerHeight: 0,
    total: 0,
  });

  const scrollViewId = `athena-page-scroll-view-${_instance.current.idCount}`;

  const headerId = `athena-page-scroll-view-header-${_instance.current.idCount}`;

  const stickyHeaderId = `athena-page-scroll-view-stickyHeader-${_instance.current.idCount}`;

  const footerId = `athena-page-scroll-view-footer-${_instance.current.idCount}`;

  const wrapperIdPreFix = `athena-list-wrapper-${_instance.current.idCount}-`;
  const onScrollToUpper = (e) => {
    console.log(e, "ppppp")
  }

  // useEffect(()=> {

  //   Taro.nextTick(()=>{
  //     const query = createSelectorQuery();
  //     // query.select(`#${stickyHeaderId}`).boundingClientRect();
  //     query.select(`#${scrollViewId}`).boundingClientRect();
  //     // query.select(`#${footerId}`).boundingClientRect();
  //     // query.select(`#${headerId}`).boundingClientRect();
  //     query.exec(([scrollViewInfo]) => {
  //       console.log(scrollViewInfo?.top, "-=-=-")
  //   })
  //   }, [])

  useEffect(() => {

    Taro.nextTick(()=>{

      createSelectorQuery().select(`#${scrollViewId}`).boundingClientRect().exec(res => {
        console.log(res)
      })
    })
  }, [])


  // or 使用箭头函数
  // onScrollToUpper = () => {}

  const onScroll = (e) => {
    // console.log(e.detail)
  }
  const scrollStyle = {
    height: '300px'
  }
  const scrollTop = 50
  const Threshold = 20
  const vStyleA = {
    height: '300px',
    backgroundColor: 'rgb(26, 173, 25)'
  }
  const vStyleB = {
    height: '300px',
    backgroundColor: 'rgb(39,130,215)'
  }
  const vStyleC = {
    height: '300px',
    backgroundColor: 'rgb(241,241,241)',
    color: '#333'
  }
  return (
    <ScrollView
      className='scrollview'
      scrollY
      id={scrollViewId}
      scrollWithAnimation
      scrollTop={scrollTop}
      style={scrollStyle}
      lowerThreshold={Threshold}
      upperThreshold={Threshold}
      onScrollToUpper={onScrollToUpper} // 使用箭头函数的时候 可以这样写 `onScrollToUpper={this.onScrollToUpper}`
      onScroll={onScroll}
    >
      <View style={vStyleA}>A</View>
      <View style={vStyleB}>B</View>
      <View style={vStyleC}>C</View>
    </ScrollView>

  )
}
export default Index;
