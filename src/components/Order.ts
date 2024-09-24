import { Form } from './common/Form';
import { IOrderForm } from '../types';
import { IEvents } from './base/events';

export class Order extends Form<IOrderForm> {
	protected paymentButtons = this.container.querySelectorAll('.button_alt');

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		//переключение кнопок с двумя (или более, если добавятся) вариантами оплаты
		//реализация из проекта "Сложно сосредоточиться"
		this.paymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				this.paymentButtons.forEach((btn) => {
					btn.classList.remove('button_alt-active'); //деактивировать все кнопки
				});

				button.classList.add('button_alt-active'); //активировать выбранную кнопку
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
		this.paymentButtons.forEach((btn) => {
			btn.classList.remove('button_alt-active');
		});
	}
}
