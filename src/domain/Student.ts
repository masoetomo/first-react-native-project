import capitalize from '../util/capitalize';
import Domain, {IDomain} from './Domain';

export type Students = Student[];
export type GenderType = 'pria' | 'wanita';
export type PlainStudent = Omit<IStudent, 'fullName' | 'toJSON'>;

export interface IStudent extends IDomain<IStudent> {
  firstName: string;
  lastName: string;
  mobilePhone: string;
  gender: GenderType;
  grade: string;
  hobbies: string[];
  address: string;
  fullName: string;
}

export default class Student extends Domain<IStudent> {
  _firstName!: string;
  _lastName!: string;
  _mobilePhone!: string;
  _gender!: GenderType;
  _grade!: string;
  _hobbies!: string[];
  _address!: string;

  get fullName() {
    let firstName = capitalize(this.firstName);
    let lastName = capitalize(this.lastName);

    return `${firstName} ${lastName}`;
  }

  set fullName(value: string) {
    throw Error(`Cannot set ${value} to property readonly fullName`);
  }

  get firstName() {
    return this._firstName;
  }

  set firstName(value: string) {
    this._firstName = value;
  }

  get lastName() {
    return this._lastName;
  }

  set lastName(value: string) {
    this._lastName = value;
  }

  get mobilePhone() {
    return this._mobilePhone;
  }

  set mobilePhone(value: string) {
    this._mobilePhone = value;
  }

  get gender() {
    return this._gender;
  }

  set gender(value: GenderType) {
    this._gender = value;
  }

  get grade() {
    return this._grade;
  }

  set grade(value: string) {
    this._grade = value;
  }

  get hobbies() {
    return this._hobbies || [];
  }

  set hobbies(value: string[]) {
    this._hobbies = value;
  }

  get address() {
    return this._address;
  }

  set address(value: string) {
    this._address = value;
  }
}
