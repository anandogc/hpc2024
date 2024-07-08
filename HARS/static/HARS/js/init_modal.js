/**
 * 
 */

function init_modal(parent) {
	if (parent === undefined) {
		parent = document.body;
	}
	
	$("[data-modal]", parent).each(function() {
		let that = this;

		$(that).click(function() {
			let modal = document.getElementById($(that).data('modal'))

			modal.showModal()
			
			$(".close_dialog", modal).click(function(){
				modal.close();
			})
		})
	})
}