export function initializeAuthForm() {
  const form = document.querySelector('#auth-form');
  const modeSwitch = document.querySelector('#mode-switch');
  const heading = document.querySelector('#auth-heading');
  const nameField = document.querySelector('#field-name');
  const errorEl = document.querySelector('#auth-error');

  let mode = 'login';
  updateMode();

  modeSwitch?.addEventListener('click', (e) => {
    e.preventDefault();
    mode = mode === 'login' ? 'register' : 'login';
    updateMode();
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    errorEl.textContent = '';
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const company = String(data.get('company') || '').trim();
    const password = String(data.get('password') || '').trim();

    if (mode === 'register' && name.length < 2) {
      errorEl.textContent = 'Please enter your full name.';
      return;
    }
    if (!validateEmail(email)) {
      errorEl.textContent = 'Enter a valid email address.';
      return;
    }
    if (password.length < 6) {
      errorEl.textContent = 'Password must be at least 6 characters.';
      return;
    }

    // Mock: Write session to localStorage
    const session = {
      token: cryptoRandomId(),
      email,
      name: mode === 'register' ? name : email.split('@')[0],
      company,
      createdAt: Date.now(),
    };
    localStorage.setItem('renderease_trial_session', JSON.stringify(session));
    window.location.href = './dashboard.html';
  });

  function updateMode() {
    if (!heading) return;
    if (mode === 'login') {
      heading.textContent = 'Welcome back to RenderEase';
      modeSwitch.textContent = 'Need an account? Create one';
      nameField.style.display = 'none';
    } else {
      heading.textContent = 'Create your free trial';
      modeSwitch.textContent = 'Already have an account? Sign in';
      nameField.style.display = 'grid';
    }
  }
}

export function signOut() {
  localStorage.removeItem('renderease_trial_session');
  window.location.href = './index.html';
}

export function getSession() {
  const raw = localStorage.getItem('renderease_trial_session');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function validateEmail(email) {
  return /[^@\s]+@[^@\s]+\.[^@\s]+/.test(email);
}

function cryptoRandomId() {
  const array = new Uint32Array(4);
  crypto.getRandomValues(array);
  return Array.from(array).map(n => n.toString(16)).join('');
}

