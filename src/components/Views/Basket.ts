import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export class Basket extends Component<any> {
    protected _list: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _price: HTMLElement;

    constructor(container: HTMLElement, protected events: any) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', container); 
        this._price = ensureElement<HTMLElement>('.basket__price', container);
        
        this.setupEventListeners();
    }

    set buttonText(value: string) {
        this._button.textContent = value;
    }

    set buttonDisabled(value: boolean) {
        this._button.disabled = value;
    }

    set basket(items: HTMLElement[]) {
        this._list.innerHTML = '';
        items.forEach(item => {
            this._list.appendChild(item);
        });
    }

    set total(value: number) {
        this._price.textContent = value + ' синапсов';
    }

    private setupEventListeners(): void {
        this._button.addEventListener('click', () => {
            this.events.emit('cart:order');
        });
    }

    render(data?: any): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}