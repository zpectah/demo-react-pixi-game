import React, { useRef, useEffect, useState } from 'react';

import { withPixi } from '../../Pixi.provider';
import collisionRectangle from '../../utils/collisionRectangle';

const GameWrapper = (props) => {
	const parent = useRef();
	const {
		canvasWidth = 500,
		canvasHeight = 500
	} = props;
	const AppOptions = {
		width: canvasWidth,
		height: canvasHeight,
		antialias: true,
		autoResize: true,
		resolution: 1,
	};
	const [state, setState] = useState({
		init: false,
	});
	const [playerState, setPlayerState] = useState({
		score: 0
	});

	const pixi = props.context.pixi;
	const pixiApp = new pixi.Application(AppOptions);

	// Pixi instance variables
	let keys = {},
		player,
		playerSheet = {},
		playerUI,
		chest,
		chestSheet = {};

	// Pixi loader
	pixiApp.loader
		.add('player', './player.0.sprite.png')
		.add('chest', './chest.sprite.png')
		.load((loader, resources) => onLoad(loader, resources));

	useEffect(() => onInit(), []);
	useEffect(() => onResize(), []);

	const onLoad = (loader, resources) => {
		createPlayerInstance(loader, resources);

		window.addEventListener("keydown", keysDown);
		window.addEventListener("keyup", keysUp);
	};

	function keysDown(e) {
		e.preventDefault();

		keys[e.keyCode] = true;
	}

	function keysUp(e) {
		e.preventDefault();

		keys[e.keyCode] = false;
	}

	function gameLoop() {
		// console.log(keys);

		// W or arrow top
		if (keys['87'] || keys['38']) {

			if (!player.playing) {
				player.textures = playerSheet.walk_back;
				player.play();
			}

			player.y -= 5;
		}

		// A or arrow left
		if (keys['65'] || keys['37']) {

			if (!player.playing) {
				player.textures = playerSheet.walk_left;
				player.play();
			}

			player.x -= 5;
		}

		// S or arrow down
		if (keys['83'] || keys['40']) {

			if (!player.playing) {
				player.textures = playerSheet.walk_front;
				player.play();
			}

			player.y += 5;
		}

		// D or arrow right
		if (keys['68'] || keys['39']) {

			if (!player.playing) {
				player.textures = playerSheet.walk_right;
				player.play();
			}

			player.x += 5;
		}


		if (collisionRectangle(player, chest)) {
			chest.textures = chestSheet.open;
		}

	}

	function createPlayerInstance(loader, resources) {
		createPlayerUI();

		createEnvironmentSheet();
		createStageEnvironment();

		createPlayerSheet();
		createPlayer();

		pixiApp.ticker.add(gameLoop);
	}

	function createStageEnvironment() {
		chest = new pixi.AnimatedSprite(chestSheet.closed);
		chest.anchor.set(0.5);
		chest.loop = false;
		chest.x = pixiApp.view.width / 3;
		chest.y = pixiApp.view.height / 3;
		pixiApp.stage.addChild(chest);
		chest.play();
	}

	function createPlayerUI() {
		let msg_title_style = new pixi.TextStyle({
			fontFamily: "Arial",
			fontSize: 24,
			fill: '#eeeeee',
		});
		playerUI = new pixi.Text(`Score: ${playerState.score}`, msg_title_style);

		pixiApp.stage.addChild(playerUI);
	}

	function createEnvironmentSheet() {
		const sSheet = new pixi.BaseTexture.from(pixiApp.loader.resources['chest'].url);

		// Rectangle size
		// Dimension of part of animation in sprite
		let w = 100;
		let h = 100;

		chestSheet['open'] = [
			new pixi.Texture(sSheet, new pixi.Rectangle(0 * w, 0, w, h))
		];
		chestSheet['closed'] = [
			new pixi.Texture(sSheet, new pixi.Rectangle(1 * w, 0, w, h))
		];

	}

	function createPlayerSheet() {
		const sSheet = new pixi.BaseTexture.from(pixiApp.loader.resources['player'].url);

		// Rectangle size
		// Dimension of part of animation in sprite
		let w = 125;
		let h = 187;

		playerSheet['stand_front'] = [
			new pixi.Texture(sSheet, new pixi.Rectangle(0 * w, 0, w, h))
		];
		playerSheet['stand_back'] = [
			new pixi.Texture(sSheet, new pixi.Rectangle(0 * w, 1 * h, w, h))
		];
		playerSheet['stand_left'] = [
			new pixi.Texture(sSheet, new pixi.Rectangle(0 * w, 2 * h, w, h))
		];
		playerSheet['stand_right'] = [
			new pixi.Texture(sSheet, new pixi.Rectangle(1 * w, 3 * h, w, h))
		];

		playerSheet['walk_front'] = [
			new pixi.Texture(sSheet, new pixi.Rectangle(0 * w, 0 * h, w, h)),
			new pixi.Texture(sSheet, new pixi.Rectangle(1 * w, 0 * h, w, h)),
			new pixi.Texture(sSheet, new pixi.Rectangle(2 * w, 0 * h, w, h)),
			new pixi.Texture(sSheet, new pixi.Rectangle(3 * w, 0 * h, w, h))
		];
		playerSheet['walk_back'] = [
			new pixi.Texture(sSheet, new pixi.Rectangle(0 * w, 1 * h, w, h)),
			new pixi.Texture(sSheet, new pixi.Rectangle(1 * w, 1 * h, w, h)),
			new pixi.Texture(sSheet, new pixi.Rectangle(2 * w, 1 * h, w, h)),
			new pixi.Texture(sSheet, new pixi.Rectangle(3 * w, 1 * h, w, h))
		];
		playerSheet['walk_left'] = [
			new pixi.Texture(sSheet, new pixi.Rectangle(0 * w, 2 * h, w, h)),
			new pixi.Texture(sSheet, new pixi.Rectangle(1 * w, 2 * h, w, h)),
			new pixi.Texture(sSheet, new pixi.Rectangle(2 * w, 2 * h, w, h)),
			new pixi.Texture(sSheet, new pixi.Rectangle(3 * w, 2 * h, w, h))
		];
		playerSheet['walk_right'] = [
			new pixi.Texture(sSheet, new pixi.Rectangle(0 * w, 3 * h, w, h)),
			new pixi.Texture(sSheet, new pixi.Rectangle(1 * w, 3 * h, w, h)),
			new pixi.Texture(sSheet, new pixi.Rectangle(2 * w, 3 * h, w, h)),
			new pixi.Texture(sSheet, new pixi.Rectangle(3 * w, 3 * h, w, h))
		];

	}

	function createPlayer() {
		player = new pixi.AnimatedSprite(playerSheet.stand_front);
		player.anchor.set(0.5);
		player.animationSpeed = 0.125;
		player.loop = false;
		player.x = pixiApp.view.width / 2;
		player.y = pixiApp.view.height / 2;
		pixiApp.stage.addChild(player);
		player.play();
	}

	const onInit = () => {
		const el = parent.current;

		el.appendChild(pixiApp.view);
		setState({ ...state, init: true });

		resizeCanvasHandler();

		return () => {
			el.innerHTML = '';
			setState({ ...state, init: false });
		}
	};

	const onResize = () => {
		window.addEventListener('resize', resizeCanvasHandler);

		return () => {
			window.removeEventListener('resize', resizeCanvasHandler);
		}
	};

	const resizeCanvasHandler = () => pixiApp.renderer.resize(window.innerWidth, window.innerHeight);

	return (
		<div className={[state.init ? 'is-init' : ''].join(' ')}>
			<div ref={parent}>
			</div>
		</div>
	);
};

export default withPixi(GameWrapper);
