/**
 * Fast, robust CommonMark + GFM Markdown parser matching marked 18.1.3 default behavior.
 * Dependency-free ES module.
 */

const ENTITIES = {
  quot: '"', amp: '&', lt: '<', gt: '>', apos: "'", nbsp: '\u00A0',
  iexcl: '¡', cent: '¢', pound: '£', curren: '¤', yen: '¥', brvbar: '¦',
  sect: '§', uml: '¨', copy: '©', ordf: 'ª', laquo: '«', not: '¬',
  shy: '\u00AD', reg: '®', macr: '¯', deg: '°', plusmn: '±', sup2: '²',
  sup3: '³', acute: '´', micro: 'µ', para: '¶', middot: '·', cedil: '¸',
  sup1: '¹', ordm: 'º', raquo: '»', frac14: '¼', frac12: '½', frac34: '¾',
  iquest: '¿', Agrave: 'À', Aacute: 'Á', Acirc: 'Â', Atilde: 'Ã', Auml: 'Ä',
  Aring: 'Å', AElig: 'Æ', Ccedil: 'Ç', Egrave: 'È', Eacute: 'É', Ecirc: 'Ê',
  Euml: 'Ë', Igrave: 'Ì', Iacute: 'Í', Icirc: 'Î', Iuml: 'Ï', ETH: 'Ð',
  Ntilde: 'Ñ', Ograve: 'Ò', Oacute: 'Ó', Ocirc: 'Ô', Otilde: 'Õ', Ouml: 'Ö',
  times: '×', Oslash: 'Ø', Ugrave: 'Ù', Uacute: 'Ú', Ucirc: 'Û', Uuml: 'Ü',
  Yacute: 'Ý', THORN: 'Þ', szlig: 'ß', agrave: 'à', aacute: 'á', acirc: 'â',
  atilde: 'ã', auml: 'ä', aring: 'å', aelig: 'æ', ccedil: 'ç', egrave: 'è',
  eacute: 'é', ecirc: 'ê', euml: 'ë', igrave: 'ì', iacute: 'í', icirc: 'î',
  iuml: 'ï', eth: 'ð', ntilde: 'ñ', ograve: 'ò', oacute: 'ó', ocirc: 'ô',
  otilde: 'õ', ouml: 'ö', divide: '÷', oslash: 'ø', ugrave: 'ù', uacute: 'ú',
  ucirc: 'û', uuml: 'ü', yacute: 'ý', thorn: 'þ', yuml: 'ÿ', OElig: 'Œ',
  oelig: 'œ', Scaron: 'Š', scaron: 'š', Yuml: 'Ÿ', fnof: 'ƒ', circ: 'ˆ',
  tilde: '˜', Alpha: 'Α', Beta: 'Β', Gamma: 'Γ', Delta: 'Δ', Epsilon: 'Ε',
  Zeta: 'Ζ', Eta: 'Η', Theta: 'Θ', Iota: 'Ι', Kappa: 'Κ', Lambda: 'Λ',
  Mu: 'Μ', Nu: 'Ν', Xi: 'Ξ', Omicron: 'Ο', Pi: 'Π', Rho: 'Ρ',
  Sigma: 'Σ', Tau: 'Τ', Upsilon: 'Υ', Phi: 'Φ', Chi: 'Χ', Psi: 'Ψ',
  Omega: 'Ω', alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε',
  zeta: 'ζ', eta: 'η', theta: 'θ', iota: 'ι', kappa: 'κ', lambda: 'λ',
  mu: 'μ', nu: 'ν', xi: 'ξ', omicron: 'ο', pi: 'π', rho: 'ρ',
  sigmaf: 'ς', sigma: 'σ', tau: 'τ', upsilon: 'υ', phi: 'φ', chi: 'χ',
  psi: 'ψ', omega: 'ω', thetasym: 'ϑ', upsih: 'ϒ', piv: 'ϖ', ensp: '\u2002',
  emsp: '\u2003', thinsp: '\u2009', zwnj: '\u200C', zwj: '\u200D', lrm: '\u200E',
  rlm: '\u200F', ndash: '–', mdash: '—', lsquo: '‘', rsquo: '’', sbquo: '‚',
  ldquo: '“', rdquo: '”', bdquo: '„', dagger: '†', Dagger: '‡', bull: '•',
  hellip: '…', permil: '‰', prime: '′', Prime: '″', lsaquo: '‹', rsaquo: '›',
  oline: '‾', frasl: '⁄', euro: '€', image: 'ℑ', weierp: '℘', real: 'ℜ',
  trade: '™', alefsym: 'ℵ', larr: '←', uarr: '↑', rarr: '→', darr: '↓',
  harr: '↔', crarr: '↵', lArr: '⇐', uArr: '⇑', rArr: '⇒', dArr: '⇓',
  hArr: '⇔', forall: '∀', part: '∂', exist: '∃', empty: '∅', nabla: '∇',
  isin: '∈', notin: '∉', ni: '∋', prod: '∏', sum: '∑', minus: '−',
  lowast: '∗', radic: '√', prop: '∝', infin: '∞', ang: '∠', and: '∧',
  or: '∨', cap: '∩', cup: '∪', int: '∫', there4: '∴', sim: '∼',
  cong: '≅', asymp: '≈', ne: '≠', equiv: '≡', le: '≤', ge: '≥',
  sub: '⊂', sup: '⊃', nsub: '⊄', sube: '⊆', supe: '⊇', oplus: '⊕',
  otimes: '⊗', perp: '⊥', sdot: '⋅', lceil: '⌈', rceil: '⌉', lfloor: '⌊',
  rfloor: '⌋', lang: '⟨', rang: '⟩', loz: '◊', spades: '♠', clubs: '♣',
  hearts: '♥', diams: '♦'
};

