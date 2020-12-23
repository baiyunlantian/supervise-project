import * as API from '@/utils/axios';
import { ACCOUNT } from './type';

export function login (params?:object)  {
    return API.POST(`${ACCOUNT}/doLogin`, params)
}