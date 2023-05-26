import { request } from '@/utils/request';

export function userUpdate({ userName, userCode, icon, userDesc, phone, code }) {
  return request({
    method: 'POST',
    url: '/user/update',
    data: {
      userName,
      userCode,
      icon,
      userDesc,
      phone,
      code,
    }
  })
}
