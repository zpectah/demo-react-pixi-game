import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import App from './App';
import { PixiProvider } from './Pixi.provider';

ReactDOM.render(
  <React.StrictMode>
		<PixiProvider>
			<App />
		</PixiProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
