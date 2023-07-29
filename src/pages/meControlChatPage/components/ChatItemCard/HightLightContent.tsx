import { View } from '@tarojs/components';
import { useLayoutEffect } from 'react';
import Taro from '@tarojs/taro';
import { query_templatecode } from "@/api/chat"
import './index.scss';

const Parse = ({ node }) => {
    const hightLightClick = (props) => {
        console.log(props, "点激高亮")
        let {  templateName, materialCode } = props
        query_templatecode({ code: materialCode }).then(({template_code,type}) => {
            Taro.navigateTo({
                url: `/pages/tagDetailPage/index?type=${type}&materialCode=${materialCode}&templateCode=${template_code}&templateName=${templateName}`,
            });
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
            <View className='taro_html k_html content' dangerouslySetInnerHTML={{ __html: node }}></View>
        </View>
    );
};
export default Parse;