const WIN1252 = {
  0x80: 0x20AC, 0x82: 0x201A, 0x83: 0x0192, 0x84: 0x201E, 0x85: 0x2026,
  0x86: 0x2020, 0x87: 0x2021, 0x88: 0x02C6, 0x89: 0x2030, 0x8A: 0x0160,
  0x8B: 0x2039, 0x8C: 0x0152, 0x8E: 0x017D, 0x91: 0x2018, 0x92: 0x2019,
  0x93: 0x201C, 0x94: 0x201D, 0x95: 0x2022, 0x96: 0x2013, 0x97: 0x2014,
  0x98: 0x02DC, 0x99: 0x2122, 0x9A: 0x0161, 0x9B: 0x203A, 0x9C: 0x0153,
  0x9E: 0x017E, 0x9F: 0x0178
};

function decodeEntity(entityStr) {
  if (entityStr.startsWith('&#x') || entityStr.startsWith('&#X')) {
    let code = parseInt(entityStr.slice(3, -1), 16);
    if (isNaN(code) || code === 0 || (code >= 0xD800 && code <= 0xDFFF) || code > 0x10FFFF) return '\uFFFD';
    if (WIN1252[code]) code = WIN1252[code];
    try { return String.fromCodePoint(code); } catch { return '\uFFFD'; }
  } else if (entityStr.startsWith('&#')) {
    let code = parseInt(entityStr.slice(2, -1), 10);
    if (isNaN(code) || code === 0 || (code >= 0xD800 && code <= 0xDFFF) || code > 0x10FFFF) return '\uFFFD';
    if (WIN1252[code]) code = WIN1252[code];
    try { return String.fromCodePoint(code); } catch { return '\uFFFD'; }
  } else if (entityStr.startsWith('&') && entityStr.endsWith(';')) {
    const name = entityStr.slice(1, -1);
    if (ENTITIES[name]) return ENTITIES[name];
  }
  return entityStr;
}

function decodeEntitiesInString(str) {
  return str.replace(/&(?:#x[0-9a-fA-F]{1,6}|#[0-9]{1,7}|[a-zA-Z0-9]+);/g, match => decodeEntity(match));
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function expandTabs(line) {
  let res = '';
  let col = 0;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '\t') {
      const num = 4 - (col % 4);
      res += ' '.repeat(num);
      col += num;
    } else {
      res += c;
      col++;
    }
  }
  return res;
}

const FILTERED_TAGS = new Set(['title', 'textarea', 'style', 'xmp', 'iframe', 'noembed', 'noframes', 'script', 'plaintext']);

function applyTagFilter(html) {
  return html.replace(/<(\/?)([a-zA-Z0-9]+)/gi, (m, slash, name) => {
    if (FILTERED_TAGS.has(name.toLowerCase())) {
      return '&lt;' + slash + name;
    }
    return m;
  });
}

// Extract Link Reference Definitions
function extractLRDs(lines, defs) {
  const remaining = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const expanded = expandTabs(line);
    const match = expanded.match(/^( {0,3})\[([^\]]+)\]:\s*(?:<([^>\s]+)>|(\S+))(?:[ \t]+(?:"([^"]*)"|'([^']*)'|\(([^)]*)\)))?\s*$/);
    if (match) {
      const label = match[2].trim().toLowerCase().replace(/\s+/g, ' ');
      const href = match[3] || match[4] || '';
      const title = match[5] ?? match[6] ?? match[7] ?? '';
      if (label && !defs.has(label)) {
        defs.set(label, { href: decodeEntitiesInString(href), title: decodeEntitiesInString(title) });
      }
      i++;
      continue;
    }
    // Check two-line definition (title on next line)
    const match1 = expanded.match(/^( {0,3})\[([^\]]+)\]:\s*(?:<([^>\s]+)>|(\S+))\s*$/);
    if (match1 && i + 1 < lines.length) {
      const nextLine = expandTabs(lines[i + 1]);
      const titleMatch = nextLine.match(/^( {0,3})(?:"([^"]*)"|'([^']*)'|\(([^)]*)\))\s*$/);
      if (titleMatch) {
        const label = match1[2].trim().toLowerCase().replace(/\s+/g, ' ');
        const href = match1[3] || match1[4] || '';
        const title = titleMatch[2] ?? titleMatch[3] ?? titleMatch[4] ?? '';
        if (label && !defs.has(label)) {
          defs.set(label, { href: decodeEntitiesInString(href), title: decodeEntitiesInString(title) });
        }
        i += 2;
        continue;
      }
    }
    remaining.push(line);
    i++;
  }
  return remaining;
}

