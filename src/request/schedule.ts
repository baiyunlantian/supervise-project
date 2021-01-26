import * as API from '@/utils/axios';
import { MOCK, PERSON } from './type';

export function updateSchedule (params?:object)  {
  return API.POST(`${PERSON}/arrange/arrangeUpdate`, params)
}

export function addSchedule (params?:object)  {
  return API.POST(`${PERSON}/arrange/arrangeAdd`, params)
}

export function batchDeleteSchedule (params?:object)  {
  return API.POST(`${PERSON}/arrange/arrangeDelete`, params)
}

export  function getArrangeReportExceptionCensus (params?:object)  {
  return API.POST(`${PERSON}/arrange/arrangeReportExceptionCensus`, params)
}
