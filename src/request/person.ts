import * as API from '@/utils/axios';
import { MOCK } from './type';


export function addPerson (params?:object)  {
  return API.POST(`${MOCK}/person/personAdd`, params)
}

export function updatePerson (params?:object)  {
  return API.POST(`${MOCK}/person/personUpdate`, params)
}

export function deletePerson (params?:object)  {
  return API.POST(`${MOCK}/person/personDelete`, params)
}

export function createBatchImportPersonExcel (params?:object)  {
  return API.POST(`${MOCK}/person/personExcelBuild`, params)
}

export function batchImportPerson (params?:object)  {
  return API.POST(`${MOCK}/person/personBatchInsert`, params)
}
