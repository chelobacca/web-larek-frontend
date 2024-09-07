import './scss/styles.scss';
import { IApi } from './types';
import { Api } from './components/base/api';
import { AppApi } from './components/AppApi';
import { CDN_URL, API_URL, settings } from './utils/constants';
import { EventEmitter } from './components/base/events';

const events = new EventEmitter();
const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);

//получение карточек с сервера
const promise = api.getProducts();

promise
  .then((data) => {
    // productData.products = data.items;
    console.log(data.items);
    console.log(data);
    events.emit('products:loaded');
  })
  .catch((err) => {
    console.error(err);
  });



  //TEST RENDER
  // const testSection = document.querySelector('.gallery')

  // const card = new Card(cardTemplate, events);



  