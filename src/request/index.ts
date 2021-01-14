import * as API from '@/utils/axios';
import { MOCK, BOX } from './type';

export function getFlowCensus (params?:object)  {
  return API.POST(`${MOCK}/index/flowCensus`, params)
}

export function getTerminalTree ()  {
  return API.POST(`${BOX}/edgebox/boxList`, {pageSize:99,pageNum:1})
}

export function getTerminalChildTree (params?:object)  {
  return API.POST(`${MOCK}/index/terminalChildTree`, params)
}