import { View } from '@tarojs/components';
import classNames from 'classnames';

export default function HTMlView({ content, className }) {
  return (
    <View className={classNames('custom-html',className)} dangerouslySetInnerHTML={{ __html: content }} />
  )
}
