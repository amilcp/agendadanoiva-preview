(() => {
  'use strict';

  const config = window.AGENDA_CONFIG || {};
  const configured = Boolean(config.SUPABASE_URL && config.SUPABASE_ANON_KEY);
  const accountModal = document.querySelector('#account-modal');
  const privacyModal = document.querySelector('#privacy-modal');
  const accountContent = document.querySelector('#account-content');
  const accountTitle = document.querySelector('#account-title');
  const syncChip = document.querySelector('#sync-chip');
  let client = null;
  let currentUser = null;
  let syncTimer = null;
  let syncing = false;
  let authMode = 'login';
  let recoveryMode = false;

  const app = () => window.AgendaApp;
  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const errorMessage = error => {
    const message = String(error?.message || error || 'Ocorreu um erro.');
    if (/invalid login credentials/i.test(message)) return 'E-mail ou palavra-passe incorretos.';
    if (/email not confirmed/i.test(message)) return 'Confirma primeiro o e-mail recebido.';
    if (/user already registered/i.test(message)) return 'Já existe uma conta com este e-mail.';
    if (/password/i.test(message) && /characters/i.test(message)) return 'A palavra-passe deve ter pelo menos 8 caracteres.';
    return message;
  };

  function loadSupabaseClient() {
    if (window.supabase?.createClient) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.116.0/dist/umd/supabase.min.js';
      script.defer = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error('Não foi possível carregar a ligação segura.'));
      document.head.appendChild(script);
    });
  }

  function setSyncStatus(status, label) {
    if (!syncChip) return;
    syncChip.dataset.status = status;
    syncChip.querySelector('span').textContent = label;
    const sideLabel = document.querySelector('[data-sync-label]');
    if (sideLabel) sideLabel.textContent = label;
  }

  function updateIdentity() {
    const localNames = app()?.getState()?.couple?.names || 'Agenda da Noiva';
    const displayName = currentUser?.user_metadata?.full_name || localNames.split('&')[0].trim() || 'Noiva';
    const initial = displayName.charAt(0).toUpperCase();
    document.querySelectorAll('[data-user-initial]').forEach(node => node.textContent = initial);
    const greeting = document.querySelector('[data-user-greeting]');
    if (greeting) greeting.textContent = currentUser ? `Olá, ${displayName.split(' ')[0]}!` : 'Modo de teste';
  }

  function authForm(mode) {
    const register = mode === 'register';
    const recover = mode === 'recover';
    const update = mode === 'update-password';
    accountTitle.textContent = register ? 'Criar conta' : recover ? 'Recuperar acesso' : update ? 'Definir nova palavra-passe' : 'Entrar na Agenda';
    return `<form class="auth-form" id="auth-form" data-mode="${mode}">
      ${register ? '<div class="field field-full"><label for="auth-name">Nome</label><input class="input" id="auth-name" name="name" autocomplete="name" required></div>' : ''}
      ${update ? '' : '<div class="field field-full"><label for="auth-email">E-mail</label><input class="input" id="auth-email" name="email" type="email" autocomplete="email" required></div>'}
      ${recover ? '' : `<div class="field field-full"><label for="auth-password">${update ? 'Nova palavra-passe' : 'Palavra-passe'}</label><input class="input" id="auth-password" name="password" type="password" minlength="8" autocomplete="${register || update ? 'new-password' : 'current-password'}" required><small>Mínimo de 8 caracteres.</small></div>`}
      ${register ? '<label class="consent-row"><input type="checkbox" name="terms" required><span>Li a informação de privacidade e aceito a utilização dos meus dados para prestar este serviço.</span></label>' : ''}
      <p class="form-message" id="auth-message" role="status"></p>
      <button class="button button-primary button-wide" type="submit">${register ? 'Criar conta' : recover ? 'Enviar ligação de recuperação' : update ? 'Guardar nova palavra-passe' : 'Entrar'}</button>
      ${mode === 'login' ? '<button class="text-action" type="button" data-auth-mode="recover">Esqueci-me da palavra-passe</button><div class="auth-divider"><span>ou</span></div><button class="button button-ghost button-wide" type="button" data-auth-mode="register">Criar uma conta</button>' : ''}
      ${register || recover ? '<button class="text-action" type="button" data-auth-mode="login">Voltar ao início de sessão</button>' : ''}
    </form>`;
  }

  function renderAccount() {
    if (!configured) {
      accountTitle.textContent = 'Modo de demonstração';
      accountContent.innerHTML = `<div class="account-intro"><span class="account-mark">♡</span><h3>Os dados estão neste dispositivo</h3><p>A conta e a sincronização estão preparadas, mas a infraestrutura online ainda não foi ligada. Podes continuar a testar todas as áreas da agenda.</p></div>
        <div class="account-actions"><button class="button button-primary" type="button" data-account-action="export">Descarregar cópia</button><button class="button button-ghost" type="button" data-account-action="privacy">Privacidade e dados</button></div>`;
      return;
    }
    if (!currentUser) {
      accountContent.innerHTML = authForm(recoveryMode ? 'update-password' : authMode);
      return;
    }
    const couple = app().getState().couple;
    accountTitle.textContent = 'A minha conta';
    accountContent.innerHTML = `<section class="account-summary"><span class="avatar account-avatar">${escapeHtml((currentUser.user_metadata?.full_name || currentUser.email)[0].toUpperCase())}</span><div><strong>${escapeHtml(currentUser.user_metadata?.full_name || 'Conta da Agenda')}</strong><span>${escapeHtml(currentUser.email)}</span></div><span class="account-online">Sincronização ativa</span></section>
      <form class="couple-form" id="couple-form">
        <div class="section-heading"><div><p class="eyebrow">O NOSSO CASAMENTO</p><h3>Dados principais</h3></div></div>
        <div class="form-grid"><div class="field field-full"><label for="couple-names">Nomes</label><input class="input" id="couple-names" name="names" value="${escapeHtml(couple.names)}" required></div><div class="field"><label for="couple-date">Data</label><input class="input" id="couple-date" name="date" type="date" value="${escapeHtml(couple.date)}" required></div><div class="field"><label for="couple-budget">Orçamento</label><input class="input" id="couple-budget" name="budget" type="number" min="0" value="${Number(couple.budget)}" required></div><div class="field field-full"><label for="couple-location">Local</label><input class="input" id="couple-location" name="location" value="${escapeHtml(couple.location)}"></div></div>
        <button class="button button-primary" type="submit">Guardar alterações</button>
      </form>
      <div class="account-actions"><button class="button button-ghost" type="button" data-account-action="sync">Sincronizar agora</button><button class="button button-ghost" type="button" data-account-action="backups">Versões de segurança</button><button class="button button-ghost" type="button" data-account-action="export">Descarregar cópia</button><button class="button button-ghost" type="button" data-account-action="privacy">Privacidade e dados</button><button class="text-action danger-text" type="button" data-account-action="logout">Terminar sessão</button></div>`;
  }

  async function handleSession(session, { pull = true } = {}) {
    currentUser = session?.user || null;
    updateIdentity();
    if (!currentUser) {
      setSyncStatus(configured ? 'offline' : 'local', configured ? 'Sem sessão' : 'Dados neste dispositivo');
      renderAccount();
      return;
    }
    setSyncStatus('pending', 'A sincronizar…');
    if (pull) await pullRemoteState();
    renderAccount();
  }

  async function pullRemoteState() {
    if (!client || !currentUser || syncing) return;
    syncing = true;
    try {
      const { data, error } = await client.from('wedding_planners').select('data, updated_at').eq('user_id', currentUser.id).maybeSingle();
      if (error) throw error;
      if (data?.data) {
        app().applyRemoteState(data.data);
      } else {
        await pushRemoteState(app().getState());
      }
      setSyncStatus('online', 'Guardado online');
    } catch (error) {
      setSyncStatus('error', 'Guardado localmente');
      app()?.toast(errorMessage(error));
    } finally {
      syncing = false;
    }
  }

  async function pushRemoteState(nextState) {
    if (!client || !currentUser) return;
    const { error } = await client.from('wedding_planners').upsert({ user_id: currentUser.id, data: nextState, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
    if (error) throw error;
  }

  function scheduleSync(nextState) {
    if (!client || !currentUser) return;
    clearTimeout(syncTimer);
    setSyncStatus('pending', 'Alterações pendentes');
    const snapshot = structuredClone(nextState);
    syncTimer = setTimeout(async () => {
      try {
        await pushRemoteState(snapshot);
        setSyncStatus('online', 'Guardado online');
      } catch (error) {
        setSyncStatus('error', 'Guardado localmente');
        app()?.toast('Sem ligação: os dados continuam seguros neste dispositivo.');
      }
    }, 1000);
  }

  async function submitAuth(form) {
    const data = Object.fromEntries(new FormData(form));
    const mode = form.dataset.mode;
    const message = form.querySelector('#auth-message');
    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    message.textContent = 'A processar…';
    try {
      if (mode === 'login') {
        const { error } = await client.auth.signInWithPassword({ email: data.email, password: data.password });
        if (error) throw error;
      } else if (mode === 'register') {
        const { data: result, error } = await client.auth.signUp({ email: data.email, password: data.password, options: { data: { full_name: data.name }, emailRedirectTo: location.origin + location.pathname } });
        if (error) throw error;
        message.textContent = result.session ? 'Conta criada.' : 'Conta criada. Confirma o e-mail que enviámos.';
        if (!result.session) return;
      } else if (mode === 'recover') {
        const { error } = await client.auth.resetPasswordForEmail(data.email, { redirectTo: location.origin + location.pathname });
        if (error) throw error;
        message.textContent = 'Enviámos uma ligação de recuperação para o teu e-mail.';
        return;
      } else if (mode === 'update-password') {
        const { error } = await client.auth.updateUser({ password: data.password });
        if (error) throw error;
        recoveryMode = false;
        message.textContent = 'Palavra-passe atualizada.';
        setTimeout(renderAccount, 500);
        return;
      }
      accountModal.close();
    } catch (error) {
      message.textContent = errorMessage(error);
    } finally {
      submit.disabled = false;
    }
  }

  async function accountAction(action) {
    if (action === 'export') app().exportData();
    if (action === 'privacy') { accountModal.close(); openPrivacy(); }
    if (action === 'sync') await pullRemoteState();
    if (action === 'backups') await showBackups();
    if (action === 'logout') {
      await client.auth.signOut();
      app().clearLocalData();
      accountModal.close();
      app().toast('Sessão terminada e dados locais removidos deste dispositivo.');
    }
  }

  async function showBackups() {
    if (!client || !currentUser) return;
    accountTitle.textContent = 'Versões de segurança';
    accountContent.innerHTML = '<div class="backup-list"><p class="meta">A carregar versões…</p></div>';
    const { data, error } = await client.from('planner_backups').select('id, created_at, source_updated_at').order('created_at', { ascending: false }).limit(30);
    if (error) {
      accountContent.innerHTML = `<p class="form-message">${escapeHtml(errorMessage(error))}</p><button class="button button-ghost" type="button" data-account-action="account-home">Voltar</button>`;
      return;
    }
    accountContent.innerHTML = `<div class="backup-heading"><p>Escolhe uma versão anterior para recuperar. Antes do restauro será descarregada automaticamente uma cópia do estado atual.</p><button class="button button-ghost" type="button" data-account-action="account-home">Voltar à conta</button></div><div class="backup-list">${data.length ? data.map(item => `<article><div><strong>${new Intl.DateTimeFormat('pt-PT',{dateStyle:'medium',timeStyle:'short'}).format(new Date(item.created_at))}</strong><span>Versão automática</span></div><button class="button button-ghost button-small" type="button" data-backup-id="${item.id}">Recuperar</button></article>`).join('') : '<p class="empty-state">Ainda não existem versões anteriores.</p>'}</div>`;
  }

  async function restoreBackup(id) {
    if (!client || !currentUser || !confirm('Substituir os dados atuais por esta versão?')) return;
    app().exportData();
    const { data, error } = await client.from('planner_backups').select('data').eq('id', id).single();
    if (error) return app().toast(errorMessage(error));
    app().applyRemoteState(data.data);
    try {
      await pushRemoteState(data.data);
      setSyncStatus('online', 'Versão recuperada');
      app().toast('Versão recuperada com sucesso.');
      renderAccount();
    } catch (restoreError) {
      app().toast(errorMessage(restoreError));
    }
  }

  function openAccount() {
    renderAccount();
    accountModal.showModal();
  }

  function openPrivacy() {
    document.querySelector('#delete-data-copy').textContent = currentUser ? 'Elimina definitivamente a conta e os dados online e locais associados.' : 'Remove os dados guardados neste dispositivo.';
    privacyModal.showModal();
  }

  async function deleteData() {
    const online = Boolean(client && currentUser);
    const warning = online ? 'Esta ação elimina definitivamente a conta e todos os dados. Queres continuar?' : 'Eliminar os dados guardados neste dispositivo?';
    if (!confirm(warning)) return;
    if (online) {
      const { error } = await client.rpc('delete_my_account');
      if (error) return app().toast(errorMessage(error));
      await client.auth.signOut({ scope: 'local' });
    }
    currentUser = null;
    app().clearLocalData();
    privacyModal.close();
    setSyncStatus(configured ? 'offline' : 'local', configured ? 'Sem sessão' : 'Dados neste dispositivo');
    updateIdentity();
    app().toast('Os dados foram eliminados.');
  }

  function bindEvents() {
    document.querySelector('#account-trigger')?.addEventListener('click', openAccount);
    document.querySelector('#account-trigger-top')?.addEventListener('click', openAccount);
    document.querySelectorAll('.dialog-close').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
    [accountModal, privacyModal].forEach(dialog => dialog?.addEventListener('click', event => { if (event.target === dialog) dialog.close(); }));
    accountContent?.addEventListener('click', event => {
      const mode = event.target.closest('[data-auth-mode]')?.dataset.authMode;
      if (mode) { authMode = mode; recoveryMode = false; renderAccount(); }
      const action = event.target.closest('[data-account-action]')?.dataset.accountAction;
      if (action === 'account-home') renderAccount();
      else if (action) accountAction(action);
      const backupId = event.target.closest('[data-backup-id]')?.dataset.backupId;
      if (backupId) restoreBackup(Number(backupId));
    });
    accountContent?.addEventListener('submit', event => {
      event.preventDefault();
      if (event.target.id === 'auth-form') submitAuth(event.target);
      if (event.target.id === 'couple-form') {
        const data = Object.fromEntries(new FormData(event.target));
        app().updateCouple(data);
        updateIdentity();
        renderAccount();
      }
    });
    document.querySelector('#delete-data')?.addEventListener('click', deleteData);
    window.addEventListener('online', () => { if (currentUser) pullRemoteState(); });
    window.addEventListener('offline', () => setSyncStatus('error', 'Guardado localmente'));
  }

  async function init() {
    bindEvents();
    updateIdentity();
    if (!configured) {
      setSyncStatus('local', 'Dados neste dispositivo');
      return;
    }
    try {
      await loadSupabaseClient();
    } catch (error) {
      setSyncStatus('error', 'Guardado localmente');
      app()?.toast(errorMessage(error));
      return;
    }
    client = window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    const { data, error } = await client.auth.getSession();
    if (error) app()?.toast(errorMessage(error));
    await handleSession(data?.session);
    client.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') recoveryMode = true;
      setTimeout(() => handleSession(session, { pull: event !== 'TOKEN_REFRESHED' }), 0);
    });
  }

  window.AgendaPlatform = { scheduleSync, openAccount, openPrivacy, syncNow: pullRemoteState, isConfigured: configured };
  init();
})();
