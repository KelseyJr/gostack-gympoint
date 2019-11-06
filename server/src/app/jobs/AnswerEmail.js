import Mail from '../../lib/Mail';

class AnswerEmail {
  get key() {
    return 'AnswerEmail';
  }

  async handle({ data }) {
    const { helpOrder } = data;

    await Mail.sendEmail({
      to: `${helpOrder.student.name} <${helpOrder.student.email}>`,
      subject: 'Dúvida Respondida',
      template: 'answer',
      context: {
        student_name: helpOrder.student.name,
        question: helpOrder.question,
        answer: helpOrder.answer,
      },
    });
  }
}

export default new AnswerEmail();
