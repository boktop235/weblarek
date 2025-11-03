import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export class Success extends Component<any> {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected actions: any) {
        super(container);
        this._description = ensureElement<HTMLElement>('.order-success__description', container);
        this._button = ensureElement<HTMLButtonElement>('.order-success__close', container);
        
        this.setupEventListeners();
    }

    set total(value: number) {
        this._description.textContent = `Списано ${value} синапсов`;
    }

    private setupEventListeners(): void {
        this._button.addEventListener('click', () => {
            if (this.actions.onClose) {
                this.actions.onClose();
            }
        });
    }

    render(data?: any): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}