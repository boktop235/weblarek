import { IBuyer, TPayment } from '../../types'; 

// Локальный интерфейс для валидации
interface IBuyerValidationResult {
    payment?: string;
    email?: string;
    phone?: string;
    address?: string;
}

export class Buyer { 
  private _payment: TPayment = 'card'; 
  private _email: string = ''; 
  private _phone: string = ''; 
  private _address: string = ''; 

  constructor() {} 

  setData(data: Partial<IBuyer>): void { 
    if (data.payment !== undefined) this._payment = data.payment; 
    if (data.email !== undefined) this._email = data.email; 
    if (data.phone !== undefined) this._phone = data.phone; 
    if (data.address !== undefined) this._address = data.address; 
  } 

  getData(): IBuyer | null { 
    if (!this._email && !this._phone && !this._address && this._payment === 'card') { 
      return null; 
    } 
     
    return { 
      payment: this._payment, 
      email: this._email, 
      phone: this._phone, 
      address: this._address 
    }; 
  } 

  clear(): void { 
    this._payment = 'card'; 
    this._email = ''; 
    this._phone = ''; 
    this._address = ''; 
  } 

  validate(): IBuyerValidationResult { 
    const errors: IBuyerValidationResult = {}; 

    if (!this._payment) { 
      errors.payment = 'Не выбран вид оплаты'; 
    } 

    if (!this._email.trim()) { 
      errors.email = 'Укажите email'; 
    } 

    if (!this._phone.trim()) { 
      errors.phone = 'Укажите телефон'; 
    } 

    if (!this._address.trim()) { 
      errors.address = 'Укажите адрес'; 
    } 

    return errors; 
  }
}