import * as API from '@/utils/axios';
import {BOX, MOCK} from './type';

export function getEquipmentCensus (params?:object)  {
  return API.POST(`${BOX}/edgebox/boxStatistics`, params)
}

export function updateEquipment (params?:object)  {
  return API.POST(`${BOX}/edgebox/update`, params)
}

export function deleteEquipment (params?:object)  {
  return API.POST(`${BOX}/edgebox/unbind`, params)
}

export function getVoiceInfo (params?:object)  {
  return API.POST(`${BOX}/edgebox/voiceConfig`, params)
}

export function updateVoiceInfo (params?:object)  {
  return API.POST(`${BOX}/edgebox/updateVoiceConfig`, params)
}

export function getCameraList (params?:object)  {
  return API.POST(`${MOCK}/camera/cameraList`, params)
}

export function getBoxList (params?:object)  {
  return API.POST(`${MOCK}/edgebox/boxList`, params)
}

export function getDeviceRunningCensus (params?:object)  {
  return API.POST(`${BOX}/edgebox/deviceOrArrangeRunningStatistics`, params)
}