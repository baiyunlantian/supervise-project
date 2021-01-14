import * as API from '@/utils/axios';
import { MOCK, BOX } from './type';

export function getExceptionList (params?:object)  {
  return API.POST(`${BOX}/event/eventSelect`, params)
}

export function getExceptionCensus (params?:object)  {
  return API.POST(`${BOX}/event/eventCensus`, params)
}

export function updateEvent (params?:object)  {
  return API.POST(`${BOX}/event/eventUpdate`, params)
}

export function deleteEvent (params?:object)  {
  return API.POST(`${BOX}/event/eventDelete`, params)
}