
import { Dialog } from '@nutui/nutui-react-taro';
import "./index.scss"
import { View } from '@tarojs/components';
const metionPropmtList = [
    '“我的预算范围是20-30万，日常自己开,有推荐的电动车吗？”',
    '“30万，买比亚迪海豹还是特斯拉Model3? “',
    '“帮我设计一款30万、适合家庭的轿车吧。”',
]

interface IProps {
    showPrompt: boolean;
    [PropName: string]: any
}

const Index = ({ showPrompt, setShowObj }: IProps) => {
    return (
        <Dialog
            className='promptDialog'
            title={<div className='propmtTit'>提问示例</div>}
            visible={showPrompt}
            footerDirection='vertical'
            mask={false}
            noOkBtn={true}
            noCancelBtn={true}
            onCancel={() => setShowObj((pre)=>({...pre,...{showPrompt:false}}))}
        >
            <View className='Propmtlist'>
                {
                    metionPropmtList.map(item => {
                        return (<div key={item} className='propmtBox'>{item}</div>)
                    })
                }

            </View>
        </Dialog>
    )
}
export default Index