import * as API from '@/utils/axios';
import { MOCK } from './type';

export function getProjectInfo (params?:object)  {
  return API.POST(`${MOCK}/project-control/projectInfo`, params)
}

export function getTodayMission (params?:object)  {
  return API.POST(`${MOCK}/project-control/todayMission`, params)
}

export function getExceptionEventCensus (params?:object)  {
  return API.POST(`${MOCK}/project-control/exceptionEventCensus`, params)
}

export function getExceptionEventList (params?:object)  {
  return API.POST(`${MOCK}/project-control/exceptionEventList`, params)
}

export function getStageList (params?:object)  {
  return API.POST(`${MOCK}/project-control/stageList`, params)
}

export function getProjectQuality (params?:object)  {
  return API.POST(`${MOCK}/project-control/projectQuality`, params)
}

export function getMissionList (params?:object)  {
  return API.POST(`${MOCK}/project-control/missionList`, params)
}

export function getTrackingList (params?:object)  {
  return API.POST(`${MOCK}/project-control/trackingList`, params)
}

export function getInAndOutRecordCensus (params?:object)  {
  return API.POST(`${MOCK}/project-control/inAndOut-record/census`, params)
}

export function getVisitorSelectList (params?:object)  {
  return API.POST(`${MOCK}/project-control/visitor/selectList`, params)
}

export function getPersonDepartmentList (params?:object)  {
  return API.POST(`${MOCK}/project-control/person/departmentList`, params)
}

export function getChildTreeById (params?:object)  {
  return API.POST(`${MOCK}/project-control/person/findDetailByDepartmentId`, params)
}

export function getPersonCensus (params?:object)  {
  return API.POST(`${MOCK}/project-control/person/personCensus`, params)
}

export function getNotActivePersonSelectList (params?:object)  {
  return API.POST(`${MOCK}/project-control/person/notActivePersonSelectList`, params)
}

export function findPersonDetailById (params?:object)  {
  return API.POST(`${MOCK}/project-control/person/findPersonDetailById`, params)
}

export function getAssetCensus (params?:object)  {
  return API.POST(`${MOCK}/project-control/asset/assetCensus`, params)
}

export function getUseSituation (params?:object)  {
  return API.POST(`${MOCK}/project-control/asset/useSituation`, params)
}

export function getAssetRatio (params?:object)  {
  return API.POST(`${MOCK}/project-control/asset/assetRatio`, params)
}

export function getAssetCountRatio (params?:object)  {
  return API.POST(`${MOCK}/project-control/asset/assetCountDetailRatio`, params)
}