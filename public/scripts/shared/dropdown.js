/* ______ Fjerner hover-effekten fra dropdown-trigger-elementet, når dropdown-menuen skjules ______ */
// Dette var nødvendigt, når dropdown er blevet lukket ved at klikke på dropdown-trigger-elementet igen, mens dropdown var åben.
// Men det lader til ikke at være noget problem længere for #navUserDropdownToggle og nu er det kun nødvendigt for #navFunktionerDropdown.
// Hvis det igen bliver et problem for andre dropdowns end #navFunktionerDropdown så kan alle dropdown rammes ved at indsætte '.dropdown-toggle' i querySelectorAll() her nedenfor:
document.querySelectorAll('#navFunktionerDropdown').forEach(function(dropdownToggle) {
	// tilføj en eventListener som kigger efter om dropdown lukkes/skjules
	dropdownToggle.addEventListener('hidden.bs.dropdown', function(event) {
		// hvor den så skal blur '.dropdown-toggle'-elementet
		dropdownToggle.blur();
	});
});