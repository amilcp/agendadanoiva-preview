const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const h = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const euro = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const dateFmt = new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });

const icons = {
  dashboard: '<path d="M3 11 12 3l9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
  plan: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/>',
  budget: '<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M16 13h5M7 6V4h10v2"/>',
  guests: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  suppliers: '<path d="M3 9h18v11H3z"/><path d="M8 9V5h8v4M3 13h18M9 13v2h6v-2"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/>',
  tables: '<circle cx="12" cy="12" r="5"/><circle cx="12" cy="2.5" r="1.5"/><circle cx="12" cy="21.5" r="1.5"/><circle cx="2.5" cy="12" r="1.5"/><circle cx="21.5" cy="12" r="1.5"/>',
  day: '<path d="M12 22s8-4 8-12V5l-8-3-8 3v5c0 8 8 12 8 12Z"/><path d="m9 12 2 2 4-4"/>',
  memory: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>',
  more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5M5 21h14"/>',
  sparkles: '<path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3Z"/><path d="m19 14 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z"/><path d="m5 14 .8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14Z"/>',
};
const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.heart}</svg>`;

const DEFAULT_STATE = {
  couple: { names: 'Ana & Pedro', date: '2027-06-12', budget: 25000, location: 'Viseu, Portugal' },
  tasks: [
    { id: 1, title: 'Confirmar fotógrafo', due: '2026-09-18', status: 'curso' },
    { id: 2, title: 'Visitar espaço', due: '2026-09-21', status: 'pendente' },
    { id: 3, title: 'Escolher alianças', due: '2026-09-26', status: 'pendente' },
    { id: 4, title: 'Definir ementa', due: '2026-09-30', status: 'pendente' },
    { id: 5, title: 'Enviar convites', due: '2026-10-04', status: 'pendente' },
    { id: 6, title: 'Rever contrato do espaço', due: '2026-09-15', status: 'atrasada' },
    { id: 7, title: 'Criar lista de músicas', due: '2026-10-20', status: 'concluida' },
  ],
  expenses: [
    { id: 1, category: 'Espaço & Catering', supplier: 'Quinta da Serra', total: 11500, paid: 4500, due: '2027-03-22' },
    { id: 2, category: 'Fotografia & Vídeo', supplier: 'Studio Memories', total: 2500, paid: 800, due: '2027-02-15' },
    { id: 3, category: 'Vestuário', supplier: 'Atelier Branco', total: 2100, paid: 1200, due: '2027-04-10' },
    { id: 4, category: 'Decoração', supplier: 'Atelier das Flores', total: 1350, paid: 350, due: '2027-05-02' },
    { id: 5, category: 'Música', supplier: 'DJ Tiago Mendes', total: 1000, paid: 500, due: '2027-06-01' },
  ],
  guests: [
    { id: 1, name: 'Ana Silva', group: 'Família', rsvp: 'confirmado', people: 2, tableId: 3, meal: 'Normal' },
    { id: 2, name: 'João Silva', group: 'Família', rsvp: 'confirmado', people: 2, tableId: 3, meal: 'Normal' },
    { id: 3, name: 'Maria Silva', group: 'Família', rsvp: 'pendente', people: 1, tableId: 3, meal: 'Vegetariano' },
    { id: 4, name: 'Carlos Mendes', group: 'Amigos', rsvp: 'confirmado', people: 2, tableId: 3, meal: 'Normal' },
    { id: 5, name: 'Sofia Mendes', group: 'Amigos', rsvp: 'confirmado', people: 1, tableId: 3, meal: 'Sem glúten' },
    { id: 6, name: 'Rita Costa', group: 'Colegas', rsvp: 'confirmado', people: 2, tableId: 3, meal: 'Normal' },
    { id: 7, name: 'Pedro Costa', group: 'Colegas', rsvp: 'recusado', people: 0, tableId: null, meal: 'Normal' },
    { id: 8, name: 'Laura Costa', group: 'Família', rsvp: 'confirmado', people: 1, tableId: 3, meal: 'Criança' },
    { id: 9, name: 'Duarte Silva', group: 'Amigos', rsvp: 'pendente', people: 1, tableId: null, meal: 'Normal' },
    { id: 10, name: 'Marta Silva', group: 'Família', rsvp: 'confirmado', people: 1, tableId: 3, meal: 'Normal' },
    { id: 11, name: 'Tiago Lima', group: 'Amigos', rsvp: 'pendente', people: 1, tableId: null, meal: 'Normal' },
    { id: 12, name: 'Avó Rosa', group: 'Família', rsvp: 'confirmado', people: 1, tableId: 1, meal: 'Sem sal' },
  ],
  suppliers: [
    { id: 1, service: 'Espaço & Catering', name: 'Quinta da Serra', status: 'contratado', contact: 'geral@quintadaserra.pt' },
    { id: 2, service: 'Fotografia', name: 'Studio Memories', status: 'avaliacao', contact: 'ola@studiomemories.pt' },
    { id: 3, service: 'Vídeo', name: 'Luz & Filme', status: 'avaliacao', contact: 'geral@luzefilme.pt' },
    { id: 4, service: 'Flores', name: 'Flor de Lis', status: 'pendente', contact: 'flores@flordelis.pt' },
    { id: 5, service: 'Música', name: 'DJ Tiago Mendes', status: 'pendente', contact: 'tiago@dj.pt' },
    { id: 6, service: 'Decoração', name: 'Atelier das Flores', status: 'avaliacao', contact: 'decor@atelier.pt' },
    { id: 7, service: 'Estacionário', name: 'Cor Púrpura', status: 'contratado', contact: 'geral@corpurpura.com' },
    { id: 8, service: 'Bolo', name: 'Doce Momento', status: 'pendente', contact: 'ola@docemomento.pt' },
  ],
  tables: [
    { id: 1, name: 'Mesa 1 — Família', capacity: 10 },
    { id: 2, name: 'Mesa 2 — Amigos', capacity: 10 },
    { id: 3, name: 'Mesa 3 — Família', capacity: 10 },
    { id: 4, name: 'Mesa 4 — Colegas', capacity: 8 },
  ],
  timeline: [
    { id: 1, time: '08:00', title: 'Pequeno-almoço', location: 'Casa da noiva' },
    { id: 2, time: '09:00', title: 'Cabelo', location: 'Salão Beleza & Cia' },
    { id: 3, time: '10:30', title: 'Maquilhagem', location: 'Salão Beleza & Cia' },
    { id: 4, time: '12:00', title: 'Fotógrafo chega', location: 'Casa da noiva' },
    { id: 5, time: '13:30', title: 'Saída da noiva', location: 'Casa da noiva' },
    { id: 6, time: '14:00', title: 'Cerimónia', location: 'Igreja de São Miguel' },
    { id: 7, time: '15:30', title: 'Cocktail', location: 'Quinta da Serra' },
    { id: 8, time: '18:00', title: 'Entrada na sala', location: 'Quinta da Serra' },
    { id: 9, time: '20:30', title: 'Primeira dança', location: 'Quinta da Serra' },
    { id: 10, time: '23:30', title: 'Corte do bolo', location: 'Quinta da Serra' },
  ],
  memory: '',
};

const modules = [
  ['01','O Nosso Casamento','Visão, prioridades e decisões do casal',78],
  ['02','O Meu Plano','Tarefas, calendário e reuniões',38],
  ['03','O Nosso Orçamento','Despesas, pagamentos e previsões',73],
  ['04','Os Nossos Convidados','Lista, respostas e necessidades',64],
  ['05','Fornecedores','Contactos, propostas e contratos',52],
  ['06','Cerimónia','Programa, participantes e votos',30],
  ['07','Espaço & Catering','Local, ementa e serviço',42],
  ['08','Visual & Experiência','Decoração, flores e ambiente',25],
  ['09','O Nosso Look','Vestuário, acessórios e cuidados',35],
  ['10','Estacionário & Comunicação','Convites, ementas e sinalética',56],
  ['11','Fotografia, Vídeo & Entretenimento','Registos, música e animação',44],
  ['12','Mesas','Distribuição visual dos convidados',61],
  ['13','O Grande Dia','Timeline, contactos e dossier',48],
  ['14','Lua de Mel','Viagem, reservas e orçamento',18],
  ['15','Memórias','Histórias, fotografias e Wedding Book',12],
];

const moduleBlueprints = {
  '01': { summary: 'Definam a visão do casamento antes de tomarem decisões isoladas.', question: 'Como querem que as pessoas se sintam quando recordarem o vosso casamento?', items: ['Escolher três palavras para definir o casamento','Registar as três prioridades do casal','Confirmar data, localização e número estimado de convidados','Definir o orçamento de referência'], tool: ['dashboard','Ver visão geral'] },
  '02': { summary: 'Transformem todas as decisões num plano simples, datado e realista.', question: 'Qual é a próxima decisão que desbloqueia várias outras?', items: ['Rever tarefas dos próximos 30 dias','Atribuir responsáveis às decisões principais','Marcar reuniões e visitas pendentes','Concluir tarefas atrasadas'], tool: ['planeamento','Abrir planeamento'] },
  '03': { summary: 'Acompanhem o que foi previsto, contratado, pago e ainda está disponível.', question: 'Que valor querem proteger para imprevistos?', items: ['Confirmar orçamento total','Registar todos os contratos assinados','Rever pagamentos dos próximos 60 dias','Reservar margem para imprevistos'], tool: ['orcamento','Abrir orçamento'] },
  '04': { summary: 'Organizem as pessoas, respostas, acompanhantes e necessidades especiais.', question: 'Quem é indispensável para tornar este dia verdadeiramente vosso?', items: ['Fechar lista inicial de convidados','Confirmar contactos em falta','Acompanhar respostas pendentes','Rever refeições e necessidades especiais'], tool: ['convidados','Gerir convidados'] },
  '05': { summary: 'Comparem propostas e guardem contactos, decisões e condições num só lugar.', question: 'Que critérios são inegociáveis na escolha de cada fornecedor?', items: ['Listar fornecedores necessários','Pedir propostas comparáveis','Rever condições e cancelamentos','Guardar contactos do dia'], tool: ['fornecedores','Gerir fornecedores'] },
  '06': { summary: 'Construam uma cerimónia coerente com a vossa história e contexto.', question: 'Que momento deve representar melhor a vossa relação?', items: ['Confirmar tipo e local da cerimónia','Escolher participantes e leituras','Preparar votos ou textos pessoais','Validar documentos e requisitos'] },
  '07': { summary: 'Alinhem espaço, serviço e ementa com o ritmo e conforto do dia.', question: 'Como querem que os convidados vivam a celebração, do início ao fim?', items: ['Confirmar planta e capacidades','Fechar ementa e bebidas','Rever horários de montagem e serviço','Validar plano alternativo para o tempo'], tool: ['fornecedores','Ver fornecedor do espaço'] },
  '08': { summary: 'Criem uma linguagem visual consistente, com intenção e sem excesso.', question: 'Que atmosfera deve unir flores, luz, materiais e pequenos detalhes?', items: ['Definir paleta e referências','Escolher flores e elementos centrais','Planear iluminação e ambiente','Validar montagem e desmontagem'] },
  '09': { summary: 'Planeiem vestuário, acessórios, provas e cuidados pessoais sem pressa.', question: 'Em que escolhas se sentem mais autênticos e confortáveis?', items: ['Escolher looks principais','Agendar provas e ajustes','Definir acessórios e alianças','Planear cabelo, maquilhagem e cuidados'] },
  '10': { summary: 'Organizem cada peça de comunicação, do convite à sinalética do espaço.', question: 'Que tom deve acompanhar os convidados desde o primeiro contacto?', items: ['Fechar lista de peças necessárias','Preparar convites e informação útil','Rever nomes, datas e textos','Planear impressão, envio e sinalética'] },
  '11': { summary: 'Definam como o dia será registado, ouvido e vivido pelos convidados.', question: 'Que imagens, sons e momentos não podem faltar?', items: ['Alinhar momentos essenciais com fotografia','Definir entregáveis de vídeo','Preparar músicas e restrições','Planear animação e momentos surpresa'], tool: ['fornecedores','Ver equipa criativa'] },
  '12': { summary: 'Distribuam os convidados de forma equilibrada e confortável.', question: 'Que combinações tornam a conversa mais natural em cada mesa?', items: ['Confirmar lista final de presenças','Definir formato e capacidade das mesas','Distribuir convidados confirmados','Preparar planta final para o espaço'], tool: ['mesas','Organizar mesas'] },
  '13': { summary: 'Transformem todos os planos num guião operacional claro para o dia.', question: 'Quem precisa de saber o quê — e a que horas?', items: ['Fechar timeline completa','Confirmar contactos de coordenação','Distribuir responsabilidades e materiais','Preparar dossier do grande dia'], tool: ['grande-dia','Abrir timeline'] },
  '14': { summary: 'Planeiem a viagem com o mesmo cuidado, deixando espaço para descansar.', question: 'Que equilíbrio procuram entre descoberta, descanso e orçamento?', items: ['Definir destino e duração','Confirmar documentos e seguros','Reservar transportes e estadias','Criar orçamento e roteiro essencial'] },
  '15': { summary: 'Guardem palavras, imagens e pequenos detalhes enquanto ainda estão vivos.', question: 'Que história gostariam de reler daqui a muitos anos?', items: ['Guardar memórias da preparação','Reunir fotografias e mensagens','Registar histórias do grande dia','Preparar a base do Wedding Book'], tool: ['memorias','Abrir Wedding Book'] },
};

let state = loadState();
let guestFilter = 'todos';
let guestSearch = '';

function normaliseState(saved = {}) {
    const next = { ...structuredClone(DEFAULT_STATE), ...(saved && typeof saved === 'object' ? saved : {}) };
    ['tasks','expenses','guests','suppliers','tables','timeline'].forEach(key => {
      if (!Array.isArray(next[key])) next[key] = structuredClone(DEFAULT_STATE[key]);
    });
    if (!next.couple || typeof next.couple !== 'object' || Array.isArray(next.couple)) next.couple = structuredClone(DEFAULT_STATE.couple);
    next.plan ||= 'comercial';
    next.moduleWork ||= {};
    modules.forEach(([number,,,seed]) => {
      const items = moduleBlueprints[number].items;
      const seeded = items.filter((_,index) => index < Math.round(items.length * seed / 100));
      next.moduleWork[number] = { completed: seeded, notes: '', ...(next.moduleWork[number] || {}) };
    });
    return next;
}
function loadState() {
  try {
    return normaliseState(JSON.parse(localStorage.getItem('agenda-noiva-state') || '{}'));
  }
  catch {
    return normaliseState();
  }
}
function saveState(message) {
  localStorage.setItem('agenda-noiva-state', JSON.stringify(state));
  window.AgendaPlatform?.scheduleSync?.(state);
  if (message) toast(message);
  render();
}
function nextId(items) { return Math.max(0, ...items.map(x => Number(x.id) || 0)) + 1; }
function daysToWedding() { return Math.max(0, Math.ceil((new Date(state.couple.date) - new Date()) / 86400000)); }
function expenseTotals() {
  const contracted = state.expenses.reduce((s,x) => s + Number(x.total || 0), 0);
  const paid = state.expenses.reduce((s,x) => s + Number(x.paid || 0), 0);
  return { contracted, paid, due: contracted - paid, available: Number(state.couple.budget) - contracted };
}
function guestCounts() {
  const confirmed = state.guests.filter(x=>x.rsvp==='confirmado').reduce((s,x)=>s+Number(x.people||0),0);
  const pending = state.guests.filter(x=>x.rsvp==='pendente').length;
  const refused = state.guests.filter(x=>x.rsvp==='recusado').length;
  return { confirmed, pending, refused, total: state.guests.length };
}
function route() { return location.hash.replace('#','') || 'dashboard'; }
function navigate(to) { location.hash = to; }
function moduleProgress(number) {
  const work = state.moduleWork?.[number];
  const total = moduleBlueprints[number]?.items.length || 1;
  return Math.round(((work?.completed?.length || 0) / total) * 100);
}

const navItems = [
  ['dashboard','Dashboard','dashboard'], ['planeamento','Planeamento','plan'], ['orcamento','Orçamento','budget'],
  ['convidados','Convidados','guests'], ['fornecedores','Fornecedores','suppliers'], ['casamento','O Casamento','heart'],
  ['mesas','Mesas','tables'], ['grande-dia','O Grande Dia','day'], ['memorias','Memórias','memory'], ['edicoes','Edições','sparkles']
];
const mobileItems = [
  ['dashboard','Início','dashboard'],['planeamento','Plano','plan'],['convidados','Convidados','guests'],['casamento','Casamento','heart'],['mais','Mais','more']
];

function renderNav() {
  const current = route();
  const inModule = current.startsWith('module-');
  $('#desktop-nav').innerHTML = navItems.map(([id,label,ico]) => `<button class="nav-link ${current===id || (id==='casamento'&&inModule)?'active':''}" data-nav="${id}">${icon(ico)}<span>${label}</span></button>`).join('');
  $('#mobile-nav').innerHTML = mobileItems.map(([id,label,ico]) => `<button class="nav-link ${current===id || (id==='casamento'&&inModule) || (id==='mais' && ['fornecedores','mesas','grande-dia','memorias','edicoes','mais'].includes(current))?'active':''}" data-nav="${id}">${icon(ico)}<span>${label}</span></button>`).join('');
}

const titles = {
  dashboard:['O nosso casamento','Dashboard'], planeamento:['Passo a passo até ao grande dia','Planeamento'], orcamento:['Controla, planeia, realiza','Orçamento'],
  convidados:['As pessoas especiais do nosso dia','Convidados'], fornecedores:['Os profissionais do nosso casamento','Fornecedores'], casamento:['Tudo o que faz parte da nossa história','O Casamento'],
  mesas:['Onde se sentam as pessoas especiais','Mesas'], 'grande-dia':['Tudo a postos para viver este momento','O Grande Dia'], memorias:['Guardar o que realmente importa','Memórias'],
  mais:['Acesso rápido','Mais'], edicoes:['Comercial e Premium','Edições']
};

function render() {
  renderNav();
  const current = route();
  const moduleNumber = current.match(/^module-(\d{2})$/)?.[1];
  const moduleInfo = modules.find(([number]) => number === moduleNumber);
  const [kicker,title] = moduleInfo ? [`Módulo ${moduleNumber} · Wedding Planner`,moduleInfo[1]] : (titles[current] || titles.dashboard);
  $('#page-kicker').textContent = kicker;
  $('#page-title').textContent = title;
  const renderers = { dashboard: renderDashboard, planeamento: renderPlanning, orcamento: renderBudget, convidados: renderGuests,
    fornecedores: renderSuppliers, casamento: renderModules, mesas: renderTables, 'grande-dia': renderDay, memorias: renderMemories, mais: renderMore, edicoes: renderEditions };
  $('#view').innerHTML = moduleNumber ? renderModuleDetail(moduleNumber) : (renderers[current] || renderDashboard)();
  bindViewEvents();
  $('#view').focus({preventScroll:true});
}

function actionButtons(buttons) { return `<div class="page-actions">${buttons.join('')}</div>`; }
function button(label, action, style='primary', ico='plus') { return `<button class="button button-${style}" data-action="${action}">${icon(ico)} ${label}</button>`; }
function statusLabel(value) { return value === 'avaliacao' ? 'Em avaliação' : value === 'pendente' ? 'Pendente' : value === 'recusado' ? 'Recusado' : value === 'curso' ? 'Em curso' : value === 'concluida' ? 'Concluída' : value[0].toUpperCase()+value.slice(1); }

function renderDashboard() {
  const totals = expenseTotals(), guests = guestCounts();
  const completed = state.tasks.filter(x=>x.status==='concluida').length;
  const progress = Math.round((completed/state.tasks.length)*100);
  const nextTasks = [...state.tasks].filter(x=>x.status!=='concluida').sort((a,b)=>a.due.localeCompare(b.due)).slice(0,5);
  const nextPayment = [...state.expenses].filter(x=>Number(x.total)>Number(x.paid)).sort((a,b)=>a.due.localeCompare(b.due))[0];
  const overdue = state.tasks.filter(x=>x.status==='atrasada').length;
  const noTable = state.guests.filter(x=>x.rsvp==='confirmado' && !x.tableId).length;
  return `
    <section class="card hero-card">
      <div class="hero-main"><p class="eyebrow">O NOSSO CASAMENTO</p><h2 class="hero-names">${h(state.couple.names)}</h2><span class="hero-date">${dateFmt.format(new Date(state.couple.date))} · ${h(state.couple.location)}</span></div>
      <div class="countdown"><span>FALTAM</span><strong>${daysToWedding()}</strong><span>DIAS</span></div>
    </section>
    <section class="grid grid-4" style="margin-top:16px">
      ${statCard('Planeamento',`${progress}%`,'concluído',progress)}
      ${statCard('Orçamento',euro.format(totals.contracted),`de ${euro.format(state.couple.budget)}`,Math.round(totals.contracted/state.couple.budget*100))}
      ${statCard('Convidados',guests.confirmed,'confirmados',Math.round(guests.confirmed/Math.max(1,guests.total)*100))}
      ${statCard('Fornecedores',state.suppliers.filter(x=>x.status==='contratado').length,'contratados',Math.round(state.suppliers.filter(x=>x.status==='contratado').length/state.suppliers.length*100))}
    </section>
    <section class="dashboard-layout">
      <div class="card card-pad">
        <div class="card-header"><div><h2>Próximas tarefas</h2><p>O que precisa da vossa atenção primeiro.</p></div><button class="link-button" data-nav="planeamento">Ver todas →</button></div>
        <ul class="check-list">${nextTasks.map(taskRow).join('')}</ul>
      </div>
      <div class="stack">
        <div class="card card-pad">
          <div class="card-header"><div><h3>Próximo pagamento</h3><p>${h(nextPayment?.supplier || 'Sem pagamentos')}</p></div></div>
          <div class="stat-value">${euro.format(nextPayment ? nextPayment.total-nextPayment.paid : 0)}</div>
          <p class="meta">${nextPayment ? dateFmt.format(new Date(nextPayment.due)) : ''}</p>
        </div>
        <div class="card card-pad">
          <div class="card-header"><div><h3>O casamento precisa da tua atenção</h3></div></div>
          <ul class="alert-list">
            <li class="alert-row"><span class="alert-icon">!</span><span>${guests.pending} respostas por confirmar</span></li>
            <li class="alert-row"><span class="alert-icon">!</span><span>${overdue} tarefas atrasadas</span></li>
            <li class="alert-row"><span class="alert-icon">!</span><span>${noTable} convidados sem mesa</span></li>
          </ul>
        </div>
      </div>
    </section>`;
}
function statCard(label,value,foot,progress) { return `<article class="card stat-card"><span class="stat-label">${label}</span><strong class="stat-value">${value}</strong><span class="stat-foot">${foot}</span><div class="progress-track"><div class="progress-bar" style="width:${Math.min(100,progress||0)}%"></div></div></article>`; }
function taskRow(t) { return `<li class="check-row ${t.status==='concluida'?'done':''}"><input type="checkbox" data-task-toggle="${t.id}" ${t.status==='concluida'?'checked':''} aria-label="Concluir ${h(t.title)}"><span class="task-name">${h(t.title)}</span><span class="meta">${dateFmt.format(new Date(t.due))}</span><button class="delete-button" data-delete="task:${t.id}" aria-label="Eliminar tarefa">×</button></li>`; }

function renderPlanning() {
  const groups = [['Esta semana',state.tasks.filter(x=>x.status!=='concluida').slice(0,4)],['Próximas',state.tasks.filter(x=>x.status!=='concluida').slice(4)],['Concluídas',state.tasks.filter(x=>x.status==='concluida')]];
  return `${actionButtons([button('Nova tarefa','add-task')])}<section class="card card-pad"><div class="card-header"><div><h2>Plano de ação</h2><p>Decisões grandes transformadas em passos concretos.</p></div><span class="status curso">${state.tasks.filter(x=>x.status!=='concluida').length} por concluir</span></div>${groups.map(([name,tasks])=>`<div style="margin-top:22px"><h3 style="margin-bottom:8px">${name}</h3><ul class="check-list">${tasks.length?tasks.map(taskRow).join(''):'<li class="empty-state">Sem tarefas nesta secção.</li>'}</ul></div>`).join('')}</section>`;
}

function renderBudget() {
  const t = expenseTotals(); const pct = Math.min(100,Math.round(t.contracted/state.couple.budget*100));
  return `${actionButtons([button('Nova despesa','add-expense')])}
    <section class="budget-summary">
      <div class="card budget-total"><span class="stat-label">Orçamento total</span><strong>${euro.format(state.couple.budget)}</strong><div class="budget-numbers">
        ${[['Contratado',t.contracted],['Pago',t.paid],['Por pagar',t.due],['Disponível',t.available]].map(([l,v])=>`<div class="budget-number"><strong>${euro.format(v)}</strong><span>${l}</span></div>`).join('')}
      </div></div>
      <div class="card donut-card"><div class="donut" style="--value:${pct}%"><div class="donut-label"><strong>${pct}%</strong><span class="meta">contratado</span></div></div><div><h2>Distribuição</h2><div class="legend">${[...new Set(state.expenses.map(x=>x.category))].slice(0,6).map((x,i)=>`<span><i style="opacity:${1-i*.1}"></i>${h(x)}</span>`).join('')}</div></div></div>
    </section>${state.plan==='premium' ? renderPremiumFinance(t) : renderPremiumPrompt('Finanças avançadas','Alertas, previsões e comparações automáticas estão disponíveis na edição Premium.')}
    <section class="card card-pad" style="margin-top:16px"><div class="card-header"><div><h2>Despesas e pagamentos</h2><p>Valores contratados e prestações realizadas.</p></div></div><div class="table-wrap"><table><thead><tr><th>Categoria</th><th>Fornecedor</th><th>Total</th><th>Pago</th><th>Por pagar</th><th>Vencimento</th><th></th></tr></thead><tbody>${state.expenses.map(x=>`<tr><td>${h(x.category)}</td><td>${h(x.supplier)}</td><td>${euro.format(x.total)}</td><td>${euro.format(x.paid)}</td><td>${euro.format(x.total-x.paid)}</td><td>${dateFmt.format(new Date(x.due))}</td><td><button class="delete-button" data-delete="expense:${x.id}">×</button></td></tr>`).join('')}</tbody></table></div></section>`;
}

function renderPremiumFinance(t) {
  const next = [...state.expenses].filter(x=>x.total>x.paid).sort((a,b)=>a.due.localeCompare(b.due))[0];
  const reserve = Math.max(0,Math.round((t.available / Math.max(1,state.couple.budget))*100));
  return `<section class="premium-insights card"><div class="premium-label">${icon('sparkles')} PREMIUM</div><div><span>Margem disponível</span><strong>${reserve}%</strong><small>${euro.format(t.available)} por contratar</small></div><div><span>Próximo compromisso</span><strong>${next ? euro.format(next.total-next.paid) : euro.format(0)}</strong><small>${next ? `${h(next.supplier)} · ${dateFmt.format(new Date(next.due))}` : 'Sem pagamentos pendentes'}</small></div><div><span>Estado do orçamento</span><strong>${t.available>=0?'Dentro do limite':'Acima do limite'}</strong><small>${t.available>=0?'Sem desvios críticos':'Rever valores contratados'}</small></div></section>`;
}

function renderPremiumPrompt(title,copy) {
  return `<aside class="premium-prompt"><span>${icon('sparkles')}</span><div><strong>${title}</strong><p>${copy}</p></div><button class="link-button" data-nav="edicoes">Comparar edições →</button></aside>`;
}

function renderGuests() {
  const c=guestCounts();
  const guests=state.guests.filter(x=>(guestFilter==='todos'||x.rsvp===guestFilter)&&x.name.toLowerCase().includes(guestSearch.toLowerCase()));
  return `${actionButtons([button('Exportar','export-data','ghost','download'),button('Importar','import-data','ghost','upload'),button('Adicionar convidado','add-guest')])}
    <section class="grid grid-4">${statCard('Confirmados',c.confirmed,'pessoas',100)}${statCard('Pendentes',c.pending,'respostas',100)}${statCard('Recusaram',c.refused,'convites',100)}${statCard('Total',c.total,'registos',100)}</section>
    <section class="card card-pad" style="margin-top:16px"><div class="toolbar"><div class="searchbox"><input id="guest-search" value="${h(guestSearch)}" placeholder="Pesquisar convidado…" aria-label="Pesquisar convidado"></div><div class="filter-pills">${['todos','confirmado','pendente','recusado'].map(x=>`<button class="pill ${guestFilter===x?'active':''}" data-guest-filter="${x}">${x==='todos'?'Todos':statusLabel(x)}</button>`).join('')}</div></div>
    <div class="table-wrap"><table><thead><tr><th>Nome</th><th>Grupo</th><th>Resposta</th><th>Pessoas</th><th>Mesa</th><th>Refeição</th><th></th></tr></thead><tbody>${guests.map(g=>`<tr><td>${h(g.name)}</td><td>${h(g.group)}</td><td><span class="status ${g.rsvp}">${statusLabel(g.rsvp)}</span></td><td>${g.people}</td><td>${h(state.tables.find(t=>t.id===g.tableId)?.name || '—')}</td><td>${h(g.meal)}</td><td><button class="delete-button" data-delete="guest:${g.id}">×</button></td></tr>`).join('')}</tbody></table></div></section>`;
}

function renderSuppliers() {
  return `${actionButtons([button('Adicionar fornecedor','add-supplier')])}<section class="supplier-grid">${state.suppliers.map(s=>`<article class="card supplier-card"><div class="supplier-visual"></div><div class="supplier-body"><span class="status ${s.status}">${statusLabel(s.status)}</span><h3>${h(s.service)}</h3><p>${h(s.name)}<br>${h(s.contact)}</p><button class="delete-button" data-delete="supplier:${s.id}" aria-label="Eliminar fornecedor">Eliminar</button></div></article>`).join('')}</section>`;
}

function renderModules() {
  const overall = Math.round(modules.reduce((sum,[number]) => sum + moduleProgress(number),0) / modules.length);
  return `<section class="module-overview card">
    <div><p class="eyebrow">O NOSSO PERCURSO</p><h2>Um casamento organizado, decisão a decisão.</h2><p>Os 15 módulos acompanham o casal da primeira visão às memórias depois do sim.</p></div>
    <div class="overview-progress"><strong>${overall}%</strong><span>progresso global</span><div class="progress-track"><div class="progress-bar" style="width:${overall}%"></div></div></div>
  </section><section class="module-grid">${modules.map(([n,title,desc])=>{const p=moduleProgress(n);return `<article class="card module-card" data-nav="module-${n}" tabindex="0"><div class="module-card-top"><span class="module-number">${n}</span><span class="module-arrow">↗</span></div><h3>${title}</h3><p>${desc}</p><div class="module-progress"><div class="progress-track"><div class="progress-bar" style="width:${p}%"></div></div><span class="meta">${p}% concluído</span></div></article>`}).join('')}</section>`;
}

function renderModuleDetail(number) {
  const moduleInfo = modules.find(([n])=>n===number);
  if (!moduleInfo) return renderModules();
  const [,title] = moduleInfo;
  const guide = moduleBlueprints[number];
  const work = state.moduleWork[number];
  const progress = moduleProgress(number);
  return `<div class="module-detail-actions"><button class="back-button" data-nav="casamento">${icon('close')} Voltar aos módulos</button>${guide.tool ? `<button class="button button-secondary" data-nav="${guide.tool[0]}">${guide.tool[1]} ${icon('plus')}</button>` : ''}</div>
    <section class="module-detail-hero card">
      <div><span class="module-number">MÓDULO ${number}</span><h2>${title}</h2><p>${guide.summary}</p></div>
      <div class="module-detail-progress"><strong>${progress}%</strong><span>concluído</span><div class="progress-track"><div class="progress-bar" style="width:${progress}%"></div></div></div>
    </section>
    <section class="module-detail-grid">
      <div class="card card-pad">
        <div class="card-header"><div><p class="eyebrow">PASSOS ESSENCIAIS</p><h2>Lista de decisões</h2></div><span class="meta">${work.completed.length}/${guide.items.length}</span></div>
        <ul class="module-checklist">${guide.items.map(item=>`<li class="module-check ${work.completed.includes(item)?'done':''}"><label><input type="checkbox" data-module-check="${number}" value="${item}" ${work.completed.includes(item)?'checked':''}><span>${item}</span></label></li>`).join('')}</ul>
      </div>
      <div class="stack">
        <aside class="card reflection-card"><p class="eyebrow">CONVERSA A DOIS</p><blockquote>${guide.question}</blockquote></aside>
        <aside class="card card-pad module-notes-card"><div class="card-header"><div><p class="eyebrow">NOTAS DO CASAL</p><h3>Decisões e ideias</h3></div></div><textarea class="textarea module-notes" data-module-notes="${number}" placeholder="Escrevam aqui o que ficou decidido…">${h(work.notes || '')}</textarea><button class="button button-primary" data-action="save-module-notes" data-module-number="${number}">Guardar notas</button></aside>
      </div>
    </section>`;
}

function renderTables() {
  return state.plan==='premium' ? renderPremiumTables() : renderCommercialTables();
}

function renderCommercialTables() {
  const confirmed=state.guests.filter(g=>g.rsvp==='confirmado');
  return `${actionButtons([button('Adicionar mesa','add-table')])}
    <section class="edition-notice card"><div><span class="edition-chip">COMERCIAL</span><h2>Organização simples e completa</h2><p>Atribui cada convidado a uma mesa. A edição Premium acrescenta planta visual e arrastar e largar.</p></div><button class="button button-ghost" data-nav="edicoes">Comparar edições</button></section>
    <section class="grid grid-3 table-summary">${state.tables.map(t=>{const used=state.guests.filter(g=>g.tableId===t.id).reduce((sum,g)=>sum+Number(g.people||0),0);return `<article class="card table-summary-card"><div><h3>${h(t.name)}</h3><span>${used}/${t.capacity} lugares</span></div><button class="delete-button" data-delete="table:${t.id}" aria-label="Eliminar ${h(t.name)}">×</button><div class="progress-track"><div class="progress-bar" style="width:${Math.min(100,Math.round(used/t.capacity*100))}%"></div></div></article>`}).join('')}</section>
    <section class="card card-pad" style="margin-top:16px"><div class="card-header"><div><h2>Distribuição dos convidados</h2><p>Todos os confirmados podem ser organizados sem Premium.</p></div></div><div class="table-wrap"><table><thead><tr><th>Convidado</th><th>Grupo</th><th>Pessoas</th><th>Mesa</th></tr></thead><tbody>${confirmed.map(g=>`<tr><td>${h(g.name)}</td><td>${h(g.group)}</td><td>${g.people}</td><td><select class="select table-select" data-guest-table-select="${g.id}" aria-label="Mesa de ${h(g.name)}"><option value="">Sem mesa</option>${state.tables.map(t=>`<option value="${t.id}" ${g.tableId===t.id?'selected':''}>${h(t.name)}</option>`).join('')}</select></td></tr>`).join('')}</tbody></table></div></section>`;
}

function renderPremiumTables() {
  const unassigned=state.guests.filter(g=>g.rsvp==='confirmado'&&!g.tableId);
  return `${actionButtons([button('Adicionar mesa','add-table')])}<section class="premium-mode-banner">${icon('sparkles')} Planta visual Premium ativa</section><section class="seating-layout">
    <aside class="card seating-panel"><h2>Sem mesa</h2><div class="guest-pool" data-drop-table="none">${unassigned.length?unassigned.map(guestChip).join(''):'<p class="meta">Todos os confirmados têm mesa.</p>'}</div></aside>
    <div class="floor">${state.tables.map(t=>{const guests=state.guests.filter(g=>g.tableId===t.id);const used=guests.reduce((sum,g)=>sum+Number(g.people||0),0);return `<article class="table-card" data-drop-table="${t.id}"><header><div><h3>${h(t.name)}</h3><span class="capacity">${used}/${t.capacity} lugares</span></div><button class="delete-button" data-delete="table:${t.id}">×</button></header><div class="table-guests">${guests.map(guestChip).join('')}</div></article>`}).join('')}</div>
    <aside class="card seating-panel"><h2>Resumo</h2><div class="grid grid-2">${statCard('Confirmados',guestCounts().confirmed,'pessoas',100)}${statCard('Mesas',state.tables.length,'criadas',100)}</div><p class="meta" style="margin-top:16px">Arrasta cada convidado para a mesa pretendida.</p></aside>
  </section>`;
}
function guestChip(g){return `<div class="guest-chip" draggable="true" data-guest-id="${g.id}"><span class="mini-avatar">${h(g.name[0])}</span><span>${h(g.name)}</span></div>`}

function renderDay() {
  return `${actionButtons([button('Imprimir dossier','print-dossier','ghost','download'),button('Adicionar momento','add-timeline')])}<section class="grid grid-3" style="margin-bottom:16px">${statCard('Data',dateFmt.format(new Date(state.couple.date)),'o grande dia',100)}${statCard('Faltam',daysToWedding(),'dias',100)}${statCard('Momentos',state.timeline.length,'na timeline',100)}</section><section class="card card-pad"><div class="card-header"><div><h2>Timeline</h2><p>O plano operacional do dia.</p></div></div><ol class="timeline">${state.timeline.sort((a,b)=>a.time.localeCompare(b.time)).map(x=>`<li class="timeline-item"><span class="timeline-time">${h(x.time)}</span><i class="timeline-dot"></i><div class="timeline-copy"><strong>${h(x.title)}</strong><span>${h(x.location)}</span></div><button class="delete-button" data-delete="timeline:${x.id}">×</button></li>`).join('')}</ol></section>`;
}

function renderMemories() {
  return `<section class="card memory-card"><p class="eyebrow">WEDDING BOOK</p><blockquote>“Há momentos que merecem ficar por escrito.”</blockquote><textarea class="textarea" id="memory-text" placeholder="Escreve aqui uma memória, uma frase ou algo que não queres esquecer…">${h(state.memory || '')}</textarea><div class="page-actions" style="margin:14px 0 0">${button('Guardar memória','save-memory')}</div></section>`;
}

function renderMore() {
  return `<section class="module-grid">${navItems.filter(([id])=>['fornecedores','mesas','grande-dia','memorias','edicoes'].includes(id)).map(([id,label,ico])=>`<article class="card module-card" data-nav="${id}">${icon(ico)}<h3>${label}</h3><p>${id==='edicoes'?`Edição atual: ${state.plan==='premium'?'Premium':'Comercial'}.`:'Abrir esta área da agenda.'}</p></article>`).join('')}<article class="card module-card" data-action="account">${icon('guests')}<h3>Conta e sincronização</h3><p>Entrar, recuperar o acesso e editar os dados do casamento.</p></article><article class="card module-card" data-action="export-data">${icon('download')}<h3>Exportar dados</h3><p>Guardar uma cópia de segurança em JSON.</p></article><article class="card module-card" data-action="privacy">${icon('day')}<h3>Privacidade e dados</h3><p>Consultar, descarregar ou eliminar os teus dados.</p></article><article class="card module-card" data-action="reset-data">${icon('more')}<h3>Repor demonstração</h3><p>Voltar aos dados iniciais deste protótipo.</p></article></section>`;
}

function renderEditions() {
  const commercial=['15 módulos completos','Dashboard, tarefas e cronograma','Orçamento, despesas e pagamentos','Convidados, respostas e refeições','Fornecedores, cerimónia e celebração','Mesas por atribuição simples','Memórias e partilha com o parceiro'];
  const premium=['Tudo da edição Comercial','Automatizações entre módulos','Finanças avançadas e alertas','Comparadores e briefings automáticos','Planta visual de mesas','Anexos, contratos e histórico','Colaboração alargada e Wedding Day Pack','Wedding Book avançado'];
  return `<section class="edition-intro card"><p class="eyebrow">MODELO DO PRODUTO</p><h2>O casamento inteiro na edição Comercial.<br>Mais inteligência e menos trabalho na Premium.</h2><p>A edição Premium acrescenta automação e ferramentas avançadas; nunca retira funções essenciais da organização.</p></section>
    <section class="edition-grid">
      ${editionCard('comercial','Comercial','Organização completa',commercial)}
      ${editionCard('premium','Premium','Automação e colaboração',premium)}
    </section>
    <p class="edition-footnote">A seleção serve para testar os dois percursos. As contas e a sincronização ficam disponíveis quando a infraestrutura online estiver ligada.</p>`;
}

function editionCard(id,name,subtitle,features){
  const active=state.plan===id;
  return `<article class="card edition-card ${active?'active':''}"><div class="edition-card-head"><div><span class="edition-chip">${name.toUpperCase()}</span><h2>${name}</h2><p>${subtitle}</p></div>${active?'<span class="current-plan">Edição ativa</span>':''}</div><ul>${features.map(item=>`<li>✓ <span>${item}</span></li>`).join('')}</ul><button class="button ${active?'button-ghost':'button-secondary'}" data-action="set-plan-${id}" ${active?'disabled':''}>${active?'Selecionada':`Testar ${name}`}</button></article>`;
}

const modal = $('#modal');
const schemas = {
  'add-task': ['Nova tarefa','task',[['title','Tarefa','text',true],['due','Prazo','date',true]]],
  'add-expense': ['Nova despesa','expense',[['category','Categoria','text',true],['supplier','Fornecedor','text',true],['total','Valor total','number',true],['paid','Valor pago','number',true],['due','Vencimento','date',true]]],
  'add-guest': ['Adicionar convidado','guest',[['name','Nome','text',true],['group','Grupo','text',true],['rsvp','Resposta','select:confirmado|pendente|recusado',true],['people','Número de pessoas','number',true],['meal','Refeição / necessidade','text',false]]],
  'add-supplier': ['Adicionar fornecedor','supplier',[['service','Serviço','text',true],['name','Empresa ou profissional','text',true],['status','Estado','select:pendente|avaliacao|contratado',true],['contact','Contacto','text',false]]],
  'add-table': ['Adicionar mesa','table',[['name','Nome da mesa','text',true],['capacity','Capacidade','number',true]]],
  'add-timeline': ['Adicionar momento','timeline',[['time','Hora','time',true],['title','Momento','text',true],['location','Local','text',false]]],
};
function openModal(action) {
  const [title,entity,fields]=schemas[action];
  $('#modal-title').textContent=title; $('#modal-form').dataset.entity=entity;
  $('#modal-fields').innerHTML=fields.map(([name,label,type,required])=>fieldMarkup(name,label,type,required)).join('');
  modal.showModal();
}
function fieldMarkup(name,label,type,required){
  const req=required?'required':'';
  if(type.startsWith('select:')) return `<div class="field"><label for="${name}">${label}</label><select class="select" id="${name}" name="${name}" ${req}>${type.split(':')[1].split('|').map(v=>`<option value="${v}">${statusLabel(v)}</option>`).join('')}</select></div>`;
  return `<div class="field ${name==='title'||name==='name'||name==='category'||name==='service'?'field-full':''}"><label for="${name}">${label}</label><input class="input" id="${name}" name="${name}" type="${type}" ${req}></div>`;
}
function saveModal(form) {
  const data=Object.fromEntries(new FormData(form).entries()); const entity=form.dataset.entity;
  if(entity==='task') state.tasks.push({id:nextId(state.tasks),title:data.title,due:data.due,status:'pendente'});
  if(entity==='expense') state.expenses.push({id:nextId(state.expenses),category:data.category,supplier:data.supplier,total:Number(data.total),paid:Number(data.paid),due:data.due});
  if(entity==='guest') state.guests.push({id:nextId(state.guests),name:data.name,group:data.group,rsvp:data.rsvp,people:Number(data.people),meal:data.meal||'Normal',tableId:null});
  if(entity==='supplier') state.suppliers.push({id:nextId(state.suppliers),service:data.service,name:data.name,status:data.status,contact:data.contact});
  if(entity==='table') state.tables.push({id:nextId(state.tables),name:data.name,capacity:Number(data.capacity)});
  if(entity==='timeline') state.timeline.push({id:nextId(state.timeline),time:data.time,title:data.title,location:data.location});
  modal.close(); form.reset(); saveState('Guardado com sucesso.');
}

function deleteItem(type,id) {
  const map={task:'tasks',expense:'expenses',guest:'guests',supplier:'suppliers',table:'tables',timeline:'timeline'};
  const key=map[type]; if(!key) return;
  if(type==='table') state.guests.forEach(g=>{if(g.tableId===id)g.tableId=null});
  state[key]=state[key].filter(x=>x.id!==id); saveState('Registo eliminado.');
}
function exportData(){
  const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a');
  a.href=url;a.download='agenda-da-noiva-dados.json';a.click();URL.revokeObjectURL(url);toast('Cópia de segurança exportada.');
}
function importData(file){
  if(file.size>2_000_000) return toast('O ficheiro excede o limite de 2 MB.');
  const reader=new FileReader();reader.onload=()=>{try{state=normaliseState(JSON.parse(reader.result));saveState('Dados importados.');}catch{toast('O ficheiro não é válido.')}};reader.readAsText(file);
}
function toast(message){const t=$('#toast');t.textContent=message;t.classList.add('show');clearTimeout(t._timer);t._timer=setTimeout(()=>t.classList.remove('show'),2600)}

function bindViewEvents(){
  $$('[data-nav]').forEach(el=>el.addEventListener('click',()=>navigate(el.dataset.nav)));
  $$('[data-nav][tabindex]').forEach(el=>el.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();navigate(el.dataset.nav)}}));
  $$('[data-action]').forEach(el=>el.addEventListener('click',()=>handleAction(el.dataset.action,el)));
  $$('[data-task-toggle]').forEach(el=>el.addEventListener('change',()=>{const t=state.tasks.find(x=>x.id===Number(el.dataset.taskToggle));t.status=el.checked?'concluida':'pendente';saveState();}));
  $$('[data-delete]').forEach(el=>el.addEventListener('click',()=>{const [type,id]=el.dataset.delete.split(':');deleteItem(type,Number(id));}));
  $$('[data-guest-filter]').forEach(el=>el.addEventListener('click',()=>{guestFilter=el.dataset.guestFilter;render();}));
  $$('[data-module-check]').forEach(el=>el.addEventListener('change',()=>{
    const number=el.dataset.moduleCheck; const completed=state.moduleWork[number].completed;
    state.moduleWork[number].completed=el.checked?[...new Set([...completed,el.value])]:completed.filter(item=>item!==el.value);
    saveState(el.checked?'Passo concluído.':'Passo reaberto.');
  }));
  $$('[data-guest-table-select]').forEach(el=>el.addEventListener('change',()=>{
    const guest=state.guests.find(item=>item.id===Number(el.dataset.guestTableSelect));
    if(guest){guest.tableId=el.value?Number(el.value):null;saveState('Mesa atualizada.');}
  }));
  $('#guest-search')?.addEventListener('input',e=>{guestSearch=e.target.value;render();setTimeout(()=>{$('#guest-search')?.focus();$('#guest-search')?.setSelectionRange(guestSearch.length,guestSearch.length)},0)});
  $$('.guest-chip').forEach(el=>el.addEventListener('dragstart',e=>e.dataTransfer.setData('text/plain',el.dataset.guestId)));
  $$('[data-drop-table]').forEach(zone=>{zone.addEventListener('dragover',e=>{e.preventDefault();zone.classList.add('drag-over')});zone.addEventListener('dragleave',()=>zone.classList.remove('drag-over'));zone.addEventListener('drop',e=>{e.preventDefault();const g=state.guests.find(x=>x.id===Number(e.dataTransfer.getData('text/plain')));const tableId=zone.dataset.dropTable==='none'?null:Number(zone.dataset.dropTable);if(g){g.tableId=tableId;saveState('Mesa atualizada.')}})});
}
function handleAction(action,source){
  if(schemas[action]) return openModal(action);
  if(action==='set-plan-comercial'||action==='set-plan-premium'){
    state.plan=action.endsWith('premium')?'premium':'comercial';
    return saveState(`Edição ${state.plan==='premium'?'Premium':'Comercial'} ativa para teste.`);
  }
  if(action==='export-data') return exportData();
  if(action==='import-data') return $('#import-file').click();
  if(action==='account') return window.AgendaPlatform?.openAccount?.();
  if(action==='privacy') return window.AgendaPlatform?.openPrivacy?.();
  if(action==='print-dossier') return window.print();
  if(action==='save-memory'){state.memory=$('#memory-text').value;return saveState('Memória guardada.');}
  if(action==='save-module-notes'){
    const number=source?.dataset.moduleNumber; if(!number) return;
    state.moduleWork[number].notes=$(`[data-module-notes="${number}"]`).value;
    return saveState('Notas guardadas.');
  }
  if(action==='reset-data'){if(confirm('Repor todos os dados de demonstração?')){state=structuredClone(DEFAULT_STATE);localStorage.removeItem('agenda-noiva-state');saveState('Demonstração reposta.')}}
}

$('#modal-form').addEventListener('submit',e=>{e.preventDefault();saveModal(e.currentTarget)});
$('#modal-close').innerHTML=icon('close');
$('#global-search').innerHTML=icon('search');
$('.notification-button').insertAdjacentHTML('afterbegin',icon('bell'));
$('#mobile-menu').innerHTML=icon('menu');
$('#mobile-menu').addEventListener('click',()=>$('.sidebar').classList.toggle('open'));
document.addEventListener('click',e=>{if(e.target.closest('[data-nav]')) $('.sidebar').classList.remove('open')});
$('#import-file').addEventListener('change',e=>{if(e.target.files[0])importData(e.target.files[0]);e.target.value=''});
$('#global-search').addEventListener('click',()=>{
  const query=prompt('O que procuras?');
  if(!query?.trim()) return;
  const term=query.trim().toLowerCase();
  const destinations=[
    ['planeamento',state.tasks.some(x=>x.title.toLowerCase().includes(term))],
    ['convidados',state.guests.some(x=>x.name.toLowerCase().includes(term))],
    ['fornecedores',state.suppliers.some(x=>`${x.name} ${x.service}`.toLowerCase().includes(term))]
  ];
  const match=destinations.find(([,found])=>found);
  if(match){navigate(match[0]);toast('Resultado encontrado.');}else toast('Não encontrámos resultados.');
});
$('.notification-button').addEventListener('click',()=>toast('Não tens notificações novas.'));
window.addEventListener('hashchange',render);
render();

window.AgendaApp = {
  getState: () => structuredClone(state),
  applyRemoteState(data) {
    state = normaliseState(data);
    localStorage.setItem('agenda-noiva-state', JSON.stringify(state));
    render();
  },
  updateCouple(couple) {
    state.couple = { ...state.couple, ...couple, budget: Number(couple.budget || state.couple.budget) };
    saveState('Dados do casamento atualizados.');
  },
  exportData,
  clearLocalData() {
    localStorage.removeItem('agenda-noiva-state');
    state = normaliseState();
    render();
  },
  toast,
  render
};
document.dispatchEvent(new CustomEvent('agenda:app-ready'));
