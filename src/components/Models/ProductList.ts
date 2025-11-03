import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class ProductList {
  private _items: IProduct[] = [];
  private _selectedItem: IProduct | null = null;

  constructor(protected events: IEvents) {}

  setItems(items: IProduct[]): void {
    this._items = items;
    this.events.emit('catalog:changed');
  }

  getItems(): IProduct[] {
    return this._items;
  }

  getItem(id: string): IProduct | undefined {
    return this._items.find(item => item.id === id);
  }

  setSelectedItem(id: string): void {
    this._selectedItem = this._items.filter(item => item.id === id)[0];
  }

  getSelectedItem(): IProduct | null {
    return this._selectedItem;
  }
}