import { Op } from 'sequelize';
import { subDays } from 'date-fns';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async index(req, res) {
    const { student_id } = req.params;

    const checkin = await Checkin.findAll({
      where: {
        student_id,
      },
      attributes: ['id', 'created_at'],
      include: [
        {
          model: Student,
          as: 'student',
        },
      ],
    });

    return res.json(checkin);
  }

  async store(req, res) {
    const { student_id } = req.params;
    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    const countCheckins = await Checkin.findAndCountAll({
      where: {
        student_id,
        created_at: { [Op.between]: [subDays(new Date(), 7), new Date()] },
      },
    });
    if (countCheckins.count >= 5) {
      return res
        .status(400)
        .json({ error: 'You can only check-in 5 times every 7 days!' });
    }

    const checkin = await Checkin.create({
      student_id,
    });

    return res.json(checkin);
  }
}

export default new CheckinController();
