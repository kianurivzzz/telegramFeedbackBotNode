import { readFileSync, writeFileSync } from 'fs';

const addUser = user => {
	try {
		const filePath = 'users.json';
		let rawData = readFileSync(filePath, 'utf8');
		let parsedData = [];

		if (rawData) {
			parsedData = JSON.parse(rawData);
		}

		const newUser = {
			userId: user?.id || '',
			username: user?.username || '',
			firstName: user?.first_name || '',
			lastName: user?.last_name || '',
		};

		let isIncludes = false;

		for (const item of parsedData) {
			if (item.userId === newUser.userId) {
				isIncludes = true;
				break;
			}
		}

		if (!isIncludes) {
			parsedData.push(newUser);
		}

		const data = JSON.stringify(parsedData);
		writeFileSync(filePath, data);
	} catch (error) {
		console.error('An error occurred while adding a user:', error);
	}
};

export default addUser;
