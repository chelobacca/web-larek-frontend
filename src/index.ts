import './scss/styles.scss';
import { IApi, ICard } from './types';
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
// import { BasketData } from './components/BasketData';
import { Order } from './components/Order';
import { OrderData } from './components/OrderData';
import { Contacts } from './components/Contacts';

const events = new EventEmitter(); //брокер событий
const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);
const cardsData = new CardsData(events); //класс данных для хранения коллекции карточек
const orderData = new OrderData(events);

//шаблоны и контейнеры
export const cardCatalogTemplate: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#card-catalog'); //шаблон карточки в галерее
const cardPreviewTemplate: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#card-preview'); //шаблон карточки модальном окне
const cardBasketTemplate: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#card-basket'); //шаблон карточки в корзине
const basketTemplate: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#basket'); //шаблон корзины
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const page = new Page(document.body, events);
const gallery = new CardsContainer(ensureElement<HTMLTemplateElement>('.gallery'), events); //галерея, контейнер, в который выводятся карточки
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

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

//клик по карточке, открывается окно с товаром
events.on('card:select', (data: { card: Card }) => {
	const { card } = data;
	const cardPreview = new Card(cloneTemplate(cardPreviewTemplate), events);
	const cardModalData = cardsData.getCard(card.id);

	modal.render({
		content: cardPreview.render(cardModalData),
	});
});

//клик по тележке в хедере, открывается корзина
events.on('cart:open', () => {
	
	basket.items = orderData.basketCards.map((card, index) => {
		const cardBasket = new Card(cloneTemplate(cardBasketTemplate), events);
		cardBasket.index = index + 1;
		return cardBasket.render(card);
	});

	basket.setTotalCost(orderData.getTotalCost());

	modal.render({
		content: basket.render(),
		
	});
});

//нажатие кнопки добавления в корзину
events.on('card:add', (data: ICard) => {
	const card = data;
	const pickedCard = cardsData.getCard(card.id);

	orderData.addСard(pickedCard);
	pickedCard.picked = true;
	page.counter = orderData.getCounter();
	modal.close();
});

//нажатие кнопки удаления товара из корзины
events.on('card:delete', (data: ICard) => {
	const card = data;
	const cancelledCard = cardsData.getCard(card.id);

	orderData.deleteCard(cancelledCard);
	cancelledCard.picked = false;
	page.counter = orderData.getCounter();

	//заново рендерим корзину после удаления карточки
	events.emit('cart:open');
});

//нажатие кнопки "оформить", открывается окно с адресом и способом оплаты
events.on('order:open', () => {
	modal.render({
		content: order.render({
			address: '',
			valid: true,
			errors: [],
		}),
	});
});

//нажатие кнопки "далее", открывается окно с почтой и телефоном
events.on('order:submit', (data) => {
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: true, //по дефолту должно быть false
			errors: [],
		}),
	});
});

//нажатие кнопки "оплатить", объект с заказом отправляется на сервер
events.on('contacts:submit', () => {
	api.postOrder(testObj).then((result) => {
		console.log(result);
	});
});

// TEST ORDER OBJECT
const testObj = {
	payment: 'online',
	email: 'test@test.ru',
	phone: '+71234567890',
	address: 'Spb Vosstania 1',
	total: 2200,
	items: ['854cef69-976d-4c2a-a18c-2aa45046c390', 'c101ab44-ed99-4a54-990d-47aa2bb4e7d9'],
};

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});


