import React, { useRef, useEffect, useState } from 'react';

import { withPixi } from '../../Pixi.provider';

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

	let walker;

	pixiApp.loader
		.add(walkRight)
		.add(walkLeft)
		.load((loader, resources) => onLoad(loader, resources));

	useEffect(() => onInit(), []);
	useEffect(() => onResize(), []);

	const onLoad = (loader, resources) => {
		walker = new pixi.AnimatedSprite.fromFrames(walkRight);

		walker.animationSpeed = 0.15;
		walker.position.set(0, 0);
		walker.updateAnchor = true;
		walker.play();
		pixiApp.stage.addChild(walker);

		pixiApp.ticker.add(delta => gameLoop(delta));
	};

	function gameLoop(delta) {
		walker.x = (walker.x + 5*delta) % (pixiApp.renderer.width - (102 / 2));
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
