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

export function getDepartPersonNum(param:object) {
  return API.fetchCommon(`${ACCOUNT}/assist/departPersonNum`, param);
}

export function getArrangeList(param:object) {
  return API.fetchCommon(`${ACCOUNT}/assist/arrangeList`, param);
}