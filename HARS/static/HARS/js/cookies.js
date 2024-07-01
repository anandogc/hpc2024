/**
 * 
 */

 					
function setCookies() {
    document.cookie = font_size_selector.value + ":" + pallete_selector.value;
}

function getCookies() {
	let font_size=document.cookie.split(":")[0]
	let theme=document.cookie.split(":")[1]
	
	if (font_size) {
		pallete.style.fontSize = font_size;
		if (font_size_selector !== null)
			font_size_selector.value = font_size;

	}
	
	if (theme) {
		pallete.className = theme;
		if (pallete_selector !== null)
			pallete_selector.value = theme;
	}
}

getCookies();