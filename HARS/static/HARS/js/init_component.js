const delay = ms => new Promise(res => setTimeout(res, ms));


function render_to_string(component) {
    self = component
    return component.view(self);
}

const observer = new MutationObserver((mutations) => { 
    mutations.forEach((mutation) => {
      const el = mutation.target;
      console.log(el)
      const component_name = el.getAttribute('data-component');
      const newValue = el.getAttribute(mutation.attributeName);
//      console.log("c", component_name);
		self = components[component_name]
      self["Attribute_changed"](self, mutation.attributeName, mutation.oldValue, newValue);
      render_component(el)
      
      //console.log(mutation.oldValue)
//      if ((!mutation.oldValue || !mutation.oldValue.match(/\bis-busy\b/)) 
//        && mutation.target.classList 
//        && mutation.target.classList.contains('is-busy')){
//        alert('is-busy class added');
//      }
    });
 });

function render_component(c) {
	let component_name = c.getAttribute('data-component');
	const dom_string = render_to_string(components[component_name]);

	let tag = dom_string.match(/<.*?>/g)[0] // .*? is non-greedy
	let tagName = tag.match(/<([\w-]+)/)[1]

	const newItem = document.createElement(tagName);
	
	let attributes = tag.match(/[\w-]+=["'].*?['"]/g)  
	
	if (attributes) {
		attributes.forEach((attribute) => {
			let m = attribute.match(/(.*?)=['"](.*?)["']/)
			let key = m[1]
			let value = m[2]
			newItem.setAttribute(key, value)
		})
	}
	front_removed = dom_string.trim().substring(tag.length).trim()
	inner_html = front_removed.substring(0, front_removed.length-tagName.length-3).trim()
	
	newItem.innerHTML = inner_html

	c.parentNode.replaceChild(newItem, c);
	
	console.log("Rendering:", newItem)
	
	init_form(newItem)
	init_modal(newItem)
	init_observe(newItem)
	//render_components_in(newItem)
	if (components[component_name].hasOwnProperty("onupdate")) {
		components[component_name].onupdate(newItem);
	}
}

function init_observe(c) {
	let component_name = c.getAttribute('data-component')
	if (component_name) {
		if ("attributeFilter" in components[component_name]) {
			observer.observe(c, {
			  attributes: true, 
			  attributeOldValue: true,
			  attributeFilter: components[component_name]["attributeFilter"] 
			});
		}
	}
}

async function init_component(c) {

	let source = c.getAttribute('data-source')

	if (!source) {
		render_component(c)
		return;
	}
	
	console.log("Fetching", source, c)

	fetch(source, {
	  method: 'GET',
	  headers: {
    	'Accept': 'application/json'
  		}
	})
	.then((response) => {
		console.log("Data received from server", response)
		if (response.status !== 404) {
			response.json().then((data) => {
				let component_name = c.getAttribute('data-component');
				components[component_name]["data"] = data;
				components[component_name]["status"] = response.status;
				delay(100);
				render_component(c)
				if (component_name in queue) {
					console.log("Executing queue " + queue[component_name])
					
					execute_queue(component_name);
				}
			})
		}
		else {
			response.text().then((message) => {
				//alert(message)
				let component_name = c.getAttribute('data-component');
				components[component_name]["status"] = response.status;
				delay(100);
				render_component(c)
			})		
		}
	})
}

function render_components_in(selector) {
	if (selector === undefined)
		selector = document.body
		
	var component_list = [];
	
	let self_component = selector.getAttribute('data-component');
	if (self_component) {
		component_list = [selector]
	}
	else {
		component_list = selector.querySelectorAll('[data-component]');
	}

	component_list.forEach((c) => {
				
		let defer = c.getAttribute('data-defer')
	
		if (defer) {
			return;
		}
		
		console.log("Initializing component", c)
		
		init_component(c)
	})
}

function render_details_in(selector) {
	if (selector === undefined)
		selector = document.body
		
	var details_list = [];
	
	//console.log(selector)
	let self_details = (selector.tagName == "details");
	if (self_details) {
		details_list = [selector]
	}
	else {
		details_list = selector.querySelectorAll('details');
	}
	
	details_list.forEach((d) => {
		d.addEventListener('toggle', function(that) {
			if (that.target.hasAttribute("open")) {
				console.log("Rendering", that)
				render_components_in(that.target)
			}
		})
	})
}

/*
$('[data-component').each(function() {
	//const template = document.getElementById($(this).data('template')).innerHTML;
	let that = this;
	
	let source = this.getAttribute('data-source')
	let component_name = this.getAttribute('data-component')
	
	fetch(source, {
	  method: 'GET',
	  headers: {
    	'Accept': 'application/json'
  		}
	})
	.then((response) => response.json())
	.then((data) => {
		if (data[0] == 0) {
			const rendered = render(component[component_name], data[1]);
		 	$( that ).replaceWith( rendered );
			init_modal();
		} else {
			alert(data[1]);
		}	
	})    
});*/