const STORAGE_KEY = 'hcm-gate-navigator-projects-v1';
const SCORE_LEVELS = ['未検討', '仮説のみ', '一部情報あり', '初期検証済み', '複数根拠あり', '判断可能な水準まで検証済み'];

const scoreCategories = [
  { key: 'customerValue', label: '顧客価値', weight: 0.2, items: ['顧客セグメントが明確か', '課題の深刻度が高いか', '課題の発生頻度が高いか', '顧客が既に代替手段に費用を払っているか', '提供価値が顧客課題に直接結びついているか', '顧客からの定性的フィードバックがあるか', '顧客の支払意思が確認されているか'] },
  { key: 'marketValidation', label: '市場検証', weight: 0.15, items: ['市場規模が推定されているか', '初期ターゲット市場が明確か', '獲得可能顧客数が試算されているか', '顧客ヒアリング数が十分か', 'PoC候補顧客が存在するか', '横展開可能性が説明されているか'] },
  { key: 'technicalReadiness', label: '技術成熟度', weight: 0.15, items: ['技術原理が成立しているか', 'MVP / プロトタイプが存在するか', '実環境での検証が行われているか', '性能要件が定義されているか', '既存技術との差分が明確か', '開発課題と解決計画が整理されているか'] },
  { key: 'deliveryModel', label: '提供モデル / オペレーション', weight: 0.1, items: ['受注から提供、運用、保守までの業務フローが整理されているか', '必要な社内機能・外部パートナーが整理されているか', '販売チャネルが想定されているか', '顧客サポート体制が想定されているか', '提供コスト・運用負荷が見えているか'] },
  { key: 'businessViability', label: '収益モデル / 事業性', weight: 0.2, items: ['価格モデルが設定されているか', '売上予測があるか', '原価・粗利が試算されているか', '販管費を含めた営業利益が見えているか', '3年以内の売上1億円以上・単年黒字化のシナリオがあるか', '標準・悲観シナリオが検討されているか'] },
  { key: 'riskCompliance', label: '法規制・品質・安全・情報管理', weight: 0.08, items: ['関連する法規制・業界基準が整理されているか', '認証・許認可・基準対応の必要性が確認されているか', '品質リスクが整理されているか', '安全リスクが整理されているか', '情報管理・データ取扱いリスクが整理されているか', '対応方針・担当部門・期限が整理されているか'] },
  { key: 'ipCompetitiveAdvantage', label: '知財・競争優位', weight: 0.07, items: ['競合・代替手段が整理されているか', 'なぜ自社が勝てるのかが説明されているか', '知財・ノウハウ・データ・販売網等の優位性が整理されているか', '模倣困難性があるか', 'HCMグループの既存アセットとの接続があるか'] },
  { key: 'teamExecution', label: 'チーム・実行体制', weight: 0.05, items: ['事業オーナーが明確か', '技術・営業・事業開発・法務・品質等の必要機能が揃っているか', '外部パートナーの役割が明確か', '6か月間の活動計画が具体的か', '必要予算と成果物が明確か'] },
];

const nextIssueTemplates = {
  customerValue: ['誰が最も困っているのか', 'その課題はどれほど深刻か', '顧客は対価を払ってでも解決したいか'],
  marketValidation: ['初期市場で獲得可能な顧客数は十分か', 'PoC候補顧客から再現性を説明できるか'],
  technicalReadiness: ['実環境で性能要件を満たせるか', '未解決の開発課題と期限は明確か'],
  deliveryModel: ['継続提供できる運用体制か', '販売・保守チャネルは実効的か'],
  businessViability: ['価格と提供価値は整合しているか', '粗利率は十分か', '3年以内に売上1億円・単年黒字化できるか'],
  riskCompliance: ['現行基準で利用可能か', '認証・制度変更の見通しはあるか', '法務・品質・安全部門の確認が必要か'],
  ipCompetitiveAdvantage: ['なぜ自社が勝てるのか', '模倣困難な資産は何か'],
  teamExecution: ['6か月で誰が何を検証するか', '必要予算と成果物は明確か'],
};

