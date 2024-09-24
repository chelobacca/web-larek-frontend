export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// интерфейс базового класса Api для запросов на сервер
// методы также используются в другом классе согласно выбранному виду связей - композиции
export interface IApi {
	baseUrl: string;
	get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IAppState {
	basketCards: ICard[];
	basket: string[];
	order: IOrder;
}

// интерфейс карточки товара
export interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	picked: boolean;
	index: number;
}

//интерфейс коллекции товаров (слой данных)
export interface ICardsData {
	cards: ICard[];
	preview: string | null;
}

// интерфейс модели данных заказа
export interface IOrderData {
	payment: string;
	address: string;
	email: string;
	phone: string;
	basketCards: ICard[];
}

// интерфейс заказа, отправляемого на сервер
export interface IOrder extends IOrderForm {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
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

export interface IContactsForm {
	phone: string;
	email: string;
}

export interface IOrderForm {
	payment: string;
	address: string;
	email: string;
	phone: string;
}

export interface IResponse {
	id: string;
	total: number;
}

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

export interface ISuccess {
	totalCost: number;
}
