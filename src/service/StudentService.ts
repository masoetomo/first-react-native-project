import Student from '../domain/Student';
import StudentRepository from '../repository/StudentRepository';

export default class StudentService {
  repository: StudentRepository;

  constructor(studentRepository: StudentRepository) {
    this.repository = studentRepository;
  }

  createStudent(data: Student) {
    return this.repository.create(data);
  }

  findAllStudents(searchCriteria?: string) {
    return this.repository.findAll(searchCriteria);
  }

  findStudentById(id: number) {
    return this.repository.findOne(id);
  }

  deleteStudentById(id: number) {
    return this.repository.delete(id);
  }

  updateStudentById(id: number, student: Student) {
    return this.repository.update(id, student);
  }
}
