import User from '../models/User';

import userValidation from '../validations/UserValidation';

class UserController {
  async store(req, res) {
    if (!(await userValidation.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email } = req.body;

    const checkEmail = await User.findOne({ where: { email } });
    if (checkEmail) {
      return res.status(400).json({ error: 'Duplicated email' });
    }

    const user = await User.create(req.body);

    return res.json(user);
  }
}

export default new UserController();
