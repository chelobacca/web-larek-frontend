import { FormErrors, IAppState, ICard, IOrder, IOrderData, IOrderForm } from '../types';
import { IEvents } from './base/events';
import { Model } from './base/Model'

export class AppState extends Model<IAppState> {
	// _payment: string;
	// _address: string;
	// _email: string;
	// _phone: string;
	basketCards: ICard[] = [];

	protected events: IEvents;
	formErrors: FormErrors = {};

	order: IOrder = {
		items: [],
		payment: '',
		total: null,
		address: '',
		email: '',
		phone: '',
	  };	

	// constructor(events: IEvents) {
	// 	this.events = events;
	// 	this._basketCards = [];
	// }

	// set payment (data: string) {
	// 	this._payment = data;
	// }

	// set address (data: string) {
	// 	this._address = data;
	// }

	// set email (data: string) {
	// 	this._email = data;
	// }

	// set phone (data: string) {
	// 	this._phone = data;
	// }

	// set basketCards(data: ICard[]) {
	// 	this._basketCards = data;
	// }

	// get basketCards() {
	// 	return this._basketCards;
	// }

	addСard(data: ICard) {
		this.basketCards.push(data);
	}

	deleteCard(item: ICard) {
		const index = this.basketCards.indexOf(item);
		if (index >= 0) {
			this.basketCards.splice(index, 1);
		}
	}

	clearBasket() {
		this.basketCards = [];
	}

	getCounter() {
		return this.basketCards.length;
	}

	getCardIndex(card: ICard): number {
		return this.basketCards.indexOf(card);
	}

	//суммарная стоимость выбранных товаров
	getTotalCost() {
        return this.basketCards.reduce((totalCost, card) => totalCost + card.price, 0)
    }

	//получить заказ для отправки на сервер
	getOrder() {
		return {
			items: this.basketCards.map((product) => product.id),
			payment: this.order.payment,
			address: this.order.address,
			email: this.order.email,
			phone: this.order.phone,
			total: this.getTotalCost()
		};
	}

	emptyBasket() {
		this.basketCards = [];
	}

	//заполнение свойств и значений в полях заказа при вводе данных в формах
	setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;

        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }

		if (this.validateContacts()) {
            this.events.emit('contacts:ready', this.order);
        }
    }

    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.payment) {
            errors.payment = 'Необходимо указать способ оплаты';
        }
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }
        this.formErrors = errors;
        this.events.emit('orderFormErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }
	
	validateContacts() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать номер телефона';
        }
        this.formErrors = errors;
        this.events.emit('contactsFormErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

}

