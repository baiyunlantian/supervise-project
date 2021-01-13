import {ACCOUNT, PERSON} from './type';
import * as API from "@/utils/axios";

export function getPersonSelectList (param:object)  {
  return API.fetchCommon(`${ACCOUNT}/assist/personList`, param);
}

export function getStationList (param:object)  {
  return API.fetchCommon(`${ACCOUNT}/assist/stationList`, param);
}

export function getDepartSelectList(param:object) {
  return API.fetchCommon(`${ACCOUNT}/assist/departList`, param);
}