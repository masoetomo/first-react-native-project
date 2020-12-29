import AbstractObject, {IAbstractObject} from './AbstractObject';

export interface IDomain<C> extends IAbstractObject<C> {
  id: number;
  createdAt: string; // actually date string
  updatedAt: string; // actually date string
}

/**
 * Domain
 * @abstract Class
 * @description this class is common property in every domain So,
 * any specific domain should inherit this class
 */
export default class Domain<T> extends AbstractObject<T> {
  // flowlint unsafe-getters-setters:off
  _id!: number;
  _createdAt!: string; // actually date string
  _updatedAt!: string; // actually date string

  get id() {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get createdAt() {
    return this._createdAt;
  }

  set createdAt(value: string) {
    this._createdAt = value;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  set updatedAt(value: string) {
    this._updatedAt = value;
  }
}
