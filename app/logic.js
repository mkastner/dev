/* eslint-disable no-undef */
import { validateForm, nmTransportMail } from './util.js';

export const formSubmit = [
  validateForm,
  async (req, res) => {
    const { firstname, lastname, email, message } = req.body;
    try {
      await nmTransportMail(res, firstname, lastname, email, message);
    } catch (error) {
      console.error('Error sending mail:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  },
];

export const serveForm = (req, res) => {
  res.render('index', res.locals);
};
