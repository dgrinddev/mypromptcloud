document.addEventListener('DOMContentLoaded', function () {
	// hvis jeg vil tilføje/fjerne classes udelukkende baseret på om viewport er xs eller sm-xxl og ikke ift om collapseSidebar er åben eller lukket
	var addRemoveConfigSmallScreens = [
		// { selector: '', add: [''], remove: [''] },
	];
	var addRemoveConfigAlwaysInstantly = [
		// { selector: '', add: [''], remove: [''] },
	];
	var addRemoveConfigAlwaysAfterAnimation = [
		// { selector: '', add: [''], remove: [''] },
	];

	// de classes som er under `add` og `remove` er de classes som skal tilføjes og fjernes når collapseSidebar skal vises (når den skal skjules er det omvendt)
	var addRemoveConfig = [
		{ selector: 'body', add: ['sidebar-open'], remove: ['sidebar-closed'] },

		{ selector: '.cardLayout_contentHeaderInsidecolInside_pClass', add: ['px-md-3'], remove: ['px-sm-3'] },
		{ selector: '.cardLayout_containerAndRowClasses', add: ['gx-md-3', 'gx-lg-4'], remove: ['gx-sm-3', 'gx-md-4'] },
		{ selector: '.cardLayout_firstRowClasses', add: ['mt-md-2'], remove: ['mt-sm-2'] },
		{ selector: '.cardLayout_rowClasses', add: ['mb-md-2'], remove: ['mb-sm-2'] },
		{ selector: '.cardLayout_cardPaddingClasses', add: ['p-md-3'], remove: ['p-sm-3'] },

		{ selector: '.promptItemBtnGroup', add: ['ms-md-3'], remove: ['ms-sm-3'] },
		{ selector: '.promptItemCopyBtn', add: ['px-md-2'], remove: ['px-sm-2'] },
		{ selector: '.promptItemCopyBtnText', add: ['d-md-block'], remove: ['d-sm-block'] },

		{ selector: '.promptItemBodyText', add: ['textTruncateMultiline_lg_3'], remove: ['textTruncateMultiline_md_3'] },

		{ selector: '.promptItemMetadata_OrganizationSectionLabelsWrapper', add: ['col-sm-8'], remove: ['col-sm-9'] },
		{ selector: '.promptItemHave_categories .promptItemMetadata_OrganizationSectionLabel_folders', add: ['pe-md-2'], remove: ['pe-sm-2'] },
		{ selector: '.promptItemHave_folders .promptItemMetadata_OrganizationSectionLabel_categories', add: ['ps-md-2'], remove: ['ps-sm-2'] },
		{ selector: '.promptItemMetadata_date', add: ['ps-lg-3'], remove: ['ps-md-3'] },
		{ selector: '.promptItemMetadata_dateLong', add: ['d-md-block'], remove: ['d-sm-block'] },
		{ selector: '.promptItemMetadata_dateShort', add: ['d-md-none'], remove: ['d-sm-none'] },

		// nedenstående er noget jeg brugte da datoen blev tvunget ned på næste linje på xs-breakpoint (eller både xs og sm hvis collapse sidebar var åben):
		// { selector: '.promptItemMetadata_OrganizationSectionLabelsWrapper', add: ['col-md-9', 'pe-md-0'], remove: ['col-sm-9', 'pe-sm-0'] },
		// { selector: '.promptItemMetadata_date', add: ['col-md-auto', 'ps-md-3', 'mt-md-0', 'justify-content-md-end'], remove: ['col-sm-auto', 'ps-sm-3', 'mt-sm-0', 'justify-content-sm-end'] },

		{ selector: '.input_organization-col', add: ['col-lg-6'], remove: ['col-sm-6'] },
		{ selector: '.input_organization-col.notLastItem', add: ['mb-lg-0'], remove: ['mb-sm-0'] },

		{ selector: '.inputPrompttypeBtn', add: ['px-md-2'], remove: ['px-sm-2'] },
		{ selector: '#improvePromptBtn', add: ['px-md-2'], remove: ['px-sm-2'] },
		{ selector: '.contentCopyBtn', add: ['px-md-2'], remove: ['px-sm-2'] },
		{ selector: '.contentCopyBtnText', add: ['d-md-block'], remove: ['d-sm-block'] },
		{ selector: '.contentClearBtn', add: ['px-md-2'], remove: ['px-sm-2'] },
		{ selector: '.contentClearBtnText', add: ['d-md-block'], remove: ['d-sm-block'] },
		{ selector: '.acceptOrDeclineImprovementBtn', add: ['px-md-2'], remove: ['px-sm-2'] },
		
		{ selector: '.input_organization-descriptionContainer', add: ['doesntHaveContent_d-lg-block'], remove: ['doesntHaveContent_d-sm-block'] },
	];

	if (!reverseHeaderAndBodyBgColors) {
		addRemoveConfig.push(...[
			// DETTE ÆNDRER BACKGROUND-COLOR FRA HVID TIL GRÅLIG I #headerUser OG #contentHeader:
			// baggrundsfarve bliver en smule mørkere i headerUser og contentHeader når sidebar lukkes
			// indsæt 'bg-light-subtle' som remove, den passer godt til case 4 i valg af farvetema i head-user.ejs
			// indsæt 'bg-body' som add hvis case 4 er valg af farvetema i head-user.ejs
			{ selector: '#headerUser', add: ['bg-body'], remove: ['bg-light-subtle'] },
			{ selector: '#contentHeader', add: ['bg-body'], remove: ['bg-light-subtle'] },

			// DETTE ER STYLING FOR BUTTONS I #headerUser:
			{ selector: '#collapseSidebarToggler', add: ['btnExtraLight'], remove: ['btnLight'] },
			{ selector: '#offcanvasSidebarToggler', add: ['btnExtraLight'], remove: ['btnLight'] },
			{ selector: '#navUserDropdownToggle', add: ['btnExtraLight'], remove: ['btnLight'] },
			{ selector: '#headerNavbarToggler', add: ['btnExtraLight'], remove: ['btnLight'] },
			
			// DETTE ER STYLING FOR BUTTONS I #headerNavBtnGroup OG #headerNavBtnGroup_XsAndSm:
			{ selector: '#btnGroup_oversigt', add: ['btnExtraLightLink'], remove: ['btnLightLink'] },
			{ selector: '#btnGroup_share', add: ['btnExtraLightLink'], remove: ['btnLightLink'] },
			{ selector: '#btnGroup_history', add: ['btnExtraLightLink'], remove: ['btnLightLink'] },
			//{ selector: '#btnGroup_support', add: ['btnExtraLightLink'], remove: ['btnLightLink'] },//bruges ikk
			{ selector: '#btnGroup_export-import', add: ['btnExtraLightLink'], remove: ['btnLightLink'] },

			// DETTE ER STYLING FOR "li"-elementer i "ul.promptItems":
			{ selector: '.cardLayout_cardBgClasses', add: ['bg-body'], remove: ['bg-light-subtle'] },
		]);
	}

	if (showHeaderNavbarCollapse) {
		addRemoveConfig.push(...[
			// DETTE ER STYLING FOR RESPONSIVENESS I #headerUser:
			{ selector: '#headerNavbar', add: ['navbar-expand-xl'], remove: ['navbar-expand-lg'] },
			{ selector: '#headerNavbarToggler', add: ['ms-xl-0'], remove: ['ms-lg-0'] },
			{ selector: '#headerNavbarCollapse', add: ['ms-xl-2', 'order-xl-0', 'mt-xl-0'], remove: ['ms-lg-2', 'order-lg-0', 'mt-lg-0'] },
			{ selector: '#headerNavBtnGroup', add: ['d-lg-inline-flex', 'w-100-lg'], remove: ['d-md-inline-flex', 'w-100-md'] },
			{ selector: '#headerNavBtnGroup_XsAndSm', add: ['d-lg-none'], remove: ['d-md-none'] },
		]);
	}

	var collapseSidebarToggler = document.getElementById('collapseSidebarToggler');
	var collapseSidebarTogglerContainer = collapseSidebarToggler.parentElement;
	var offcanvasSidebarToggler = document.getElementById('offcanvasSidebarToggler');
	var offcanvasSidebarTogglerContainer = offcanvasSidebarToggler.parentElement;
	var collapseSidebar = document.getElementById('collapseSidebar');
	var offcanvasSidebar = document.getElementById('offcanvasSidebar');
	var offcanvasInstance = new bootstrap.Offcanvas(offcanvasSidebar);

	var collapseInstance = new bootstrap.Collapse(collapseSidebar, {toggle: false});
	// var collapseInstance = bootstrap.Collapse.getInstance('#collapseSidebar');
	// var collapseInstance = bootstrap.Collapse.getInstance('#collapseSidebar', {toggle: false});

	/*
	function toggleClasses(elementsConfig, sidebarShow) {
		elementsConfig.forEach((elementConfig) => {
			var element = document.getElementById(elementConfig.id);
			var addClasses = sidebarShow ? elementConfig.add : elementConfig.remove;
			var removeClasses = sidebarShow ? elementConfig.remove : elementConfig.add;
			addClasses.forEach(cls => element.classList.add(cls));
			removeClasses.forEach(cls => element.classList.remove(cls));
		});
	}
	*/

	function toggleClasses(elementsConfig, sidebarShow) {
		elementsConfig.forEach((elementConfig) => {
			// Find alle elementer, der matcher CSS-selector
			var elements = document.querySelectorAll(elementConfig.selector);
			var addClasses = sidebarShow ? elementConfig.add : elementConfig.remove;
			var removeClasses = sidebarShow ? elementConfig.remove : elementConfig.add;
	
			// Gå gennem alle fundne elementer
			elements.forEach((element) => {
				addClasses.forEach(cls => element.classList.add(cls));
				removeClasses.forEach(cls => element.classList.remove(cls));
			});
		});
	}

	function changeCollapseSidebarTogglerIcon(sidebarShow) {
		const iconId = sidebarShow ? '#bootstrapIcon-arrow-bar-left' : '#bootstrapIcon-arrow-bar-right';
		const svgElement = collapseSidebarToggler.querySelector('svg');
		const useElement = svgElement.querySelector('use');
		useElement.setAttribute('xlink:href', iconId);
	};

	collapseSidebar.addEventListener('hide.bs.collapse', event => {
		if (event.target.id === 'collapseSidebar') {
			const sidebarShow = false;
			toggleClasses(addRemoveConfigAlwaysInstantly, sidebarShow);
			changeCollapseSidebarTogglerIcon(sidebarShow);
		}
	});

	collapseSidebar.addEventListener('hidden.bs.collapse', event => {
		if (event.target.id === 'collapseSidebar') {
			const sidebarShow = false;
			toggleClasses(addRemoveConfig, sidebarShow);
			toggleClasses(addRemoveConfigAlwaysAfterAnimation, sidebarShow);
			// collapseSidebarToggler.blur();
		}
	});

	collapseSidebar.addEventListener('show.bs.collapse', event => {
		if (event.target.id === 'collapseSidebar') {
			const sidebarShow = true;
			toggleClasses(addRemoveConfig, sidebarShow);
			toggleClasses(addRemoveConfigAlwaysInstantly, sidebarShow);
			changeCollapseSidebarTogglerIcon(sidebarShow);
		}
	});

	collapseSidebar.addEventListener('shown.bs.collapse', event => {
		if (event.target.id === 'collapseSidebar') {
			const sidebarShow = true;
			toggleClasses(addRemoveConfigAlwaysAfterAnimation, sidebarShow);
			// collapseSidebarToggler.blur();
		}
	});

	function checkViewport() {
		console.log('window.innerWidth: ' + window.innerWidth);
		
		var isSmallScreen = window.innerWidth <= 576-0.02;
		if (isSmallScreen) {
			toggleClasses(addRemoveConfigSmallScreens, false);
			// Skjul collapseSidebarTogglerContainer og vis offcanvasSidebarTogglerContainer
			collapseSidebarTogglerContainer.style.display = 'none';
			offcanvasSidebarTogglerContainer.style.display = 'block';
			// Luk collapseSidebar, hvis det er åbent
			if (collapseSidebar.classList.contains('show')) {
				collapseInstance.hide();
			}
		} else {
			toggleClasses(addRemoveConfigSmallScreens, true);
			// Skjul offcanvasSidebarTogglerContainer og vis collapseSidebarTogglerContainer
			offcanvasSidebarTogglerContainer.style.display = 'none';
			collapseSidebarTogglerContainer.style.display = 'block';
			// Luk offcanvasSidebar, hvis det er åbent
			if (offcanvasSidebar.classList.contains('show')) {
				offcanvasInstance.hide();
			}
		}
	}

	// Initial check ved sideindlæsning
	checkViewport();
	// Lyt efter ændringer i viewport-størrelse
	window.addEventListener('resize', checkViewport);


});

