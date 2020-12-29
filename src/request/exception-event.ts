import * as API from '@/utils/axios';
import { MOCK } from './type';

export function getLatelyList (params?:object)  {
  return API.POST(`${MOCK}/exception-event/latelyList`, params)
}