// Inline Parser
function parseInline(text, defs, allowLinks = true, depth = 0) {
  if (!text || depth > 100) return '';
  try {
    let tokens = [];
    let i = 0;
    const len = text.length;

    while (i < len) {
      // Backslash escapes
      if (text[i] === '\\' && i + 1 < len) {
        const next = text[i + 1];
        if (next === '\n') {
          tokens.push({ type: 'html', content: '<br>\n' });
          i += 2;
          continue;
        }
        if (/[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/.test(next)) {
          tokens.push({ type: 'text', content: next });
          i += 2;
          continue;
        }
      }

      // Hard break (2+ spaces before newline)
      if (text[i] === ' ' && text.substring(i).match(/^ {2,}\n/)) {
        const match = text.substring(i).match(/^ {2,}\n/);
        tokens.push({ type: 'html', content: '<br>\n' });
        i += match[0].length;
        continue;
      }

      // Code Spans
      if (text[i] === '`') {
        let backticks = 0;
        let j = i;
        while (j < len && text[j] === '`') { backticks++; j++; }
        let closed = false;
        let k = j;
        while (k < len) {
          if (text[k] === '`') {
            let closeTicks = 0;
            let m = k;
            while (m < len && text[m] === '`') { closeTicks++; m++; }
            if (closeTicks === backticks) {
              let code = text.substring(j, k).replace(/\n/g, ' ');
              if (code.startsWith(' ') && code.endsWith(' ') && code.trim().length > 0) {
                code = code.slice(1, -1);
              }
              const htmlCode = `<code>${escapeHtml(code)}</code>`;
              tokens.push({ type: 'html', content: htmlCode });
              i = m;
              closed = true;
              break;
            } else {
              k = m;
            }
          } else {
            k++;
          }
        }
        if (closed) continue;
      }

      // Autolinks <scheme:...> or <email@domain>
      if (text[i] === '<') {
        const uriMatch = text.substring(i).match(/^<([a-zA-Z][a-zA-Z0-9+.-]{1,31}:[^\s<>]*)>/);
        if (uriMatch) {
          const url = escapeAttr(uriMatch[1]);
          const display = escapeHtml(uriMatch[1]);
          tokens.push({ type: 'html', content: applyTagFilter(`<a href="${url}">${display}</a>`) });
          i += uriMatch[0].length;
          continue;
        }
        const emailMatch = text.substring(i).match(/^<([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})>/);
        if (emailMatch) {
          const email = escapeAttr(emailMatch[1]);
          const display = escapeHtml(emailMatch[1]);
          tokens.push({ type: 'html', content: applyTagFilter(`<a href="mailto:${email}">${display}</a>`) });
          i += emailMatch[0].length;
          continue;
        }

        // Inline Raw HTML Tag
        const htmlMatch = text.substring(i).match(/^<\/?[a-zA-Z][a-zA-Z0-9-]*\s*[^>]*>|^<!--[\s\S]*?-->|^<\?[\s\S]*?\?>|^<![A-Z][^>]*>|^<!\[CDATA\[[\s\S]*?\]\]>/);
        if (htmlMatch) {
          tokens.push({ type: 'html', content: applyTagFilter(htmlMatch[0]) });
          i += htmlMatch[0].length;
          continue;
        }
      }

      // Images ![alt](url "title") or ![alt][ref]
      if (text.startsWith('![', i)) {
        const linkRes = parseLinkOrImage(text, i, defs, true, depth);
        if (linkRes) {
          tokens.push({ type: 'html', content: linkRes.html });
          i = linkRes.nextIndex;
          continue;
        }
      }

      // Links [text](url "title") or [text][ref]
      if (allowLinks && text[i] === '[') {
        const linkRes = parseLinkOrImage(text, i, defs, false, depth);
        if (linkRes) {
          tokens.push({ type: 'html', content: linkRes.html });
          i = linkRes.nextIndex;
          continue;
        }
      }

      // Delimiters (*, _, ~~)
      if (text[i] === '*' || text[i] === '_' || text.startsWith('~~', i)) {
        const isStrikethrough = text.startsWith('~~', i);
        const char = isStrikethrough ? '~~' : text[i];
        const runLen = isStrikethrough ? 2 : countRun(text, i, char);

        const prevChar = i > 0 ? text[i - 1] : ' ';
        const nextChar = i + runLen < len ? text[i + runLen] : ' ';

        const isLeft = isLeftFlanking(prevChar, nextChar);
        const isRight = isRightFlanking(prevChar, nextChar);

        let canOpen = isLeft;
        let canClose = isRight;

        if (char === '_') {
          canOpen = isLeft && (!isRight || isPunctuation(prevChar));
          canClose = isRight && (!isLeft || isPunctuation(nextChar));
        }

        tokens.push({
          type: 'delimiter',
          char,
          length: runLen,
          origLength: runLen,
          canOpen,
          canClose,
          active: true
        });
        i += runLen;
        continue;
      }

      // GFM Extended Autolinks in Plain Text
      if (text.startsWith('www.', i) || text.startsWith('http://', i) || text.startsWith('https://', i) || text.startsWith('ftp://', i)) {
        const autoMatch = text.substring(i).match(/^(https?:\/\/|ftp:\/\/|www\.)[^\s<]+/);
        if (autoMatch) {
          let rawUrl = autoMatch[0];
          // Strip trailing punctuation
          while (/[?!.,:*_~]$/.test(rawUrl)) {
            rawUrl = rawUrl.slice(0, -1);
          }
          // Balance closing parens
          if (rawUrl.endsWith(')')) {
            const openCount = (rawUrl.match(/\(/g) || []).length;
            const closeCount = (rawUrl.match(/\)/g) || []).length;
            if (closeCount > openCount) {
              rawUrl = rawUrl.slice(0, -1);
            }
          }
          // Strip entity suffix
          rawUrl = rawUrl.replace(/&(?:[a-zA-Z0-9]+|#[0-9]+|#x[0-9a-fA-F]+);?$/, '');

          if (rawUrl.length > 0) {
            const href = rawUrl.startsWith('www.') ? 'http://' + rawUrl : rawUrl;
            tokens.push({
              type: 'html',
              content: applyTagFilter(`<a href="${escapeAttr(href)}">${escapeHtml(rawUrl)}</a>`)
            });
            i += rawUrl.length;
            continue;
          }
        }
      }

      // Regular character
      tokens.push({ type: 'text', content: text[i] });
      i++;
    }

    // Process emphasis stack O(n)
    processEmphasis(tokens);

    // Build final output string
    let out = '';
    for (const tok of tokens) {
      if (tok.type === 'html') {
        out += tok.content;
      } else if (tok.type === 'text') {
        out += escapeHtml(tok.content);
      } else if (tok.type === 'delimiter') {
        out += escapeHtml(tok.char.repeat(tok.length));
      }
    }

    return out;
  } catch {
    return escapeHtml(text);
  }
}

function countRun(text, start, char) {
  let count = 0;
  for (let i = start; i < text.length && text[i] === char; i++) count++;
  return count;
}

function isWhitespace(c) {
  return /\s/.test(c);
}

function isPunctuation(c) {
  return /[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/.test(c);
}

function isLeftFlanking(prev, next) {
  if (isWhitespace(next)) return false;
  if (!isPunctuation(next)) return true;
  return isWhitespace(prev) || isPunctuation(prev);
}

function isRightFlanking(prev, next) {
  if (isWhitespace(prev)) return false;
  if (!isPunctuation(prev)) return true;
  return isWhitespace(next) || isPunctuation(next);
}

function processEmphasis(tokens) {
  let stack = [];
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    if (tok.type !== 'delimiter') continue;

    if (tok.canClose) {
      let j = stack.length - 1;
      while (j >= 0) {
        const opener = stack[j];
        if (opener.char === tok.char && opener.active) {
          // Rule of 3 check for * and _
          if ((opener.canOpen && opener.canClose) || (tok.canOpen && tok.canClose)) {
            if ((opener.origLength + tok.origLength) % 3 === 0 && (opener.origLength % 3 !== 0 || tok.origLength % 3 !== 0)) {
              j--;
              continue;
            }
          }

          const useLen = (opener.char === '~~' || (opener.length >= 2 && tok.length >= 2)) ? 2 : 1;
          const openTag = opener.char === '~~' ? '<del>' : (useLen === 2 ? '<strong>' : '<em>');
          const closeTag = opener.char === '~~' ? '</del>' : (useLen === 2 ? '</strong>' : '</em>');

          opener.length -= useLen;
          tok.length -= useLen;

          tokens.splice(i, 0, { type: 'html', content: closeTag });
          i++;

          const openerTokIdx = tokens.indexOf(opener);
          tokens.splice(openerTokIdx + 1, 0, { type: 'html', content: openTag });
          i++;

          // Invalidate inner delimiters
          for (let k = j + 1; k < stack.length; k++) {
            stack[k].active = false;
          }
          stack = stack.slice(0, j + 1);

          if (opener.length === 0) {
            opener.active = false;
            stack.pop();
          }

          if (tok.length === 0) {
            tok.active = false;
            break;
          }
        }
        j--;
      }
    }

    if (tok.canOpen && tok.length > 0) {
      stack.push(tok);
    }
  }
}

function parseLinkOrImage(text, start, defs, isImage, depth) {
  const prefixLen = isImage ? 2 : 1;
  let bracketDepth = 1;
  let j = start + prefixLen;
  const len = text.length;

  while (j < len) {
    if (text[j] === '\\' && j + 1 < len) { j += 2; continue; }
    if (text[j] === '`') {
      const ticks = countRun(text, j, '`');
      const closeIdx = text.indexOf('`'.repeat(ticks), j + ticks);
      if (closeIdx !== -1) { j = closeIdx + ticks; continue; }
    }
    if (text[j] === '[') bracketDepth++;
    if (text[j] === ']') {
      bracketDepth--;
      if (bracketDepth === 0) break;
    }
    j++;
  }

  if (j >= len || text[j] !== ']') return null;

  const rawLabel = text.substring(start + prefixLen, j);
  let next = j + 1;

  let href = null;
  let title = '';

  // Inline Link (url "title")
  if (next < len && text[next] === '(') {
    let k = next + 1;
    while (k < len && /\s/.test(text[k])) k++;
    let dest = '';
    if (k < len && text[k] === '<') {
      const endAngle = text.indexOf('>', k);
      if (endAngle !== -1) {
        dest = text.substring(k + 1, endAngle);
        k = endAngle + 1;
      }
    } else {
      let parenCount = 0;
      let startDest = k;
      while (k < len) {
        if (text[k] === '\\' && k + 1 < len) { k += 2; continue; }
        if (text[k] === '(') parenCount++;
        if (text[k] === ')') {
          if (parenCount === 0) break;
          parenCount--;
        }
        if (/\s/.test(text[k])) break;
        k++;
      }
      dest = text.substring(startDest, k);
    }

    while (k < len && /\s/.test(text[k])) k++;

    // Optional Title
    if (k < len && (text[k] === '"' || text[k] === "'" || text[k] === '(')) {
      const quoteChar = text[k] === '(' ? ')' : text[k];
      const startTitle = k + 1;
      let endTitle = text.indexOf(quoteChar, startTitle);
      if (endTitle !== -1) {
        title = text.substring(startTitle, endTitle);
        k = endTitle + 1;
      }
    }

    while (k < len && /\s/.test(text[k])) k++;

    if (k < len && text[k] === ')') {
      href = dest;
      next = k + 1;
    }
  }

  // Reference Link [label][ref] or [label][] or shortcut [label]
  if (href === null) {
    let refLabel = rawLabel;
    if (next < len && text[next] === '[') {
      const endRef = text.indexOf(']', next + 1);
      if (endRef !== -1) {
        const explicitRef = text.substring(next + 1, endRef);
        if (explicitRef.trim().length > 0) refLabel = explicitRef;
        next = endRef + 1;
      }
    }

    const normKey = refLabel.trim().toLowerCase().replace(/\s+/g, ' ');
    if (defs.has(normKey)) {
      const def = defs.get(normKey);
      href = def.href;
      title = def.title;
    }
  }

  if (href === null) return null;

  href = decodeEntitiesInString(href);
  title = decodeEntitiesInString(title);

  if (isImage) {
    const altText = extractPlainText(rawLabel);
    let html = `<img src="${escapeAttr(href)}" alt="${escapeAttr(altText)}"`;
    if (title) html += ` title="${escapeAttr(title)}"`;
    html += '>';
    return { html, nextIndex: next };
  } else {
    const innerHtml = parseInline(rawLabel, defs, false, depth + 1);
    let html = `<a href="${escapeAttr(href)}"`;
    if (title) html += ` title="${escapeAttr(title)}"`;
    html += `>${innerHtml}</a>`;
    return { html, nextIndex: next };
  }
}

function extractPlainText(markdown) {
  return markdown
    .replace(/`([^`]+)`/g, '$1')
    .replace(/<\/?[^>]+>/g, '')
    .replace(/\\([!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~])/g, '$1')
    .replace(/&(?:#x[0-9a-fA-F]{1,6}|#[0-9]{1,7}|[a-zA-Z0-9]+);/g, m => decodeEntity(m));
}

// Block Parser & Renderer
export function parse(markdown) {
  if (typeof markdown !== 'string') markdown = String(markdown ?? '');
  markdown = markdown.replace(/\r\n|\r/g, '\n');

  const defs = new Map();
  const rawLines = markdown.split('\n');
  const lines = extractLRDs(rawLines, defs);

  try {
    const blocks = parseBlocks(lines, defs, 0);
    return renderBlocks(blocks, defs);
  } catch {
    return `<p>${escapeHtml(markdown.trim())}</p>\n`;
  }
}

function parseBlocks(lines, defs, depth) {
  if (depth > 500) return [];
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const expanded = expandTabs(line);

    // Blank line
    if (/^\s*$/.test(line)) {
      i++;
      continue;
    }

    // Fenced Code Block
    const fenceMatch = expanded.match(/^( {0,3})(`{3,}|~{3,})(.*)$/);
    if (fenceMatch) {
      const fenceChar = fenceMatch[2][0];
      const fenceLen = fenceMatch[2].length;
      const infoStr = fenceMatch[3].trim();
      const indent = fenceMatch[1].length;

      if (fenceChar !== '`' || !infoStr.includes('`')) {
        let codeLines = [];
        i++;
        let closed = false;
        while (i < lines.length) {
          const cLine = expandTabs(lines[i]);
          const closeMatch = cLine.match(/^( {0,3})(`{3,}|~{3,})\s*$/);
          if (closeMatch && closeMatch[2][0] === fenceChar && closeMatch[2].length >= fenceLen) {
            i++;
            closed = true;
            break;
          }
          // Strip leading spaces up to indent
          let stripped = lines[i];
          let sCount = 0;
          while (sCount < indent && stripped.length > 0 && (stripped[0] === ' ' || stripped[0] === '\t')) {
            if (stripped[0] === '\t') sCount += 4; else sCount++;
            stripped = stripped.slice(1);
          }
          codeLines.push(stripped);
          i++;
        }
        const lang = infoStr.split(/\s+/)[0];
        blocks.push({
          type: 'code',
          text: codeLines.join('\n') + '\n',
          lang: lang ? decodeEntitiesInString(lang) : '',
          isFenced: true
        });
        continue;
      }
    }

    // Indented Code Block
    if (/^( {4}|\t)/.test(line)) {
      let codeLines = [];
      while (i < lines.length) {
        const cLine = lines[i];
        if (/^( {4}|\t)/.test(cLine) || /^\s*$/.test(cLine)) {
          if (/^\s*$/.test(cLine)) {
            codeLines.push('');
          } else {
            codeLines.push(cLine.replace(/^( {4}|\t)/, ''));
          }
          i++;
        } else {
          break;
        }
      }
      // Trim trailing blank lines
      while (codeLines.length > 0 && codeLines[codeLines.length - 1] === '') {
        codeLines.pop();
      }
      blocks.push({
        type: 'code',
        text: codeLines.join('\n') + '\n',
        lang: '',
        isFenced: false
      });
      continue;
    }

    // ATX Heading
    const atxMatch = expanded.match(/^( {0,3})(#{1,6})(?:[ \t]+(.*)|[ \t]*)$/);
    if (atxMatch) {
      const level = atxMatch[2].length;
      let text = (atxMatch[3] || '').trim();
      text = text.replace(/(?:^|[ \t]+)#+[ \t]*$/, '').trim();
      blocks.push({ type: 'heading', level, text });
      i++;
      continue;
    }

    // Thematic Break (HR)
    if (/^( {0,3})([-*_][ \t]*){3,}\s*$/.test(expanded)) {
      const clean = expanded.replace(/\s/g, '');
      if (/^(-{3,}|\*{3,}|_{3,})$/.test(clean)) {
        blocks.push({ type: 'hr' });
        i++;
        continue;
      }
    }

    // HTML Block (Types 1-7)
    if (/^( {0,3})</.test(expanded)) {
      const htmlRes = parseHtmlBlock(lines, i);
      if (htmlRes) {
        blocks.push({ type: 'html', text: htmlRes.text });
        i = htmlRes.nextIndex;
        continue;
      }
    }

    // Block Quote
    if (/^( {0,3})>/.test(expanded)) {
      let quoteLines = [];
      while (i < lines.length) {
        const qLine = expandTabs(lines[i]);
        if (/^( {0,3})>/.test(qLine)) {
          quoteLines.push(qLine.replace(/^( {0,3})>[ \t]?/, ''));
          i++;
        } else if (/^\s*$/.test(lines[i])) {
          break;
        } else {
          // Lazy continuation line
          quoteLines.push(lines[i]);
          i++;
        }
      }
      const childBlocks = parseBlocks(quoteLines, defs, depth + 1);
      blocks.push({ type: 'blockquote', children: childBlocks });
      continue;
    }

    // Table
    if (line.includes('|') && i + 1 < lines.length) {
      const delimLine = expandTabs(lines[i + 1]);
      if (/^( {0,3})\|?\s*:?-+:?\s*(?:\|?\s*:?-+:?\s*)*\|?\s*$/.test(delimLine) && delimLine.includes('-')) {
        const tableRes = parseTableBlock(lines, i);
        if (tableRes) {
          blocks.push(tableRes.node);
          i = tableRes.nextIndex;
          continue;
        }
      }
    }

    // List Block
    const listMatch = expanded.match(/^( {0,3})([-*+]|\d{1,9}[.)])(?:[ \t]+(.*)|$)/);
    if (listMatch) {
      const listRes = parseListBlock(lines, i, defs, depth);
      if (listRes) {
        blocks.push(listRes.node);
        i = listRes.nextIndex;
        continue;
      }
    }

    // Paragraph (with Setext Heading check)
    let paragraphLines = [line];
    i++;
    let setextLevel = 0;

    while (i < lines.length) {
      const nextExpanded = expandTabs(lines[i]);
      if (/^\s*$/.test(lines[i])) break;

      // Setext Heading check
      const setextMatch = nextExpanded.match(/^( {0,3})(=+|-+)\s*$/);
      if (setextMatch && !/^( {0,3})([-*+])[ \t]/.test(lines[i])) {
        setextLevel = setextMatch[2][0] === '=' ? 1 : 2;
        i++;
        break;
      }

      // Interrupting blocks
      if (/^( {0,3})(#{1,6})(?:[ \t]|$)/.test(nextExpanded)) break;
      if (/^( {0,3})(`{3,}|~{3,})/.test(nextExpanded)) break;
      if (/^( {0,3})>/.test(nextExpanded)) break;
      if (/^( {0,3})([-*_][ \t]*){3,}\s*$/.test(nextExpanded)) break;

      paragraphLines.push(lines[i]);
      i++;
    }

    const fullText = paragraphLines.join('\n');
    if (setextLevel > 0) {
      blocks.push({ type: 'heading', level: setextLevel, text: fullText.trim() });
    } else {
      blocks.push({ type: 'paragraph', text: fullText });
    }
  }

  return blocks;
}

function parseHtmlBlock(lines, startIdx) {
  const line0 = expandTabs(lines[startIdx]);
  let type = 0;

  if (/^( {0,3})<(script|pre|style|textarea)([\s>]|$)/i.test(line0)) type = 1;
  else if (/^( {0,3})<!--/.test(line0)) type = 2;
  else if (/^( {0,3})<\?/.test(line0)) type = 3;
  else if (/^( {0,3})<![A-Z]/.test(line0)) type = 4;
  else if (/^( {0,3})<!\[CDATA\[/.test(line0)) type = 5;
  else if (/^( {0,3})<\/?(address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h1|h2|h3|h4|h5|h6|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul)([\s/>]|$)/i.test(line0)) type = 6;
  else if (/^( {0,3})<\/?[a-zA-Z][a-zA-Z0-9-]*\s*[^>]*>\s*$/.test(line0)) type = 7;

  if (type === 0) return null;

  let contentLines = [lines[startIdx]];
  let i = startIdx + 1;

  while (i < lines.length) {
    const cur = lines[i];
    const curExp = expandTabs(cur);

    if (type === 1 && /<\/(script|pre|style|textarea)>/i.test(curExp)) { contentLines.push(cur); i++; break; }
    if (type === 2 && /-->/.test(curExp)) { contentLines.push(cur); i++; break; }
    if (type === 3 && /\?>/.test(curExp)) { contentLines.push(cur); i++; break; }
    if (type === 4 && />/.test(curExp)) { contentLines.push(cur); i++; break; }
    if (type === 5 && /\]\]>/.test(curExp)) { contentLines.push(cur); i++; break; }
    if ((type === 6 || type === 7) && /^\s*$/.test(cur)) { break; }

    contentLines.push(cur);
    i++;
  }

  return { text: contentLines.join('\n') + '\n', nextIndex: i };
}

function parseTableBlock(lines, startIdx) {
  const headerRaw = lines[startIdx];
  const delimRaw = lines[startIdx + 1];

  const delimCells = splitTableCells(delimRaw);
  const align = delimCells.map(cell => {
    const c = cell.trim();
    const left = c.startsWith(':');
    const right = c.endsWith(':');
    if (left && right) return 'center';
    if (left) return 'left';
    if (right) return 'right';
    return null;
  });

  const numCols = align.length;
  const header = splitTableCells(headerRaw).slice(0, numCols);
  while (header.length < numCols) header.push('');

  const rows = [];
  let i = startIdx + 2;

  while (i < lines.length) {
    const rowLine = lines[i];
    if (/^\s*$/.test(rowLine) || !rowLine.includes('|')) break;
    const cells = splitTableCells(rowLine).slice(0, numCols);
    while (cells.length < numCols) cells.push('');
    rows.push(cells);
    i++;
  }

  return {
    node: { type: 'table', header, align, rows },
    nextIndex: i
  };
}

function splitTableCells(line) {
  let trimmed = line.trim();
  if (trimmed.startsWith('|')) trimmed = trimmed.slice(1);
  if (trimmed.endsWith('|') && !trimmed.endsWith('\\|')) trimmed = trimmed.slice(0, -1);

  const cells = [];
  let cur = '';
  for (let i = 0; i < trimmed.length; i++) {
    if (trimmed[i] === '\\' && i + 1 < trimmed.length && trimmed[i + 1] === '|') {
      cur += '|';
      i++;
    } else if (trimmed[i] === '|') {
      cells.push(cur.trim());
      cur = '';
    } else {
      cur += trimmed[i];
    }
  }
  cells.push(cur.trim());
  return cells;
}

function parseListBlock(lines, startIdx, defs, depth) {
  const line0 = expandTabs(lines[startIdx]);
  const match0 = line0.match(/^( {0,3})([-*+]|\d{1,9}[.)])(?:[ \t]+(.*)|$)/);
  if (!match0) return null;

  const marker = match0[2];
  const isOrdered = /^\d/.test(marker);
  const startNum = isOrdered ? parseInt(marker, 10) : 1;
  const delimChar = marker[marker.length - 1];

  const items = [];
  let i = startIdx;
  let hasBlankBetweenItems = false;

  while (i < lines.length) {
    const expLine = expandTabs(lines[i]);
    const itemMatch = expLine.match(/^( {0,3})([-*+]|\d{1,9}[.)])(?:[ \t]+(.*)|$)/);

    if (!itemMatch) break;
    const curMarker = itemMatch[2];
    const curOrdered = /^\d/.test(curMarker);
    const curDelim = curMarker[curMarker.length - 1];

    if (curOrdered !== isOrdered || curDelim !== delimChar) break;

    const leadingSpaces = itemMatch[1].length;
    const markerLen = curMarker.length;
    const rest = itemMatch[3] ?? '';

    let spacesAfter = 1;
    if (rest.length > 0) {
      const matchSpace = rest.match(/^[ \t]+/);
      if (matchSpace) {
        spacesAfter = Math.min(matchSpace[0].length, 4);
      }
    }
    const contentIndent = leadingSpaces + markerLen + spacesAfter;

    let itemLines = [rest];
    i++;
    let hasInternalBlank = false;

    while (i < lines.length) {
      const cur = lines[i];
      const curExp = expandTabs(cur);

      if (/^\s*$/.test(cur)) {
        if (i + 1 < lines.length && expandTabs(lines[i + 1]).match(/^( {0,3})([-*+]|\d{1,9}[.)])/)) {
          hasBlankBetweenItems = true;
          i++;
          break;
        }
        itemLines.push('');
        hasInternalBlank = true;
        i++;
        continue;
      }

      // Check if next item starts
      const nextItemMatch = curExp.match(/^( {0,3})([-*+]|\d{1,9}[.)])(?:[ \t]+(.*)|$)/);
      if (nextItemMatch) {
        const nOrd = /^\d/.test(nextItemMatch[2]);
        const nDelim = nextItemMatch[2][nextItemMatch[2].length - 1];
        if (nOrd === isOrdered && nDelim === delimChar) break;
      }

      // Indented line belonging to item
      if (curExp.length >= contentIndent || curExp.startsWith(' '.repeat(contentIndent))) {
        itemLines.push(curExp.slice(contentIndent));
        i++;
      } else {
        // Lazy continuation
        itemLines.push(cur);
        i++;
      }
    }

    // Task list check
    let checked = null;
    if (itemLines.length > 0) {
      const taskMatch = itemLines[0].match(/^\[([ xX])\][ \t]+(.*)$/);
      if (taskMatch) {
        checked = taskMatch[1].toLowerCase() === 'x';
        itemLines[0] = taskMatch[2];
      }
    }

    const itemBlocks = parseBlocks(itemLines, defs, depth + 1);
    items.push({
      type: 'list_item',
      children: itemBlocks,
      checked,
      hasInternalBlank
    });
  }

  const isLoose = hasBlankBetweenItems || items.some(it => it.hasInternalBlank);

  return {
    node: {
      type: 'list',
      ordered: isOrdered,
      start: startNum,
      items,
      loose: isLoose
    },
    nextIndex: i
  };
}

