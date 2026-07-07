const STORAGE_KEY = 'lottery-app-state-v1';

const defaultState = {
  prizes: [
    { id: crypto.randomUUID(), name: '特賞ギフトカード', quantity: 1 },
    { id: crypto.randomUUID(), name: '参加賞', quantity: 5 },
  ],
  participantsText: '佐藤\n鈴木\n高橋\n田中\n伊藤',
  winners: [],
};

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : structuredClone(defaultState);
  } catch (_) {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function participants() {
  return state.participantsText.split('\n').map((name) => name.trim()).filter(Boolean);
}

function totalPrizeCount() {
  return state.prizes.reduce((sum, prize) => sum + Number(prize.quantity || 0), 0);
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function app() {
  return document.querySelector('#app');
}

function render() {
  app().innerHTML = `
    <section class="hero">
      <p class="eyebrow">Static / LocalStorage / GitHub Pages Ready</p>
      <h1>プレゼント抽選アプリ</h1>
      <p>参加者リストと景品数を入力して、ブラウザだけで公平に当選者を抽選できます。データは端末のLocalStorageに保存され、サーバーや外部APIは不要です。</p>
      <div class="hero-actions"><button type="button" onclick="drawLottery()">抽選する</button><button type="button" class="ghost" onclick="resetWinners()">結果をリセット</button></div>
    </section>
    <section class="stats-grid">
      ${statCard('参加者', participants().length)}
      ${statCard('景品枠', totalPrizeCount())}
      ${statCard('当選済み', state.winners.length)}
      ${statCard('未抽選枠', Math.max(totalPrizeCount() - state.winners.length, 0))}
    </section>
    <section class="grid-2">
      <article class="card"><h2>参加者</h2><textarea id="participants" oninput="updateParticipants(this.value)">${escapeHtml(state.participantsText)}</textarea><p class="help">1行につき1名を入力してください。</p></article>
      <article class="card"><div class="section-head"><h2>景品</h2><button type="button" onclick="addPrize()">景品を追加</button></div>${prizeEditor()}</article>
    </section>
    <section class="card"><h2>抽選結果</h2>${winnerList()}</section>`;
}

function statCard(label, value) {
  return `<article class="stat portfolio"><span>${label}</span><strong>${value}</strong></article>`;
}

function prizeEditor() {
  return `<div class="prize-list">${state.prizes.map((prize) => `<div class="prize-row"><input value="${escapeHtml(prize.name)}" aria-label="景品名" onchange="updatePrize('${prize.id}', 'name', this.value)"><input type="number" min="1" value="${escapeHtml(prize.quantity)}" aria-label="数量" onchange="updatePrize('${prize.id}', 'quantity', this.value)"><button type="button" class="ghost" onclick="deletePrize('${prize.id}')">削除</button></div>`).join('')}</div>`;
}

function winnerList() {
  if (!state.winners.length) return '<p class="empty">まだ抽選結果はありません。</p>';
  return `<ol class="winner-list">${state.winners.map((winner) => `<li><strong>${escapeHtml(winner.prize)}</strong><span>${escapeHtml(winner.name)}</span></li>`).join('')}</ol>`;
}

function updateParticipants(value) {
  state.participantsText = value;
  saveState();
  render();
}

function addPrize() {
  state.prizes.push({ id: crypto.randomUUID(), name: '新しい景品', quantity: 1 });
  saveState();
  render();
}

function updatePrize(id, key, value) {
  const prize = state.prizes.find((item) => item.id === id);
  if (!prize) return;
  prize[key] = key === 'quantity' ? Math.max(Number(value || 1), 1) : value;
  saveState();
  render();
}

function deletePrize(id) {
  state.prizes = state.prizes.filter((item) => item.id !== id);
  saveState();
  render();
}

function drawLottery() {
  const remainingNames = participants().filter((name) => !state.winners.some((winner) => winner.name === name));
  const prizePool = state.prizes.flatMap((prize) => Array.from({ length: Number(prize.quantity || 0) }, () => prize.name)).slice(state.winners.length);
  if (!remainingNames.length || !prizePool.length) return;
  const nextPrize = prizePool[0];
  const winnerIndex = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32 * remainingNames.length);
  state.winners.push({ prize: nextPrize, name: remainingNames[winnerIndex] });
  saveState();
  render();
}

function resetWinners() {
  state.winners = [];
  saveState();
  render();
}

window.addEventListener('DOMContentLoaded', render);
