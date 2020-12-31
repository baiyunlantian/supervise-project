import * as API from '@/utils/axios';
import { MOCK } from './type';

export function getFlowCensus (params?:object)  {
  return API.POST(`${MOCK}/index/flowCensus`, params)
}

export function getTerminalTree (params?:object)  {
  return API.POST(`${MOCK}/index/terminalTree`, params)
}

export function getTerminalChildTree (params?:object)  {
  return API.POST(`${MOCK}/index/terminalChildTree`, params)
}