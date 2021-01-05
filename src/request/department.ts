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

export function deleteDepart (params?:object)  {
  return API.POST(`${MOCK}/depart/departDelete`, params)
}

export function getStationList (params?:object)  {
  return API.POST(`${MOCK}/depart/stationSelect`, params)
}

export function addStation (params?:object)  {
  return API.POST(`${MOCK}/depart/stationAdd`, params)
}

export function updateStation (params?:object)  {
  return API.POST(`${MOCK}/depart/stationUpdate`, params)
}

export function deleteStation (params?:object)  {
  return API.POST(`${MOCK}/depart/stationDelete`, params)
}