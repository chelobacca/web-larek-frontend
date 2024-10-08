import { Component } from './base/Component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export class Page extends Component<IPage> {
	protected _counter: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._basket = ensureElement<HTMLElement>('.header__basket');

		//слушатель клика на тележке
		this._basket.addEventListener('click', () => {
			this.events.emit('cart:open');
		});
	}

	//установка счетчика на тележке
	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	//блокировка прокрутки страницы, используется при открытии модального окна
	set locked(value: boolean) {
			this.toggleClass(this._wrapper, 'page__wrapper_locked');
	}
}
