import { IEvents } from './base/events';
import { Form } from './common/Form';

export interface IContacts {
  phone: string;
  email: string;
}

//окно с номером телефона и почтой 
export class Contacts extends Form<IContacts> {
  constructor(container: HTMLFormElement, events: IEvents)
   {
    super(container, events);
  }
}
