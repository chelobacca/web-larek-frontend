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
import { Modal } from './components/common/Modal';
import { Page } from './components/Page';
import { Basket } from './components/Basket';
import { BasketData } from './components/BasketData';

const events = new EventEmitter(); //брокер событий
const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);
const cardsData = new CardsData(events); //класс данных для хранения коллекции карточек
const basketData = new BasketData; //класс данных для хранения содержимого корзины

//все шаблоны и контейнеры
const cardCatalogTemplate: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#card-catalog'); //шаблон карточки в галерее
const cardPreviewTemplate: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#card-preview'); //шаблон карточки модальном окне
const cardBasketTemplate: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#card-basket'); //шаблон карточки в корзине
const basketTemplate: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#basket'); //шаблон корзины

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const page = new Page(document.body, events);
const gallery = new CardsContainer(ensureElement<HTMLTemplateElement>('.gallery'), events); //галерея, контейнер, в который выводятся карточки
const basket = new Basket(cloneTemplate(basketTemplate), events);

//слушатель на все события
events.onAll((event) => {
	console.log(event.eventName, event.data);
});

//загрузка карточек с сервера
api
	.getCardsList()
	.then((data) => {
		cardsData.cards = data.items;
		events.emit('cards:loaded');
	})
	.catch((err) => {
		console.error(err);
	});

//отрисовка каталога товаров на главной странице
events.on('cards:loaded', () => {
	const cardsArray = cardsData.cards.map((card) => {
		const cardInstance = new Card(cloneTemplate(cardCatalogTemplate), events);
		return cardInstance.render(card);
	});

	gallery.render({ catalog: cardsArray });
});

//клик по карточке, открытие окна с товаром
events.on('card:select', (data: { card: Card }) => {
	const { card } = data;
	const cardPreview = new Card(cloneTemplate(cardPreviewTemplate), events);
	const cardModalData = cardsData.getCard(card.id);

	modal.render({
		content: cardPreview.render(cardModalData),
	});
});

//клик по тележке, открытие корзины
events.on('cart:open', () => {
	
	
	
	modal.render({
		content: basket.render(),
	});
});

//нажатие кнопки добавления в корзину
events.on('card:add', (data: { card: Card }) => {
	const { card } = data; 
	
	const pickedCard = cardsData.getCard(card.id);

	basketData.addСard(pickedCard); 
	console.log(basketData.basketCards);
  
	modal.close();
	// basketCounter.counter = orderData.getTotal();    
  
  });



// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});

console.log();
