import Student from '../domain/Student';
import faker from 'faker';
import getRandomInt from '../util/random';

let gender = ['pria', 'wanita'];
let grade = ['tk', 'sd', 'smp', 'sma'];
let hobbies = ['membaca', 'menulis', 'menggambar'];

export function seedStudent() {
  const student = new Student();
  student.firstName = faker.name.firstName();
  student.lastName = faker.name.lastName();
  student.mobilePhone = faker.phone.phoneNumber(
    // @ts-ignore
    faker.definitions.phone_number.formats[0],
  );
  student.gender = gender[getRandomInt(gender.length)];
  student.grade = grade[getRandomInt(grade.length)];
  student.address = faker.address.streetAddress();
  student.hobbies = hobbies;

  return student;
}

export function getTypeDatas(typeData: String) {
  if (typeData === 'gender') {
    console.log(typeData);
    console.log(gender);
    return gender;
  } else if (typeData === 'grade') {
    return grade;
  } else if (typeData === 'hobbies') {
    return hobbies;
  }
}

export default function generateStudents(max: number = 5) {
  let students = [];
  for (let i = 0; i < max; i = i + 1) {
    students.push(seedStudent());
  }

  return students;
}
