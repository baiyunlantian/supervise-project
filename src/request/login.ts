import * as API from '@/utils/axios';
import { ACCOUNT } from './type';

export function login (params?:object)  {
    return API.POST(`${ACCOUNT}/login/webLogin`, params)
}

export function logout (params?:object)  {
    return API.POST(`${ACCOUNT}/login/webLogout`, params)
}