import { Form } from './common/Form';
import { IOrderForm } from '../types';
import { IEvents } from './base/events';

export class Order extends Form<IOrderForm> {
	protected _card: HTMLButtonElement;
	protected _cash: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._card = container.elements.namedItem('card') as HTMLButtonElement;
		this._cash = container.elements.namedItem('cash') as HTMLButtonElement;

		this._cash.addEventListener('click', () => {
			this._cash.classList.add('button_alt-active');
			this._card.classList.remove('button_alt-active');
			this.onInputChange('payment', 'cash');
		});

		this._card.addEventListener('click', () => {
			this._card.classList.add('button_alt-active');
			this._cash.classList.remove('button_alt-active');
			this.onInputChange('payment', 'card');
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value = value;
	}

	resetPayment() {
		this._cash.classList.remove('button_alt-active')
		this._card.classList.remove('button_alt-active')
	  }
}
