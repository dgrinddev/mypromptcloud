// ______ valider: email, password, betingelserCheckbox ______
function userDetailsAreValid(email, password, betingelserCheckbox) {
	return (
		email && // valider: er email udfyldt?
		email.includes('@') && // valider: indeholder email et @ ?
		password && // valider: er password udfyldt?
		password.trim().length >= 8 && // valider: er password mindst 8 tegn?
		betingelserCheckbox // valider: er betingelserCheckbox checked?
	);
}

// ______ valider: er password og confirmPassword ens? ______
function passwordIsConfirmed(password, confirmPassword) {
	return password === confirmPassword;
}


/*
function validateData(validationConditions) {
	const errors = [];
	validationConditions.forEach(condition => {
		if (!condition.check) {
			errors.push({
				id: condition.id,
				message: condition.message
			});
		}
	});
	return errors;
}
*/


function validateData(validationConditions) {
	const validateRes = {};
	
	validationConditions.forEach(condition => {
		if (!condition.check) {
			// Hvis check er falsk, inkluder invalidMessage
			validateRes[condition.id] = {
				validOrInvalid: 'invalid',
				message: condition.invalidMessage
			};
		} else if (condition.validMessage) {
			// Hvis check er sandt og validMessage findes, inkluder validMessage
			validateRes[condition.id] = {
				validOrInvalid: 'valid',
				message: condition.validMessage
			};
		}
	});

	return validateRes;
}



module.exports = {
	userDetailsAreValid: userDetailsAreValid,
	passwordIsConfirmed: passwordIsConfirmed,
	validateData: validateData,
}