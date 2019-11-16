import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';

class AppointmentController {
  async list(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'date', 'past', 'cancelable'],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            { model: File, as: 'avatar', attributes: ['id', 'path', 'url'] }
          ]
        }
      ]
    });

    return res.json(appointments);
  }

  async create(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    const { provider_id, date } = req.body;

    const checkIsUserProvider = await User.findOne({
      where: { id: provider_id, provider: true }
    });

    if (!checkIsUserProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers.' });
    }

    const checkIsAuthenticatedUserIsProvider = await User.findOne({
      where: { id: req.userId, provider: true }
    });

    if (checkIsAuthenticatedUserIsProvider) {
      return res
        .status(400)
        .json({ error: 'Only normal users can create appointments.' });
    }

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted.' });
    }

    const checkIsAvailability = await Appointment.findOne({
      where: { provider_id, canceled_at: null, date: hourStart }
    });

    if (checkIsAvailability) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available.' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart
    });

    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: ptBR }
    );

    await Notification.create({
      content: `Novo agendamento de ${user.name} para dia ${formattedDate}`,
      user: provider_id
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        { model: User, as: 'provider', attributes: ['name', 'email'] },
        { model: User, as: 'user', attributes: ['name'] }
      ]
    });

    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: 'You does not have permission to cancel this appointment.'
      });
    }

    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can only cancel appointments 2 hours in advance.'
      });
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    await Queue.add(CancellationMail.key, {
      appointment
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
