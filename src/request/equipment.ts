import * as API from '@/utils/axios';
import { MOCK } from './type';

export function getEquipmentCensus (params?:object)  {
  return API.POST(`${MOCK}/equipment-management/census`, params)
}