import type {Location} from 'react-native-sqlite-storage';

export default class ModelConfig {
  _database!: string;
  _location!: Location;
  _debug!: boolean;
  _asPromise!: boolean;

  constructor(opts: {
    database: string;
    location?: Location;
    asPromise?: boolean;
    debug?: boolean;
  }) {
    const {
      database,
      location = 'default',
      asPromise = true,
      debug = false,
    } = opts;

    this.database = database;
    this.location = location;
    this.asPromise = asPromise;
    this.debug = debug;
  }

  get database(): string {
    return this._database;
  }

  set database(value: string) {
    this._database = value;
  }

  get location(): Location {
    return this._location;
  }

  set location(value: Location) {
    this._location = value;
  }

  get asPromise() {
    return this._asPromise;
  }

  set asPromise(value: boolean) {
    this._asPromise = value;
  }

  get debug() {
    return this._debug;
  }

  set debug(value: boolean) {
    this._debug = value;
  }
}
