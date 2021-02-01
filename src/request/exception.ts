import * as API from '@/utils/axios';
import { MOCK, BOX } from './type';

export function getExceptionList (params?:object)  {
  return API.POST(`${BOX}/exception/exceptionPageList`, params)
}

export function getExceptionCensus (params?:object)  {
  return API.POST(`${BOX}/exception/exceptionStatistics`, params)
}

export function updateEvent (params?:object)  {
  return API.POST(`${BOX}/exception/dealException`, params)
}

export function deleteEvent (params?:object)  {
  return API.POST(`${BOX}/exception/deleteException`, params)
}

export function reloadEventVideo (params?:object)  {
  return API.POST(`${BOX}/exception/reloadEventVideo`, params)
}

export function getExceptionDetail (params:object)  {
  return API.POST(`${BOX}/exception/exceptionDetail`, params)
}