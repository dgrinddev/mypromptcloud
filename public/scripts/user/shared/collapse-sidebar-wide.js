// BEMÆRK: dette kode bruges kun fordi der er en fejl. se collapse-sidebar-wide.css for mere info

document.addEventListener('DOMContentLoaded', function () {
	
	const headerNavbarCollapse = document.getElementById('headerNavbarCollapse');
	const collapseSidebar = document.getElementById('collapseSidebar');
	
	headerNavbarCollapse.addEventListener('hidden.bs.collapse', event => {
		if (event.target.id === 'headerNavbarCollapse') {
			collapseSidebar.classList.remove('collapseSidebarWide')
		}
	});

	headerNavbarCollapse.addEventListener('show.bs.collapse', event => {
		if (event.target.id === 'headerNavbarCollapse') {
			collapseSidebar.classList.add('collapseSidebarWide')
		}
	});

});
