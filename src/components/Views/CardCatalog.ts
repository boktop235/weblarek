import { ensureElement } from "../../utils/utils";
import { IProduct } from "../../types";
import { Card } from "./Card";
import { categoryMap } from "../../utils/constants";

type CategoryKey = keyof typeof categoryMap;
export type TCardCatalog = Pick<IProduct, 'id' | 'title' | 'image' | 'category'>;

export class CardCatalog extends Card<TCardCatalog> {
    protected cardImage: HTMLImageElement;
    protected cardCategory: HTMLElement;
    protected id!: string;

    constructor(container: HTMLElement, protected events: any) {
        super(container);

        this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container);
        
        this.container.addEventListener('click', () => {
            this.events.emit('card:select', { id: this.id });
        });
    }

    render(data: TCardCatalog): HTMLElement {
        console.log('🎴 Rendering card:', data.title, 'image:', data.image);
        this.id = data.id;
        
        // Устанавливаем все свойства напрямую
        this.title = data.title;
        this.category = data.category;
        
        // ПРЯМАЯ установка картинки
        console.log('🖼️ Direct image assignment:', data.image);
        this.cardImage.src = data.image;
        this.cardImage.alt = data.title;
        
        // Принудительные стили
        this.cardImage.style.display = 'block';
        this.cardImage.style.visibility = 'visible';
        this.cardImage.style.width = '100%';
        this.cardImage.style.height = 'auto';
        this.cardImage.style.minHeight = '100px';
        
        return this.container;
    }

    set category(value: string) {
        this.cardCategory.textContent = value;
        this.cardCategory.className = 'card__category';
        
        for (const key in categoryMap) {
            if (key === value) {
                this.cardCategory.classList.add(categoryMap[key as CategoryKey]);
                break;
            }
        }
    }
}