import React, { createContext } from 'react';
import * as PIXI from 'pixi.js';

const PixiContext = createContext(null);

const PixiProvider = ({ children, options = {} }) => {
	const pixi = PIXI;

	return (
		<PixiContext.Provider value={{ pixi }}>
			{children}
		</PixiContext.Provider>
	);
};

const withPixi = (Child) => (props) => (
	<PixiContext.Consumer>
		{context => <Child {...props} context={context}/>}
	</PixiContext.Consumer>
);

export { PixiProvider, withPixi };
