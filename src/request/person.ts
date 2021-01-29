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

export function createBatchImportPersonExcel (params:FormData)  {
  return fetch(`${PERSON}/person/white/personExcelBuild`,
    {
      method: 'post',
      //@ts-ignore
      headers:{
        token: sessionStorage.getItem('token')
      },
      //@ts-ignore
      body: params,
    })
    .then(res => res.blob())
}

export function batchImportPerson (params?:object)  {
  return API.POST(`${PERSON}/person/personBatchInsert`, params)
}
