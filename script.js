const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// Estado
let boardState = Array(9).fill(null); // 'X' | 'O' | null
let current = 'X';
let winner = null;
let aiEnabled = true; // siempre hay IA, el humano es X

const winSets = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// DOM
const boardEl = $('#board');
const statusEl = $('#status');
const resetBtn = $('#resetBtn');
const yearEl = $('#year');
const difficultySel = $('#difficulty');
const aiFirstToggle = $('#aiFirst');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Construcción del tablero
function buildBoard() {
  boardEl.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('button');
    cell.className = 'cell';
    cell.type = 'button';
    cell.dataset.index = String(i);
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', `Casilla ${i+1}`);
    cell.addEventListener('click', onCellClick);
    boardEl.appendChild(cell);
  }
}

function setStatus(text) { statusEl.textContent = text; }

function hasWin(player, state = boardState) {
  return winSets.some(set => set.every(i => state[i] === player));
}

function getEmptyIndices(state = boardState) {
  const xs = [];
  for (let i = 0; i < 9; i++) if (!state[i]) xs.push(i);
  return xs;
}

function endIfNeeded() {
  if (hasWin('X')) { winner = 'X'; setStatus('¡Ganaste! (X)'); return true; }
  if (hasWin('O')) { winner = 'O'; setStatus('La IA ganó (O)'); return true; }
  if (boardState.every(Boolean)) { setStatus('Empate 🤝'); return true; }
  return false;
}

function onCellClick(e) {
  if (winner) return;
  const idx = Number(e.currentTarget.dataset.index);
  if (boardState[idx]) return;
  playMove(idx, 'X');
  if (endIfNeeded()) return;
  if (aiEnabled) aiTurn();
}

function playMove(idx, player) {
  boardState[idx] = player;
  const el = boardEl.children[idx];
  el.textContent = player;
  el.classList.add('taken', player === 'X' ? 'x' : 'o');
}

function setBoardDisabled(disabled) {
  $$('.cell').forEach(c => {
    c.classList.toggle('disabled', disabled);
  });
}

// --- IA ---
function aiTurn() {
  setBoardDisabled(true);
  setStatus('Pensando...');
  const diff = difficultySel.value;
  // pequeño retardo para UX
  setTimeout(() => {
    let idx;
    if (diff === 'easy') idx = aiEasy();
    else if (diff === 'medium') idx = aiMedium();
    else idx = aiHard();

    if (idx != null) playMove(idx, 'O');
    setBoardDisabled(false);

    if (!endIfNeeded()) setStatus('Tu turno (X)');
  }, 250);
}

// Fácil: jugada aleatoria
function aiEasy() {
  const empties = getEmptyIndices();
  return empties[Math.floor(Math.random() * empties.length)] ?? null;
}

// Medio: gana si puede, si no, bloquea; si no, centro > esquinas > laterales
function aiMedium() {
  // 1) ganar si es posible
  const winIdx = findWinningMove('O', boardState);
  if (winIdx != null) return winIdx;
  // 2) bloquear si el humano gana
  const blockIdx = findWinningMove('X', boardState);
  if (blockIdx != null) return blockIdx;
  // 3) priorizar centro, esquinas, laterales
  const order = [4,0,2,6,8,1,3,5,7];
  for (const i of order) if (!boardState[i]) return i;
  return null;
}

function findWinningMove(player, state) {
  for (const [a,b,c] of winSets) {
    const line = [state[a], state[b], state[c]];
    const countP = line.filter(v => v === player).length;
    const countN = line.filter(v => !v).length;
    if (countP === 2 && countN === 1) {
      if (!state[a]) return a; if (!state[b]) return b; if (!state[c]) return c;
    }
  }
  return null;
}

// Difícil: Minimax con poda alfa-beta
function aiHard() {
  const best = minimax(boardState, 'O', -Infinity, Infinity);
  return best.index;
}

function minimax(state, player, alpha, beta) {
  if (hasWin('X', state)) return { score: -10 };
  if (hasWin('O', state)) return { score: 10 };
  const empties = [];
  for (let i = 0; i < 9; i++) if (!state[i]) empties.push(i);
  if (empties.length === 0) return { score: 0 };

  let bestMove = { index: null, score: player === 'O' ? -Infinity : Infinity };

  for (const idx of empties) {
    state[idx] = player;
    const result = minimax(state, player === 'O' ? 'X' : 'O', alpha, beta);
    state[idx] = null;

    const score = result.score;
    if (player === 'O') { // maximiza
      if (score > bestMove.score) { bestMove = { index: idx, score }; }
      alpha = Math.max(alpha, score);
    } else { // minimiza
      if (score < bestMove.score) { bestMove = { index: idx, score }; }
      beta = Math.min(beta, score);
    }
    if (beta <= alpha) break; // poda
  }
  return bestMove;
}

function resetGame() {
  boardState = Array(9).fill(null);
  current = 'X';
  winner = null;
  buildBoard();
  if (aiFirstToggle.checked) {
    setStatus('La IA comienza...');
    setTimeout(() => aiTurn(), 250);
  } else {
    setStatus('Tu turno (X)');
  }
}

resetBtn.addEventListener('click', resetGame);

difficultySel.addEventListener('change', () => {
  // No reiniciamos automáticamente para no perder partidas; solo actualizamos estado
  statusEl.textContent += '  •  Dificultad: ' + difficultySel.options[difficultySel.selectedIndex].text;
});

// Init
buildBoard();
resetGame();