import { IApi, IProductListResponse, IOrder, IOrderResult } from '../../types';

export class ApiCommunication {
  constructor(private api: IApi) {}

  async getCatalog(): Promise<IProductListResponse> {
    try {
      const response = await this.api.get<IProductListResponse>('/product/');
      return response;
    } catch (error) {
      console.error('Ошибка при получении каталога:', error);
      throw error;
    }
  }

  async createOrder(orderData: IOrder): Promise<IOrderResult> {
    try {
      const response = await this.api.post<IOrderResult>('/order/', orderData);
      return response;
    } catch (error) {
      console.error('Ошибка при создании заказа:', error);
      throw error;
    }
  }
}