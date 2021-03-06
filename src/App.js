import React from 'react';
import { Switch, BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Demo1 from './components/Demo1';
import Demo2 from './components/Demo2';

const App = () => {

	return (
		<Router>
			<div className="app-wrapper">
				<aside className="app-sidebar">
					<div>
						<ul>
							<li>
								<Link to={'/'}>
									Home
								</Link>
							</li>
							<li>
								<Link to={'/demo1'}>
									Demo 1
								</Link>
							</li>
							<li>
								<Link to={'/demo2'}>
									Demo 2
								</Link>
							</li>
						</ul>
					</div>
				</aside>
				<main className="app-content">
					<Switch>

						<Route path={'/demo1'} component={Demo1} />
						<Route path={'/demo2'} component={Demo2} />

						<Route path={'/'} exact>
							<div className="app-content-block">
								<h1>
									Game dev demos
								</h1>
								<div>
									Demo 1 - Sprite animations, Animations changes on movement, Collision detection
									<br />
									Demo 2 - Limiting game playable area
									<br />
									Demo 3 - Change stage during play
									<br />
									<br />
									Pong - Game demo
									<br />
									Space Invaders - Game demo
									<br />
								</div>
							</div>
						</Route>

					</Switch>
				</main>
			</div>
		</Router>
	);
}

export default App;
