import { Api, ApiListResponse } from "./base/api";
import { IApi, ICard, ICardsList } from "../types";

// interface IAppAPI {
// 	getProducts: () => Promise<ICard[]>;
// 	getProduct: (id: string) => Promise<ICard>;
// 	createOrder: (invoice: TOrderInvoice) => Promise<IOrderResult>;
// }

export class AppApi {
    private _baseApi: IApi;

    constructor(baseApi: IApi) {
		this._baseApi = baseApi;
	}

	getCardsList(): Promise<ICardsList> {
		return this._baseApi.get<ICardsList>(`/product`).then((result: ICardsList) => result);
	}
	
	// postOrder(orderData: IOrderSendData): Promise<IResponse> {
    //     return this._baseApi.post<IResponse>('/order', orderData)
    //         .then((result: IResponse) => result);
    // }
}