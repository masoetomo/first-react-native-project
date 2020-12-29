import SQLite, {
  ResultSet,
  Transaction,
  TransactionCallback,
} from 'react-native-sqlite-storage';
import ModelConfig from './ModelConfig';
import Model from './Model';

let isDev = process.env.NODE_ENV !== 'production';
let _modelHolder: ModelHolder;
export default class ModelHolder {
  // flowlint unsafe-getters-setters:off
  _config!: ModelConfig;
  _sqlite: SQLite.SQLiteDatabase | undefined;

  static getInstance() {
    if (_modelHolder && _modelHolder instanceof ModelHolder) {
      return _modelHolder;
    }

    let _config = new ModelConfig({database: '_sekolahku.db', debug: isDev});
    _modelHolder = new ModelHolder(_config);

    return _modelHolder;
  }

  constructor(config: ModelConfig) {
    this.config = config;
  }

  async open(): Promise<SQLite.SQLiteDatabase> {
    SQLite.DEBUG(this.config.debug);
    SQLite.enablePromise(this.config.asPromise);
    let databaseInstance: SQLite.SQLiteDatabase;

    const db = await SQLite.openDatabase({
      name: this.config.database,
      location: this.config.location,
    });
    databaseInstance = db;
    console.log('[db] Database open!');
    // Perform any database initialization or updates, if needed
    const model = new Model();
    await model.init(databaseInstance);
    this.sqlite = databaseInstance;
    return databaseInstance;
  }

  close(): Promise<void> {
    if (this.sqlite === undefined) {
      return Promise.reject('[db] Database was not open; unable to close.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return this.sqlite.close().then((status) => {
      console.log('[db] Database closed.');
      this._sqlite = undefined;
    });
  }

  get config(): ModelConfig {
    return this._config;
  }

  set config(value: ModelConfig) {
    this._config = value;
  }

  get sqlite() {
    if (this._sqlite === undefined) {
      // mock what we use from SQLite.SQLiteDatabase
      /* eslint-disable @typescript-eslint/no-unused-vars */
      return {
        executeSql(statement: string, params?: any[]): Promise<[ResultSet]> {
          throw Error('You forgot to open database first!');
        },
        close() {
          throw Error('Database never open!');
        },
        transaction(scope: (tx: Transaction) => void): Promise<Transaction> {
          throw Error('You forgot to open database first!');
        },
        readTransaction(
          scope: (tx: Transaction) => void,
        ): Promise<TransactionCallback> {
          throw Error('You forgot to open database first!');
        },
        attach(nameToAttach: string, alias: string): Promise<void> {
          throw Error('You forgot to open database first!');
        },
        dettach(alias: string): Promise<void> {
          throw Error('You forgot to open database first!');
        },
      };
      /* eslint-enable @typescript-eslint/no-unused-vars */
    }

    return this._sqlite;
  }

  set sqlite(value: SQLite.SQLiteDatabase) {
    this._sqlite = value;
  }
}
