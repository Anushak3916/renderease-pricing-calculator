export function setUserAvatarInitial(targetSelector, nameOrEmail) {
  const el = document.querySelector(targetSelector);
  if (!el) return;
  const initial = (nameOrEmail || '?').trim().charAt(0).toUpperCase();
  el.textContent = initial || 'R';
}

export function downloadCanvas(canvas, filename = 'renderease-virtual.jpg') {
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/jpeg', 0.9);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

