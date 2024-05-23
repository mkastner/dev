/* eslint-disable no-undef */
import { workerFactory } from "./workerFactory.mjs"
import { body, validationResult } from "express-validator"

import nm from "nodemailer"
import "dotenv/config"

export const validationLayer = (req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(403).json({ errors: errors.array() })
	}
	next()
}

export const validateForm = [
	body("firstname").notEmpty().withMessage("First name is required"),
	body("lastname").notEmpty().withMessage("Last name is required"),
	body("email").isEmail().withMessage("Invalid email"),
	body("message").notEmpty().withMessage("Message is required"),
	body("privacy").equals("on").withMessage("Privacy policy must be accepted"),
	validationLayer,
]

// UUID Generator
export const uuidGen = (req, res) => {
	workerFactory()
		.then((uuid) => {
			res
			.json({ uuid }) // Return the UUID
		})
		.catch((error) => {
			console.error("Error fetching UUID:", error)
			res
			.status(500)
			.json({ error: "Failed to generate UUID" })
		})
}

const nmTransporter = nm.createTransport({
	host: process.env.MAILHOST,
	port: 587,
	secure: false,
	auth: {
		user: process.env.MAILUSER_ACCOUNT,
		pass: process.env.MAILUSER_PASS,
	},
	requireTLS: true,
	debug: true,
	logger: true,
});

export async function nmTransportMail(
	res,
	firstname,
	lastname,
	email,
	message,
) {
	const mailOptions = {
		from: process.env.MAILUSER_ACCOUNT,
		to: process.env.MAILRECIPIENT_ACCOUNT,
		subject: `Weiterleitung von ${firstname} ${lastname}: <${email}>`,
		text: message,
	}

	console.log(
		`Sending email to: ${mailOptions.to} \nsubject: ${mailOptions.subject}`,
	)

	try {
		const info = await nmTransporter.sendMail(mailOptions)
		res
			.status(200)
			.json({
				message: `E-Mail erfolgreich gesendet: ${info.response}, Nachrichten-ID: ${info.messageId}`,
			})
	} catch (error) {
		console.error("Error sending mail:", error)
		res
			.status(500)
			.json({ error: `Fehler beim Senden der E-Mail: ${error.message}` })
	}
};