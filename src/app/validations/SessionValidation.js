import * as Yup from 'yup';

const SessionValidation = Yup.object().shape({
  email: Yup.string()
    .email()
    .required(),
  password: Yup.string().required(),
});

export default SessionValidation;
