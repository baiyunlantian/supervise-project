import * as API from '@/utils/axios';
import { BOX, MOCK } from './type';

export function getCameraList (params?:object)  {
  return API.POST(`${MOCK}/camera/cameraList`, params)
}