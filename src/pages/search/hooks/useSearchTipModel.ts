import { templateQueryByFuzzyName } from '@/api/template';
import { createAsyncEffect, useModel } from '@/hooks/react-store/useModel';

interface IState {
  searchList: string[];
  loading: boolean;
}
interface IEffects {
  fetchData: (name: string) => Promise<any>;
}
export function useSearchTipModel() {
  const searchTipModel = useModel<IState, IEffects>({
    state: {
      searchList: [],
      loading: true,
    },
    effects: {
      fetchData: createAsyncEffect((name: string) => {
        return templateQueryByFuzzyName({
          name,
        }).then(data => {
          return {
            searchList: data || [],
          }
        })
      }, { loadingKey: 'loading' })
    }
  })
  return searchTipModel;
}
