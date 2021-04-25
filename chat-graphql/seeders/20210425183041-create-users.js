'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		const password = await bcrypt.hash('123456', 6);
		const createdAt = new Date();
		const updatedAt = createdAt;

		await queryInterface.bulkInsert('users', [
			{
				username: 'john',
				email: 'john@email.com',
				password: password,
				imageUrl: 'https://avatars.githubusercontent.com/u/139426?s=200&v=4',
				createdAt,
				updatedAt,
			},
			{
				username: 'jane',
				email: 'jane@email.com',
				password: password,
				imageUrl: 'https://avatars.githubusercontent.com/u/6128107?s=200&v=4',
				createdAt,
				updatedAt,
			},
			{
				username: 'admin',
				email: 'admin@email.com',
				password: password,
				imageUrl: 'https://avatars.githubusercontent.com/u/14985020?s=200&v=4',
				createdAt,
				updatedAt,
			},
		]);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete('users', null, {});
	},
};
