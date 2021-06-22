/* eslint-disable no-console */
import axios from 'axios';
import admin from './types/admin';
import guest from './types/guest';
import customer from './types/customer';
import { isNumber } from '../utils';
import { ADMIN_TYPE, CUSTOMER_TYPE } from './types';
import {magentoOptions} from '../../config/magento';


const defaultOptions = {
  url: null,
  userAgent: 'ferielbouchoucha',
  home_cms_block_id: '',
  authentication: {
    integration: {
      access_token: undefined,
    },
  },
};

class Magento {
  init(options) {
    this.configuration = { ...defaultOptions, ...options };
    this.base_url = this.configuration.url;
    this.root_path = `rest/${this.configuration.store}`;
    this.admin = admin(this);
    this.guest = guest(this);
    this.customer = customer(this);
    if (this.configuration.authentication.integration.access_token) {
      this.access_token = this.configuration.authentication.integration.access_token;
    } else {
      throw new Error('Need Integration Token');
    }
  }

  post(path, params, data, type = ADMIN_TYPE) {
    return this.send(path, 'POST', params, data, type);
  }

  put(path, params, data, type = ADMIN_TYPE) {
    return this.send(path, 'PUT', params, data, type);
  }

  get(path, params, data, type = ADMIN_TYPE) {
    return this.send(path, 'GET', params, data, type);
  }

  delete(path, params, data, type = ADMIN_TYPE) {
    return this.send(path, 'DELETE', params, data, type);
  }

  send(path, method, params, data, type) {
    const url = `${this.base_url}${this.root_path}${path}`;

    const headers = {
      'User-Agent': this.configuration.userAgent,
      'Content-Type': 'application/json',
    };

    if (this.access_token && type === ADMIN_TYPE) {
      headers.Authorization = `Bearer ${this.access_token}`;
    } else if (this.customerToken && type === CUSTOMER_TYPE) {
      headers.Authorization = `Bearer ${this.customerToken}`;
    }

    return new Promise((resolve, reject) => {
      axios({
        url,
        method,
        headers,
        params,
        data,
      })
        .then(response => {

          resolve(response.data);
        })
        .catch(error => {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            if (error.response.status === 404 && error.response.data == null) {
              reject();
              return;
            }
          } else if (error.request) {
            // The request was made but no response was received
            reject() ;
            throw new Error('No response from the server');
          } else {
            // Something happened in setting up the request that triggered an Error
          }
         let customError;
          if (
            typeof error.response.data === 'object' &&
            error.response.data !== null
          ) {
            customError = Magento.extractErrorMessage(error.response.data);
          } else {
            customError = 'Page not found';
          }
         reject(customError);
        });
    });
  }

  static extractErrorMessage(data) {
    const { parameters } = data;
    let { message } = data;

    if (parameters && Array.isArray(parameters) && parameters.length > 0) {
      parameters.forEach((item, index) => {
        message = message.replace(`%${index + 1}`, item);
      });
    } else if (parameters && parameters instanceof Object) {
      Object.keys(parameters).forEach(parameter => {
        message = message.replace(`%${parameter}`, parameters[parameter]);
      });
    }

    return { message };
  }

  isConfigured() {
    return this.access_token != null;
  }

  setStoreConfig(config) {
    this.storeConfig = config;
   
  }

  setCustomerToken(token) {
    this.customerToken = token;
  }

  getBaseUrl() {
    return this.base_url || '';
  }

  getMediaUrl() {
    return `${this.storeConfig}`;
  }

  getProductMediaUrl() {
   
    return magentoOptions.url +'media/catalog/product';
  }

  getHomeData() {
    if (isNumber(this.configuration.home_cms_block_id)) {
      console.log("homedata",this.configuration)
      return this.admin.getCmsBlock(this.configuration.home_cms_block_id);
    }
    throw homeCmsBlockError;
  }

  isCustomerLogin() {
    if (this.customerToken) {
      return true;
    }
    return false;
  }
}

// Constants
export const CUSTOMER_TOKEN = 'customerToken';
export const CURRENCY_CODE = 'currencyCode';

export const magento = new Magento();
