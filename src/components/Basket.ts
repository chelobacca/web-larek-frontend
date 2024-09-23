import { Component } from './base/Component';
import { cloneTemplate, createElement, ensureElement, formatNumber } from '../utils/utils';
import { EventEmitter } from './base/events';
import { ICard } from '../types';

interface IBasketView {
	items: HTMLElement[];
	total: number;
	selected: string[];
}

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);
		this.events = events;
		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	//проверка наличия товаров корзине для управления состоянием кнопки "оформить"
	set selected(items: ICard[]) {
		if (items.length) {
			this.setDisabled(this._button, false);
		} else {
			this.setDisabled(this._button, true);
		}
	}

	setTotalCost(total: number) {
		this._total.textContent = formatNumber(total) + ' синапсов';
		//проверка на единственный бесценный товар в корзине, который нельзя заказать без других
		if (total === 0) {
			this.setDisabled(this._button, true);
		}
	}
}
