import { Form } from './Form'; 
import { ensureElement } from '../../utils/utils'; 
import { IFormActions } from '../../types';

export class FormOrder extends Form<IFormActions> { 
    protected _paymentCard: HTMLButtonElement; 
    protected _paymentCash: HTMLButtonElement; 
    protected _addressInput: HTMLInputElement; 
    protected _submitButton: HTMLButtonElement; 
 
    constructor(container: HTMLElement, actions: IFormActions, protected events: any) { 
        super(container, actions); 
         
        this._paymentCard = ensureElement<HTMLButtonElement>('button[name="card"]', container); 
        this._paymentCash = ensureElement<HTMLButtonElement>('button[name="cash"]', container); 
        this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container); 
        this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container); 
         
        this.setupEventListeners(); 
    } 
 
    set payment(value: string) { 
        if (value === 'card') { 
            this._paymentCard.classList.add('button_alt-active'); 
            this._paymentCash.classList.remove('button_alt-active'); 
        } else { 
            this._paymentCash.classList.add('button_alt-active'); 
            this._paymentCard.classList.remove('button_alt-active'); 
        } 
    } 
 
    set address(value: string) { 
        this._addressInput.value = value; 
    } 
 
    set submitButtonDisabled(value: boolean) { 
        this._submitButton.disabled = value; 
    }

    // Реализация абстрактного метода из Form
    checkErrors(): boolean {
        return true;
    }

    // Реализация метода clearErrors из Form
    clearErrors(): void {
        this.clearFieldError(this._addressInput);
    }

    setErrors(errors: { address?: string }): void {
        this.clearErrors();
        if (errors.address) {
            this.setFieldError(this._addressInput, errors.address);
        }
    }

    // Метод для установки ошибки поля
    protected setFieldError(field: HTMLInputElement, error: string): void {
        field.classList.add('form__input_error');
        const errorElement = field.parentElement?.querySelector('.form__error');
        if (errorElement) {
            errorElement.textContent = error;
        }
    }

    // Метод для очистки ошибки поля
    protected clearFieldError(field: HTMLInputElement): void {
        field.classList.remove('form__input_error');
        const errorElement = field.parentElement?.querySelector('.form__error');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }
 
    protected setupEventListeners(): void { 
        super.setupEventListeners(); 
 
        if (this._paymentCard) { 
            this._paymentCard.addEventListener('click', () => { 
                this.events.emit('form:payment-change', 'card');
            }); 
        } 
 
        if (this._paymentCash) { 
            this._paymentCash.addEventListener('click', () => { 
                this.events.emit('form:payment-change', 'cash');
            }); 
        } 
 
        if (this._addressInput) { 
            this._addressInput.addEventListener('input', () => { 
                this.events.emit('form:address-change', this._addressInput.value); 
            }); 
        } 
 
        // Обработчик отправки формы 
        if (this._submitButton) { 
            this._submitButton.addEventListener('click', (event) => { 
                event.preventDefault(); 
                if (this.actions.onSubmit) { 
                    this.actions.onSubmit(); 
                } 
            }); 
        } 
    } 
 
    render(data?: any): HTMLElement { 
        Object.assign(this as object, data ?? {}); 
        return this.container; 
    }
}