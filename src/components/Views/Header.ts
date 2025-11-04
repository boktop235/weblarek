import { Component } from '../base/Component';

export class Header extends Component<any> {
    protected _counter: HTMLElement | null = null;
    protected _basket: HTMLButtonElement | null = null;

    constructor(container: HTMLElement, protected events: any) {
        super(container);
        
        setTimeout(() => {
            this.initialize();
        }, 0);
    }

    private initialize(): void {
        try {
            this._counter = this.container.querySelector('.header__basket-counter'); 
            this._basket = this.container.querySelector('.header__basket'); 
            
            if (this._basket) {
                this._basket.addEventListener('click', () => {
                    this.events.emit('cart:open');
                });
            } else {
                console.warn('Header cart button not found');
            }
        } catch (error) {
            console.warn('Header initialization error:', error);
        }
    }

    set counter(value: number) {
        if (this._counter) {
            this._counter.textContent = value.toString();
        }
    }

    render(data?: any): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}