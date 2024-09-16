import { IBasketData, ICard } from '../types';

export class BasketData implements IBasketData {
	protected _basketCards: ICard[]; // массив карточек в корзине

	constructor() {
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
}

