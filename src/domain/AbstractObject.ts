export interface IAbstractObject<T> {
  toJSON(): T;
  toString(): string;
}

/**
 * @flow-weak
 *
 * AbstractObject
 * @abstract Class
 * @description JavaScript doesn't have abstract class
 * So, this is an approach in JavaScript
 */
export default class AbstractObject<C> {
  /**
   * @overide method
   * @description To remove _ from the field names
   */
  toJSON() {
    let obj = {} as C;
    let self = (this as unknown) as C;
    for (let key of Object.keys(self)) {
      if (key.startsWith('_')) {
        obj[key.substring(1) as keyof C] = self[key as keyof C];
      } else {
        obj[key as keyof C] = self[key as keyof C];
      }
    }

    return obj;
  }

  toString() {
    return `instance of class ${this.constructor.name}: ${JSON.stringify(
      this,
    )}`;
  }
}
