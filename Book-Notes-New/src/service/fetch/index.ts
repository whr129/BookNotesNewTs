import axios from 'axios';
import { setResponseInterceptor, setRequestInterceptor } from './interceptors';

// 默认超时时间
axios.defaults.timeout = 150000;
// 返回其他状态码
axios.defaults.validateStatus = status => status >= 200 && status < 400;

axios.defaults.responseType = 'json';
axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';

export const pureFetch = axios.create({
    baseURL: 'http://localhost:3000',
  },
);
setResponseInterceptor(pureFetch);
setRequestInterceptor(pureFetch);
