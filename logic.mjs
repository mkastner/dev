/* eslint-disable no-undef */
import pool from './db.mjs';
import { validateForm, validateUser, nmTransportMail } from "./util.mjs"
import { workerFactory } from './workerFactory.mjs';
import { getUsers, getUserByUuid, checkEmailExists, createUsers } from './queries.mjs';


// Controller for handling the logic for the routes 
export const apiUsers = (req, res) => {
    pool.query(getUsers, (error, results) => {
        if (error) {
            console.error('Error executing query', error);
            return res
            .status(500)
            .json({ error: 'Error while searching for Users' });
        }
        res
        .status(200)
        .json(results.rows);
    });
};

// Controller for getting a user by UUID
export const apiUserByUuid = (req, res) => {
    pool.query(getUserByUuid, [req.params.uuid], (error, results) => {
        if (error) {
            console.error('Error executing query', error);
            return res
            .status(500)
            .json({ error: 'Error while searching by UUID' });
        }
        res
        .status(200)
        .json(results.rows);
    });
};

// Create a user in the DB
export const apiCreateUsers = [
    validateUser,
    (req, res) => {
        const { firstname, lastname, email, age } = req.body;
        pool.query(checkEmailExists, [email], (error, results) => {
            if (error) {
                console.error('Error executing query', error);
                return res
                .status(500)
                .json({ error: 'Error while checking if email exists' });
            }

            // Ensure results is defined and has rows property
            if (results && results.rows && results.rows.length > 0) {
                return res
                .status(403)
                .json({ message: 'User already exists in DB' });
            }

            workerFactory()
            .then(uuid => {
                pool.query(createUsers, [firstname, lastname, email, age, uuid], (error, results) => {
                    if (error) {
                        console.error('Error executing query', error);
                        return res
                        .status(500)
                        .json({ error: 'Error while inserting user' });
                    }
                    // Ensure results.rows and results.rows[0] are defined
                    if (results && results.rows && results.rows[0]) {
                        res
                        .status(201)
                        .json({ message: 'User added with ID: ' + results.rows[0].uuid });
                    } else {
                        res
                        .status(500)
                        .json({ error: 'User creation failed, no ID returned' });
                    }
                });
            })
            .catch(error => {
                console.error('Error generating UUID:', error);
                res
                .status(500)
                .json({ error: 'Failed to generate UUID' });
            });
        });
    }
];

export const formSubmit = [
	validateForm,
	async (req, res) => {
		const { firstname, lastname, email, message } = req.body
		try {
        await nmTransportMail(res, firstname, lastname, email, message)
		} catch (error) {
			console.error("Error sending mail:", error)
			res
            .status(500)
            .json({ error: "Failed to send email" })
		}
	},
]

export const serveForm = (req, res) => {
    res.sendFile(`${process.cwd()}/public/index.html`)
}