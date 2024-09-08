import { ICard } from "../types";
import { CDN_URL } from "../utils/constants";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export class Card extends Component<ICard> {

    protected events: IEvents;

    protected _id: HTMLElement;
    protected _image: HTMLImageElement;
    protected _title: HTMLElement;
    protected _category: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container); 

        this.events = events;
        
        this._image = this.container.querySelector('.card__image');
        this._title = ensureElement<HTMLElement>('.card__title', this.container);

        
    
    }
    
    render(cardsData: Partial<ICard> | undefined) { 
        const { ...otherCardsData } = cardsData;
        Object.assign(this, otherCardsData); 
        return this.container;
    }

    set id(value) {
        this._id = value;
        console.log(this._id);
        
    };

    get id() { 
        return this._id;
     } 

    set image(value: string) {
        this._image.src = CDN_URL + value;   
    }

    set title(value: string) {
        this._title.textContent = value;
    }
}
