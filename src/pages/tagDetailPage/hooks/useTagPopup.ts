import { templateDetail } from '@/api/template';
import { createAsyncEffect, useModel } from '@/hooks/react-store/useModel';
import { useEffect } from 'react';

interface IState {
  visible: boolean;
  loading: boolean;
  data: any;
}
interface IEffects {
  fetchData: () => Promise<any>;
}
export function useTagPopupModel({ routerParams }) {
  const tagPopupModel = useModel<IState, IEffects>({
    state: {
      visible: false,
      loading: false,
      data: null,
    },
    effects: {
      fetchData: createAsyncEffect(() => {
        return templateDetail({
          templateCode: routerParams.templateCode,
        }).then(data => {
          return {
            data,
          }
        })
      }, { loadingKey: 'loading' })
    }
  });
  useEffect(() => {
    tagPopupModel.getEffect('fetchData')();
  }, [])
  return tagPopupModel;
}
