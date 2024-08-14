/**
 * 
 */

 var queue = {
	 "Profile": ["name"],
	 "Projects": ["applications", "application"]
 }

 
 function execute_queue(name) {
	 queue[name].forEach(function(c) {
		 selector = document.getElementById(c);
		 init_component(selector);
	 });
 }