import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

import AnswerEmail from '../jobs/AnswerEmail';
import Queue from '../../lib/Queue';

class AnswerController {
  async store(req, res) {
    const { helpOrder_id } = req.params;

    const helpOrder = await HelpOrder.findByPk(helpOrder_id, {
      include: [
        {
          model: Student,
          as: 'student',
        },
      ],
    });
    if (!helpOrder) {
      return res.status(400).json({
        error: 'Help Order does not exists!',
      });
    }
    if (helpOrder.answer !== null) {
      return res.status(400).json({
        error: 'Help Order already answered!',
      });
    }

    const { answer } = req.body;
    await helpOrder.update({
      answer,
      answer_at: new Date(),
    });

    await Queue.add(AnswerEmail.key, { helpOrder });

    return res.json(helpOrder);
  }
}

export default new AnswerController();
