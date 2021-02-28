import React, { useRef, useEffect, useState } from 'react';

import { withPixi } from '../../Pixi.provider';
import keyboard from '../../utils/keyboard';

const GameWrapper = (props) => {
	const parent = useRef();
	const {
		canvasWidth = 500,
		canvasHeight = 500
	} = props;
	const Options = {
		width: canvasWidth,
		height: canvasHeight,
		antialias: true,
		autoResize: true,
		resolution: 1,
	};
	const [state, setState] = useState({
		init: false,
		loadingProgress: 0,
	});

	const [ax, setAx] = useState(0);
	const [ay, setAy] = useState(0);
	const [avx, setAvx] = useState(0);
	const [avy, setAvy] = useState(0);

	const [score, setScore] = useState(0);

	const pixi = props.context.pixi;
	const pixiApp = new pixi.Application(Options);
	const walkRight = [
		'./walk-right_01.png',
		'./walk-right_02.png',
		'./walk-right_03.png',
		'./walk-right_04.png',
		'./walk-right_05.png',
		'./walk-right_06.png'
	];
	const walkLeft = [
		'./walk-left_01.png',
		'./walk-left_02.png',
		'./walk-left_03.png',
		'./walk-left_04.png',
		'./walk-left_05.png',
		'./walk-left_06.png'
	];

	let walker, st, walker_left, walker_right;


	pixiApp.loader
		.add(walkRight)
		.add(walkLeft)
		.load((loader, resources) => onLoad(loader, resources));

	useEffect(() => onInit(), []);
	useEffect(() => onResize(), []);

	const onLoad = (loader, resources) => {
		walker_right = new pixi.AnimatedSprite.fromFrames(walkRight);
		walker_left = new pixi.AnimatedSprite.fromFrames(walkLeft);
		walker = walker_right || walker_left;

		walker.vx = avx;
		walker.vy = avy;
		walker.animationSpeed = 0.35;

		st = play;

		let msg_title_style = new pixi.TextStyle({
			fontFamily: "Arial",
			fontSize: 36,
			fill: "white",
			stroke: '#ff3300',
			strokeThickness: 4,
			dropShadow: true,
			dropShadowColor: "#000000",
			dropShadowBlur: 4,
			dropShadowAngle: Math.PI / 6,
			dropShadowDistance: 6,
		});
		let msg_title = new pixi.Text(`Score: ${score}`, msg_title_style);

		pixiApp.stage.addChild(walker);
		pixiApp.ticker.add(delta => gameLoop(delta));
		pixiApp.stage.addChild(msg_title);

		let left = keyboard("ArrowLeft"),
				up = keyboard("ArrowUp"),
				right = keyboard("ArrowRight"),
				down = keyboard("ArrowDown");

		// UP
		up.press = () => {

			console.log('Up pressed');

			walker.vy = -5;
			walker.vx = 0;

		}
		up.release = () => {

			console.log('Up released');

			if (!down.isDown && walker.vx === 0) {
				walker.vy = 0;
			}

		}

		// DOWN
		down.press = () => {

			console.log('Down pressed');

			walker.vy = 5;
			walker.vx = 0;

		}
		down.release = () => {

			console.log('Down released');

			if (!up.isDown && walker.vx === 0) {
				walker.vy = 0;
			}

		}

		// RIGHT
		right.press = () => {
			console.log('Right pressed');

			// walker = walker_right;

			st = play;
			walker.play(walker_right);
			walker.vx = 5;
			walker.vy = 0;


		}
		right.release = () => {
			console.log('Right released');

			walker.stop(walker_right);

			if (!left.isDown && walker.vy === 0) {
				walker.vx = 0;
			}

		}

		// LEFT
		left.press = () => {
			console.log('Left pressed');

			// walker = walker_left;

			st = play;
			walker.play(walker_left);
			walker.vx = -5;
			walker.vy = 0;



		}
		left.release = () => {
			console.log('Left released');

			walker.stop(walker_left);

			if (!right.isDown && walker.vy === 0) {
				walker.vx = 0;
			}

		}

	};

	function gameLoop(delta) {
		// walker.x = (walker.x + 5*delta) % (pixiApp.renderer.width - (102 / 2));
		st(delta);
	}

	function play(delta) {

		//Use the cat's velocity to make it move
		walker.x += walker.vx;
		walker.y += walker.vy
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
