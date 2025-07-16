function updateIconAndTooltip(button, successIcon, resetIcon, tooltip) {
	const svgElement = button.querySelector('svg use');
	svgElement.setAttribute('xlink:href', successIcon);
	tooltip.show();
	// Hide tooltip after 2 seconds and reset icon
	setTimeout(() => {
		svgElement.setAttribute('xlink:href', resetIcon);
		tooltip.hide();
	}, 1000);
}

function setupCopyAndClearButtons(selector,closestAncestorClass,targetSelector,action,useValue) {
	document.querySelectorAll(selector).forEach(button => {
		const tooltip = bootstrap.Tooltip.getOrCreateInstance(button);

		button.addEventListener('click', function() {
			// Find the closest ancestor with the specified css selector
			const closestAncestor = this.closest(closestAncestorClass);
			
			if (closestAncestor) {
				// Find the closest descendant with the specified selector
				const targetElement = closestAncestor.querySelector(targetSelector);
				
				if (targetElement) {
					if (action === 'copy') {
						// Get the value or inner HTML from the target element
						const textToCopy = useValue ? targetElement.value : targetElement.innerHTML;
						
						// Use the Clipboard API to copy text
						navigator.clipboard.writeText(textToCopy).then(() => {
							updateIconAndTooltip(this, '#bootstrapIcon-check-lg', '#bootstrapIcon-copy', tooltip);
						}).catch(err => {
							console.error('Failed to copy text: ', err);
						});
					} else if (action === 'clear') {
						// Clear the value or inner HTML from the target element
						if (useValue) {
							targetElement.value = '';
						} else {
							targetElement.innerHTML = '';
						}
						targetElement.dispatchEvent(new Event('input'));
						updateIconAndTooltip(this, '#bootstrapIcon-check-lg', '#bootstrapIcon-backspace', tooltip);
					}
				}
			}
		});
	});
}

export { setupCopyAndClearButtons };