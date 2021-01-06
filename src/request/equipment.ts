import * as API from '@/utils/axios';
import { MOCK } from './type';

export function getEquipmentCensus (params?:object)  {
  return API.POST(`${MOCK}/equipment-management/census`, params)
}

export function updateEquipment (params?:object)  {
  return API.POST(`${MOCK}/equipment/updateEquipment`, params)
}

export function deleteEquipment (params?:object)  {
  return API.POST(`${MOCK}/equipment/deleteEquipment`, params)
}