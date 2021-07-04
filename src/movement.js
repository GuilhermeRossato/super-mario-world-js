const maxAbsoluteVerticalSpeed = 4.333;
const gravityAcceleration = -0.3;

export function getVerticalVelocity(grounded, previousVelocity) {
	if (grounded) {
		return 0;
	}
	if (previousVelocity > -1) {
		return -1;
	}
	if (previousVelocity < -maxAbsoluteVerticalSpeed) {
		return -maxAbsoluteVerticalSpeed;
	}
	return Math.max(-maxAbsoluteVerticalSpeed, previousVelocity + gravityAcceleration);
}

/**
 * @param {{velocity: number, counter: number}} horizontalVelocityObject
 * @param {boolean} left
 * @param {boolean} right
 * @param {boolean} running
 */
export function changeHorizontalVelocity(horizontalVelocityObject, left, right, running) {
	const previousVelocity = horizontalVelocityObject.velocity;
	// Idle check
	if (previousVelocity === 0 && !left && !right) {
		horizontalVelocityObject.velocity = 0;
		if (horizontalVelocityObject.counter > 0) {
			horizontalVelocityObject.counter--;
		}
		return;
	}
	if (right && !running) {
		const targetSpeed = Math.min(1.2165, previousVelocity + 0.175);
		const decayedVelocity = Math.max(0, previousVelocity - 0.12);

		if (targetSpeed > 0 && decayedVelocity > targetSpeed) {
			horizontalVelocityObject.velocity = decayedVelocity;
		} else {
			horizontalVelocityObject.velocity = targetSpeed;
		}
		if (horizontalVelocityObject.counter > 0) {
			horizontalVelocityObject.counter--;
		}
		return;
	}
	if (left && !running) {
		const targetSpeed = Math.max(-1.2165, previousVelocity - 0.175);
		const decayedVelocity = Math.min(0, previousVelocity + 0.12);

		if (targetSpeed < 0 && decayedVelocity < targetSpeed) {
			horizontalVelocityObject.velocity = decayedVelocity;
		} else {
			horizontalVelocityObject.velocity = targetSpeed;
		}
		if (horizontalVelocityObject.counter > 0) {
			horizontalVelocityObject.counter--;
		}
		return;
	}
	if (running) {
		if (right) {
			if (previousVelocity < 2.0) {
				if (horizontalVelocityObject.counter > 0) {
					horizontalVelocityObject.counter--;
				}
				horizontalVelocityObject.velocity = previousVelocity + 0.15;
			} else {
				if (horizontalVelocityObject.counter < 60) {
					horizontalVelocityObject.velocity = Math.min(2.25, previousVelocity + 0.5/60);
					horizontalVelocityObject.counter++;
				} else {
					horizontalVelocityObject.velocity = Math.min(3, previousVelocity + 0.175);
				}
			}
			return;
		} else if (left) {
			if (previousVelocity > -2.0) {
				if (horizontalVelocityObject.counter > 0) {
					horizontalVelocityObject.counter--;
				}
				horizontalVelocityObject.velocity = previousVelocity - 0.15;
			} else {
				if (horizontalVelocityObject.counter < 60) {
					horizontalVelocityObject.velocity = Math.min(-2.25, previousVelocity + 0.5/60);
					horizontalVelocityObject.counter++;
				} else {
					horizontalVelocityObject.velocity = Math.min(-3, previousVelocity + 0.175);
				}
			}
			return;
		}
	} else {
		if (horizontalVelocityObject.counter > 0) {
			horizontalVelocityObject.counter--;
		}
	}
	if (previousVelocity > 0) {
		horizontalVelocityObject.velocity = Math.max(0, previousVelocity - 0.12);
		return;
	}
	if (previousVelocity < 0) {
		horizontalVelocityObject.velocity = Math.min(0, previousVelocity + 0.12);
		return;
	}
	throw new Error("Unimplemented exception");
}