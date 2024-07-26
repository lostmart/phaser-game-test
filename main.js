import "./style.css"
import Phaser, { Physics } from "phaser"

const windowSize = {
	width: 500,
	height: 500,
}

const speedDown = 300

class GameScene extends Phaser.Scene {
	constructor() {
		super("scene-game")
		this.player
		this.cursor
		this.playerSpeed = speedDown + 50
		this.target
	}

	preload() {
		this.load.image("bg", "/assets/bg.png")
		this.load.image("basket", "/assets/basket.png")
		this.load.image("apple", "/assets/apple.png")
	}
	create() {
		// bg
		this.add.image(0, 0, "bg").setOrigin(0, 0)
		// player
		this.player = this.physics.add
			.image(0, windowSize.height - 100, "basket")
			.setOrigin(0, 0)
		this.player.setImmovable(true)
		this.player.body.allowGravity = false
		this.player.setCollideWorldBounds(true)
		// cursor
		this.cursor = this.input.keyboard.createCursorKeys()
		// apple
		this.target = this.physics.add.image(0, 0, "apple").setOrigin(0, 0)
		this.target.setMaxVelocity(0, speedDown + 20)
	}
	update() {
		const { right, left } = this.cursor

		if (left.isDown) {
			this.player.setVelocityX(-this.playerSpeed)
		} else if (right.isDown) {
			this.player.setVelocityX(this.playerSpeed)
		} else {
			this.player.setVelocityX(0)
		}

		// prevent apple from falling infinitevly
		if (this.target.y >= windowSize.height) {
			this.target.setY(0)
			this.target.setX(this.getRandomX())
		}
	}

	getRandomX() {
		return Math.floor(Math.random() * 480)
	}
}

const config = {
	type: Phaser.WEBGL,
	width: windowSize.width,
	height: windowSize.height,
	canvas: gameCanvas,
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: speedDown },
			debug: true,
		},
	},
	scene: [GameScene],
}

const game = new Phaser.Game(config)
