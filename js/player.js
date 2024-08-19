game.player = {
	x: 54,
	y: 0,
	height: 24,
	highestY: 0,
	direction: "left",
	isInAir: false,
	startedJump: false,
	canDoubleJump: true, // Thêm Variable nhảy đôi
	moveInterval: null,
	fallTimeout: function(startingY, time, maxHeight) {
		setTimeout( function () {
			if (this.isInAir) {
				this.y = startingY - maxHeight + Math.pow((-time / 3 + 11), 2)
				if (this.y < this.highestY) {
					this.highestY = this.y
					
					// Update Score khi đạt đến độ cao mới
					var points = Math.round(-this.highestY / (3 * game.options.tileHeight));
					game.counter.innerHTML = "A game by Karol Swierczek | Controls: A, D / arrows and SPACE | Points: " + points;
				}
				if (time > 37) {
					this.startedJump = false
					game.checkCollisions()
				}
				if (time < 150) {
					time++
					this.fallTimeout(startingY, time, maxHeight)
				} else {
					game.isOver = true
				}
				if (this.y > 40) {
					game.isOver = true
				}
				game.requestRedraw()
			}
		}.bind(this, startingY, time, maxHeight), 12)
	},
	animationFrameNumber: 0,
	collidesWithGround: true,
	animations: {
		// Describe coordinates of consecutive animation frames of objects in textures
		left: [{tileColumn: 4, tileRow: 0}, {tileColumn: 5, tileRow: 0}, {tileColumn: 4, tileRow: 0}, {tileColumn: 6, tileRow: 0}],
		right: [{tileColumn: 9, tileRow: 0}, {tileColumn: 8, tileRow: 0}, {tileColumn: 9, tileRow: 0}, {tileColumn: 7, tileRow: 0}]
	},
	jump: function (type) {
		if (!this.isInAir || (this.isInAir && this.canDoubleJump)) { 
			clearInterval(this.fallInterval)
			game.sounds.jump.play()
	
			if (this.isInAir) {
				this.canDoubleJump = false; // Nếu đang trên không và nhảy lần thứ hai, tắt nhảy đôi
			} else {
				this.isInAir = true; // Nếu là lần nhảy đầu tiên, đặt isInAir thành true
			}
	
			this.startedJump = true
			var startingY = this.y
			var time = 1
			var maxHeight = 121
			if (type == "fall") {
				time = 30
				maxHeight = 0
			}
			this.fallTimeout(startingY, time, maxHeight)
		}
	}
}
