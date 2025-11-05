import { Form } from './Form'; 
import { ensureElement } from '../../utils/utils'; 
import { IFormOrderActions } from '../../types';

export class FormOrder extends Form<IFormOrderActions> { 
    protected _paymentCard: HTMLButtonElement; 
    protected _paymentCash: HTMLButtonElement; 
    protected _addressInput: HTMLInputElement; 
    protected _submitButton: HTMLButtonElement; 
 
    constructor(container: HTMLElement, actions: IFormOrderActions, protected events: any) { 
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
        this.enableSubmitButton();
    } 
 
    set address(value: string) { 
        this._addressInput.value = value; 
        this.enableSubmitButton();
    } 
 
    set submitButtonDisabled(value: boolean) { 
        this._submitButton.disabled = value; 
    }

    enableSubmitButton(): void {
        const isAddressFilled = this._addressInput.value.trim() !== '';
        const isPaymentSelected = this._paymentCard.classList.contains('button_alt-active') || 
                                 this._paymentCash.classList.contains('button_alt-active');
        
        this.submitButtonDisabled = !(isAddressFilled && isPaymentSelected);
    }

    isAddressValid(errors: { address?: string }): void {
        this.setErrors(errors);
        this.enableSubmitButton();
    }

    checkErrors(): boolean {
        return true;
    }

    clearErrors(): void {
        this.clearFieldError(this._addressInput);
    }

    setErrors(errors: { address?: string }): void {
        this.clearErrors();
        if (errors.address) {
            this.setFieldError(this._addressInput, errors.address);
        }
    }

    protected setFieldError(field: HTMLInputElement, error: string): void {
        field.classList.add('form__input_error');
        const errorElement = field.parentElement?.querySelector('.form__error');
        if (errorElement) {
            errorElement.textContent = error;
        }
    }

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
                this.payment = 'card';
                if (this.actions.onPaymentSelect) {
                    this.actions.onPaymentSelect('card');
                }
            }); 
        } 
 
        if (this._paymentCash) { 
            this._paymentCash.addEventListener('click', () => { 
                this.payment = 'cash';
                if (this.actions.onPaymentSelect) {
                    this.actions.onPaymentSelect('cash');
                }
            }); 
        } 
 
        if (this._addressInput) { 
            this._addressInput.addEventListener('input', () => { 
                this.enableSubmitButton();
                if (this.actions.onAddressInput) {
                    this.actions.onAddressInput(this._addressInput.value);
                }
            }); 
        } 
 
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
        this.enableSubmitButton();
        return this.container; 
    }
}