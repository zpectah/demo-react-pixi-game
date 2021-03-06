import React, { useRef, useEffect, useState } from 'react';

import { withPixi } from '../Pixi.provider';

const Options = {
	width: 900,
	height: 900,
};

const __ = (props) => {
	const parent = useRef();
	const [state, setState] = useState({
		init: false,
	});

	useEffect(() => onInit(), []);

	const pixi = props.context.pixi;
	const pixiApp = new pixi.Application(Options);

	// Pixi instance variables

	// Pixi loader
	// pixiApp.loader

	const onInit = () => {
		const el = parent.current;

		el.appendChild(pixiApp.view);
		setState({ ...state, init: true });

		return () => {
			el.innerHTML = '';
			setState({ ...state, init: false });
		}
	};

	return (
		<div className={[state.init ? 'is-init' : ''].join(' ')}>
			<div ref={parent}>
			</div>
		</div>
	);
}

export default withPixi(__);
