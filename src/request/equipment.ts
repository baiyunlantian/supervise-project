import * as API from '@/utils/axios';
import { BOX } from './type';

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