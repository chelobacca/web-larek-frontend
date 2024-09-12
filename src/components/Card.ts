import { ICard } from "../types";
import { CDN_URL } from "../utils/constants";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { CategoryType } from "../types";

export class Card extends Component<ICard> {

    protected events: IEvents;

    protected _id: string;
    protected _image?: HTMLImageElement;
    protected _title: HTMLElement;
    protected _category?: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container); 

        this.events = events;
        
        this._image = this.container.querySelector('.card__image');
        this._title = ensureElement<HTMLElement>('.card__title', this.container);
        this._price = ensureElement<HTMLElement>('.card__price', this.container);
        this._category = this.container.querySelector('.card__category');
        
        // слушатель клика по карточке
        this.container.addEventListener('click', () => this.events.emit('card:select', { card: this }));
    }
    
    render(cardsData: Partial<ICard> | undefined) { 
        const { ...otherCardsData } = cardsData;
        Object.assign(this, otherCardsData); 
        return this.container;
    }

    //сеттеры и геттеры
    set id(id) {
        this._id = id;
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
  
    set price(value: string) {
        this._price.textContent = value;
    }

    set category(category: string) {
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
