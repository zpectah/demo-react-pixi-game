import React from 'react';
import { Switch, BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Demo1 from './components/Demo1';

const App = () => {

	return (
		<Router>
			<div>
				<aside>
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
						</ul>
					</div>
				</aside>
				<main>

					<Switch>

						<Route path={'/demo1'} component={Demo1} />

						<Route path={'/'} exact>
							<div>
								<h1>
									Game dev demos
								</h1>
							</div>
						</Route>

					</Switch>
				</main>
			</div>
		</Router>
	);
}

export default App;
