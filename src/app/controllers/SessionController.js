import User from '../models/User';

import sessionValidation from '../validations/SessionValidation';

class SessionController {
  async store(req, res) {
    if (!(await sessionValidation.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'User not found!' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password  does not match!' });
    }

    const { name, id } = user;
    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: user.generateToken(),
    });
  }
}

export default new SessionController();
