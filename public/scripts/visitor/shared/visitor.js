document.addEventListener('DOMContentLoaded', function () {

	const newsletterForm = document.getElementById('newsletterForm');
	newsletterForm.addEventListener('submit', function (event) {
		event.preventDefault(); // Forhindrer formularen i at blive sendt
		alert('Denne formular er stadig under opbygning og er derfor deaktiveret. Din e-mailadresse er ikke gemt.');
	});

});