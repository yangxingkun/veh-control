//通过邀请码进行校验
import { request } from '@/utils/request';
export function verifyChatCode({ code, user }) {
    return request({
      method: 'POST',
      url: '/gpt/verify_invitation_code',
      data: {
        code,
        user,
      }
    })
  }
export function questionBychat(data) {
    return request({
      method: 'POST',
      url: '/gpt/chat',
      data
    })
  }
export function updateBychat(id,status) {
    return request({
      method: 'POST',
      url: `/gpt/message/update/${id}`,
      data: {
        status,
      }
    })
  }

  