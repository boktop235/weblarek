import { Card } from './Card';
import { ensureElement } from '../../utils/utils';

export class CardBasket extends Card<any> {
    protected _index: HTMLElement;
    protected _deleteButton: HTMLButtonElement;
    protected _id!: string; 

    constructor(container: HTMLElement, protected events: any) {
        super(container);
        this._index = ensureElement<HTMLElement>('.basket__item-index', container);
        this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
        
        this.setupEventListeners();
    }

    render(data: any): HTMLElement {
        this._id = data.id; 
        return super.render(data);
    }

    set index(value: number) {
        this._index.textContent = value.toString();
    }

    private setupEventListeners(): void {
        this._deleteButton.addEventListener('click', (event) => {
            event.stopPropagation(); 
            
            
            if (this._id) {
                this.events.emit('card:remove-product', this._id);
            }
        });
    }
}