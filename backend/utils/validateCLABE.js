/**
 * Validates a Mexican CLABE (Clave Bancaria Estandarizada)
 * Uses the official Banco de Mexico checksum algorithm.
 * @param {string} clabe - 18-digit CLABE string
 * @returns {boolean}
 */
function validateCLABE(clabe) {
  if (!/^\d{18}$/.test(clabe)) return false;

  const weights = [3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7];
  const digits = clabe.split('').map(Number);
  const sum = weights.reduce((acc, w, i) => acc + ((w * digits[i]) % 10), 0);
  const checkDigit = (10 - (sum % 10)) % 10;

  return checkDigit === digits[17];
}

module.exports = { validateCLABE };
