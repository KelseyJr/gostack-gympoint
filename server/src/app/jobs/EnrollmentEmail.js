import { format, parseISO } from 'date-fns';
import Mail from '../../lib/Mail';

class EnrollmentEmail {
  get key() {
    return 'EnrollmentEmail';
  }

  async handle({ data }) {
    const { enrollmentData } = data;

    await Mail.sendEmail({
      to: `${enrollmentData.student.name} <${enrollmentData.student.email}>`,
      subject: 'Bem vindo ao GymPoint',
      template: 'enrollment',
      context: {
        student_name: enrollmentData.student.name,
        plan_name: enrollmentData.plan.title,
        price: enrollmentData.price.toFixed(2),
        start_date: format(parseISO(enrollmentData.start_date), 'dd/MM/yyyy'),
        end_date: format(parseISO(enrollmentData.end_date), 'dd/MM/yyyy'),
      },
    });
  }
}

export default new EnrollmentEmail();
