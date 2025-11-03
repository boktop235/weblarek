export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'card' | 'cash';

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface IOrder extends IBuyer {
  total: number;
  items: string[];
}

export interface IOrderResult {
  id: string;
  total: number;
}

export interface IProductListResponse {
  total: number;
  items: IProduct[];
}

export interface ICardData {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  description?: string;
}

export interface IBasketItem {
  id: string;
  title: string;
  price: number;
  index: number;
}

export interface IFormActions {
  onSubmit: () => void;
}

export interface ISuccessActions {
  onClose: () => void;
}

export interface ICardActions {
  onClick: (id: string) => void;
  onAddToCart: (id: string) => void;
  onRemoveFromCart: (id: string) => void;
}

export interface IEvents {
  emit: (event: string, data?: any) => void;
  on: (event: string, callback: (data?: any) => void) => void;
}