//import Phaser, { Physics } from "phaser"

const windowSize = {
	width: 500,
	height: 500,
}

const speedDown = 300

const gameStartDiv = document.querySelector("#gameStartDiv")
const gameStartBtn = document.querySelector("#gameStartBtn")
const gameEndDiv = document.querySelector("#gamseEndDiv")
const gameWinLoseSpan = document.querySelector("#gameWinLoseSpan")
const gameEndScoreSpan = document.querySelector("#gameEndScoreSpan")

class GameScene extends Phaser.Scene {
	constructor() {
		super("scene-game")
		this.player
		this.cursor
		this.playerSpeed = speedDown + 50
		this.target
		this.points = 0
		this.textScore
		this.bgMusic
		this.coinSound
		this.emitter
	}

	preload() {
		this.load.image("bg", "/assets/bg.png")
		this.load.image("basket", "/assets/basket.png")
		this.load.image("apple", "/assets/apple.png")
		this.load.image("money", "/assets/money.png")
		this.load.audio("coin", "/assets/coin.mp3")
		this.load.audio("bgMusic", "/assets/bgMusic.mp3")
	}
	create() {
		this.scene.pause("scene-game")

		// sounds & music
		this.coinSound = this.sound.add("coin")
		this.bgMusic = this.sound.add("bgMusic")
		this.bgMusic.play()
		// bg
		this.add.image(0, 0, "bg").setOrigin(0, 0)
		// player
		this.player = this.physics.add
			.image(0, windowSize.height - 100, "basket")
			.setOrigin(0, 0)
		this.player.setImmovable(true)
		this.player.body.allowGravity = false
		this.player.setCollideWorldBounds(true)
		this.player.setSize(80, 25).setOffset(10, 45)
		// this.player.setSize(
		// 	this.player.width - this.player.width / 4,
		// 	this.player.height - this.player.height / 2
		// )
		// cursor
		this.cursor = this.input.keyboard.createCursorKeys()
		// apple
		this.target = this.physics.add.image(0, 0, "apple").setOrigin(0, 0)
		this.target.setMaxVelocity(0, speedDown + 20)
		// physics
		this.physics.add.overlap(
			this.target,
			this.player,
			this.targetHit,
			null,
			this
		)
		// score text
		this.textScore = this.add.text(windowSize.width - 120, 10, "Score: 0", {
			font: "25px Arial",
			fill: "#000",
		})
		// particle emitter
		this.emitter = this.add.particles(0, 0, "money", {
			speed: 100,
			gravityY: speedDown - 200,
			scale: 0.025,
			duration: 100,
			emitting: false,
		})
		this.emitter.startFollow(
			this.player,
			this.player.width / 2,
			this.player.height / 2,
			true
		)
		console.log(this.player)
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

	targetHit() {
		this.coinSound.play()
		this.emitter.start()
		this.target.setY(0)
		this.target.setX(this.getRandomX())
		this.points++
		this.textScore.setText(`Score: ${this.points}`)
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

gameStartBtn.addEventListener("click", () => {
	gameStartDiv.style.display = "none"
	game.scene.resume("scene-game")
})
