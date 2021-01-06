import * as API from '@/utils/axios';
import { MOCK } from './type';

export function getWarningCensus (params?:object)  {
  return API.POST(`${MOCK}/schedule-management/reporter/infoCensus`, params)
}

export function getWarningSelectList (params?:object)  {
  return API.POST(`${MOCK}/schedule-management/reporter/warningList`, params)
}

export function updateSchedule (params?:object)  {
  return API.POST(`${MOCK}/arrange/arrangeUpdate`, params)
}

export function addSchedule (params?:object)  {
  return API.POST(`${MOCK}/arrange/arrangeAdd`, params)
}

export function batchDeleteSchedule (params?:object)  {
  return API.POST(`${MOCK}/arrange/arrangeDelete`, params)
}

export function getScheduleDetail (params?:object)  {
  return API.POST(`${MOCK}/arrange/arrangeDetail`, params)
}