function animateMovement() {
  // Set the target positions
  const targetPositions = {
    cover1x1: positions.cover1x2,
    cover1x2: positions.cover2x1,
    cover2x1: positions.cover1x1
  };

  // Apply CSS transitions and move to target positions
  Object.keys(targetPositions).forEach((cover) => {
    const elem = document.getElementById(cover);
    elem.style.transition = 'all 1s ease-in-out';
    elem.setAttribute('x', targetPositions[cover].x);
    elem.setAttribute('y', targetPositions[cover].y);
  });

  // Update the stored positions for the next cycle
  positions.cover1x1 = targetPositions.cover1x1;
  positions.cover1x2 = targetPositions.cover1x2;
  positions.cover2x1 = targetPositions.cover2x1;
}

// Call the function in a loop or with a timer for continuous animation
setInterval(animateMovement, 1000);
