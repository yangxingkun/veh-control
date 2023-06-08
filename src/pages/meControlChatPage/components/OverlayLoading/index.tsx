import {  Overlay, Animate } from '@nutui/nutui-react-taro';
const WrapperStyle = {
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
}
interface IProps {
    showLoading: boolean;
  }
const Index = ({ showLoading }:IProps) => {
    return (
        <Overlay visible={showLoading} >
            <div style={WrapperStyle}>
                <Animate type="breath" loop={true}>
                    <img
                        style={
                            {
                                display: 'block',
                                width: '51px',
                                height: '51px'
                            }
                        }
                        src="http://152.136.205.136:9000/vehicle-control/font/Shape.svg"
                    />
                </Animate>
            </div>
        </Overlay>
    )
}
export default Index