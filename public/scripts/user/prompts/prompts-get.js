import { setupCopyAndClearButtons } from './shared/copy-and-clear-buttons.js';

document.addEventListener('DOMContentLoaded', function () {

	setupCopyAndClearButtons('.promptItemCopyBtn', '.promptItemArticle', '.promptItemBodyText', 'copy', false);

	// håndter når der slettes en organization-section item
	const promptItemDeleteBtnElements = document.getElementsByClassName('promptItemDeleteBtn');

	async function deletePromptItem(event) {
		const btnElement = event.target;
		const itemId = btnElement.dataset.itemid;		
		const csrfToken = btnElement.dataset.csrf;

		const response = await fetch(`/user/prompt/delete/${itemId}`, {
			method: 'DELETE',
			headers: {'x-csrf-token': csrfToken}
		});

		if (!response.ok) {
			alert('Something went wrong!');
			return;
		}

		const promptItemElement = document.getElementById(`promptItem-${itemId}`);

		if (promptItemElement) {
			const parentElement = promptItemElement.parentElement;
			promptItemElement.remove();

			// Kontroller om parent elementet ikke længere har nogen children-elementer
			if (parentElement.children.length === 0) {
				// Tilføj klassen "noItems" til parentElement ("#promptItems"-elementet)
				parentElement.classList.add('noItems');
				
				let collapseSidebarOpen = true;
				if (document.body.classList.contains('sidebar-closed')) {
					collapseSidebarOpen = false;
				}

				let organizationSectionType_labelSingular_da = '';
				if (document.body.classList.contains('user__prompts_get__categories')) {
					organizationSectionType_labelSingular_da = 'kategori';
				}
				if (document.body.classList.contains('user__prompts_get__folders')) {
					organizationSectionType_labelSingular_da = 'mappe';
				}

				const cardLayout_rowClasses = `cardLayout_rowClasses mb-1 ${collapseSidebarOpen ? 'mb-md-2' : 'mb-sm-2'}`;
				const cardLayout_firstRowClasses = `cardLayout_firstRowClasses mt-1 ${collapseSidebarOpen ? 'mt-md-2' : 'mt-sm-2'}`;
				const cardLayout_cardPaddingClasses = `cardLayout_cardPaddingClasses p-2 ${collapseSidebarOpen ? 'p-md-3' : 'p-sm-3'}`;
				const cardLayout_containerAndRowClasses = `cardLayout_containerAndRowClasses gx-2 ${collapseSidebarOpen ? 'gx-md-3 gx-lg-4' : 'gx-sm-3 gx-md-4'}`;

				// tilføj følgende html til parentElement:
				/*
				<li id="noPromptItemsFound_row" class="row <%= `${cardLayout_rowClasses} ${cardLayout_firstRowClasses} ${cardLayout_containerAndRowClasses}` %>">
					<div class="col">
						<div class="<%= `${cardLayout_cardPaddingClasses}` %>">
							<h3 class="h6 text-body-tertiary fw-medium mb-0">
								Ingen prompts her. Tryk på "Tilføj Prompt"-knappen for at tilføje en prompt<%= organizationSectionType_labelSingular_da ? ` til denne ${organizationSectionType_labelSingular_da}` : '' %>.
							</h3>
						</div>
					</div>
				</li>
				*/

				// Opret HTML-indholdet dynamisk
				const liElement = document.createElement('li');
				liElement.id = 'noPromptItemsFound_row';
				liElement.className = `row ${cardLayout_rowClasses} ${cardLayout_firstRowClasses} ${cardLayout_containerAndRowClasses}`;

				const divCol = document.createElement('div');
				divCol.className = 'col';

				const divPadding = document.createElement('div');
				divPadding.className = `${cardLayout_cardPaddingClasses}`;

				const h3Element = document.createElement('h3');
				h3Element.className = 'h6 text-body-tertiary fw-medium mb-0';
				h3Element.innerHTML = `Ingen prompts her. Tryk på "Tilføj Prompt"-knappen for at tilføje en prompt${organizationSectionType_labelSingular_da ? ` til denne ${organizationSectionType_labelSingular_da}` : ''}.`;

				// Saml elementerne
				divPadding.appendChild(h3Element);
				divCol.appendChild(divPadding);
				liElement.appendChild(divCol);

				parentElement.appendChild(liElement);
			}
		}
	}

	for (const deleteBtnElement of promptItemDeleteBtnElements) {
		deleteBtnElement.addEventListener('click', deletePromptItem);
	}

});