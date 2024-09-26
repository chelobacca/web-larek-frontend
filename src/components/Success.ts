import { ISuccess } from '../types';
import { ensureElement, formatNumber } from '../utils/utils';
import { Component } from './base/Component';

interface ISuccessActions {
	onClick: () => void;
}

export class Success extends Component<ISuccess> {
	protected _close: HTMLElement;
	protected _totalCost: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._close = ensureElement<HTMLElement>('.order-success__close', this.container);
		this._totalCost = ensureElement<HTMLElement>('.order-success__description', this.container);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	set totalCost(totalCost: number) {
		this.setText(this._totalCost, 'Cписано ' + formatNumber(totalCost) + ' синапсов');
	}
}
