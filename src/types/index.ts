// интерфейс карточки товара
export interface IProduct {
	id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

// интерфейс заказа
export interface IOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number
    items: IProduct[];
}    

// интерфейс ответа сервера при отправке заказа
export interface IOrderResponse {
    id: string;
    total: number;
  }

// интерфейс списка товаров  
export interface IProductList {
    total: number; 
    items: IProduct[];
}

