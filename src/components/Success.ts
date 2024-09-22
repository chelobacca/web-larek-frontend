import { ISuccess } from "../types";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";


export class Success extends Component<ISuccess> {
    protected events: IEvents;


    constructor(protected container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
    }
}