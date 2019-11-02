import { object, string, number } from 'yup';

export default async (req, res, next) => {
  try {
    const schema = object().shape({
      title: string().required(),
      duration: number()
        .positive()
        .integer()
        .required(),
      price: number()
        .positive()
        .required(),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Validations fails', messages: err.inner });
  }
};
