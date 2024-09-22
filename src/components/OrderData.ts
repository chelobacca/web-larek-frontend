import { FormErrors, ICard, IOrder, IOrderData, IOrderForm } from '../types';
import { IEvents } from './base/events';

export class OrderData implements IOrderData {
	_payment: string;
	_address: string;
	_email: string;
	_phone: string;
	_basketCards: ICard[];

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

	constructor(events: IEvents) {
		this.events = events;
		this._basketCards = [];
	}

	set payment (data: string) {
		this._payment = data;
	}

	set address (data: string) {
		this._address = data;
	}

	set email (data: string) {
		this._email = data;
	}

	set phone (data: string) {
		this._phone = data;
	}

	set basketCards(data: ICard[]) {
		this._basketCards = data;
	}

	get basketCards() {
		return this._basketCards;
	}

	addСard(data: ICard) {
		this._basketCards.push(data);
	}

	deleteCard(item: ICard) {
		const index = this._basketCards.indexOf(item);
		if (index >= 0) {
			this._basketCards.splice(index, 1);
		}
	}

	clearBasket() {
		this.basketCards = [];
	}

	getCounter() {
		return this.basketCards.length;
	}

	getCardIndex(card: ICard): number {
		return this._basketCards.indexOf(card);
	}

	//суммарная стоимость выбранных товаров
	getTotalCost() {
        return this.basketCards.reduce((totalCost, card) => totalCost + card.price, 0)
    }

	//получить заказ для отправки на сервер
	getOrder() {
		return {
			items: this._basketCards.map((product) => product.id),
			payment: this._payment,
			address: this._address,
			email: this._email,
			phone: this._phone,
			total: this.getTotalCost()
		};
	}

	//заполнение свойств и значений в полях заказа при вводе данных в формах
	setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;

        // if (this.validateOrder()) {
        //     this.events.emit('order:ready', this.order);
        // }
    }


	validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.payment) {
            errors.payment = 'Необходимо указать email';
        }
        if (!this.order.address) {
            errors.address = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }
}

