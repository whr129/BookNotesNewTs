import { generateRequestHeaders, generateRequestDefaultParams } from '../utils';

import type { AxiosInstance, AxiosRequestHeaders } from 'axios';
import type { IAxiosRequestConfig } from '../types';
import qs from 'qs';
import { autoErrorHandler } from '../utils';

function isNil(data: unknown) {
    if(data === null || data === undefined) {
        return true;
    } else {
      return false;
    }
}

/** 设置响应拦截器 [默认] */
export function setResponseInterceptor(fetch: AxiosInstance) {
  // 响应处理
  fetch.interceptors.response.use(
    response => {
      // 若响应体 data 中 code 值为非 200 ，则接口处理异常
      if (response.data?.code !== 200) {
        autoErrorHandler(response);
      }
      return isNil(response.data) ? undefined : response.data;
    },
    error => {
      autoErrorHandler(error.response);
      throw error;
    }
  );
}

/** 默认请求拦截器 */
export function setRequestInterceptor(fetch: AxiosInstance) {
  fetch.interceptors.request.use(config => {
    // 默认由拦截器自动处理错误
    if (!Reflect.has(config, 'autoHandleError')) {
      (config as IAxiosRequestConfig).autoHandleError = true;
    }

    const defaultHeaders = generateRequestHeaders();
    const defaultParams = generateRequestDefaultParams();
    const isFormData = config.data instanceof FormData;

    if (defaultParams) {
      config.params = { ...config.params, ...defaultParams };
    }

    //  存在设置头信息时，执行头信息设置
    if (config.headers) {
      const headers = { ...config.headers, ...defaultHeaders };

      for (const key in headers) {
        if (Object.prototype.hasOwnProperty.call(headers, key)) {
          config.headers[key] = headers[key];
        }
      }

      // 默认设置 Content-Type 为 application/json
      if (!config.headers?.['Content-Type']) {
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      }
    }

    if (isFormData) {
      if (!config.headers) {
        config.headers = {} as AxiosRequestHeaders;
      }

      config.headers['Content-Type'] = 'multipart/form-data';
    }

    // 格式化参数
    if (config.method !== 'get' && !isFormData) {
      if (config.headers?.['Content-Type'] !== 'application/json') {
        console.log(config.data);
        config.data = qs.stringify(config.data);
      }
    }
    return config;
  });
}
