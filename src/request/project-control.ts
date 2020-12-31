import * as API from '@/utils/axios';
import { MOCK } from './type';


export function getPersonDepartmentList (params?:object)  {
  return API.POST(`${MOCK}/project-control/person/departmentList`, params)
}

export function getChildTreeById (params?:object)  {
  return API.POST(`${MOCK}/project-control/person/findDetailByDepartmentId`, params)
}
