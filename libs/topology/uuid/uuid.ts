export function s4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

export function s8() {
  return s4() + s4();
}

export function s12() {
  return s4() + s4() + s4();
}

export function s16() {
  return s4() + s4() + s4() + s4();
}
