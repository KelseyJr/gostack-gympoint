import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const plan = await Plan.findAll();

    return res.json(plan);
  }

  async show(req, res) {
    const plan = await Plan.findByPk(req.params.id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exist' });
    }

    return res.json(plan);
  }

  async store(req, res) {
    const plan = await Plan.create(req.body);

    return res.json(plan);
  }

  async update(req, res) {
    const plan = await Plan.findByPk(req.body.id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exist' });
    }

    await plan.update(req.body);

    return res.json(plan);
  }

  async delete(req, res) {
    const plan = await Plan.findByPk(req.params.id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exist' });
    }

    await plan.destroy();

    return res.send();
  }
}

export default new PlanController();
