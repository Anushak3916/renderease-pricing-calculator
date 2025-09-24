export function requireSession() {
  const raw = localStorage.getItem('renderease_trial_session');
  if (!raw) {
    window.location.replace('./index.html');
    return null;
  }
  try {
    const session = JSON.parse(raw);
    return session;
  } catch {
    window.location.replace('./index.html');
    return null;
  }
}

export function attachSignOut(buttonSelector = '#signout') {
  const btn = document.querySelector(buttonSelector);
  if (!btn) return;
  btn.addEventListener('click', () => {
    localStorage.removeItem('renderease_trial_session');
    window.location.href = './index.html';
  });
}

