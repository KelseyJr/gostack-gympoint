import * as Yup from 'yup';

const StudentValidation = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string()
    .email()
    .required(),
  age: Yup.number()
    .positive()
    .integer()
    .required(),
  weight: Yup.number()
    .positive()
    .required(),
  height: Yup.number()
    .positive()
    .required(),
});

export default StudentValidation;
