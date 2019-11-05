import { addMonths, parseISO } from 'date-fns';
import Enrollment from '../models/Enrollment';
import Student from '../models/Student';
import Plan from '../models/Plan';

import EnrollmentEmail from '../jobs/EnrollmentEmail';
import Queue from '../../lib/Queue';

class EnrollmentController {
  async index(req, res) {
    const enrollment = await Enrollment.findAll({
      attributes: ['id', 'start_date', 'end_date', 'price'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
    });

    return res.json(enrollment);
  }

  async show(req, res) {
    const { enrollment_id } = req.params;
    const enrollment = await Enrollment.findOne({
      where: {
        id: enrollment_id,
      },
      attributes: ['id', 'start_date', 'end_date', 'price'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
    });

    return res.json(enrollment);
  }

  async store(req, res) {
    const { student_id } = req.params;
    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    const { plan_id } = req.body;
    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exists' });
    }

    const userEnroll = await Enrollment.findOne({
      where: {
        student_id,
      },
    });
    if (userEnroll) {
      return res
        .status(400)
        .json({ error: 'Studen already enrolled into a plan' });
    }

    const { start_date } = req.body;
    const end_date = addMonths(parseISO(start_date), plan.duration);
    const enrollment = await Enrollment.create({
      plan_id,
      student_id,
      start_date,
      end_date,
      price: plan.duration * plan.price,
    });

    const enrollmentData = await Enrollment.findOne({
      where: {
        id: enrollment.id,
      },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'duration', 'price', 'title'],
        },
      ],
    });

    await Queue.add(EnrollmentEmail.key, { enrollmentData });

    return res.json(enrollment);
  }

  async update(req, res) {
    const enrollment = await Enrollment.findByPk(req.params.enrollment_id);
    if (!enrollment) {
      return res.status(400).json({ error: 'Enrollment does not exists' });
    }

    const { plan_id } = req.body;
    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exists' });
    }

    const { student_id } = req.body;
    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    const { start_date } = req.body;
    const end_date = addMonths(parseISO(start_date), plan.duration);

    await enrollment.update({
      plan_id,
      student_id,
      start_date,
      end_date,
      price: plan.duration * plan.price,
    });

    return res.json(enrollment);
  }

  async delete(req, res) {
    const enrollment = await Enrollment.findByPk(req.params.enrollment_id);
    if (!enrollment) {
      return res.status(400).json({ error: 'Enrollment does not exists' });
    }

    await enrollment.destroy();

    return res.send();
  }
}

export default new EnrollmentController();
