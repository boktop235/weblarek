import { IProduct } from '../../types';

export class ProductList {
  private _items: IProduct[] = [];
  private _selectedItem: IProduct | null = null;

  constructor() {}

  setItems(items: IProduct[]): void {
    this._items = items;
  }

  getItems(): IProduct[] {
    return this._items;
  }

  getItem(id: string): IProduct | undefined {
    return this._items.find(item => item.id === id);
  }

  setSelectedItem(item: IProduct): void {
    this._selectedItem = item;
  }

  getSelectedItem(): IProduct | null {
    return this._selectedItem;
  }
}