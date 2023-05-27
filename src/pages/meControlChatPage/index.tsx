import { useState,useRef, useEffect } from 'react';
import { Button, Overlay } from '@nutui/nutui-react-taro';
import './index.scss';
const WrapperStyle = {
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
};
const ContentStyle = {
  display: 'flex',
  width: '150px',
  height: '150px',
  // background: '#fff',
  borderRadius: '8px',
  alignItems: 'center',
  justifyContent: 'center',
};
const Index = () => {
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<any>();
  const handleToggleShow = () => {
    // setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };
  // useEffect(() => {
  //   timerRef.current = setTimeout(() => {
  //     setVisible(false);
  //   }, 3000);
  //   return () => {
  //     clearTimeout(timerRef.current);
  //   }
  // }, [visible])
  return (
    <div className='mechat'>
      <Button type="success" onClick={handleToggleShow}>
        嵌套内容
      </Button>
      <Overlay visible={visible} onClick={onClose} overlayClass={'chat-wapper'} closeOnClickOverlay={false}>
        <div className="chat-wapper-body" style={WrapperStyle}>
          <div className="chat-wapper-content" style={ContentStyle}>
            <img
              className="logo"
              src="http://152.136.205.136:9000/vehicle-control/font/Shape.svg"
            />
            {/* <div className='title'>8099</div> */}
            {/* <img
              className="logo"
              src="http://152.136.205.136:9000/vehicle-control/font/ds.jpeg"
            /> */}
          </div>
        </div>
      </Overlay>
    </div>
  );
};
export default Index;
