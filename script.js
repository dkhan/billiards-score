let yourScore = 0;
let opponentScore = 0;

const yourScoreEl = document.getElementById('yourScore');
const opponentScoreEl = document.getElementById('opponentScore');

function updateScores() {
  yourScoreEl.innerText = yourScore;
  opponentScoreEl.innerText = opponentScore;
}

function adjustScore(side, direction) {
  if (side === 'left') {
    yourScore = Math.max(0, yourScore + (direction === 'up' ? 1 : -1));
  } else {
    opponentScore = Math.max(0, opponentScore + (direction === 'up' ? 1 : -1));
  }
  updateScores();
}

function resetSide(side) {
  if (side === 'left') {
    yourScore = 0;
  } else if (side === 'right') {
    opponentScore = 0;
  }
  updateScores();
}

function resetBoth() {
  yourScore = 0;
  opponentScore = 0;
  updateScores();
}

function handleTap(e, side) {
  const box = e.currentTarget;
  const scoreEl = box.querySelector('.score');
  const boxRect = box.getBoundingClientRect();
  const scoreRect = scoreEl.getBoundingClientRect();

  const clickY = e.clientY;

  if (clickY <= scoreRect.bottom) {
    adjustScore(side, 'up');
  } else {
    adjustScore(side, 'down');
  }
}

function addListeners(id, side) {
  const el = document.getElementById(id);
  let startY = null;
  let longPressTimer = null;
  let cancelClick = false;

  el.addEventListener('click', (e) => {
    if (cancelClick) {
      cancelClick = false;
      return;
    }
    handleTap(e, side);
  });

  el.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      longPressTimer = setTimeout(() => {
        resetBoth();
        cancelClick = true;
      }, 600);
    } else if (e.touches.length === 1) {
      startY = e.touches[0].clientY;

      longPressTimer = setTimeout(() => {
        resetSide(side);
        cancelClick = true;
      }, 600);
    }
  });

  el.addEventListener('touchend', (e) => {
    clearTimeout(longPressTimer);
    longPressTimer = null;

    if (startY !== null && e.changedTouches.length === 1) {
      const endY = e.changedTouches[0].clientY;
      const deltaY = endY - startY;

      if (Math.abs(deltaY) > 30) {
        adjustScore(side, deltaY < 0 ? 'up' : 'down');
        cancelClick = true;
      }

      startY = null;
    }
  });

  el.addEventListener('touchmove', () => {
    clearTimeout(longPressTimer);
    longPressTimer = null;
  });

  // Right-click to reset side (for desktop testing only)
  el.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    resetSide(side);
  });
}

addListeners('yourScoreBox', 'left');
addListeners('opponentScoreBox', 'right');

// Prevent scrolling when swiping
document.addEventListener('touchmove', function (e) {
  e.preventDefault();
}, { passive: false });
