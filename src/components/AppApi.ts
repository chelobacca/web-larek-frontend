import { Api, ApiListResponse } from "./base/api";
import { IApi, ICard, ICardList } from "../types";

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

	getProducts(): Promise<ICardList> {
		return this._baseApi.get<ICardList>(`/product`).then((result: ICardList) => result);
	}
	
	// postOrder(orderData: IOrderSendData): Promise<IResponse> {
    //     return this._baseApi.post<IResponse>('/order', orderData)
    //         .then((result: IResponse) => result);
    // }
}