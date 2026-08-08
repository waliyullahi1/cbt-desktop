// Mirrors format_html.py — used when a question is added or edited from
// inside the app, so it gets the same v-html-ready formatting as the
// bulk-imported question bank.
//
// Heuristic, not a full parser: tuned to the patterns that actually show
// up in this question bank (chemical formulas, cm3/dm3-style units,
// ^-exponents). Already-garbled input will format literally.

const UNIT_EXPONENT = /(cm|dm|mm|km|m)([23])(?![0-9A-Za-z])/g
const FORMULA_TOKEN = /\b[A-Za-z][A-Za-z0-9()]*\d[A-Za-z0-9()]*\b/g
const TRAILING_DIGITS_AFTER_LETTER = /(?<=[A-Za-z)])(\d+)/g
const CARET_EXPONENT = /\^(\w+)/g

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function subscriptFormulaToken(token) {
  return token.replace(TRAILING_DIGITS_AFTER_LETTER, '<sub>$1</sub>')
}

export function toHtml(text) {
  if (text === null || text === undefined) return null

  let s = escapeHtml(String(text))
  s = s.replace(UNIT_EXPONENT, '$1<sup>$2</sup>')     // cm3 -> cm<sup>3</sup>
  s = s.replace(FORMULA_TOKEN, subscriptFormulaToken)  // H2SO4 -> H<sub>2</sub>SO<sub>4</sub>
  s = s.replace(CARET_EXPONENT, '<sup>$1</sup>')        // (1.05)^2 -> (1.05)<sup>2</sup>
  s = s.replace(/\n/g, '<br>')                            // preserve line breaks

  return s
}

export function optionsToHtml(options) {
  if (!options) return {}
  const out = {}
  for (const [letter, text] of Object.entries(options)) {
    out[letter] = toHtml(text)
  }
  return out
}
