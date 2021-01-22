import * as API from '@/utils/axios';
import { VIDEO, MOCK, BOX } from './type';

export function getFlowCensus (params?:object)  {
  return API.POST(`${BOX}/vis/flowStatistics`, params)
}

export function updateFlowAlert (params?:object)  {
  return API.POST(`${VIDEO}/visflow/updateFlowAlert`, params)
}

export function getFlowAlert (params?:object)  {
  return API.POST(`${VIDEO}/visflow/getFlowAlert`, params)
}

export function deleteFlowAlert (params?:object)  {
  return API.POST(`${VIDEO}/visflow/deleteFlowAlert`, params)
}

export function getCameraStreamControl (params?:object)  {
  return API.POST(`${VIDEO}/camera/cameraStreamControl`, params)
}

export function updateReportVideoConfig (params?:object)  {
  return API.POST(`${BOX}/edgebox/updateUnifyConfig`, params)
}

export function getReportVideoConfig (params?:object)  {
  return API.POST(`${BOX}/edgebox/getUnifyConfig`, params)
}