import * as API from '@/utils/axios';
import { VIDEO } from './type';

export function getFlowCensus (params?:object)  {
  return API.POST(`${VIDEO}/visflow/flowStatistics`, params)
}