import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

interface ModalContent {
    content: HTMLElement;
};

export class Modal extends Component<ModalContent> {
    protected closeButton: HTMLButtonElement;
    protected modalElement: HTMLElement;
    protected page: HTMLElement;
    isOpen: boolean = false;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this.modalElement = ensureElement<HTMLElement>('.modal__content', this.container);
        this.page = ensureElement<HTMLElement>('.page__wrapper');

        this.closeButton.addEventListener('click', () => { this.close() });

        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.close();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (this.isOpen && (event.key === 'Escape' || event.key === 'Enter')) {
                this.close();
            }
        });
    };

    set content(elem: HTMLElement) {
        this.modalElement.replaceChildren(elem); 
    }

    open(): void {
        this.page.classList.add('page__wrapper_locked');
        this.container.classList.add('modal_active');
        this.isOpen = true;
        this.events.emit('modal:open');
    };

    close(): void {
        this.page.classList.remove('page__wrapper_locked');
        this.container.classList.remove('modal_active');
        this.isOpen = false;
        this.events.emit('modal:close');
    };
};