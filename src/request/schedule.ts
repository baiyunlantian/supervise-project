import * as API from '@/utils/axios';
import { MOCK } from './type';

export function getWarningCensus (params?:object)  {
  return API.POST(`${MOCK}/schedule-management/reporter/infoCensus`, params)
}

export function getWarningSelectList (params?:object)  {
  return API.POST(`${MOCK}/schedule-management/reporter/warningList`, params)
}