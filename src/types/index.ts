export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// интерфейс базового класса Api для запросов на сервер
// методы также используются в другом классе согласно выбранному виду связей - композиции
export interface IApi {
    baseUrl: string;
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// интерфейс карточки товара
export interface ICard {
	id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

//интерфейс коллекции товаров (слой данных)
export interface ICardsData {
    cards: ICard[];
    preview: string | null;
}

//интерфейс корзины
export interface IBasketData {
    basketCards: ICard[];
    

}

// интерфейс заказа
export interface IOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number
    items: ICard[];
}    

// интерфейс ответа сервера при отправке заказа
export interface IOrderResponse {
    id: string;
    total: number;
  }

// интерфейс списка товаров, получаемых с сервера
export interface ICardsList {
    total: number; 
    items: ICard[];
}

export type CategoryType =
  | 'другое'
  | 'софт-скил'
  | 'дополнительное'
  | 'кнопка'
  | 'хард-скил';
  


  