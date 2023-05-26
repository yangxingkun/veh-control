import { useModel } from '@/hooks/react-store/useModel';
import Taro from '@tarojs/taro';
import { ReactNode, useRef } from 'react';
import './index.scss';

interface IState {
  scrollX: number;
  scrollY: number;
  duration: number;
  bezier: string;
}
interface IProps {
  children?: ReactNode;
  scroll?: 'x' | 'y';
}
let id = 0;
const momentumTimeThreshold = 300;
const momentumThreshold = 15;
const ScrollContainer = ({ children, scroll = 'x' }: IProps) => {
  const model = useModel<IState>({
    state: {
      scrollX: 0,
      scrollY: 0,
      duration: 0,
      bezier: 'linear',
    },
  });
  const idRefs = useRef<any>();
  if (!idRefs.current) {
    const idNum = ++id;
    idRefs.current = {
      containerId: `scroll-container-${idNum}`,
      wrapperId: `scroll-container-wrapper-${idNum}`,
    };
  }
  const { scrollX, scrollY, duration, bezier } = model.useGetState();
  const onStartPointRef = useRef<any>({});
  const onTouchStart = (e) => {
    const touch = e.changedTouches[0];
    if (!touch) return;
    Taro.createSelectorQuery()
      .selectAll(`#${idRefs.current.containerId}, #${idRefs.current.wrapperId}`)
      .boundingClientRect((res) => {
        const containerRect = res[0];
        const wrapperRect = res[1];
        const { scrollX: startX, scrollY: startY } = model.getState();
        model.setState({
          duration: 0,
        });
        onStartPointRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          startX,
          startY,
          isTouch: true,
          lock: '',
          maxScrollX: 0,
          maxScrollY: 0,
          minScrollX: containerRect.width - wrapperRect.width,
          minScrollY: containerRect.height - wrapperRect.height,
          startTime: new Date().getTime(),
          momentumStartX: startX,
          containerRect,
          wrapperRect,
        };
      })
      .exec();
  };
  const onTouchMove = (e) => {
    const touch = e.changedTouches[0];
    if (!touch) return;
    if (!onStartPointRef.current.isTouch) return;
    const dx = touch.clientX - onStartPointRef.current.x;
    const dy = touch.clientY - onStartPointRef.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    if (absDx < 5 && absDy < 5) return;
    const scrollDir = absDx >= absDy ? 'x' : 'y';
    if (!onStartPointRef.current.lock) {
      onStartPointRef.current.lock = scrollDir;
    }
    if (scroll === onStartPointRef.current.lock) {
      e.preventDefault();
      const { startX, startY, minScrollX, maxScrollX, startTime } =
        onStartPointRef.current;
      let scrollX = startX + dx;
      if (scrollX < minScrollX || scrollX > maxScrollX) {
        if (scrollX < minScrollX) {
          scrollX = Math.round(minScrollX + (scrollX - minScrollX) / 3);
        } else {
          scrollX = Math.round(maxScrollX + (scrollX - maxScrollX) / 3);
        }
      }
      let scrollY = startY + dy;
      const now = new Date().getTime();
      // 记录在触发惯性滑动条件下的偏移值和时间
      if (now - startTime > momentumTimeThreshold) {
        onStartPointRef.current.momentumStartX = scrollX;
        onStartPointRef.current.startTime = now;
      }
      model.setState({
        scrollX: scrollX,
        scrollY: scrollY,
      });
    }
  };
  const isNeedReset = () => {
    const { scrollX } = model.getState();
    let offsetX;
    const { minScrollX, maxScrollX } = onStartPointRef.current;
    if (scrollX < minScrollX) {
      offsetX = minScrollX;
    } else if (scrollX > maxScrollX) {
      offsetX = maxScrollX;
    }
    if (typeof offsetX !== 'undefined') {
      model.setState({
        duration: 500,
        scrollX: offsetX,
        bezier: 'cubic-bezier(.165, .84, .44, 1)',
      });
      return true;
    }
    return false;
  };
  const momentum = (current, start, duration) => {
    const { containerRect, minScrollX, maxScrollX } = onStartPointRef.current;
    const durationMap = {
      noBounce: 2500,
      weekBounce: 800,
      strongBounce: 400,
    };
    const bezierMap = {
      noBounce: 'cubic-bezier(.17, .89, .45, 1)',
      weekBounce: 'cubic-bezier(.25, .46, .45, .94)',
      strongBounce: 'cubic-bezier(.25, .46, .45, .94)',
    };
    let type = 'noBounce';
    // 惯性滑动加速度
    const deceleration = 0.003;
    // 回弹阻力
    const bounceRate = 10;
    // 强弱回弹的分割值
    const bounceThreshold = 300;
    // 回弹的最大限度
    const maxOverflowY = containerRect.height / 6;
    let overflowY;

    const distance = current - start;
    const speed = (2 * Math.abs(distance)) / duration;
    let destination =
      current + (speed / deceleration) * (distance < 0 ? -1 : 1);
    if (destination < minScrollX) {
      overflowY = minScrollX - destination;
      type = overflowY > bounceThreshold ? 'strongBounce' : 'weekBounce';
      destination = Math.max(
        minScrollX - maxOverflowY,
        minScrollX - overflowY / bounceRate
      );
    } else if (destination > maxScrollX) {
      overflowY = destination - maxScrollX;
      type = overflowY > bounceThreshold ? 'strongBounce' : 'weekBounce';
      destination = Math.min(
        maxScrollX + maxOverflowY,
        maxScrollX + overflowY / bounceRate
      );
    }

    return {
      destination,
      duration: durationMap[type],
      bezier: bezierMap[type],
    };
  };
  const onTouchEnd = () => {
    if (isNeedReset()) return;
    const currentState = model.getState();
    const { momentumStartX, startTime } = onStartPointRef.current;
    const absDeltaY = Math.abs(currentState.scrollX - momentumStartX);
    const duration = new Date().getTime() - startTime;
    // 启动惯性滑动
    if (duration < momentumTimeThreshold && absDeltaY > momentumThreshold) {
      const momentumValue = momentum(
        currentState.scrollX,
        momentumStartX,
        duration
      );
      currentState.scrollX = Math.round(momentumValue.destination);
      model.setState({
        duration: momentumValue.duration,
        bezier: momentumValue.bezier,
      });
    }
    onStartPointRef.current.isTouch = false;
    onStartPointRef.current.lock = '';
  };
  const translate = {
    x: scroll === 'x' ? scrollX : 0,
    y: scroll === 'y' ? scrollY : 0,
  };
  return (
    <div
      id={idRefs.current.containerId}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="carControl-scroll-container"
    >
      <div
        id={idRefs.current.wrapperId}
        onTransitionEnd={isNeedReset}
        style={{
          transform: `translate3d(${translate.x}px, ${translate.y}px, 0)`,
          transitionDuration: `${duration}ms`,
          transitionTimingFunction: bezier,
        }}
        className="carControl-scroll-wrapper"
      >
        {children}
      </div>
    </div>
  );
};

export default ScrollContainer;