const defaultProjects = [
  {
    id: 'icon-rider',
    name: 'i-Conライダー',
    owner: '新事業開発チーム',
    department: '事業戦略本部 / HCMJ連携',
    stage: 'Final Stage',
    phase: '顧客価値成立Phase',
    nextReviewDate: '2026-10-31',
    summary: '施工現場において、重機や手持ち機器に計測装置を装着し、施工しながら出来形計測・後処理・帳票出力を行うソリューション。現場のダウンタイムを削減し、外注測量に近い結果を日々確認できるようにする。',
    customerIssues: '施工現場はダウンタイムを嫌う\n出来形計測や後処理、帳票作成に時間がかかる\n施工ミスによる手戻りを減らしたい\n必要なタイミングで帳票を取得したい',
    valueProposition: '計測装置を装着して施工するだけでデータ取得\n自動処理により帳票取得を効率化\nPC・スマホで出来形進捗を確認\nオペレーターがリアルタイムにヒートマップを確認\n施工ミスによる手戻りを削減',
    pricingModel: 'クラウド基本料: 15万円/年\n出来形帳票出力: 5万円/年\nオペレーター用出来形確認: 15万円/年\n重機搭載計測機: 販売500万円\nレンタルモデルも検討',
    revenueForecast: '1年目: 60台、売上336百万円\n2年目: 90台、売上552百万円\n3年目: 130台、売上876百万円\n4年目: 200台、売上1,362百万円\n5年目: 300台、売上2,091百万円',
    risks: '現段階の基準ではハンドスキャナ利用に制約がある\nバックパック方式は認められている\nハンドスキャナ利用に向けた基準整備が進行中\n技術開発、クラウド環境、現地PoC、HCMJ連携が必要',
    nextActions: '無償PoC・有償PoCで顧客の支払意思を確認\n現場運用性と帳票精度のKPIを測定\n法規制・品質・安全部門と基準対応ロードマップを作成\n販売チャネルと保守体制のRACIを定義',
    severeRiskOpen: false,
    scoreItems: {
      customerValue: [4, 4, 4, 4, 4, 4, 4],
      marketValidation: [4, 4, 3, 3, 4, 3],
      technicalReadiness: [4, 4, 3, 3, 3, 3],
      deliveryModel: [3, 3, 3, 3, 3],
      businessViability: [4, 4, 4, 3, 4, 4],
      riskCompliance: [3, 2, 2, 2, 2, 3],
      ipCompetitiveAdvantage: [3, 3, 3, 2, 3],
      teamExecution: [4, 4, 3, 4, 3],
    },
    reviews: [
      { date: '2026-04-30', decision: '条件付き継続', summary: '顧客価値と売上仮説は前進。制度対応と運用体制が未成熟。', nextActions: '有償PoCで価格受容性を確認\n現行基準内で使える提供範囲を確定\nHCMJ販売・保守体制を定義' },
    ],
  },
];

let projects = loadProjects();

function loadProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : structuredClone(defaultProjects);
  } catch (error) {
    return structuredClone(defaultProjects);
  }
}

function saveProjects() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

function categoryScore(project, category) {
  const values = project.scoreItems[category.key] || [];
  const total = values.reduce((sum, value) => sum + Number(value || 0), 0);
  return Math.round((total / (category.items.length * 5)) * 100);
}

function scores(project) {
  return Object.fromEntries(scoreCategories.map((category) => [category.key, categoryScore(project, category)]));
}

function overallScore(project) {
  const scoreMap = scores(project);
  return Math.round(scoreCategories.reduce((sum, category) => sum + scoreMap[category.key] * category.weight, 0));
}

function status(project) {
  const scoreMap = scores(project);
  const overall = overallScore(project);
  if (overall >= 75 && scoreMap.customerValue >= 70 && scoreMap.businessViability >= 65 && !project.severeRiskOpen) return 'Green';
  if (overall < 55 || scoreMap.customerValue < 45 || scoreMap.businessViability < 45 || project.severeRiskOpen) return 'Red';
  return 'Yellow';
}

function gate(project) {
  const current = status(project);
  if (current === 'Green') return 'Go';
  if (current === 'Yellow') return 'Conditional Go';
  return overallScore(project) < 45 ? 'No-Go' : 'Hold';
}

