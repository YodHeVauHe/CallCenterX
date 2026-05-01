// Must run before any other module is loaded.
// Suppresses DEP0040 (punycode) triggered by socket.io → whatwg-url → tr46 on Node 18+.
const _emitWarning = process.emitWarning.bind(process);
process.emitWarning = function (warning, ...args) {
  const msg = typeof warning === 'string' ? warning : (warning && warning.message) || '';
  if (msg.includes('punycode')) return;
  return _emitWarning(warning, ...args);
};
