import * as Yup from 'yup';

const UserValidation = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string()
    .email()
    .required(),
  password: Yup.string().required(),
});

export default UserValidation;
