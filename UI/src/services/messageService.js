const listeners = new Set();

const subscribe = (listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notify = (text, type = 'info', duration = 3000) => {
  const id = Date.now() + Math.random().toString(36).substring(2, 9);
  listeners.forEach((listener) => listener({ id, text, type, duration }));
};

const message = {
  success: (text, duration) => notify(text, 'success', duration),
  error: (text, duration) => notify(text, 'error', duration),
  info: (text, duration) => notify(text, 'info', duration),
  warning: (text, duration) => notify(text, 'warning', duration),
  subscribe,
};

export default message;
