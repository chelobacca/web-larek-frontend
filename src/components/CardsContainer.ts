import { Component } from './base/Component';
import { IEvents } from './base/events';

interface ICardsContainer {
	catalog: HTMLElement[];
}

export class CardsContainer extends Component<ICardsContainer> {
	protected _catalog: HTMLElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);
		this.events = events;
	}

	set catalog(items: HTMLElement[]) {
		this.container.replaceChildren(...items);
	}
}
