
 function LekhoMessage(options) {
	 
	    var options = options || {
			"set": "lunar"
		}
        this.timerId = null;
        var that = this;
        
    	this.loader = document.querySelector('dialog.loader');
		this.emoji = this.loader.querySelector('.emoji');
		this.message = this.loader.querySelector('.message');
        this.close = this.loader.querySelector('.close')
		this.close.addEventListener('click', function() {
			that.closeMessage()
		})
		
		this.loader.addEventListener('close', function() {
			that.closeMessage();
		});
		
        //By Greem - https://javascript.plainenglish.io/adding-loader-to-your-deployed-projects-d8f389e8c928
        this.showLoader = function (text) {
			const emojis = {
				"lunar": ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"],
				"clock": ["🕐", "🕜", "🕑","🕝", "🕒", "🕞", "🕓", "🕟", "🕔", "🕠", "🕕", "🕡", "🕖", "🕢",  "🕗", "🕣", "🕘", "🕤", "🕙",  "🕥", "🕚", "🕦",  "🕛", "🕧"],
				"arrows": ["⬆️", "↗️", "➡️", "↘️", "⬇️", "↙️", "⬅️", "↖️"],
				"harmony": ["⚛️", "🕉️", "✡️", "☸️", "☯️", "✝️", "☦️", "☪️", "☮️"],
				"numeric": ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9⃣"],
				"cards": ["♠️", "♥️", "♦️", "♣"],
				"zodiac": ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"],
				"Circular": ["🔴", "🟠", "🟡", "🟢", "🔵", "🟣", "🟤", "⚫", "⚪"],
				"Angular": ["🟥", "🟧", "🟨", "🟩", "🟦", "🟪", "🟫", "⬛", "⬜"],
				"User": ["🔴<br>🟥", "🟠<br>🟧", "🟡<br>🟨", "🟢<br>🟩", "🔵<br>🟦", "🟣<br>🟪", "🟤<br>🟫", "⚫<br>⬛", "⚪<br>⬜"]
			}

			const interval = 200;
			
			const loadEmojis = (arr) => {
			    let i = 0;
			    let n = emojis.length
			
			    this.timerId = setInterval(() => {
			      this.emoji.innerText = arr[ (i++) % arr.length];
			      //console.log(Math.floor(Math.random() * arr.length))
			    }, interval);
			}
			
			loadEmojis(emojis[options.set]);
			this.message.innerText = text;
			this.message.classList.add('color1')
			this.message.classList.remove('dark-red')
			if (!this.loader.open)
				this.close.classList.add('dn')
			this.loader.showModal();	
		}

        this.stopLoader = function () {
            window.clearInterval(this.timerId);
        };

        this.closeMessage = function () {
            this.stopLoader()
            this.loader.close();	
        };
        
        this.alert = function(text) {
			this.message.classList.add('color1')
			this.message.classList.remove('dark-red')
			this.message.innerText = text;
			this.close.classList.remove('dn')
			if (!this.loader.open)
				this.loader.showModal();
		}
			        
        this.error = function(text) {
			this.message.classList.remove('color1')
			this.message.classList.add('dark-red')
			this.message.innerText = text;
			this.close.classList.remove('dn')
			if (!this.loader.open)
				this.loader.showModal();	
		}
}