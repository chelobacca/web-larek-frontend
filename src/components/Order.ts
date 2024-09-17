import {Form} from "./common/Form";
import {IOrderForm} from "../types";
import {EventEmitter, IEvents} from "./base/events";
import {ensureElement} from "../utils/utils";

export class Order extends Form<IOrderForm> {
    protected _card: HTMLButtonElement;
    protected _cash: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._card = container.elements.namedItem('online') as HTMLButtonElement;
        this._cash = container.elements.namedItem('cash') as HTMLButtonElement;
    }

    

    // set address(value: string) {
    //     (this.container.elements.namedItem('online') as HTMLInputElement).value = value;
    // }

    // set payment(value: string) {
    //     (this.container.elements.namedItem('cash') as HTMLInputElement).value = value;
    // }
}
