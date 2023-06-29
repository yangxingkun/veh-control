// utils.tsx

import React, { CSSProperties, ReactNode } from "react";

const regAtom = '^\\$.\\*+-?=!:|\\/()[]{}';

// 关键词高亮
export const highlightText = (
  text: string,
  keywords: string | string[],
  highlightStyle?: CSSProperties,
  ignoreCase?: boolean
): string | [] | ReactNode => {
  let keywordRegExp;
  if (!text) {
    return '';
  }
  // 把字符串类型的关键字转换成正则
  if (keywords) {
    if (keywords instanceof Array) {
      if (keywords.length === 0) {
        return text;
      }
      keywordRegExp = new RegExp(
        (keywords as string[])
          .filter(item => !!item)
          .map(item => (regAtom.includes(item) ? '\\' + item : item))
          .join('|'),
        ignoreCase ? 'ig' : 'g'
      );
    } else if (typeof keywords === 'string') {
      keywordRegExp = new RegExp(keywords, ignoreCase ? 'ig' : 'g');
    }
  }
  if (text && keywordRegExp) {
    const newData = text.split(keywordRegExp); //  通过关键字的位置开始截取，结果为一个数组
    // eslint-disable-next-line
    const matchWords = text.match(keywordRegExp); // 获取匹配的文本
    const len = newData.length;

    return (
      <>
        {newData.map((item, index) => (
        //   eslint-disable-next-line react/no-array-index-key
          <React.Fragment key={index}>
            {item}
            {index !== len - 1 && <mark style={highlightStyle}>{matchWords?.[index]}</mark>}
          </React.Fragment>
        ))}
      </>
    );
  }
  return text;
};

