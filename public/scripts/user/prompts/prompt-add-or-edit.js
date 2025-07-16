import { setupCopyAndClearButtons } from './shared/copy-and-clear-buttons.js';

document.addEventListener('DOMContentLoaded', function () {
		
	setupCopyAndClearButtons('#inputContentCopyBtn', '#inputContentContainer', '#input_content', 'copy', true);
	setupCopyAndClearButtons('#improvedContentCopyBtn', '#improvedContentContainer', '#improved_content', 'copy', true);

	setupCopyAndClearButtons('#inputContentClearBtn', '#inputContentContainer', '#input_content', 'clear', true);
	setupCopyAndClearButtons('#improvedContentClearBtn', '#improvedContentContainer', '#improved_content', 'clear', true);

	const inputContentAndImprovedContentWrapper = document.getElementById('inputContentAndImprovedContentWrapper');
	const improvePromptBtn = document.getElementById('improvePromptBtn');
	const input_content = document.getElementById('input_content');
	const improvedContentContainer = document.getElementById('improvedContentContainer');
	const improved_content = document.getElementById('improved_content');
	const acceptImprovementBtn = document.getElementById('acceptImprovementBtn');
	const declineImprovementBtn = document.getElementById('declineImprovementBtn');
	const submitBtnTooltip = document.getElementById('submitBtnTooltip');
	const submitBtn = document.getElementById('submitBtn');
	const errorBtnWrapper = document.getElementById('errorBtnWrapper');
	const input_organization_folders = document.getElementById('input_organization_folders');
	const input_organization_folders_description = document.getElementById('input_organization_folders-description');
	const input_organization_folders_descriptionContainer = document.getElementById('input_organization_folders-descriptionContainer');
	
	const submitBtnTooltipInstance = bootstrap.Tooltip.getInstance('#submitBtnTooltip');

	// deaktiver advarsels-tooltip på submit-knappen
	submitBtnTooltipInstance.disable();

	let tooltipTimeout;
	// Når advarsels-tooltip på submit-knappen vises, skjul den efter 5 sekunder
	submitBtnTooltip.addEventListener('shown.bs.tooltip', () => {
		// Først annuller eventuelle eksisterende timeout, hvis der er nogen
		clearTimeout(tooltipTimeout);
		// Sæt den nye timeout
		tooltipTimeout = setTimeout(function(){
			submitBtnTooltipInstance.hide();
		}, 5000);
	});
	// Når advarsels-tooltip på submit-knappen skjules manuelt, annuller timeout
	submitBtnTooltip.addEventListener('hide.bs.tooltip', () => {
		clearTimeout(tooltipTimeout);
	});


	const fadeOutSeconds = 1;
	const heightSeconds_hide = 1;

	const hideImprovedContentElements = () => {
		// Function to get computed style
		const getStyle = (elem, prop) => window.getComputedStyle(elem).getPropertyValue(prop);
	
		// Store original styles for inputContentAndImprovedContentWrapper
		const originalBorderWidth = getStyle(inputContentAndImprovedContentWrapper, 'border-width');
		const originalBorderStyle = getStyle(inputContentAndImprovedContentWrapper, 'border-style');
		const originalBorderColor = getStyle(inputContentAndImprovedContentWrapper, 'border-color');
		const originalBorderRadius = getStyle(inputContentAndImprovedContentWrapper, 'border-radius');
		const originalPadding = getStyle(inputContentAndImprovedContentWrapper, 'padding');
		const originalMarginBottom = getStyle(inputContentAndImprovedContentWrapper, 'margin-bottom');
	
		// Store the original height of improvedContentContainer
		const originalHeight = improvedContentContainer.offsetHeight;
		
		// Set up transitions
		improvedContentContainer.style.transition =
		`opacity ${fadeOutSeconds}s, ` +
		`height ${heightSeconds_hide}s`;
		improvePromptBtn.style.transition =
		`opacity ${fadeOutSeconds}s`;
		inputContentAndImprovedContentWrapper.style.transition =
		`border-color ${fadeOutSeconds}s, ` +
		`border-width ${fadeOutSeconds}s, ` +
		`padding ${fadeOutSeconds}s, ` +
		`margin-bottom ${fadeOutSeconds}s`;
		
		// Set explicit height before starting the animation
		improvedContentContainer.style.height = `${originalHeight}px`;
		improvedContentContainer.style.overflow = 'hidden';
		
		improvedContentCopyBtn.disabled = true;
		improvedContentClearBtn.disabled = true;
		acceptImprovementBtn.disabled = true;
		declineImprovementBtn.disabled = true;
		errorBtn.disabled = true;
		if (!improved_content.disabled) {
			improved_content.style.backgroundColor = 'var(--bs-body-bg)';
			improved_content.disabled = true;
		}
		improvePromptBtn.disabled = true;

		// Start fade out
		improvedContentContainer.style.opacity = '0';
		improvePromptBtn.style.opacity = '0';
		
		// Remove classes that affect border and add inline styles
		inputContentAndImprovedContentWrapper.classList.remove('border', 'borderStyle_double', 'border-3', 'rounded-2', 'p-2', 'mb-3');
		inputContentAndImprovedContentWrapper.style.borderWidth = originalBorderWidth;
		inputContentAndImprovedContentWrapper.style.borderStyle = originalBorderStyle;
		inputContentAndImprovedContentWrapper.style.borderColor = originalBorderColor;
		inputContentAndImprovedContentWrapper.style.borderRadius = originalBorderRadius;
		inputContentAndImprovedContentWrapper.style.padding = originalPadding;
		inputContentAndImprovedContentWrapper.style.marginBottom = originalMarginBottom;
	
		// Start border fade out
		inputContentAndImprovedContentWrapper.style.borderColor = 'transparent';
		inputContentAndImprovedContentWrapper.style.borderWidth = '0px';
		inputContentAndImprovedContentWrapper.style.padding = '0px';
		inputContentAndImprovedContentWrapper.style.marginBottom = '0px';
		
		// After fade out, reduce height
		setTimeout(() => {
			improvedContentContainer.style.height = '0';
			
			// After height reduction, add d-none class and clean up
			setTimeout(() => {
				improvedContentContainer.classList.add('d-none');
				
				improvedContentCopyBtn.disabled = false;
				improvedContentClearBtn.disabled = false;
				acceptImprovementBtn.disabled = false;
				declineImprovementBtn.disabled = false;
				errorBtn.disabled = false;
				improved_content.disabled = false;
				improved_content.style.backgroundColor = '';

				// Clean up styles
				improvedContentContainer.style.transition = '';
				// improvePromptBtn.style.transition = '';
				inputContentAndImprovedContentWrapper.style.transition = '';
				improvedContentContainer.style.opacity = '';
				// improvePromptBtn.style.opacity = '';
				improvedContentContainer.style.height = '';
				improvedContentContainer.style.overflow = '';
				
				inputContentAndImprovedContentWrapper.style.borderWidth = '';
				inputContentAndImprovedContentWrapper.style.borderStyle = '';
				inputContentAndImprovedContentWrapper.style.borderColor = '';
				inputContentAndImprovedContentWrapper.style.borderRadius = '';
				inputContentAndImprovedContentWrapper.style.padding = '';
				inputContentAndImprovedContentWrapper.style.marginBottom = '';

				// Fade in improvePromptBtn
				improvePromptBtn.classList.remove('d-none');
				improvePromptBtn.style.display = '';
				improvePromptBtn.style.opacity = '0';

				setTimeout(() => {
					improvePromptBtn.style.opacity = '1';
					improvePromptBtn.disabled = false;
					
					// Clean up improvePromptBtn styles after fade-in
					setTimeout(() => {
						improvePromptBtn.style.transition = '';
						improvePromptBtn.style.opacity = '';
					}, fadeOutSeconds * 1000);
				}, 50); // Small delay to ensure display change has taken effect
			}, heightSeconds_hide * 1000); // Same duration as the height transition
		}, fadeOutSeconds * 1000); // Same duration as the fade out transition
	};


	const fadeInSeconds = 1;
	const heightSeconds_show = 1;

	const showImprovedContentElements = async () => {
		// Remove the event listener to prevent multiple calls
		improvePromptBtn.removeEventListener('click', showImprovedContentElements);
	
		// Define animation durations
		const maxTypewriterDuration = 5000; // Maximum duration for typewriter effect in milliseconds
	
		// Function to get computed style
		const getStyle = (elem, prop) => window.getComputedStyle(elem).getPropertyValue(prop);
	
		// Get necessary elements
		const contentWrapper = document.getElementById('contentWrapper');
		const contentHeader = document.getElementById('contentHeader');
		const headerUser = document.getElementById('headerUser');
	
		// Initial setup
		improvedContentContainer.classList.remove('d-none');

		improvedContentCopyBtn.disabled = true;
		improvedContentClearBtn.disabled = true;
		acceptImprovementBtn.disabled = true;
		declineImprovementBtn.disabled = true;
		errorBtn.disabled = true;
		
		// Hide elements
		// improvePromptBtn.style.display = 'none'; // Permanently hide
		// improvePromptBtn.style.opacity = '0';
		improvePromptBtn.classList.add('d-none');
		improvedContentCopyBtn.style.opacity = '0';
		improvedContentClearBtn.style.opacity = '0';
		acceptOrDeclineImprovementBtnsWrapper.style.opacity = '0';
	
		// Set initial styles
		improvedContentContainer.style.height = 'auto';
		improvedContentContainer.style.opacity = '0';
		improvedContentContainer.style.overflow = 'hidden';
		inputContentAndImprovedContentWrapper.style.marginBottom = '0';
		inputContentAndImprovedContentWrapper.style.borderWidth = '0';
		inputContentAndImprovedContentWrapper.style.borderStyle = 'solid';
		inputContentAndImprovedContentWrapper.style.borderColor = 'var(--bs-light-border-subtle)';
		inputContentAndImprovedContentWrapper.style.padding = '0';
	
		// disable midlertidigt indtil animationer er ovre
		improved_content.disabled = true;

		// Force a reflow to ensure the initial styles are applied
		improvedContentContainer.offsetHeight;
	
		// Set up transitions
		improvedContentContainer.style.transition = `opacity ${fadeInSeconds}s`;
		inputContentAndImprovedContentWrapper.style.transition = `
			margin ${heightSeconds_show}s,
			border-width ${heightSeconds_show}s,
			padding ${heightSeconds_show}s
		`;
	
		// Scroll to inputContentAndImprovedContentWrapper
		const scrollToWrapper = () => {
			const wrapperRect = inputContentAndImprovedContentWrapper.getBoundingClientRect();
			const headerHeight = headerUser.offsetHeight + contentHeader.offsetHeight;
			const scrollTop = wrapperRect.top + contentWrapper.scrollTop - headerHeight - 20; // 20px extra space
			contentWrapper.scrollTo({top: scrollTop, behavior: 'smooth'});
		};
	
		// Start the animation
		requestAnimationFrame(() => {
			improvedContentContainer.style.opacity = '1';
			inputContentAndImprovedContentWrapper.style.marginBottom = '1rem'; // Equivalent to Bootstrap's mb-3
			inputContentAndImprovedContentWrapper.style.borderWidth = '3px';
			inputContentAndImprovedContentWrapper.style.padding = '0.5rem'; // Equivalent to Bootstrap's p-2
	
			scrollToWrapper();
	
			// Start loading animation
			const loadingInterval = startLoadingAnimation();
	
			// Perform AJAX request
			performAjaxRequest(loadingInterval);
		});
	
		// Loading animation function
		const startLoadingAnimation = () => {
			const loadingStates = ['.', '..', '...'];
			let currentState = 0;
	
			const updateLoadingState = () => {
				improved_content.value = loadingStates[currentState];
				improved_content.dispatchEvent(new Event('input'));
				currentState = (currentState + 1) % loadingStates.length;
			};
	
			return setInterval(updateLoadingState, 500);
		};
	
		// AJAX request function
		const performAjaxRequest = async (loadingInterval) => {
			const csrfToken = improvePromptBtn.getAttribute('data-csrf');
			const input_prompttype = document.querySelector('input[name="input_prompttype"]:checked');

			try {
				if (!input_prompttype || !input_prompttype.value) {
					throw new Error('FEJL: Vælg venligst en prompt-type og prøv igen. Dette vil hjælpe med at give det bedste resultat i "Forbedrér"-funktionen.');
				}

				const response = await fetch('/user/prompt/improve', {
					method: 'POST',
					body: JSON.stringify({
						input_prompttype: input_prompttype.value,
						input_content: input_content.value,
						_csrf: csrfToken
					}),
					headers: {
						'Content-Type': 'application/json',
					},
				});

				// Hvis responsen ikke er ok, kast ikke en fejl endnu, men læs responsen
				if (!response.ok) {
					const errorData = await response.json(); // Prøv at læse fejlsvaret som JSON
					throw new Error(errorData.message || 'Network response was not ok');
				}
				
				const responseData = await response.json();

				// Ensure minimum x milliseconds of loading animation
				await new Promise(resolve => setTimeout(resolve, 2200));
	
				// Stop loading animation
				clearInterval(loadingInterval);
	
				// Insert response with typewriter effect
				await typewriterEffect(improved_content, responseData.improved_content);
	
				// Show buttons after typewriter effect is complete
				fadeInButtons();

				improvedContentContainer.style.overflow = '';
				improved_content.disabled = false;
				
				// aktiver advarsels-tooltip på submit-knappen
				submitBtnTooltipInstance.enable();
			} catch (error) {
				improved_content.value = error.message;
				improved_content.dispatchEvent(new Event('input'));
				clearInterval(loadingInterval);
				acceptOrDeclineImprovementBtnsWrapper.style.display = 'none';
				errorBtn.disabled = false;
				errorBtnWrapper.classList.remove('d-none');
				// aktiver advarsels-tooltip på submit-knappen
				submitBtnTooltipInstance.enable();
				submitBtnTooltipInstance.setContent({'.tooltip-inner': 'Inden du kan gemme skal du trykke på "OK"-knappen ved "Forslag til forbedring" for at skjule fejlen'});
				autoScroll();
			}
		};
	
		// Typewriter effect function
		const typewriterEffect = async (element, text) => {
			element.value = '';
			const words = text.split(' ');
			const totalWords = words.length;
			const baseDelay = Math.min(maxTypewriterDuration / totalWords, 200); // Cap at 200ms per word
	
			for (let i = 0; i < words.length; i++) {
				element.value += words[i] + ' ';
				element.dispatchEvent(new Event('input'));
				autoScroll();
				await new Promise(resolve => setTimeout(resolve, baseDelay));
			}
		};
	
		// Auto-scroll function
		const autoScroll = () => {
			const wrapperRect = inputContentAndImprovedContentWrapper.getBoundingClientRect();
			const headerHeight = headerUser.offsetHeight + contentHeader.offsetHeight;
			const viewportHeight = window.innerHeight;
	
			if (wrapperRect.bottom > viewportHeight) {
				const scrollTop = wrapperRect.bottom + contentWrapper.scrollTop - viewportHeight + 20; // 20px extra space
				contentWrapper.scrollTo({top: scrollTop, behavior: 'smooth'});
			}
		};
	
		// Fade in buttons function
		const fadeInButtons = () => {
			acceptImprovementBtn.disabled = false;
			declineImprovementBtn.disabled = false;
			improvedContentCopyBtn.disabled = false;
			improvedContentClearBtn.disabled = false;

			improvePromptBtn.style.transition = 'opacity 0.5s';
			improvedContentCopyBtn.style.transition = 'opacity 0.5s';
			improvedContentClearBtn.style.transition = 'opacity 0.5s';
			acceptOrDeclineImprovementBtnsWrapper.style.transition = 'opacity 0.5s';
	
			improvePromptBtn.style.opacity = '1';
			improvedContentCopyBtn.style.opacity = '1';
			improvedContentClearBtn.style.opacity = '1';
			acceptOrDeclineImprovementBtnsWrapper.style.opacity = '1';
		};
	};

	improvePromptBtn.addEventListener('click', () => {
		// vis ImprovedContentElements
		showImprovedContentElements();
		// deaktiver submit-knappen
		submitBtn.disabled = true;
	});

	function improvementWasAcceptedOrDeclined() {
		// skjul advarsels-tooltip på submit-knappen
		submitBtnTooltipInstance.hide();
		// deaktiver advarsels-tooltip på submit-knappen
		submitBtnTooltipInstance.disable();
		// skjul ImprovedContentElements
		hideImprovedContentElements();
		// find det tidspunkt hvor fadeOut er færdig og height_hide er halvejs færdig
		const fadeOutSecondsANDheightSeconds_hide = (fadeOutSeconds + (heightSeconds_hide / 2)) * 1000;
		setTimeout(() => {
			// nulstil teksten i improved_content textarea
			improved_content.value = '';
			// juster højden i improved_content textarea
			improved_content.dispatchEvent(new Event('input'));
			// aktiver submit-knappen
			submitBtn.disabled = false;
		}, fadeOutSecondsANDheightSeconds_hide);
	};

	acceptImprovementBtn.addEventListener('click', () => {
		// Ændre textarea værdi
		input_content.value = improved_content.value;
		// juster højden i input_content textarea
		input_content.dispatchEvent(new Event('input'));
		improvementWasAcceptedOrDeclined();
	});

	declineImprovementBtn.addEventListener('click', () => {
		improvementWasAcceptedOrDeclined();
	});

	errorBtnWrapper.addEventListener('click', () => {
		submitBtnTooltipInstance.setContent({'.tooltip-inner': 'Inden du kan gemme skal du vælge om du vil bruge foreslået prompt eller oprindelig prompt!'});
		improvementWasAcceptedOrDeclined();
		setTimeout(() => {
			acceptOrDeclineImprovementBtnsWrapper.style.display = '';
			errorBtnWrapper.classList.add('d-none');
		}, fadeOutSeconds);
	});

	// Funktion til at tjekke og opdatere visningen af "#input_organization_folders-description"-elementet
	function updateDescriptionVisibility() {
		if (input_organization_folders.value === '') {
			input_organization_folders_description.classList.remove('d-none');
			input_organization_folders_descriptionContainer.classList.remove('doesntHaveContent');
		} else {
			input_organization_folders_description.classList.add('d-none');
			input_organization_folders_descriptionContainer.classList.add('doesntHaveContent');
		}
	}
	// Lyt til ændringer i select-elementet
	input_organization_folders.addEventListener('change', updateDescriptionVisibility);
	// Tjek værdien ved sidens indlæsning
	updateDescriptionVisibility();

});
