import type { AxiosResponse } from 'axios';
import { message as Message } from 'antd';
import type { IAxiosRequestConfig } from './types';
import { getToken, removeToken } from '../../utils/token';


/** 生成 request 默认请求头 */
export function generateRequestHeaders() {
    const headers: Record<string, unknown> = {};
    const token = getToken();
    if (token) {
      headers.Authorization = token;
    }
    return headers;
  }

  export const getNotNeedAuthConfig = () => ({ notNeedAuth: true } as IAxiosRequestConfig);
  export const getCustomErrorConfig = () => ({ autoHandleError: false } as IAxiosRequestConfig);

  /** 生成公共请默认参数 */
export const generateRequestDefaultParams = () => {
    const params: Record<string, unknown> = {};
  
    return params;
  };

/** handleError automatically */
export const autoErrorHandler = (response: AxiosResponse) => {
    // 是否需要自动处理错误
    const { autoHandleError } = (response ? response.config : {}) as IAxiosRequestConfig;
    const { data, status } = response;
  
    if (autoHandleError) {
      if ([401, 403].includes(status)) {
        removeToken();
        // removeUserInfo()
        location.href = '/loginIn';
        return;
      }
  
      // 接口处理时，出现业务异常
      if (![200].includes(data.code)) {
        Message.error(data.message);
      }
    }
  
    throw data;
  };