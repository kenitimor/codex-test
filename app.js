const fileInput = document.querySelector('#participantFile');
const winnerCountInput = document.querySelector('#winnerCount');
const drawButton = document.querySelector('#drawButton');
const statusText = document.querySelector('#status');
const fileNameText = document.querySelector('#fileName');
const participantCountText = document.querySelector('#participantCount');
const participantPreview = document.querySelector('#participantPreview');
const participantEmpty = document.querySelector('#participantEmpty');
const participantMore = document.querySelector('#participantMore');
const winnersList = document.querySelector('#winnersList');
const winnerEmpty = document.querySelector('#winnerEmpty');

let participants = [];

const normalizeCell = (value) => String(value ?? '').trim();

const parseParticipants = (workbook) => {
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) return [];

  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName], {
    header: 1,
    blankrows: false,
  });

  return rows
    .map((row) => row.map(normalizeCell).filter(Boolean).join(' '))
    .filter(Boolean);
};

const pickRandomWinners = (entries, count) => {
  const pool = [...entries];

  for (let index = pool.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[randomIndex]] = [pool[randomIndex], pool[index]];
  }

  return pool.slice(0, count);
};

const setStatus = (message) => {
  statusText.textContent = message;
};

const renderParticipants = (fileName = '') => {
  participantCountText.textContent = `${participants.length}名`;
  participantPreview.textContent = '';

  fileNameText.hidden = !fileName;
  fileNameText.textContent = fileName ? `ファイル: ${fileName}` : '';

  participants.slice(0, 8).forEach((participant) => {
    const item = document.createElement('li');
    item.textContent = participant;
    participantPreview.append(item);
  });

  participantEmpty.hidden = participants.length > 0;
  const remainingCount = Math.max(participants.length - 8, 0);
  participantMore.hidden = remainingCount === 0;
  participantMore.textContent = remainingCount > 0 ? `ほか ${remainingCount}名` : '';

  winnerCountInput.max = String(participants.length || 1);
  winnerCountInput.value = String(Math.min(Math.max(Number(winnerCountInput.value) || 1, 1), participants.length || 1));
  drawButton.disabled = participants.length === 0;
};

const renderWinners = (winners) => {
  winnersList.textContent = '';
  winnerEmpty.hidden = winners.length > 0;

  winners.forEach((winner, index) => {
    const item = document.createElement('li');
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = String(index + 1);
    item.append(badge, document.createTextNode(winner));
    winnersList.append(item);
  });
};

fileInput.addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!window.XLSX) {
    setStatus('Excel読み込みライブラリを取得できませんでした。ネットワーク接続を確認してください。');
    return;
  }

  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    participants = parseParticipants(workbook);
    renderWinners([]);
    renderParticipants(file.name);
    setStatus(
      participants.length > 0
        ? `${participants.length}名の参加者を読み込みました。`
        : '参加者を読み込めませんでした。1枚目のシートに参加者名を入力してください。',
    );
  } catch (error) {
    participants = [];
    renderWinners([]);
    renderParticipants('');
    setStatus('Excelファイルの読み込みに失敗しました。xlsx または xls ファイルを確認してください。');
  }
});

drawButton.addEventListener('click', () => {
  const winnerCount = Number(winnerCountInput.value);

  if (!Number.isInteger(winnerCount) || winnerCount < 1 || winnerCount > participants.length) {
    setStatus('抽選人数は、1名以上かつ参加者数以下で入力してください。');
    return;
  }

  const winners = pickRandomWinners(participants, winnerCount);
  renderWinners(winners);
  setStatus(`${winners.length}名を抽選しました。おめでとうございます！`);
});
