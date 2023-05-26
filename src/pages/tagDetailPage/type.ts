import { useDetailModel } from './hooks/useDetailModel';
import { useTagPopupModel } from './hooks/useTagPopup';

export interface DetailProps {
  detailData: any;
  loading: boolean;
  openTagPopup: () => any;
  tagPopupModel: ReturnType<typeof useTagPopupModel>;
  detailModel: ReturnType<typeof useDetailModel>;
  visible: boolean;
}