import { ICard, IOrderData } from '../types';
import { IEvents } from './base/events';

export class OrderData implements IOrderData {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	_basketCards: ICard[];

	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
		this._basketCards = [];
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

	clearBasketProducts() {
		this.basketCards = [];
	}

	getCounter() {
		return this.basketCards.length;
	}

	getCardIndex(card: ICard): number {
		return this._basketCards.indexOf(card);
	}

	getOrder() {
		return {
			items: this._basketCards.map((product) => product.id),
		};
	}

	getTotalCost() {
        return this.basketCards.reduce((totalcost, card) => totalcost + card.price, 0)
    }
}

