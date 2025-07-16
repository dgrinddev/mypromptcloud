document.addEventListener('DOMContentLoaded', () => {

	function initializeGrowers() {
		const growers = document.querySelectorAll(".textareaGrowWrap");
	
		growers.forEach((grower) => {
			const textarea = grower.querySelector("textarea");
			textarea.addEventListener("input", () => {
				grower.dataset.replicatedValue = textarea.value;
			});
			grower.dataset.replicatedValue = textarea.value;
		});
	}

	initializeGrowers();

});