import { ICard } from '../types';
import { CDN_URL } from '../utils/constants';
import { ensureElement, formatNumber } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

export class Card extends Component<ICard> {
	protected events: IEvents;

	protected _id: string;
	protected _image?: HTMLImageElement;
	protected _title: HTMLElement;
	protected _category?: HTMLElement;
	protected _price: HTMLElement;
	protected _picked?: boolean;
	protected _addButton?: HTMLButtonElement;
	protected _deleteButton?: HTMLButtonElement;
	protected _index: HTMLElement;
	protected _description?: HTMLElement;
	protected _categories = <Record<string, string>>{
		'софт-скил': 'card__category_soft',
		другое: 'card__category_other',
		дополнительное: 'card__category_additional',
		кнопка: 'card__category_button',
		'хард-скил': 'card__category_hard',
	};

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this._image = this.container.querySelector('.card__image');
		this._title = ensureElement<HTMLElement>('.card__title', this.container);
		this._price = ensureElement<HTMLElement>('.card__price', this.container);
		this._category = this.container.querySelector('.card__category');
		this._index = this.container.querySelector('.basket__item-index');
		this._addButton = this.container.querySelector('.button.card__button');
		this._deleteButton = this.container.querySelector('.basket__item-delete');
		this._description = this.container.querySelector('.card__text');
		this._picked = false;

		// слушатель клика по карточке (только если карточка рендерится в галерее)
		if (this.container.classList.contains('gallery__item')) {
			this.container.addEventListener('click', () => this.events.emit('card:select', this));
		}

		//слушатель кнопки добавления в корзину
		if (this._addButton) {
			this._addButton.addEventListener('click', (event) => {
				event.stopPropagation();
				this.events.emit('card:add', this);
			});
		}

		//слушатель кнопки удаления из корзины
		if (this._deleteButton) {
			this._deleteButton.addEventListener('click', (event) => {
				event.stopPropagation();
				this.events.emit('card:delete', this);
			});
		}
	}

	render(cardsData: Partial<ICard> | undefined) {
		const { ...otherCardsData } = cardsData;
		Object.assign(this, otherCardsData);
		return this.container;
	}

	//сеттеры и геттеры
	set id(id) {
		this._id = id;
	}

	get id() {
		return this._id;
	}

	set image(value: string) {
		if (this._image) this._image.src = CDN_URL + value;
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set description(value: string) {
		if (this._description) {
			this.setText(this._description, value);
		}
	}

	set price(value: number | null) {
		if (value !== null) {
			this.setText(this._price, formatNumber(value) + ' синапсов');
		}
		if (value === null) {
			this.setText(this._price, 'Бесценно');
		}
	}

	set category(value: string) {
		if (this._category) {
			this.setText(this._category, value);
			this._category.className = `card__category ${this._categories[value]}`;
		}
	}

	//порядковый номер карточки товара в списке в корзине
	set index(index: number) {
		if (this._index) {
			this.setText(this._index, index);
		}
	}

	//изменение статуса "карточка уже в корзине" и (де)активация кнопки добавления
	set picked(value: boolean) {
		this._picked = value;
		if (this._addButton) {
			this.setDisabled(this._addButton, value);
		}
	}
}
