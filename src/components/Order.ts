import { Form } from './common/Form';
import { IOrderForm } from '../types';
import { IEvents } from './base/events';
import { ensureAllElements } from '../utils/utils';

export class Order extends Form<IOrderForm> {
	protected _paymentButtons: HTMLButtonElement[];
	

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._paymentButtons = ensureAllElements<HTMLButtonElement>('.button_alt', container);

		//переключение кнопок с двумя (или более, если добавятся) вариантами оплаты
		this._paymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				 this.resetPayment();//деактивировать все кнопки
				 this.toggleClass(button, 'button_alt-active'); //активировать выбранную кнопку

				const name = button.attributes.getNamedItem('name').value;
				this.onInputChange('payment', name);
			});
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value = value;
	}

	//сброс выделения кнопок выбора способа оплаты
	resetPayment() {
		this._paymentButtons.forEach((btn) => {
			btn.classList.remove('button_alt-active');
		});
	}
}
