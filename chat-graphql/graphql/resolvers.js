const bcrypt = require('bcryptjs');
const { UserInputError } = require('apollo-server');
const { User } = require('../models');

module.exports = {
    Query: {
        getUsers: async () => {
            try {
                const users = await User.findAll();
                return users;
            } catch (error) {
                console.log(error);
            }
        },
    },
    Mutation: {
        register: async (_, args) => {
            let { username, email, password, confirmPassword } = args

            let errors = {};

            try {
                // validate input data
                if (username.trim() === '') errors.username = 'Username must not be empty';
                if (email.trim() === '') errors.email = 'Email must not be empty';
                if (password.trim() === '') errors.password = 'Password must not be empty';
                if (confirmPassword.trim() === '') errors.confirmPassword = 'Repeat password must not be empty';

                if (password !== confirmPassword) errors.confirmPassword = 'Passwords must match';

                // check if username/email exists
                // const userByUsername = await User.findOne({ where: { username: username } });
                // const userByEmail = await User.findOne({ where: { email: email } });

                // if (userByUsername) errors.username = 'Username is taken';
                // if (userByEmail) errors.Email = 'Email is taken';

                if (Object.keys(errors).length > 0) {
                    throw errors
                }

                // hash password
                password = await bcrypt.hash(password, 6);
                
                // create user
                const user = await User.create({
                    username,
                    email,
                    password
                });

                return user.toJSON();
                // could also do like
                // return user;
            } catch (err) {
                console.log(err);

                if (err.name === 'SequelizeUniqueConstraintError') {
                    err.errors.forEach((e) => (errors[e.path.split('.')[1]] = `${e.path.split('.')[1]} is already taken`));
                } else if(err.name === 'SequelizeValidationError') {
                    err.errors.forEach(e => errors[e.path] = e.message);
                }

                throw new UserInputError('Bad input', { errors });
            }
        }
    }
};