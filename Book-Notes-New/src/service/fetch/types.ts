import type { AxiosRequestConfig } from 'axios';

export interface IAxiosRequestConfig<T = any> extends AxiosRequestConfig<T> {
  /** handle error */
  autoHandleError?: boolean;
  /** API which doesn't need Auth */
  notNeedAuth?: boolean;
}

export interface IBaseResponseData<T = any> {
  data: T;
}
