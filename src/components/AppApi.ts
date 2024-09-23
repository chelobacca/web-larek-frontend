import { IApi, ICardsList, IOrder, IResponse } from '../types';

export class AppApi {
	private _baseApi: IApi;

	constructor(baseApi: IApi) {
		this._baseApi = baseApi;
	}

	getCardsList(): Promise<ICardsList> {
		return this._baseApi.get<ICardsList>(`/product`)
		.then((result: ICardsList) => result);
	}

	postOrder(orderData: IOrder): Promise<IResponse> {
		return this._baseApi.post<IResponse>('/order', orderData)
		.then((result: IResponse) => result);
	}
}
