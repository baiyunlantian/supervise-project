import * as API from '@/utils/axios';
import { PERSON } from './type';


export function addPerson (params?:object)  {
  return API.fetchCommon(`${PERSON}/person/personAdd`, params);
}

export function updatePerson (params:object)  {
  return API.fetchCommon(`${PERSON}/person/personUpdate`, params);
}

export function deletePerson (params?:object)  {
  return API.POST(`${PERSON}/person/personDelete`, params)
}

export function createBatchImportPersonExcel (params?:object)  {
  return API.POST(`${PERSON}/person/personExcelBuild`, params)
}

export function batchImportPerson (params?:object)  {
  return API.POST(`${PERSON}/person/personBatchInsert`, params)
}
