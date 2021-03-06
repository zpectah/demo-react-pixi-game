// https://pixijs.io/examples/#/demos-advanced/collision-detection.js
import React, { useRef, useEffect, useState } from 'react';

import { withPixi } from '../../Pixi.provider';

const Options = {
	width: 900,
	height: 900,
};

const Demo2 = (props) => {
	const parent = useRef();
	const [state, setState] = useState({
		init: false,
	});

	useEffect(() => onInit(), []);

	const pixi = props.context.pixi;
	const pixiApp = new pixi.Application(Options);

	// Pixi instance variables
	const movementSpeed = 0.05;
	const impulsePower = 15;

	// Pixi loader
	// pixiApp.loader

	function testForAABB(object1, object2) {
		const bounds1 = object1.getBounds();
		const bounds2 = object2.getBounds();

		return bounds1.x < bounds2.x + bounds2.width
			&& bounds1.x + bounds1.width > bounds2.x
			&& bounds1.y < bounds2.y + bounds2.height
			&& bounds1.y + bounds1.height > bounds2.y;
	}

// Calculates the results of a collision, allowing us to give an impulse that
// shoves objects apart
	function collisionResponse(object1, object2) {
		if (!object1 || !object2) {
			return new pixi.Point(0);
		}

		const vCollision = new pixi.Point(
			object2.x - object1.x,
			object2.y - object1.y,
		);

		const distance = Math.sqrt(
			(object2.x - object1.x) * (object2.x - object1.x)
			+ (object2.y - object1.y) * (object2.y - object1.y),
		);

		const vCollisionNorm = new pixi.Point(
			vCollision.x / distance,
			vCollision.y / distance,
		);

		const vRelativeVelocity = new pixi.Point(
			object1.acceleration.x - object2.acceleration.x,
			object1.acceleration.y - object2.acceleration.y,
		);

		const speed = vRelativeVelocity.x * vCollisionNorm.x
			+ vRelativeVelocity.y * vCollisionNorm.y;

		const impulse = impulsePower * speed / (object1.mass + object2.mass);

		return new pixi.Point(
			impulse * vCollisionNorm.x,
			impulse * vCollisionNorm.y,
		);
	}

// Calculate the distance between two given points
	function distanceBetweenTwoPoints(p1, p2) {
		const a = p1.x - p2.x;
		const b = p1.y - p2.y;

		return Math.hypot(a, b);
	}

// The green square we will knock about
	const greenSquare = new pixi.Sprite(pixi.Texture.WHITE);
	greenSquare.position.set((pixiApp.screen.width - 100) / 2, (pixiApp.screen.height - 100) / 2);
	greenSquare.width = 50;
	greenSquare.height = 50;
	greenSquare.tint = '0x00FF00';
	greenSquare.acceleration = new pixi.Point(0);
	greenSquare.mass = 3;

// The square you move around
	const redSquare = new pixi.Sprite(pixi.Texture.WHITE);
	redSquare.position.set(0, 0);
	redSquare.width = 100;
	redSquare.height = 50;
	redSquare.tint = '0xFF0000';
	redSquare.acceleration = new pixi.Point(0);
	redSquare.mass = 1;

// Listen for animate update
	pixiApp.ticker.add((delta) => {
		// Applied deacceleration for both squares, done by reducing the
		// acceleration by 0.01% of the acceleration every loop
		redSquare.acceleration.set(redSquare.acceleration.x * 0.99, redSquare.acceleration.y * 0.99);
		greenSquare.acceleration.set(greenSquare.acceleration.x * 0.99, greenSquare.acceleration.y * 0.99);

		const mouseCoords = pixiApp.renderer.plugins.interaction.mouse.global;

		// Check whether the green square ever moves off the screen
		// If so, reverse acceleration in that direction
		if (greenSquare.x < 0 || greenSquare.x > (pixiApp.screen.width - 100)) {
			greenSquare.acceleration.x = -greenSquare.acceleration.x;
		}

		if (greenSquare.y < 0 || greenSquare.y > (pixiApp.screen.height - 100)) {
			greenSquare.acceleration.y = -greenSquare.acceleration.y;
		}

		// If the green square pops out of the cordon, it pops back into the
		// middle
		if ((greenSquare.x < -30 || greenSquare.x > (pixiApp.screen.width + 30))
			|| greenSquare.y < -30 || greenSquare.y > (pixiApp.screen.height + 30)) {
			greenSquare.position.set((pixiApp.screen.width - 100) / 2, (pixiApp.screen.height - 100) / 2);
		}

		// If the mouse is off screen, then don't update any further
		if (pixiApp.screen.width > mouseCoords.x || mouseCoords.x > 0
			|| pixiApp.screen.height > mouseCoords.y || mouseCoords.y > 0) {
			// Get the red square's center point
			const redSquareCenterPosition = new pixi.Point(
				redSquare.x + (redSquare.width * 0.5),
				redSquare.y + (redSquare.height * 0.5),
			);

			// Calculate the direction vector between the mouse pointer and
			// the red square
			const toMouseDirection = new pixi.Point(
				mouseCoords.x - redSquareCenterPosition.x,
				mouseCoords.y - redSquareCenterPosition.y,
			);

			// Use the above to figure out the angle that direction has
			const angleToMouse = Math.atan2(
				toMouseDirection.y,
				toMouseDirection.x,
			);

			// Figure out the speed the square should be travelling by, as a
			// function of how far away from the mouse pointer the red square is
			const distMouseRedSquare = distanceBetweenTwoPoints(
				mouseCoords,
				redSquareCenterPosition,
			);
			const redSpeed = distMouseRedSquare * movementSpeed;

			// Calculate the acceleration of the red square
			redSquare.acceleration.set(
				Math.cos(angleToMouse) * redSpeed,
				Math.sin(angleToMouse) * redSpeed,
			);
		}

		// If the two squares are colliding
		if (testForAABB(greenSquare, redSquare)) {
			// Calculate the changes in acceleration that should be made between
			// each square as a result of the collision
			const collisionPush = collisionResponse(greenSquare, redSquare);
			// Set the changes in acceleration for both squares
			redSquare.acceleration.set(
				(collisionPush.x * greenSquare.mass),
				(collisionPush.y * greenSquare.mass),
			);
			greenSquare.acceleration.set(
				-(collisionPush.x * redSquare.mass),
				-(collisionPush.y * redSquare.mass),
			);
		}

		greenSquare.x += greenSquare.acceleration.x * delta;
		greenSquare.y += greenSquare.acceleration.y * delta;

		redSquare.x += redSquare.acceleration.x * delta;
		redSquare.y += redSquare.acceleration.y * delta;
	});

	pixiApp.stage.addChild(redSquare, greenSquare);

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

export default withPixi(Demo2);
