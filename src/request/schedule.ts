import * as API from '@/utils/axios';
import { MOCK, PERSON } from './type';

export function getWarningCensus (params?:object)  {
  return API.POST(`${MOCK}/schedule-management/reporter/infoCensus`, params)
}

export function getWarningSelectList (params?:object)  {
  return API.POST(`${PERSON}/schedule-management/reporter/warningList`, params)
}

export function updateSchedule (params?:object)  {
  return API.POST(`${PERSON}/arrange/arrangeUpdate`, params)
}

export function addSchedule (params?:object)  {
  return API.POST(`${PERSON}/arrange/arrangeAdd`, params)
}

export function batchDeleteSchedule (params?:object)  {
  return API.POST(`${PERSON}/arrange/arrangeDelete`, params)
}

export function getScheduleDetail (params?:object)  {
  return API.POST(`${PERSON}/arrange/arrangeDetail`, params)
}

export function getArrangeReportExceptionCensus (params?:object)  {
  return API.POST(`${MOCK}/arrange/arrangeReportExceptionCensus`, params)
}

export function getPersonSelectList ()  {
  return fetch(`${PERSON}/assist/personList`,
    {
      method: 'post',
      //@ts-ignore
      headers:{
        webToken: sessionStorage.getItem('token')
      },
      body: {
        //@ts-ignore
        companyCode:sessionStorage.getItem('companyCode')
      },
    }).then(res => res);
}