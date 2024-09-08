import './scss/styles.scss';
import { IApi } from './types';
import { Api } from './components/base/api';
import { AppApi } from './components/AppApi';
import { CDN_URL, API_URL, settings } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { Card } from './components/Card';
import { CardsData } from './components/CardsData';
import { cloneTemplate, ensureElement } from './utils/utils';
import { CardsContainer } from './components/CardsContainer';

const events = new EventEmitter(); //брокер событий
const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(baseApi); 
const cardsData = new CardsData(events); //класс данных для хранения коллекции карточек

//все шаблоны
const gallery = new CardsContainer(ensureElement<HTMLTemplateElement>('.gallery'), events); //галерея карточек
const cardCatalogTemplate: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#card-catalog'); // шаблон карточки в галерее




//загрузка карточек с сервера
api.getCardsList()
  .then((data) => {
    cardsData.cards = data.items;
    events.emit('cards:loaded');
    // console.log(cardsData.cards);
    
  })
  .catch((err) => {
    console.error(err);
  });

//отрисовка каталога товаров на главной странице
  events.on('cards:loaded', () => {
 
    const cardsArray = cardsData.cards.map((card) => {
      const cardInstant = new Card(cloneTemplate(cardCatalogTemplate), events);
      return cardInstant.render(card);
    });

    gallery.render({ catalog: cardsArray });
  });
 









  