import { ICard, ICardsData } from "../types";
import { IEvents } from "./base/events";

export class CardsData implements ICardsData {
    protected _cards: ICard[];
    protected _preview: string | null;
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
     }

    set cards(cards:ICard[]) {
        this._cards = cards;
        this.events.emit('cards:changed')
    }

    get cards () {
        return this._cards;
    }

    set preview(cardId: string | null) {
        this._preview = cardId;
        this.events.emit('card:select')
    }

    get preview () {
        return this._preview;
    }

    getCard(cardId: string) {
        return this._cards.find((item) => item.id === cardId)
    }

    getCards() {
        return this._cards;
      }
}

