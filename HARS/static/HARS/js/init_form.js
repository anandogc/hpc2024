/**
 * 
 */

/* By John Weisz - https://stackoverflow.com/a/55152476/1525392 */
async function readFileAsDataURL(file) {
    let result_base64 = await new Promise((resolve) => {
        let fileReader = new FileReader();
        fileReader.onload = (e) => resolve(fileReader.result);
        fileReader.readAsDataURL(file);
    });

    //console.log(result_base64); // aGV5IHRoZXJl...

    return result_base64;
}


var message = new LekhoMessage();

async function form_submit(event){
	event.preventDefault();
	
	for (const el of this.querySelectorAll("[required]")) {
	el.classList.remove('b--dark-red')
  	el.parentElement.classList.remove('b--dark-red')

	  if (el.value === '') {	  	
	  	if (el.type !== 'hidden') {
	  		el.classList.add('b--dark-red')
	  		el.focus()
	  		return;
	  	}
	  	else {
	  		el.parentElement.classList.add('b--dark-red')
	  		el.parentElement.querySelector('input').focus()
	  		return;
	  	}
	  }
	}
	
	message.showLoader("Processing request")
	let that = this;
	
	const data = {}
	
		
	for (const pair of new FormData(this)) {		
		if (pair[1] instanceof File) {
			let dataURL = await readFileAsDataURL(pair[1]);
			let file = [pair[1].name, pair[1].size, dataURL]

	    	data[pair[0]] = file
	
	    }
	    else {
	    	data[pair[0]] = pair[1]
		}
	}	
	
	let method = this.getAttribute('data-method')
	if (method === null)
		method = "POST"

	let action = this.getAttribute('data-action');
	if (!action) {
		action = this.getAttribute('data-source')
	}
	
	fetch(action, {
	    method: method,
	     headers: {
            'X-CSRFToken': csrfToken,
        },
	    body: JSON.stringify(data),
	}).then(function(response) {

		if (response.status == 200) {
			response.text().then(function(text) {
				
				let dialog = $(that).closest('dialog')[0]
				if (dialog) {
					dialog.close()
				}
	
				if (that.getAttribute('data-reload-page')) {
					location.reload();
				}

				init_component(that)
				
				let reload = that.getAttribute('data-reload')
	
				if (reload !== null) {
					if (!reload.includes(',') ) {					
						let c = document.getElementById(reload)
						render_components_in(c)
					}
					else {
						reload.split(',').forEach(function(r) {
							let c = document.getElementById(r)
							render_components_in(c)
						})
					}
		
				}
				message.closeMessage()
			})
		}
		else {
			response.text().then((text) => {
				message.error(text)
			})		
		}
		
		//enable_form(that)
			//if (that.getAttribute('data-reload') == "true") {
			//	location.reload();	
			//} 
	})


//	    var formData = new FormData(this);
//	    
//	    fetch(this.getAttribute('data-action'),
//	    {
//	       body: formData,
//	       method: this.getAttribute('data-method')
//	    }); // .then(…)
	    
	    //Dont submit the form
    return false; 
}
//https://stackoverflow.com/a/46642899
function init_form(parent) {
	if (parent === undefined) {
		parent = document.body
	}

	if (parent.tagName == "FORM") {
		if (parent.getAttribute('data-action')) {
			let form = parent
			form.addEventListener("submit", form_submit)
		}	
	}
	else {
		let forms = parent.querySelectorAll('form[data-action]')
		for (const form of forms) {
		  	form.addEventListener("submit", form_submit)
		} 
	}
}

init_form()