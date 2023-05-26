import { request } from '@/utils/request';

// 发现列表的分页查询
export function templateSearchPage(
  data: ApiSearchParams<{
    type?: 1 | 2 | 3 | 4;
    templateDesc?: string;
    templateName?: string;
    tag?: 1 | 2;
  }>
) {
  return request({
    method: 'POST',
    url: '/template/searchPage',
    data,
  });
}

// 进入详情需要调用的接口
export function templateQueryByCode(data: {
  type: 1 | 2 | 3 | 4;
  materialCode?: string;
  templateCode: string;
}) {
  return request({
    method: 'POST',
    url: '/template/queryByCode',
    data,
  });
}

// 根据选取的标签进行收藏
export function templateCollectByLabel({ categoryCodes }) {
  return request({
    method: 'POST',
    url: '/template/collectByLabel',
    data: {
      categoryCodes,
    },
  });
}

export function templateCollect({ templateCode }) {
  return request({
    method: 'GET',
    url: '/template/collect',
    data: {
      templateCode,
    },
  });
}

export function templateCancleCollect({ templateCode }) {
  return request({
    method: 'GET',
    url: '/template/cancelCollect',
    data: {
      templateCode,
    },
  });
}

export function templateMy() {
  return request({
    method: 'GET',
    url: '/template/my',
  });
}

export function templateVehicleDynamics({ materialCode }) {
  return request({
    method: 'GET',
    url: '/template/vehicleDynamics',
    data: {
      materialCode,
    },
  });
}

export function templateSearchCurrentUserCollectPage(
  data: ApiSearchParams<{}>
) {
  return request({
    method: 'POST',
    url: '/template/searchCurrentUserCollectPage',
    data,
  });
}

export function templateQueryByFuzzyName({ name }) {
  return request({
    method: 'GET',
    url: '/template/queryByFuzzyName',
    data: {
      name,
    },
  });
}

export function templateDetail({ templateCode }) {
  return request({
    method: 'GET',
    url: '/template/detail',
    data: {
      templateCode,
    },
  });
}