function nextIssues(project) {
  const scoreMap = scores(project);
  return scoreCategories
    .filter((category) => scoreMap[category.key] < 65)
    .sort((a, b) => scoreMap[a.key] - scoreMap[b.key])
    .slice(0, 3)
    .map((category) => ({ category, score: scoreMap[category.key], questions: nextIssueTemplates[category.key] }));
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function lines(value = '') {
  return String(value).split('\n').map((item) => item.trim()).filter(Boolean);
}

function app() {
  return document.querySelector('#app');
}

function render() {
  const [route, id] = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (!route) return renderDashboard();
  if (route === 'projects' && id) return renderProjectDetail(id);
  if (route === 'projects') return renderProjects();
  if (route === 'reviews') return renderReviews();
  if (route === 'scoring') return renderScoring();
  return renderDashboard();
}

function renderDashboard() {
  const totals = { all: projects.length, green: projects.filter((p) => status(p) === 'Green').length, yellow: projects.filter((p) => status(p) === 'Yellow').length, red: projects.filter((p) => status(p) === 'Red').length };
  app().innerHTML = `
    <section class="hero">
      <p class="eyebrow">Static / LocalStorage / GitHub Pages Ready</p>
      <h1>新事業ステージゲート管理</h1>
      <p>案件管理、スコアリング、Go/No-Go判定、レビュー履歴に絞った完全静的MVPです。Azure OpenAI、SharePoint、Microsoft Entra ID認証は将来追加できるよう、データアクセスとAI連携の責務を分離しやすい構成にしています。</p>
    </section>
    <section class="stats-grid">
      ${statCard('全案件', totals.all, 'portfolio')}
      ${statCard('Green', totals.green, 'green')}
      ${statCard('Yellow', totals.yellow, 'yellow')}
      ${statCard('Red', totals.red, 'red')}
    </section>
    ${projectTable(projects)}
    <section class="grid-2">
      ${projects.map((project) => `<article class="card"><h2>${escapeHtml(project.name)} スコア</h2>${scoreBars(project)}</article>`).join('')}
      <article class="card"><h2>次に潰すべき論点</h2>${projects.map((project) => nextIssues(project).map((issue) => `<div class="issue"><strong>${escapeHtml(project.name)} / ${issue.category.label}（${issue.score}）</strong><ul>${issue.questions.map((q) => `<li>${escapeHtml(q)}</li>`).join('')}</ul></div>`).join('')).join('')}</article>
    </section>`;
}

function statCard(label, value, tone) {
  return `<article class="stat ${tone}"><span>${label}</span><strong>${value}</strong></article>`;
}

function projectTable(items) {
  return `<section class="card table-card"><div class="section-head"><h2>案件管理</h2><button type="button" onclick="createProject()">案件を追加</button></div><div class="table-wrap"><table><thead><tr><th>案件</th><th>ステージ/フェーズ</th><th>総合</th><th>顧客価値</th><th>事業性</th><th>リスク</th><th>次回レビュー</th><th>判定</th><th>Gate推奨</th><th>次論点</th></tr></thead><tbody>${items.map((project) => {
    const scoreMap = scores(project);
    return `<tr><td><a href="#/projects/${project.id}">${escapeHtml(project.name)}</a></td><td>${escapeHtml(project.stage)}<br><small>${escapeHtml(project.phase)}</small></td><td><strong>${overallScore(project)}</strong></td><td>${scoreMap.customerValue}</td><td>${scoreMap.businessViability}</td><td>${scoreMap.riskCompliance}</td><td>${escapeHtml(project.nextReviewDate)}</td><td><span class="badge ${status(project).toLowerCase()}">${status(project)}</span></td><td>${gate(project)}</td><td>${nextIssues(project).map((issue) => issue.category.label).join('、') || '—'}</td></tr>`;
  }).join('')}</tbody></table></div></section>`;
}

function renderProjects() {
  app().innerHTML = `<section class="page-title"><h1>案件管理</h1><p>LocalStorageに保存される静的MVPです。ブラウザをまたいだ共有は将来のSharePoint/DB連携で追加します。</p></section>${projectTable(projects)}`;
}

function renderProjectDetail(id) {
  const project = projects.find((item) => item.id === id) || projects[0];
  const scoreMap = scores(project);
  app().innerHTML = `
    <section class="detail-header">
      <div><a href="#/projects">← 案件一覧へ</a><p class="eyebrow">${escapeHtml(project.stage)} / ${escapeHtml(project.phase)}</p><h1>${escapeHtml(project.name)}</h1><p>${escapeHtml(project.owner)} / ${escapeHtml(project.department)}</p></div>
      <div class="score-ring"><span>総合</span><strong>${overallScore(project)}</strong><em>${status(project)} / ${gate(project)}</em></div>
    </section>
    <section class="tabs"><a href="#overview">Overview</a><a href="#score">Score</a><a href="#reviews">Review History</a><a href="#edit">Edit</a></section>
    <section id="overview" class="grid-2"><article class="card wide"><h2>概要</h2><p>${escapeHtml(project.summary)}</p></article>${infoList('顧客課題', project.customerIssues)}${infoList('提供価値', project.valueProposition)}${infoList('価格モデル', project.pricingModel)}${infoList('売上予測', project.revenueForecast)}${infoList('主要リスク', project.risks)}${infoList('次アクション', project.nextActions)}</section>
    <section id="score" class="card"><h2>スコアリング</h2>${scoreEditor(project)}</section>
    <section class="card"><h2>Go/No-Go判定</h2><div class="decision-panel"><div><span>判定ステータス</span><strong class="${status(project).toLowerCase()}">${status(project)}</strong></div><div><span>Gate推奨</span><strong>${gate(project)}</strong></div><div><span>重要カテゴリ</span><strong>顧客価値 ${scoreMap.customerValue} / 事業性 ${scoreMap.businessViability} / リスク ${scoreMap.riskCompliance}</strong></div></div>${nextIssues(project).map((issue) => `<div class="issue"><strong>${issue.category.label}（${issue.score}）</strong><ul>${issue.questions.map((question) => `<li>${escapeHtml(question)}</li>`).join('')}</ul></div>`).join('')}</section>
    <section id="reviews" class="card"><div class="section-head"><h2>レビュー履歴</h2><button type="button" onclick="addReview('${project.id}')">レビュー追加</button></div>${reviewList(project)}</section>
    <section id="edit" class="card"><h2>案件編集</h2>${projectForm(project)}</section>`;
}

function infoList(title, value) {
  return `<article class="card"><h2>${title}</h2><ul>${lines(value).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></article>`;
}

function scoreBars(project) {
  return `<div class="bars">${scoreCategories.map((category) => `<div class="bar-row"><span>${category.label}</span><div class="bar-track"><i style="width:${categoryScore(project, category)}%"></i></div><b>${categoryScore(project, category)}</b></div>`).join('')}</div>`;
}

function scoreEditor(project) {
  return `${scoreBars(project)}<div class="score-grid">${scoreCategories.map((category) => `<fieldset><legend>${category.label}（重み ${Math.round(category.weight * 100)}%）</legend>${category.items.map((item, index) => `<label><span>${escapeHtml(item)}</span><select onchange="updateScore('${project.id}','${category.key}',${index},this.value)">${SCORE_LEVELS.map((label, value) => `<option value="${value}" ${(project.scoreItems[category.key]?.[index] ?? 0) === value ? 'selected' : ''}>${value}: ${label}</option>`).join('')}</select></label>`).join('')}</fieldset>`).join('')}</div><label class="check"><input type="checkbox" ${project.severeRiskOpen ? 'checked' : ''} onchange="toggleSevereRisk('${project.id}',this.checked)"> 重大リスクに未対応項目がある</label>`;
}

function projectForm(project) {
  const fields = [
    ['name', '事業名', 'input'], ['owner', '担当者', 'input'], ['department', '所属', 'input'], ['stage', '現在ステージ', 'input'], ['phase', '現在フェーズ', 'input'], ['nextReviewDate', '次回レビュー日', 'date'], ['summary', '概要', 'textarea'], ['customerIssues', '顧客課題', 'textarea'], ['valueProposition', '提供価値', 'textarea'], ['pricingModel', '価格モデル', 'textarea'], ['revenueForecast', '売上予測', 'textarea'], ['risks', '主要リスク', 'textarea'], ['nextActions', '次アクション', 'textarea'],
  ];
  return `<form class="form" onsubmit="saveProject(event,'${project.id}')">${fields.map(([key, label, type]) => `<label><span>${label}</span>${type === 'textarea' ? `<textarea name="${key}">${escapeHtml(project[key])}</textarea>` : `<input name="${key}" type="${type}" value="${escapeHtml(project[key])}">`}</label>`).join('')}<button type="submit">保存</button></form>`;
}

function reviewList(project) {
  return project.reviews.map((review, index) => `<article class="review"><strong>${escapeHtml(review.date)} / ${escapeHtml(review.decision)}</strong><p>${escapeHtml(review.summary)}</p><ul>${lines(review.nextActions).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul><button type="button" class="ghost" onclick="deleteReview('${project.id}',${index})">削除</button></article>`).join('') || '<p class="empty">レビュー履歴はまだありません。</p>';
}

function renderReviews() {
  app().innerHTML = `<section class="page-title"><h1>レビュー履歴</h1><p>6か月レビューの判断、次に行う仮説検証、追加資金・体制論点を案件別に確認します。</p></section><section class="card">${projects.map((project) => `<h2><a href="#/projects/${project.id}">${escapeHtml(project.name)}</a></h2>${reviewList(project)}`).join('')}</section>`;
}

function renderScoring() {
  app().innerHTML = `<section class="page-title"><h1>スコアリング</h1><p>各項目は0〜5点。カテゴリスコアは「合計 / 満点 * 100」、総合スコアは重み付きで算出します。</p></section><section class="score-config">${scoreCategories.map((category) => `<article class="card"><h2>${category.label}<span>${Math.round(category.weight * 100)}%</span></h2><ul>${category.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></article>`).join('')}</section>`;
}

function findProject(id) {
  return projects.find((project) => project.id === id);
}

function updateScore(projectId, categoryKey, index, value) {
  const project = findProject(projectId);
  project.scoreItems[categoryKey][index] = Number(value);
  saveProjects();
  renderProjectDetail(projectId);
  toast('スコアを保存しました');
}

function toggleSevereRisk(projectId, checked) {
  const project = findProject(projectId);
  project.severeRiskOpen = checked;
  saveProjects();
  renderProjectDetail(projectId);
}

function saveProject(event, projectId) {
  event.preventDefault();
  const project = findProject(projectId);
  const data = new FormData(event.target);
  for (const [key, value] of data.entries()) project[key] = String(value);
  saveProjects();
  renderProjectDetail(projectId);
  toast('案件を保存しました');
}

function createProject() {
  const id = `project-${Date.now()}`;
  const emptyScores = Object.fromEntries(scoreCategories.map((category) => [category.key, Array(category.items.length).fill(0)]));
  projects.push({ id, name: '新規案件', owner: '', department: '', stage: 'KβC / 1st Stage', phase: 'テーマ探索', nextReviewDate: '', summary: '', customerIssues: '', valueProposition: '', pricingModel: '', revenueForecast: '', risks: '', nextActions: '', severeRiskOpen: false, scoreItems: emptyScores, reviews: [] });
  saveProjects();
  location.hash = `#/projects/${id}`;
}

function addReview(projectId) {
  const project = findProject(projectId);
  const date = prompt('レビュー日を入力してください（YYYY-MM-DD）', new Date().toISOString().slice(0, 10));
  if (!date) return;
  const decision = prompt('判定を入力してください（継続 / 条件付き継続 / 保留 / 中止 / Final Gate申請可）', '条件付き継続');
  const summary = prompt('レビューサマリーを入力してください', '次の6か月で重点論点を検証する');
  project.reviews.unshift({ date, decision: decision || '条件付き継続', summary: summary || '', nextActions: nextIssues(project).flatMap((issue) => issue.questions).join('\n') });
  saveProjects();
  renderProjectDetail(projectId);
}

function deleteReview(projectId, index) {
  const project = findProject(projectId);
  project.reviews.splice(index, 1);
  saveProjects();
  renderProjectDetail(projectId);
}

function toast(message) {
  const template = document.querySelector('#toast-template');
  const node = template.content.firstElementChild.cloneNode(true);
  node.textContent = message;
  document.body.append(node);
  setTimeout(() => node.remove(), 2200);
}

window.updateScore = updateScore;
window.toggleSevereRisk = toggleSevereRisk;
window.saveProject = saveProject;
window.createProject = createProject;
window.addReview = addReview;
window.deleteReview = deleteReview;
window.addEventListener('hashchange', render);
render();
