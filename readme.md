# 框架

基于 [Taro](https://taro-docs.jd.com/docs) 跨端框架，兼容 React 语法

# UI 组件库

[NutUI](https://nutui.jd.com/taro/react/1x/#/zh-CN/guide/intro-react)

# 使用 svg 图标
1. 将 svg 文件放置在 src/svgIcons文件夹中
注意 需要去掉 svg 文件中的 xml 声明标签 (<?xml version="1.0" encoding="UTF-8"?>)

2. 执行命令 npm run icon 生成图标字体  (使用 svgtofont 将 svg 转换为 图标字体)
3. 生成的图标字体文件会放在 src/svgIconFonts 中
4. 在 app.scss 中 引入 @import '~@/assets/svgIconFonts/iconfont.scss';
5. 在页面中使用 <view className="iconfont-xxx"></view> xxx 表示 svg 文件名称

# 图表组件库

基于 [antv/f2](https://f2.antv.antgroup.com/)
为适配 Taro 自己封装了 component/F2 组件来使用图表

使用

```tsx
import F2 from '@/components/F2'
import { Chart, Axis, Line, Area } from '@antv/f2';

// jsx 语法跟官方文档一致， 只不过 子元素需要放到 render 属性中
export default function App() {
  return (
    <F2
      render={
        <Chart
          data={data}
          coord={{
            type: 'polar',
          }}
          scale={{
            value: {
              min: 0,
              max: 5,
              nice: false,
              tickCount: 6,
            },
          }}
        >
          <Axis
            field="value"
            grid="line"
            style={{
              label: {
                strokeOpacity: 0,
                fillOpacity: 0,
              },
              grid: {
                lineDash: null as any,
                strokeStyle: '#3388FF',
              },
            }}
          />
          <Area x="name" y="value" color="#D377CD" />
          <Line x="name" y="value" color="#D377CD" />
        </Chart>
      }
    />
  );
}
```

# nodejs 版本

大于 nodejs v16 建议安装最新的

# 开发

```bash
npm i # 安装依赖 or yarn
npm run dev:weapp  # 微信开发

npm run build:weapp # 打包微信小程序
```
