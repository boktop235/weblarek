import { Card } from './Card';
import { ensureElement } from '../../utils/utils';

export class CardPreview extends Card<any> {
    protected _image: HTMLImageElement; 
    protected _category: HTMLElement;
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _inCart: boolean = false;
    protected _id!: string;

    constructor(container: HTMLElement, protected events: any) {
        super(container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container); 
        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._description = ensureElement<HTMLElement>('.card__text', container);
        this._button = ensureElement<HTMLButtonElement>('.card__button', container);
        
        this.setupEventListeners();
    }

    render(data: any): HTMLElement {
        this._id = data.id;
        return super.render(data);
    }

    set category(value: string) {
        this._category.textContent = value;
        this._category.className = 'card__category';
        const categoryClass = this.getCategoryClass(value);
        this._category.classList.add(categoryClass);
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title);
    }

    set description(value: string) {
        this._description.textContent = value;
    }

    set inCart(value: boolean) {
        this._inCart = value;
        this.updateButton();
    }

    private getCategoryClass(category: string): string {
        const categoryMap: {[key: string]: string} = {
            'софт-скил': 'card__category_soft',
            'хард-скил': 'card__category_hard',
            'дополнительное': 'card__category_additional',
            'кнопка': 'card__category_button',
            'другое': 'card__category_other'
        };
        return categoryMap[category] || 'card__category_other';
    }

    private updateButton(): void {
        this._button.textContent = this._inCart ? 'Удалить из корзины' : 'В корзину';
    }

    private setupEventListeners(): void {
        this._button.addEventListener('click', () => {
            if (this._id) {
                if (this._inCart) {
                    this.events.emit('card:remove-product', this._id);
                } else {
                    this.events.emit('card:add-product', this._id);
                }
            }
        });
    }
}