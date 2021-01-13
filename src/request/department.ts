import * as API from '@/utils/axios';
import { PERSON, ACCOUNT } from './type';


export function getDepartmentTreeList (params?:object)  {
  return API.POST(`${PERSON}/depart/departSelectList`, params)
}

export function updateDepart (params?:object)  {
  return API.POST(`${PERSON}/depart/departUpdate`, params)
}

export function addDepart (params?:object)  {
  return API.POST(`${PERSON}/depart/departAdd`, params)
}

export function deleteDepart (params?:object)  {
  return API.POST(`${PERSON}/depart/departDelete`, params)
}

export function addStation (params?:object)  {
  return API.POST(`${PERSON}/depart/stationAdd`, params)
}

export function updateStation (params?:object)  {
  return API.POST(`${PERSON}/depart/stationUpdate`, params)
}

export function deleteStation (params?:object)  {
  return API.POST(`${PERSON}/depart/stationDelete`, params)
}
