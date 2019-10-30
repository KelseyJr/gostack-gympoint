import Student from '../models/Student';

import studentValidation from '../validations/StudentValidation';

class StudentController {
  async store(req, res) {
    if (!(await studentValidation.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email } = req.body;

    const checkEmail = await Student.findOne({ where: { email } });
    if (checkEmail) {
      return res.status(400).json({ error: 'Duplicated email' });
    }

    const student = await Student.create(req.body);

    return res.json(student);
  }

  async update(req, res) {
    if (!(await studentValidation.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;
    const { email } = req.body;

    const student = await Student.findByPk(id);
    if (student.email !== email) {
      const checkEmail = await Student.findOne({ where: { email } });
      if (checkEmail) {
        return res.status(400).json({ error: 'Duplicated email' });
      }
    }

    await student.update(req.body);

    return res.json(student);
  }
}

export default new StudentController();
