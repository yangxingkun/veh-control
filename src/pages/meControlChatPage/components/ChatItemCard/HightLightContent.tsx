import { View } from '@tarojs/components';
import { useLayoutEffect } from 'react';
import './index.scss';
import Taro from '@tarojs/taro';
const Parse = ({ imgClick, node }) => {
    const hightLightClick = (props) => {
        console.log(props, "点激高亮")
        let { type = 1, templateName, materialCode, templateCode } = props
        Taro.nextTick(() => {
            Taro.navigateTo({
                url: `/pages/tagDetailPage/index?type=1&materialCode=${materialCode}&templateCode=${templateCode}&templateName=${templateName}`,
            });
        })
        // Taro.navigateTo({
        //     url: `/pages/tagDetailPage/index?type=1&materialCode=26cd2b4696e04a1180082509feaf52d7&templateCode=24d0919c4d6d42c682bd0273d0f2af42&templateName=理想L9`,
        //   });
    }
    useLayoutEffect(() => {
        // 修改图片行内默认样式
        (Taro as any).options.html.transformElement = el => {
            // console.log(el, "dom节点--------------4------------")
            if (el.nodeName === 'image') {
                el.setAttribute('mode', 'widthFix');
                //   图片增加点击事件
                el.__handlers.tap = [() => {
                    imgClick(el.props.src)
                }]
            }
            if (el.nodeName == 'text') {
                el.__handlers.tap = [() => {
                    hightLightClick(el.dataset)
                }]
                el.classList.add('hightColor')
                el.props = { ...el.props, selectable: true, userSelect: true };
            }
            //将view标签替换成text标签,则可以添加select属性，实现长按选择
            if (el.tagName === 'VIEW') {
                el.tagName = 'TEXT';
                el.h5tagName = 'span';
                el.nodeName = 'text';
                el.props = { class: "h5-span", selectable: true, userSelect: true };
            }
            return el;
        };
    }, [node]);
    return (
        <View className='parse'>
            <View className='taro_html k_html content' dangerouslySetInnerHTML={{ __html: node}}></View>
            {/* <View className='taro_html k_html content' >
                {node?.props?.children}
            </View> */}
        </View>
    );
};
export default Parse;