import { request } from '@/utils/request';

// 展示所有兴趣标签
export function categoryList() {
  return request({
    method: 'GET',
    url: '/category/list',
  })
}
