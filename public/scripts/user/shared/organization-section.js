document.addEventListener('DOMContentLoaded', function () {
	
	// håndter når der slettes en organization-section item
	const organizationSectionDeleteItemSubmitBtnElements = document.getElementsByClassName('organizationSectionDeleteItemSubmitBtn');

	async function deleteOrganizationSectionItem(event) {
		const btnElement = event.target;
		const organizationSectionType = btnElement.dataset.organizationsectiontype;
		const itemId = btnElement.dataset.itemid;
		const csrfToken = btnElement.dataset.csrf;

		const response = await fetch(`/user/organization-section/delete-item/${organizationSectionType}/${itemId}`, {
			method: 'DELETE',
			headers: {'x-csrf-token': csrfToken}
		});

		if (!response.ok) {
			alert('Something went wrong!');
			return;
		}

		// Hent 'currentPath' fra URL uden query-parametre eller fragmenter
		const currentPath = window.location.pathname;
		// Find positionen af det sidste '/'
		const lastSlashIndex = currentPath.lastIndexOf('/');
		// Brug substring til at få alt efter det sidste '/'
		const lastPart = currentPath.substring(lastSlashIndex + 1);

		if (lastPart === itemId) {
			// Omdiriger til "/user/prompts-get/all"
			window.location.href = "/user/prompts-get/all";
		} else {
			const organizationSectionTypeLabels = {
				folders: {
					labelSingular_da: 'mappe',
					labelPlural_da: 'mapper',
				},
				categories: {
					labelSingular_da: 'kategori',
					labelPlural_da: 'kategorier',
				},
			};
	
			const organizationSectionItemElement = document.querySelectorAll(`.SIDEBAR-organization_section_item-${itemId}`);
	
			if (organizationSectionItemElement) {
				for (const itemElement of organizationSectionItemElement) {
					const parentElement = itemElement.parentElement;
					itemElement.remove();
					
					// Kontroller om parent elementet ikke længere har nogen children-elementer
					if (parentElement.children.length === 0) {
						// Tilføj klassen "noItems" til parentElement ("ul.organizationSectionItems"-elementet)
						parentElement.classList.add('noItems');
		
						// tilføj følgende html til parentElement:
						/*
						<li>
							<a class="organizationSectionItemBtn btn btn-outline-light btnExtraLight btn-sm border-0 disabled" aria-disabled="true">Ingen <%= section.labelPlural_da %> tilføjet</a>
						</li>
						*/
	
						// Opret en ny li og a element
						const li = document.createElement('li');
						const a = document.createElement('a');
						a.className = 'organizationSectionItemBtn btn btn-outline-light btnExtraLight btn-sm border-0 disabled';
						a.setAttribute('aria-disabled', 'true');
						a.textContent = `Ingen ${organizationSectionTypeLabels[organizationSectionType].labelPlural_da} tilføjet`;
						
						// Tilføj a elementet til li
						li.appendChild(a);
						
						// Tilføj li elementet til parentElement
						parentElement.appendChild(li);
					}
				}
			}
	
			// Tjek om body har class "user__prompts_get"
			if (document.body.classList.contains('user__prompts_get')) {
				// Get the parent element by its ID
				const parentElement = document.getElementById('promptItems');
	
				// Check if the parent element exists
				if (parentElement) {
					// Get all child elements of the parent element
					const childElements = parentElement.children;
	
					// Iterate through each child element
					Array.from(childElements).forEach(child => {
						// Find the descendant element with the specified class
						const organizationSectionLabelsWrapper = child.querySelector('.promptItemMetadata_OrganizationSectionLabelsWrapper');
						// Check if the element exists
						if (organizationSectionLabelsWrapper) {
							// Find the descendant element with the specified class and of the CURRENT organization section type
							const organizationSectionLabel = organizationSectionLabelsWrapper.querySelector(`.promptItemMetadata_OrganizationSectionLabel_${organizationSectionType}`);
							// Check if the element exists and has the required attribute with the value of the correct id
							if (organizationSectionLabel && organizationSectionLabel.getAttribute('data-organizationsectionitemid') === itemId) {
								// delete the element
								organizationSectionLabel.remove();
								organizationSectionLabelsWrapper.classList.remove(`promptItemHave_${organizationSectionType}`);
	
								// hvis organizationSectionLabelsWrapper nu ingen children har så slet den
								if (organizationSectionLabelsWrapper.children.length === 0) {
									organizationSectionLabelsWrapper.remove();
								} else {
									const otherOrganizationSectionType = organizationSectionType === 'folders' ? 'categories' : 'folders';
									// Find the descendant element with the specified class and of the OTHER organization section type
									const otherOrganizationSectionLabel = organizationSectionLabelsWrapper.querySelector(`.promptItemMetadata_OrganizationSectionLabel_${otherOrganizationSectionType}`);
									// Check if the element exists
									if (otherOrganizationSectionLabel) {
										otherOrganizationSectionLabel.classList.remove('pe-1', 'pe-md-2', 'pe-sm-2', 'ps-1', 'ps-md-2', 'ps-sm-2');
									}
								}
							}
						}
					});
				}
			}
	
			// Tjek om body har class "user__prompt___add_or_edit"
			if (document.body.classList.contains('user__prompt___add_or_edit')) {
				// Find det relevante select-element baseret på organizationSectionType
				const selectElement = document.getElementById(`input_organization_${organizationSectionType}`);
	
				if (selectElement) {
					// Find det relevante select-element baseret på organizationSectionType
					const optionElement = document.querySelector(`#input_organization_${organizationSectionType} option[value="${itemId}"]`);
					if (optionElement) {
						optionElement.remove();
					}
					
					// Kontroller om selectElement ikke længere har nogle options (udover den med value="")
					if (selectElement.children.length === 1) {
						// fjern alle options
						while (selectElement.firstChild) { 
							selectElement.removeChild(selectElement.firstChild);
						}
	
						// tilføj følgende html til selectElement:
						/*
						<option value="" selected="">Tilføj evt. en kategori i sidepanelet</option>
						*/
						const defaultOption = document.createElement('option');
						defaultOption.value = "";
						defaultOption.selected = true;
						defaultOption.textContent = `Tilføj evt. en ${organizationSectionTypeLabels[organizationSectionType].labelSingular_da} i sidepanelet`;
						selectElement.insertBefore(defaultOption, selectElement.firstChild);
	
						// Sæt disabled-attribute til true
						selectElement.disabled = true;
					}
				}
			}
		}
	}

	for (const deleteBtnElement of organizationSectionDeleteItemSubmitBtnElements) {
		deleteBtnElement.addEventListener('click', deleteOrganizationSectionItem);
	}






	function createOrganizationSectionItem(responseData, offcanvasOrCollapse, currentPath, itemsUrlPrefix, csrfToken, organizationSectionType, labelSingular_da) {
		// Create the <li> element
		const li = document.createElement('li');
		li.id = `${offcanvasOrCollapse}_SIDEBAR-organization_section_item-${responseData.newOrganizationSectionItem.id}`;
		li.classList.add(`SIDEBAR-organization_section_item-${responseData.newOrganizationSectionItem.id}`, 'd-flex');

		// Create the <a> element
		const a = document.createElement('a');
		a.className = `organizationSectionItemBtn btn btn-outline-light btnExtraLight btn-sm border-0${currentPath === itemsUrlPrefix + responseData.newOrganizationSectionItem.id ? ' active' : ''}`;
		if (currentPath === itemsUrlPrefix + responseData.newOrganizationSectionItem.id) {
				a.setAttribute('aria-current', 'page');
		}
		a.href = `${itemsUrlPrefix}${responseData.newOrganizationSectionItem.id}`;
		a.textContent = responseData.newOrganizationSectionItem.name;

		// Append <a> to <li>
		li.appendChild(a);

		// Create the dropdown container <div>
		const dropdownDiv = document.createElement('div');
		dropdownDiv.className = 'dropdown';

		// Create the dropdown button
		const dropdownButton = document.createElement('button');
		dropdownButton.className = 'organizationSectionItemDropdownBtn btn btn-outline-light btnExtraLight btn-sm border-0 d-flex align-items-center';
		dropdownButton.setAttribute('type', 'button');
		dropdownButton.setAttribute('data-bs-toggle', 'dropdown');
		dropdownButton.setAttribute('aria-expanded', 'false');

		// Add SVG icon to the dropdown button
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.classList.add('flex-shrink-0');
		const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
		use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#bootstrapIcon-three-dots');
		svg.appendChild(use);

		// Add invisible span for accessibility
		const span = document.createElement('span');
		span.className = 'invisible';
		span.textContent = '.';

		// Append SVG and span to button
		dropdownButton.appendChild(svg);
		dropdownButton.appendChild(span);

		// Append dropdownButton to dropdownDiv
		dropdownDiv.appendChild(dropdownButton);

		// Create the dropdown menu <div>
		const dropdownMenu = document.createElement('div');
		dropdownMenu.className = 'dropdown-menu dropdown-menu-end';

		// Create the form for editing the item
		const form = document.createElement('form');
		form.className = 'px-2';
		form.setAttribute('action', '/user/organization-section/add-or-edit-item');
		form.setAttribute('method', 'POST');

		// Hidden CSRF token input
		const csrfInput = document.createElement('input');
		csrfInput.type = 'hidden';
		csrfInput.name = '_csrf';
		csrfInput.value = csrfToken;

		// Hidden organization section type input
		const sectionTypeInput = document.createElement('input');
		sectionTypeInput.type = 'hidden';
		sectionTypeInput.name = 'organization_section_type';
		sectionTypeInput.value = organizationSectionType;

		// Hidden item ID input
		const itemIdInput = document.createElement('input');
		itemIdInput.type = 'hidden';
		itemIdInput.name = 'item_id';
		itemIdInput.value = responseData.newOrganizationSectionItem.id;

		// Input group for item name
		const inputGroup = document.createElement('div');
		inputGroup.className = 'input-group';

		const itemNameInput = document.createElement('input');
		itemNameInput.type = 'text';
		itemNameInput.name = 'name';
		itemNameInput.className = 'organizationSectionEditItemNameInput form-control form-control-sm';
		itemNameInput.placeholder = `Navn på ${labelSingular_da}`;
		itemNameInput.setAttribute('aria-label', `Navn på ${labelSingular_da}`);
		itemNameInput.value = responseData.newOrganizationSectionItem.name;

		const submitButton = document.createElement('button');
		submitButton.type = 'submit';
		submitButton.className = 'organizationSectionEditItemSubmitBtn btn btn-success icon-link px-2';

		const checkSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		checkSvg.classList.add('bi');
		checkSvg.setAttribute('aria-hidden', 'true');
		const checkUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
		checkUse.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#bootstrapIcon-check-lg');
		checkSvg.appendChild(checkUse);

		// Append check icon to submit button
		submitButton.appendChild(checkSvg);

		// Append inputs and button to input group
		inputGroup.appendChild(itemNameInput);
		inputGroup.appendChild(submitButton);

		// Append hidden inputs and input group to form
		form.appendChild(csrfInput);
		form.appendChild(sectionTypeInput);
		form.appendChild(itemIdInput);
		form.appendChild(inputGroup);
		form.addEventListener('submit', addOrEditOrganizationSectionItem);

		// Append form to dropdown menu
		dropdownMenu.appendChild(form);

		// Add divider
		const divider = document.createElement('div');
		divider.className = 'dropdown-divider';
		dropdownMenu.appendChild(divider);

		// Add delete button
		const deleteButton = document.createElement('button');
		deleteButton.className = 'organizationSectionDeleteItemSubmitBtn dropdown-item icon-link text-danger form-control-sm';
		deleteButton.type = 'button';
		deleteButton.setAttribute('data-itemid', responseData.newOrganizationSectionItem.id);
		deleteButton.setAttribute('data-organizationsectiontype', organizationSectionType);
		deleteButton.setAttribute('data-csrf', csrfToken);
		deleteButton.innerHTML = '<svg class="bi" aria-hidden="true"><use xlink:href="#bootstrapIcon-trash"/></svg>Slet';
		deleteButton.addEventListener('click', deleteOrganizationSectionItem);

		// Append delete button to dropdown menu
		dropdownMenu.appendChild(deleteButton);

		// Append dropdown menu to dropdownDiv
		dropdownDiv.appendChild(dropdownMenu);

		// Append dropdownDiv to <li>
		li.appendChild(dropdownDiv);

		return li;
	}


	// håndter når der tilføjes ny organization-section item eller der redigeres en
	const organizationSectionAddOrEditItemFormElements = document.querySelectorAll('form[action="/user/organization-section/add-or-edit-item"]');

	async function addOrEditOrganizationSectionItem(event) {
		event.preventDefault(); // Forhindrer standard form submission
		const formElement = event.target;
		const formData = new FormData(formElement);
		let formObj = Object.fromEntries(formData);
		const formObjStringified = JSON.stringify(formObj);

		let response;
		try {
			response = await fetch(formElement.action, {
				method: formElement.method,
				body: formObjStringified,
				headers: {
					'Content-Type': 'application/json',
				},
			});
		} catch (error) {
			alert('Something went wrong!');
			return;
		}

		if (!response.ok) {
			const errorData = await response.json(); // Prøv at læse fejlsvaret som JSON
			alert(errorData.message);

			if (formObj.item_id) {
				const organizationSectionItemElement = document.querySelectorAll(`.SIDEBAR-organization_section_item-${formObj.item_id}`);
				if (organizationSectionItemElement) {
					for (const itemElement of organizationSectionItemElement) {
						let oldValue = '';
						// Find descendant element med class "organizationSectionItemBtn"
						const btnElement = itemElement.querySelector('.organizationSectionItemBtn');
						if (btnElement) {
							oldValue = btnElement.innerHTML;
						}	
						// Find descendant element med class "organizationSectionEditItemNameInput"
						const inputElement = itemElement.querySelector('.organizationSectionEditItemNameInput');
						if (inputElement) {
							inputElement.value = oldValue;
						}
					}
				}
			}

			return;
		}

		const responseData = await response.json();

		if (formObj.item_id) {
			const organizationSectionItemElement = document.querySelectorAll(`.SIDEBAR-organization_section_item-${formObj.item_id}`);
			if (organizationSectionItemElement) {
				for (const itemElement of organizationSectionItemElement) {
					// Find descendant element med class "organizationSectionItemBtn"
					const btnElement = itemElement.querySelector('.organizationSectionItemBtn');
					if (btnElement) {
							btnElement.innerHTML = responseData.newOrganizationSectionItem.name;
					}
					// Find descendant element med class "organizationSectionEditItemNameInput"
					const inputElement = itemElement.querySelector('.organizationSectionEditItemNameInput');
					if (inputElement) {
							inputElement.value = responseData.newOrganizationSectionItem.name;
					}
				}
			}

			// Tjek om body har class "user__prompt___add_or_edit"
			if (document.body.classList.contains('user__prompt___add_or_edit')) {
				// Find det relevante select-element baseret på formObj.organization_section_type
				const optionElement = document.querySelector(`#input_organization_${formObj.organization_section_type} option[value="${responseData.newOrganizationSectionItem.id}"]`);
				if (optionElement) {
					optionElement.textContent = responseData.newOrganizationSectionItem.name;
				}
			}

			// Tjek om body har class "user__prompts_get"
			if (document.body.classList.contains('user__prompts_get')) {
				// Hent 'currentPath' fra URL uden query-parametre eller fragmenter
				const currentPath = window.location.pathname;
				// Find positionen af det sidste '/'
				const lastSlashIndex = currentPath.lastIndexOf('/');
				// Brug substring til at få alt efter det sidste '/'
				const lastPart = currentPath.substring(lastSlashIndex + 1);

				if (lastPart === responseData.newOrganizationSectionItem.id) {
					const contentHeaderHeading_organizationType = document.getElementById('contentHeaderHeading_organizationType');
					if (contentHeaderHeading_organizationType) {
						// Change its textContent to the new name
						contentHeaderHeading_organizationType.textContent = responseData.newOrganizationSectionItem.name;
					}
				}

				// Get the parent element by its ID
				const parentElement = document.getElementById('promptItems');

				// Check if the parent element exists
				if (parentElement) {
					// Get all child elements of the parent element
					const childElements = parentElement.children;

					// Iterate through each child element
					Array.from(childElements).forEach(child => {
						// Find the descendant element with the specified class
						const organizationSectionLabel = child.querySelector(`.promptItemMetadata_OrganizationSectionLabel_${formObj.organization_section_type}`);

						// Check if the element exists and has the required attribute with the value of the correct id
						if (organizationSectionLabel && organizationSectionLabel.getAttribute('data-organizationsectionitemid') === responseData.newOrganizationSectionItem.id) {
							// Find the descendant element with the specified class
							const textElement = organizationSectionLabel.querySelector(`.promptItemMetadata_OrganizationSectionLabel_${formObj.organization_section_type}_text`);

							// Check if the text element exists
							if (textElement) {
								// Change its textContent to the new name
								textElement.textContent = responseData.newOrganizationSectionItem.name;
							}
						}
					});
				}
			}
		} else {
			const organizationSectionTypeLabels = {
				folders: {
					labelSingular_da: 'mappe',
				},
				categories: {
					labelSingular_da: 'kategori',
				},
			};
			const reverseOrder = 0;
			const organizationSectionElement = document.querySelectorAll(`.SIDEBAR-organizationSectionCollapse_${formObj.organization_section_type} .organizationSectionItems`);
			if (organizationSectionElement) {
				for (const sectionElement of organizationSectionElement) {
					// Find værdien af 'offcanvasOrCollapse'
					const offcanvasOrCollapse = sectionElement.parentElement.id.startsWith('OFFCANVAS') ? 'OFFCANVAS' : 'COLLAPSE';
					// Hent 'currentPath' fra URL uden query-parametre eller fragmenter
					const currentPath = window.location.pathname;
					// Byg 'itemsUrlPrefix' baseret på formObj.organization_section_type
					const itemsUrlPrefix = `/user/prompts-get/${formObj.organization_section_type}/`;
					// CSRF-token
					const csrfToken = formObj._csrf;

					// Tjek om parent <ul> elementet har class 'noItems'
					if (sectionElement.classList.contains('noItems')) {
						// Fjern det eneste <li> element (beskeden) og 'noItems' klassen
						while (sectionElement.firstChild) {
							sectionElement.removeChild(sectionElement.firstChild);
						}
						sectionElement.classList.remove('noItems');
					}

					// Skab <li> elementet
					const newItem = createOrganizationSectionItem(responseData, offcanvasOrCollapse, currentPath, itemsUrlPrefix, csrfToken, formObj.organization_section_type, organizationSectionTypeLabels[formObj.organization_section_type].labelSingular_da);
					// Indsæt <li> elementet i starten eller slutningen af parent <ul> elementet
					if (reverseOrder) {
							sectionElement.insertBefore(newItem, sectionElement.firstChild);
					} else {
							sectionElement.appendChild(newItem);
					}

					// Find .organizationSectionAddItemNameInput inde i .organizationSection parent-elementet
					const organizationSectionParent = sectionElement.closest('.organizationSection');
					if (organizationSectionParent) {
						const addItemNameInput = organizationSectionParent.querySelector('.organizationSectionAddItemNameInput');
						if (addItemNameInput) {
							// Tøm value-attributten
							addItemNameInput.value = '';
						}
					}
				}
			}

			// Tjek om body har class "user__prompt___add_or_edit"
			if (document.body.classList.contains('user__prompt___add_or_edit')) {
				// Find det relevante select-element baseret på formObj.organization_section_type
				const selectElement = document.getElementById(`input_organization_${formObj.organization_section_type}`);

				if (selectElement) {
					// Hvis select element har disabled-attribute lig med true
					if (selectElement.disabled) {
						// fjern alle options
						while (selectElement.firstChild) { 
							selectElement.removeChild(selectElement.firstChild);
						}

						// Indsæt den passende første option-element
						const defaultOption = document.createElement('option');
						defaultOption.value = "";
						defaultOption.selected = true;
						defaultOption.textContent = `Eventuelt vælg en ${organizationSectionTypeLabels[formObj.organization_section_type].labelSingular_da}`;
						selectElement.insertBefore(defaultOption, selectElement.firstChild);

						// Sæt disabled-attribute til false
						selectElement.disabled = false;
					}
					
					// Opret og indsæt en ny option baseret på reverseOrder
					const newOption = document.createElement('option');
					newOption.value = responseData.newOrganizationSectionItem.id;
					newOption.textContent = responseData.newOrganizationSectionItem.name;

					if (reverseOrder) {
						// Indsæt som det næstførste element (som nr. 2 option)
						selectElement.insertBefore(newOption, selectElement.children[1]);
					} else {
						// Indsæt som det sidste element
						selectElement.appendChild(newOption);
					}
				}
			}
		}
	}

	for (const addOrEditItemFormElement of organizationSectionAddOrEditItemFormElements) {
		addOrEditItemFormElement.addEventListener('submit', addOrEditOrganizationSectionItem);
	}


});