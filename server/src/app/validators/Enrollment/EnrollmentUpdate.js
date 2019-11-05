import { object, number, date } from 'yup';

export default async (req, res, next) => {
  try {
    const schema = object().shape({
      plan_id: number()
        .positive()
        .integer()
        .required(),
      start_date: date().required(),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Validations fails', messages: err.inner });
  }
};
