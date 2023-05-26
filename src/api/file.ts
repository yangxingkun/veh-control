import { upload } from '@/utils/request';

// 更换头像
export function uploadAvatar({ filePath }) {
  return upload({
    url: '/file/uploadAvatar',
    filePath,
  })
}
