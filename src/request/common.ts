import {ACCOUNT, PERSON} from './type';
import * as API from "@/utils/axios";
let formData = new FormData();
formData.append('companyCode', sessionStorage.getItem('companyCode') || '');

export function getPersonSelectList ()  {
  return API.fetchCommon(`${ACCOUNT}/assist/personList`, formData);
}

export function getStationList ()  {
  return API.fetchCommon(`${ACCOUNT}/assist/stationList`, formData);
}

export function getDepartSelectList() {
  return API.fetchCommon(`${ACCOUNT}/assist/departList`, formData);
}

export function getDepartPersonNum() {
  return API.fetchCommon(`${ACCOUNT}/assist/departPersonNum`, formData);
}

export function getArrangeList() {
  return API.fetchCommon(`${ACCOUNT}/assist/arrangeList`, formData);
}