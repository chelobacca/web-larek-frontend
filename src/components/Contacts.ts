import { IContactsForm } from '../types';
import { IEvents } from './base/events';
import { Form } from './common/Form';

//окно с номером телефона и почтой
export class Contacts extends Form<IContactsForm> {
  
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}
