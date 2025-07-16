/** ______
 * Beregner Bootstrap spacing-værdien i pixels baseret på en given skala fra 0 til 5.
 * Skalaen følger Bootstrap's spacing utilities (f.eks. my-1, mx-3 osv.).
 * @param {number} scale - En værdi fra 0 til 5, der angiver spacing-niveauet.
 * @returns {number} - Spacing-værdien i pixels.
 * @throws {Error} - Hvis skalaen ikke er mellem 0 og 5.
 ______ */
function getBootstrapSpacingValue(scale) {
	// Kontrollér, at input er mellem 0 og 5
	if (scale < 0 || scale > 5) {
		throw new Error('Scale must be between 0 and 5');
	}
	// Få roden elementet, som er :root i CSS
	const root = document.documentElement;
	// Få base font-size fra roden elementet (typisk 16px)
	const baseFontSize = parseFloat(getComputedStyle(root).fontSize);
	// Definer spacer-skalaen baseret på Bootstrap's $spacers Sass map
	// https://getbootstrap.com/docs/5.3/utilities/spacing/#sass-maps
	const spacers = {
		0: 0,
		1: 0.25,
		2: 0.5,
		3: 1,
		4: 1.5,
		5: 3
	};
	// Beregn spacing værdien i pixels
	const spacingValue = baseFontSize * spacers[scale];
	return spacingValue;
}

// ______ Justerer top- og bundmargin på ".container-lg" elementet dynamisk baseret på om indholdet passer i viewport-højden ______
document.addEventListener("DOMContentLoaded", function() {
	const container = document.querySelector('.container-lg');

	function adjustMargin() {
		// højden på ".container-lg"-elementet
		const containerHeight = container.scrollHeight;
		// højden på viewport
		const viewportHeight = window.innerHeight;
		// Antal px i margin i top og bund totalt når "my-1"-class bruges
		const topPlusBottomMarginPxVed_MY1 = getBootstrapSpacingValue(1) * 2;
		
		// hvis højden på ".container-lg"-elementet (inkl. 4px top + 4px bottom margin) er mindre eller lig med højden på viewport:
		if (containerHeight + topPlusBottomMarginPxVed_MY1 <= viewportHeight) {
			// gør top+bottom margin på ".container-lg"-elementet minimal for at undgå scrolling
			container.classList.remove('my-4');
			container.classList.add('my-1');
		} else {
			// hvis containeren derimod ikke kan være på skærmen og vi ikke undgår scrolling så kan vi lige så godt give noget mere top+bottom margin på ".container-lg"-elementet (24px) for at gøre det pænere
			container.classList.remove('my-1');
			container.classList.add('my-4');
		}
	}

	// udfør ovenstående ved indlæsning af siden
	adjustMargin();
	// udfør ovenstående ved resize af vinduet
	window.addEventListener('resize', adjustMargin);
});
