
export interface TemplateListItem {
  id: string;
  templateCode: string;
  templateName: string;
  templateDesc: string;
  materialCode: string;
  type: TemplateType;
  icon: string;
  parentCodes: any[];
  childCodes: any[];
}

export enum TemplateType {
  car = 1,
  part = 2,
  tag = 3,
  user = 4,
}
