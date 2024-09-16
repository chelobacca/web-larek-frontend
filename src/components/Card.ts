import { ICard } from '../types';
import { CDN_URL } from '../utils/constants';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';
import { CategoryType } from '../types'; //////////////////////////////////////////////////////
import { cardCatalogTemplate } from '..';

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

		// слушатель клика по карточке (если карточка рендерится в галерее)
        if (this.container.classList.contains('gallery__item')) {
	    this.container.addEventListener('click', () => this.events.emit('card:select', { card: this }));
        };

		//слушатель кнопки добавления в корзину
		if (this._addButton) {
			this._addButton.addEventListener('click', (event) => {
				event.stopPropagation();

				this.events.emit('card:add', { card: this });
			});
		}

		if (this._deleteButton) {
			this._deleteButton.addEventListener('click', (event) => {
				event.stopPropagation();

				this.events.emit('card:delete', { card: this });
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
		this._title.textContent = value;
	}

	set price(value: string) {
		this._price.textContent = value;
	}

	set category(category: string) {
		if (this._category) {
			this._category.textContent = category;
			this.setText(this._category, category);

			switch (category) {
				case 'другое':
					this._category.classList.add('card__category_other');
					break;
				case 'дополнительное':
					this._category.classList.add('card__category_additional');
					break;
				case 'софт-скил':
					this._category.classList.add('card__category_soft');
					break;
				case 'хард-скил':
					this._category.classList.add('card__category_hard');
					break;
				case 'кнопка':
					this._category.classList.add('card__category_button');
					break;
				default:
					break;
			}
		}
	}

	set index(index: number) {
		if (this._index) {
			this.setText(this._index, index);
		}
	}

	//изменение статуса "карточка уже в корзине" и (де)активация кнопки добавления
	set picked(value: boolean) {
		if (this._addButton) {
			this._addButton.disabled = value;
		}
	}
}
