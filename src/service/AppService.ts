import ModelHolder from '../model/ModelHolder';
import StudentRepository from '../repository/StudentRepository';
import StudentService from './StudentService';

const _studentRepository = new StudentRepository(ModelHolder.getInstance());
const _studentService = new StudentService(_studentRepository);

export default class AppService {
  static get studentService() {
    return _studentService;
  }

  static openDatabase() {
    return ModelHolder.getInstance().open();
  }

  static closeDatabase() {
    return ModelHolder.getInstance().close();
  }
}
