import * as API from '@/utils/axios';
import { PERSON } from './type';


export function addPerson (params?:object)  {
  return fetch(`${PERSON}/person/personAdd`,
    {
      method: 'post',
      //@ts-ignore
      headers:{
        webToken: sessionStorage.getItem('token')
      },
      //@ts-ignore
      body: params,
    }).then(res => res);
}

export function updatePerson (params?:object)  {
  return fetch(`${PERSON}/person/personUpdate`,
    {
      method: 'post',
      //@ts-ignore
      headers:{
        webToken: sessionStorage.getItem('token')
      },
      //@ts-ignore
      body: params,
    }).then(res => res);
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
