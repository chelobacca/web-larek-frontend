import './scss/styles.scss';
import { IApi, ICard, IOrderForm } from './types';
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
import { Order } from './components/Order';
import { AppState } from './components/AppData';
import { Contacts } from './components/Contacts';
import { Success } from './components/Success';

const events = new EventEmitter(); //брокер событий
const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);
const cardsData = new CardsData(events); //класс данных для хранения коллекции карточек

// Модель данных приложения
const appData = new AppState({}, events);

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

//клик по карточке, открывается окно с товаром
events.on('card:select', (data: ICard) => {
	const card = data;
	const cardInstance = new Card(cloneTemplate(cardPreviewTemplate), events);
	const viewedCard = cardsData.getCard(card.id);

	modal.render({
		content: cardInstance.render(viewedCard),
	});
});

//клик по тележке в хедере, открывается корзина
events.on('cart:open', () => {
	basket.items = appData.basketCards.map((card, index) => {
		const cardInstance = new Card(cloneTemplate(cardBasketTemplate), events);
		cardInstance.index = index + 1;
		return cardInstance.render(card);
	});
	//(де)активация кнопки "оформить" в зависимости от наличия товаров в корзине
	basket.selected = appData.basketCards; 
	basket.setTotalCost(appData.getTotalCost()); //суммарная стоимость товаров

	modal.render({
		content: basket.render(),
	});
});

//нажатие кнопки добавления в корзину
events.on('card:add', (data: ICard) => {
	const card = data;
	const pickedCard = cardsData.getCard(card.id);

	appData.addСard(pickedCard);
	pickedCard.picked = true; //товар в корзине, кнопка добавления неактивна
	page.counter = appData.getCounter(); //обновление счетчика
	modal.close();
});

//нажатие кнопки удаления товара из корзины
events.on('card:delete', (data: ICard) => {
	const card = data;
	const cancelledCard = cardsData.getCard(card.id);

	appData.deleteCard(cancelledCard);
	cancelledCard.picked = false; //отказались от товара, кнопка активна
	page.counter = appData.getCounter();
	events.emit('cart:open'); //заново рендерим корзину после удаления карточки
});

//нажатие кнопки "оформить", открывается окно с адресом и способом оплаты
events.on('order:open', () => {
	modal.render({
		content: order.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
	order.resetPayment(); //сброс выделения кнопок выбора способа оплаты
	appData.order.payment = ''; //сброс выбранного способа оплаты
});

//нажатие кнопки "далее", открывается окно с почтой и телефоном
events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

//изменилось одно из полей в форме с адресом и способом оплаты
events.on(/^order\..*:change/, (data: { field: keyof IOrderForm; value: string }) => {
	appData.setOrderField(data.field, data.value);
});

//изменилось одно из полей в форме с почтой и телефоном
events.on(/^contacts\..*:change/, (data: { field: keyof IOrderForm; value: string }) => {
	appData.setOrderField(data.field, data.value);
});

// Изменилось состояние валидации формы с адресом и способом оплаты
events.on('orderFormErrors:change', (errors: Partial<IOrderForm>) => {
	const { payment, address } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось состояние валидации формы с почтой и телефоном
events.on('contactsFormErrors:change', (errors: Partial<IOrderForm>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

//нажатие кнопки "оплатить", объект с заказом отправляется на сервер
events.on('contacts:submit', () => {
	api
		.postOrder(appData.getOrder())
		.then((result) => {
			//пришел ответ сервера, открывается модальное окно с сообщением об успешной покупке
			appData.emptyBasket(); //очистка корзины
			page.counter = appData.getCounter(); //обновление счетчика

			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});

			modal.render({
				content: success.render({
					totalCost: result.total,
				}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
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

// Чтобы мониторить все события, для отладки (слушатель на все события)
//для отладки на стадии исправления замечаний ревьюера
// events.onAll((event) => {
// 	console.log(event.eventName, event.data);
// });