function renderBlocks(blocks, defs) {
  let html = '';
  for (const block of blocks) {
    html += renderBlock(block, defs);
  }
  return html;
}

function renderBlock(block, defs) {
  switch (block.type) {
    case 'paragraph': {
      return `<p>${parseInline(block.text, defs)}</p>\n`;
    }
    case 'heading': {
      return `<h${block.level}>${parseInline(block.text, defs)}</h${block.level}>\n`;
    }
    case 'code': {
      const escCode = escapeHtml(block.text);
      if (block.lang) {
        const escLang = escapeAttr(block.lang);
        return `<pre><code class="language-${escLang}">${escCode}</code></pre>\n`;
      }
      return `<pre><code>${escCode}</code></pre>\n`;
    }
    case 'blockquote': {
      return `<blockquote>\n${renderBlocks(block.children, defs)}</blockquote>\n`;
    }
    case 'hr': {
      return `<hr>\n`;
    }
    case 'html': {
      return block.text;
    }
    case 'table': {
      let out = '<table>\n<thead>\n<tr>\n';
      for (let c = 0; c < block.header.length; c++) {
        const align = block.align[c];
        const attr = align ? ` align="${align}"` : '';
        out += `<th${attr}>${parseInline(block.header[c], defs)}</th>\n`;
      }
      out += '</tr>\n</thead>\n';

      if (block.rows.length > 0) {
        out += '<tbody>\n';
        for (const row of block.rows) {
          out += '<tr>\n';
          for (let c = 0; c < block.header.length; c++) {
            const align = block.align[c];
            const attr = align ? ` align="${align}"` : '';
            const cellVal = row[c] ?? '';
            out += `<td${attr}>${parseInline(cellVal, defs)}</td>\n`;
          }
          out += '</tr>\n';
        }
        out += 'tbody>\n'.replace(/^/, '<');
      }
      out += '</table>\n';
      return out;
    }
    case 'list': {
      const tag = block.ordered ? 'ol' : 'ul';
      const startAttr = (block.ordered && block.start !== 1) ? ` start="${block.start}"` : '';
      let out = `<${tag}${startAttr}>\n`;

      for (const item of block.items) {
        out += '<li>';
        let itemHtml = '';

        if (item.checked !== null) {
          const chkAttr = item.checked ? 'checked="" ' : '';
          itemHtml += `<input ${chkAttr}disabled="" type="checkbox"> `;
        }

        if (!block.loose && item.children.length === 1 && item.children[0].type === 'paragraph') {
          itemHtml += parseInline(item.children[0].text, defs);
        } else {
          for (const child of item.children) {
            if (!block.loose && child.type === 'paragraph') {
              itemHtml += parseInline(child.text, defs) + '\n';
            } else {
              itemHtml += renderBlock(child, defs);
            }
          }
        }

        out += itemHtml + '</li>\n';
      }

      out += `</${tag}>\n`;
      return out;
    }
    default:
      return '';
  }
}
