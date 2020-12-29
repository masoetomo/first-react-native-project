import Student, {PlainStudent} from '../domain/Student';

import type {Students} from '../domain/Student';
import ModelHolder from '../model/ModelHolder';
import snakeCase from '../util/snakeCase';

export default class StudentRepository {
  _students!: Students;
  _modelHolder!: ModelHolder;

  constructor(modelHolder: ModelHolder) {
    this.modelHolder = modelHolder;
  }

  create(domain: Student) {
    // Object.assign works in our Domain is because AbstractObject 'toJSON()' method
    // make sure the domain is instance of Student Domain
    let student = Object.assign(new Student(), domain);
    student.createdAt = new Date().toISOString();
    let rawStudent = student.toJSON();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {fullName, toJSON, ...rest} = rawStudent;
    let columns = [];
    let values = [];
    for (const key in rest) {
      if (rest.hasOwnProperty(key)) {
        let value = rest[key as keyof PlainStudent];
        if (key === 'hobbies') {
          // sqlite doesn't support JSON / Array JSON
          // so, we need convert the array to string eg: (from [1, 2] to '1,2')
          value = value.toString();
        }
        values.push(value);
        // convert key to match every columns in Siswa table eg: firstName to first_name
        columns.push(snakeCase(key));
      }
    }
    let column = columns.join(', ');
    // for values placeholder ?,?,?
    let statementValues = Array.from(
      {length: values.length},
      () => '?',
    ).toString();
    const sql = `INSERT INTO Siswa (${column}) VALUES (${statementValues});`;

    return this.modelHolder.sqlite.executeSql(sql, values).then(([results]) => {
      const {insertId} = results;
      console.log('[db] results ', JSON.stringify(results, null, 2));
      console.log(
        `[db] Added siswa ${JSON.stringify(rest)}! InsertId: ${insertId}`,
      );
    });
  }

  findAll(searchCriteria?: string): Promise<Students> {
    // Get all the lists, ordered by newest lists first
    console.log('[db] Fetching lists from the db...');
    let sql = `
          SELECT
            id_siswa AS id,
            first_name AS firstName,
            last_name AS lastName,
            mobile_phone AS mobilePhone,
            gender,
            grade,
            hobbies,
            address,
            created_at AS createdAt,
            updated_at AS updatedAt
          FROM
            Siswa
          ORDER BY created_at DESC;
        `;

    if (searchCriteria) {
      console.log('searchCriteria ', searchCriteria);
      let pattern = `%${searchCriteria}%`;
      sql = `
          SELECT
            id_siswa AS id,
            first_name AS firstName,
            last_name AS lastName,
            mobile_phone AS mobilePhone,
            gender,
            grade,
            hobbies,
            address,
            created_at AS createdAt,
            updated_at AS updatedAt
          FROM
            Siswa
          WHERE
            first_name LIKE '${pattern}' OR
            last_name LIKE '${pattern}' OR
            mobile_phone LIKE '${pattern}' OR
            gender LIKE '${pattern}' OR
            grade LIKE '${pattern}'
          ORDER BY created_at DESC;
        `;
      console.log('[db] search sql: ', sql);
    }
    return this.modelHolder.sqlite.executeSql(sql).then(([results]) => {
      console.log(
        '🚀 ~ file: StudentRepository.ts ~ line 75 ~ StudentRepository ~ returnthis.modelHolder.sqlite.executeSql ~ results',
        results,
      );
      if (results === undefined) {
        return [];
      }
      const count = results.rows.length;
      const lists: Students = [];
      for (let i = 0; i < count; i++) {
        const row = results.rows.item(i);
        row.hobbies = row.hobbies.split(',');
        const student: Student = Object.assign(new Student(), row);
        console.log(`[db] List ${JSON.stringify(student)}`);
        lists.push(student);
      }

      return lists;
    });
  }

  findOne(id: number): Promise<null | Student> {
    console.log('[db] Fetching data by id from the db...');
    const sql = `
      SELECT
        id_siswa AS id,
        first_name AS firstName,
        last_name AS lastName,
        mobile_phone AS mobilePhone,
        gender,
        grade,
        hobbies,
        address,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM
        Siswa
      WHERE id_siswa = ${id};`;
    return this.modelHolder.sqlite.executeSql(sql).then(([results]) => {
      console.log('[db] findOne results ', results);
      if (results === undefined) {
        return null;
      }
      const row = results.rows.item(0);
      console.log(`[db] findOne(${id}) ${JSON.stringify(row)}`);
      if (row === undefined) {
        return null;
      }
      row.hobbies = row.hobbies.split(',');

      return Object.assign(new Student(), row);
    });
  }

  update(id: number, domain: Student): Promise<boolean> {
    console.log('[db] Updating data by id from the db...');
    const sql = `
      UPDATE
        Siswa
      SET
        first_name = '${domain.firstName}',
        last_name =  '${domain.lastName}',
        mobile_phone = '${domain.mobilePhone}',
        gender = '${domain.gender}',
        grade = '${domain.grade}',
        address = '${domain.address}',
        hobbies = '${domain.hobbies.toString()}',
        updated_at = '${new Date().toISOString()}'
      WHERE
        id_siswa = ${id};
    `;
    return this.modelHolder.sqlite.executeSql(sql).then(([results]) => {
      console.log('[db] Updated success!');
      console.log('[db] update results ', results);

      return true;
    });
  }

  delete(id: number): Promise<boolean> {
    console.log(`[db] Deleting student with id: ${id}`);
    return this.modelHolder.sqlite
      .executeSql('DELETE FROM Siswa WHERE id_siswa = ?', [id])
      .then(() => {
        console.log('[db] Deleted success!');

        return true;
      });
  }

  get students() {
    return this._students;
  }

  set students(value: Students) {
    this._students = value;
  }

  get modelHolder() {
    return this._modelHolder;
  }

  set modelHolder(value: ModelHolder) {
    this._modelHolder = value;
  }
}
