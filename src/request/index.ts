import * as API from '@/utils/axios';
import { MOCK } from './type';

export function getCompanyInfo (params?:object)  {
  return API.POST(`${MOCK}/index/companyInfo`, params)
}

export function getProjectCensus (params?:object)  {
  return API.POST(`${MOCK}/index/projectCensus`, params)
}

export function getProjectProgressList (params?:object)  {
  return API.POST(`${MOCK}/index/projectProgressList`, params)
}

export function getProjectDetail (params?:object)  {
  return API.POST(`${MOCK}/index/projectDetail`, params)
}

export function getAssetsCensus (params?:object)  {
  return API.POST(`${MOCK}/index/assetsCensus`, params)
}

export function getEquipmentCensus (params?:object)  {
  return API.POST(`${MOCK}/index/equipmentCensus`, params)
}

export function getMissionList (params?:object)  {
  return API.POST(`${MOCK}/index/missionList`, params)
}