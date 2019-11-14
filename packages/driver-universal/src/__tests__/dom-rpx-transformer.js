import { createElement, render } from 'rax';
import DriverUniversalDOM from '../dom';

describe('Transform rpx', () => {
  const CLIENT_WIDTH = 750;

  it('CSS custom properties works.', () => {
    global.DEVICE_WIDTH = CLIENT_WIDTH;

    const container = document.createElement('div');
    render((
      <div style={{
        margin: '75rpx 100vh'
      }} />
    ), container, {
      driver: DriverUniversalDOM
    });

    expect(container.childNodes[0].style.margin).toEqual('10vw 100vh');
  });

  it('should automatically append `rpx` to relevant styles', () => {
    const container = document.createElement('div');
    render((
      <div style={{
        margin: 75
      }} />
    ), container, {
      driver: DriverUniversalDOM
    });

    expect(container.childNodes[0].style.margin).toEqual('10vw');
  });
});
