import * as API from '@/utils/axios';
import { MOCK } from './type';


export function getDepartmentTreeList (params?:object)  {
  return API.POST(`${MOCK}/depart/departSelectList`, params)
}

export function updateDepart (params?:object)  {
  return API.POST(`${MOCK}/depart/departUpdate`, params)
}

export function addDepart (params?:object)  {
  return API.POST(`${MOCK}/depart/departAdd`, params)
}