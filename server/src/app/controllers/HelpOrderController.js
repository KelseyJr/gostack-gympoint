import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class HelpOrderController {
  async index(req, res) {
    const helpOrder = await HelpOrder.findAll({
      where: {
        answer: null,
      },
      include: [
        {
          model: Student,
          as: 'student',
        },
      ],
    });

    return res.json(helpOrder);
  }

  async show(req, res) {
    const { student_id } = req.params;
    const helpOrder = await HelpOrder.findAll({
      where: {
        student_id,
      },
      include: [
        {
          model: Student,
          as: 'student',
        },
      ],
    });

    return res.json(helpOrder);
  }

  async store(req, res) {
    const { student_id } = req.params;
    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    const helpOrder = await HelpOrder.create({
      student_id,
    });

    return res.json(helpOrder);
  }
}

export default new HelpOrderController();
