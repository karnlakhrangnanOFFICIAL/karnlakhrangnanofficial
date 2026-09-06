function normalizeName(str) {
  if (!str) return '';
  return str.toLowerCase()
    .replace(/-/g, ' ')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/g, '')
    .trim();
}

console.log(normalizeName("João Pedro"));
console.log(normalizeName("Joao Pedro"));
console.log(normalizeName("Estevão Willian"));
console.log(normalizeName("Estevao Willian"));
