import * as API from '@/utils/axios';
import { MOCK, BOX } from './type';

export function getLatelyList (params?:object)  {
  return API.POST(`${BOX}/event/latelyList`, params)
}