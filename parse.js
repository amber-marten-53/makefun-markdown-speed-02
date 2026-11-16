/**
 * parse.js - Fast, CommonMark & GFM compliant Markdown parser matching marked 18.1.3
 */

const ENTITIES = {
  quot: '"', amp: '&', lt: '<', gt: '>', nbsp: '\u00A0', iexcl: '¡', cent: '¢', pound: '£',
  curren: '¤', yen: '¥', brvbar: '¦', sect: '§', uml: '¨', copy: '©', ordf: 'ª', laquo: '«',
  not: '¬', shy: '\u00AD', reg: '®', macr: '¯', deg: '°', plusmn: '±', sup2: '²', sup3: '³',
  acute: '´', micro: 'µ', para: '¶', middot: '·', cedil: '¸', sup1: '¹', ordm: 'º', raquo: '»',
  frac14: '¼', frac12: '½', frac34: '¾', iquest: '¿', Agrave: 'À', Aacute: 'Á', Acirc: 'Â',
  Atilde: 'Ã', Auml: 'Ä', Aring: 'Å', AElig: 'Æ', Ccedil: 'Ç', Egrave: 'È', Eacute: 'É',
  Ecirc: 'Ê', Euml: 'Ë', Igrave: 'Ì', Iacute: 'Í', Icirc: 'Î', Iuml: 'Ï', ETH: 'Ð',
  Ntilde: 'Ñ', Ograve: 'Ò', Oacute: 'Ó', Ocirc: 'Ô', Otilde: 'Õ', Ouml: 'Ö', times: '×',
  Oslash: 'Ø', Ugrave: 'Ù', Uacute: 'Ú', Ucirc: 'Û', Uuml: 'Ü', Yacute: 'Ý', THORN: 'Þ',
  szlig: 'ß', agrave: 'à', aacute: 'á', acirc: 'â', atilde: 'ã', auml: 'ä', aring: 'å',
  aelig: 'æ', ccedil: 'ç', egrave: 'è', eacute: 'é', ecirc: 'ê', euml: 'ë', igrave: 'ì',
  iacute: 'í', icirc: 'î', iuml: 'ï', eth: 'ð', ntilde: 'ñ', ograve: 'ò', oacute: 'ó',
  ocirc: 'ô', otilde: 'õ', ouml: 'ö', divide: '÷', oslash: 'ø', ugrave: 'ù', uacute: 'ú',
  ucirc: 'û', uuml: 'ü', yacute: 'ý', thorn: 'þ', yuml: 'ÿ', OElig: 'Œ', oelig: 'œ',
  Scaron: 'Š', scaron: 'š', Yuml: 'Ÿ', fnof: 'ƒ', circ: 'ˆ', tilde: '˜', Alpha: 'Α',
  Beta: 'Β', Gamma: 'Γ', Delta: 'Δ', Epsilon: 'Ε', Zeta: 'Ζ', Eta: 'Η', Theta: 'Θ',
  Iota: 'Ι', Kappa: 'Κ', Lambda: 'Λ', Mu: 'Μ', Nu: 'Ν', Xi: 'Ξ', Omicron: 'Ο',
  Pi: 'Π', Rho: 'Ρ', Sigma: 'Σ', Tau: 'Τ', Upsilon: 'Υ', Phi: 'Φ', Chi: 'Χ',
  Psi: 'Ψ', Omega: 'Ω', alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε',
  zeta: 'ζ', eta: 'η', theta: 'θ', iota: 'ι', kappa: 'κ', lambda: 'λ', mu: 'μ',
  nu: 'ν', xi: 'ξ', omicron: 'ο', pi: 'π', rho: 'ρ', sigmaf: 'ς', sigma: 'σ',
  tau: 'τ', upsilon: 'υ', phi: 'φ', chi: 'χ', psi: 'ψ', omega: 'ω', thetasym: 'ϑ',
  upsih: 'ϒ', piv: 'ϖ', ensp: '\u2002', emsp: '\u2003', thinsp: '\u2009', zwnj: '\u200C',
  zwj: '\u200D', lrm: '\u200E', rlm: '\u200F', ndash: '–', mdash: '—', lsquo: '‘',
  rsquo: '’', sbquo: '‚', ldquo: '“', rdquo: '”', bdquo: '„', dagger: '†', Dagger: '‡',
  bull: '•', hellip: '…', permil: '‰', prime: '′', Prime: '″', lsaquo: '‹', rsaquo: '›',
  oline: '‾', frasl: '⁄', euro: '€', image: 'ℑ', weierp: '℘', real: 'ℜ', trade: '™',
  alefsym: 'ℵ', larr: '←', uarr: '↑', rarr: '→', darr: '↓', harr: '↔', crarr: '↵',
  lArr: '⇐', uArr: '⇑', rArr: '⇒', dArr: '⇓', hArr: '⇔', forall: '∀', part: '∂',
  exist: '∃', empty: '∅', nabla: '∇', isin: '∈', notin: '∉', ni: '∋', prod: '∏',
  sum: '∑', minus: '−', lowast: '∗', radic: '√', prop: '∝', infin: '∞', ang: '∠',
  and: '∧', or: '∨', cap: '∩', cup: '∪', int: '∫', there4: '∴', sim: '∼',
  cong: '≅', asymp: '≈', ne: '≠', equiv: '≡', le: '≤', ge: '≥', sub: '⊂',
  sup: '⊃', nsub: '⊄', sube: '⊆', supe: '⊇', oplus: '⊕', otimes: '⊗', perp: '⊥',
  sdot: '⋅', lceil: '⌈', rceil: '⌉', lfloor: '⌊', rfloor: '⌋', lang: '⟨', rang: '⟩',
  loz: '◊', spades: '♠', clubs: '♣', hearts: '♥', diams: '♦', apos: "'"
};

function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(str) {
  return escapeHTML(str);
}

function applyTagFilter(html) {
  if (!html) return '';
  return html.replace(/<(\/?(?:title|textarea|style|xmp|iframe|noembed|noframes|script|plaintext)(?:[\s>\/]|$))/gi, '&lt;$1');
}

function isPunctuation(ch) {
  if (!ch) return false;
  const code = ch.charCodeAt(0);
  if ((code >= 33 && code <= 47) || (code >= 58 && code <= 64) ||
      (code >= 91 && code <= 96) || (code >= 123 && code <= 126)) return true;
  return /[\p{P}\p{S}]/u.test(ch);
}

function isWhitespace(ch) {
  if (!ch) return true;
  return /\s/u.test(ch);
}

function decodeEntities(str) {
  return str.replace(/&(?:#x[0-9a-fA-F]{1,6}|#[0-9]{1,7}|[a-zA-Z0-9]+);/g, match => {
    if (match.startsWith('&#x') || match.startsWith('&#X')) {
      const code = parseInt(match.slice(3, -1), 16);
      if (isNaN(code) || code === 0 || code > 0x10FFFF || (code >= 0xD800 && code <= 0xDFFF)) return '\uFFFD';
      return String.fromCodePoint(code);
    }
    if (match.startsWith('&#')) {
      const code = parseInt(match.slice(2, -1), 10);
      if (isNaN(code) || code === 0 || code > 0x10FFFF || (code >= 0xD800 && code <= 0xDFFF)) return '\uFFFD';
      return String.fromCodePoint(code);
    }
    const name = match.slice(1, -1);
    return ENTITIES[name] !== undefined ? ENTITIES[name] : match;
  });
}

function normalizeLabel(label) {
  return decodeEntities(label).trim().toLowerCase().replace(/\s+/g, ' ');
}

// Collect global Link Reference Definitions from Markdown text
function collectLinkReferences(lines) {
  const linkMap = new Map();
  const cleanedLines = [];

  let i = 0;
  while (i < lines.length) {
    let line = lines[i];
    const match = line.match(/^[ ]{0,3}\[([^\]]+)\]:\s*<?([^\s>]+)>?(?:\s+(?:"([^"]*)"|'([^']*)'|\(([^)]*)\)))?\s*$/);
    if (match) {
      const label = normalizeLabel(match[1]);
      const href = match[2];
      const title = match[3] || match[4] || match[5] || '';
      if (!linkMap.has(label)) {
        linkMap.set(label, { href, title });
      }
      i++;
      continue;
    }
    cleanedLines.push(line);
    i++;
  }

  return { linkMap, cleanedLines };
}

function parseInline(text, linkMap, depth = 0) {
  if (!text || depth > 100) return escapeHTML(text);

  let i = 0;
  const len = text.length;
  const tokens = [];

  while (i < len) {
    const ch = text[i];

    // 1. Backslash escapes
    if (ch === '\\' && i + 1 < len) {
      const nextChar = text[i + 1];
      if (nextChar === '\n') {
        tokens.push({ type: 'html', html: '<br>\n' });
        i += 2;
        continue;
      }
      if (isPunctuation(nextChar)) {
        tokens.push({ type: 'text', text: nextChar });
        i += 2;
        continue;
      }
    }

    // 2. Code spans
    if (ch === '`') {
      let run = 0;
      while (i + run < len && text[i + run] === '`') run++;

      let closeIdx = -1;
      let searchIdx = i + run;
      while (searchIdx < len) {
        if (text[searchIdx] === '`') {
          let closeRun = 0;
          while (searchIdx + closeRun < len && text[searchIdx + closeRun] === '`') closeRun++;
          if (closeRun === run) {
            closeIdx = searchIdx;
            break;
          }
          searchIdx += closeRun;
        } else {
          searchIdx++;
        }
      }

      if (closeIdx !== -1) {
        let content = text.slice(i + run, closeIdx).replace(/\n/g, ' ');
        if (content.length > 2 && content.startsWith(' ') && content.endsWith(' ') && content.trim().length > 0) {
          content = content.slice(1, -1);
        }
        tokens.push({ type: 'html', html: `<code>${escapeHTML(content)}</code>` });
        i = closeIdx + run;
        continue;
      }
    }

    // 3. Autolinks <uri> and <email> & Raw HTML tags
    if (ch === '<') {
      const rest = text.slice(i);
      // URI autolink
      const uriMatch = rest.match(/^<([a-zA-Z][a-zA-Z0-9+.-]{1,31}:[^<>\s]*)>/);
      if (uriMatch) {
        const uri = uriMatch[1];
        tokens.push({ type: 'html', html: `<a href="${escapeAttr(uri)}">${escapeHTML(uri)}</a>` });
        i += uriMatch[0].length;
        continue;
      }
      // Email autolink
      const emailMatch = rest.match(/^<([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)>/);
      if (emailMatch) {
        const email = emailMatch[1];
        tokens.push({ type: 'html', html: `<a href="mailto:${escapeAttr(email)}">${escapeHTML(email)}</a>` });
        i += emailMatch[0].length;
        continue;
      }
      // Raw HTML tag / comment
      const htmlMatch = rest.match(/^<(?:\/?[a-zA-Z][a-zA-Z0-9-]*\b[^>]*|!--[\s\S]*?--|\?[\s\S]*?\?|!\[CDATA\[[\s\S]*?\]\]|![A-Z][^>]*)>/i);
      if (htmlMatch) {
        tokens.push({ type: 'html', html: applyTagFilter(htmlMatch[0]) });
        i += htmlMatch[0].length;
        continue;
      }
    }

    // 4. GFM Extended Autolinks (http://, https://, www.)
    if (ch === 'h' || ch === 'w') {
      const rest = text.slice(i);
      const autoMatch = rest.match(/^(https?:\/\/[^\s<]+|www\.[^\s<]+)/i);
      if (autoMatch) {
        let url = autoMatch[1];
        // Trim trailing punctuation
        let cleanUrl = url.replace(/[,.:;!?~]+$/, '');
        if (cleanUrl.endsWith(')')) {
          let openCount = 0;
          for (const c of cleanUrl) {
            if (c === '(') openCount++;
            if (c === ')') openCount--;
          }
          if (openCount < 0) cleanUrl = cleanUrl.slice(0, -1);
        }
        const href = cleanUrl.toLowerCase().startsWith('www.') ? 'http://' + cleanUrl : cleanUrl;
        tokens.push({ type: 'html', html: `<a href="${escapeAttr(href)}">${escapeHTML(cleanUrl)}</a>` });
        i += cleanUrl.length;
        continue;
      }
    }

    // 5. Entity / numeric character reference
    if (ch === '&') {
      const rest = text.slice(i);
      const entMatch = rest.match(/^&(?:[a-zA-Z0-9]+|#[0-9]{1,7}|#[xX][0-9a-fA-F]{1,6});/);
      if (entMatch) {
        const decoded = decodeEntities(entMatch[0]);
        tokens.push({ type: 'text', text: decoded });
        i += entMatch[0].length;
        continue;
      }
    }

    // 6. Links and Images: [text](dest "title") or [text][label] or ![alt](dest)
    if (ch === '[' || (ch === '!' && i + 1 < len && text[i + 1] === '[')) {
      const isImage = (ch === '!');
      const openOffset = isImage ? 2 : 1;

      // Find matching ]
      let bracketDepth = 1;
      let closeIdx = -1;
      let j = i + openOffset;
      while (j < len) {
        if (text[j] === '\\' && j + 1 < len) {
          j += 2;
          continue;
        }
        if (text[j] === '[') bracketDepth++;
        else if (text[j] === ']') {
          bracketDepth--;
          if (bracketDepth === 0) {
            closeIdx = j;
            break;
          }
        }
        j++;
      }

      if (closeIdx !== -1) {
        const linkText = text.slice(i + openOffset, closeIdx);
        let href = null;
        let title = '';
        let nextIdx = closeIdx + 1;

        // Check (destination "title")
        if (nextIdx < len && text[nextIdx] === '(') {
          let endParen = -1;
          let k = nextIdx + 1;
          let pDepth = 1;
          let inQuote = false;
          let quoteChar = '';
          while (k < len) {
            if (inQuote) {
              if (text[k] === '\\' && k + 1 < len) { k += 2; continue; }
              if (text[k] === quoteChar) inQuote = false;
            } else {
              if (text[k] === '"' || text[k] === "'") { inQuote = true; quoteChar = text[k]; }
              else if (text[k] === '(') pDepth++;
              else if (text[k] === ')') {
                pDepth--;
                if (pDepth === 0) { endParen = k; break; }
              }
            }
            k++;
          }

          if (endParen !== -1) {
            const inlineDestStr = text.slice(nextIdx + 1, endParen).trim();
            const destMatch = inlineDestStr.match(/^(?:<([^>]+)>|([^\s]+))(?:\s+(?:"([^"]*)"|'([^']*)'|\(([^)]*)\)))?$/);
            if (destMatch) {
              href = destMatch[1] || destMatch[2] || '';
              title = destMatch[3] || destMatch[4] || destMatch[5] || '';
              nextIdx = endParen + 1;
            }
          }
        }

        // Check reference link [label]
        if (href === null && linkMap) {
          let refLabel = linkText;
          if (nextIdx < len && text[nextIdx] === '[') {
            const refClose = text.indexOf(']', nextIdx + 1);
            if (refClose !== -1) {
              const explicitRef = text.slice(nextIdx + 1, refClose);
              if (explicitRef.trim().length > 0) refLabel = explicitRef;
              nextIdx = refClose + 1;
            }
          }
          const norm = normalizeLabel(refLabel);
          if (linkMap.has(norm)) {
            const def = linkMap.get(norm);
            href = def.href;
            title = def.title;
          }
        }

        if (href !== null) {
          if (isImage) {
            const altText = escapeAttr(decodeEntities(linkText.replace(/[*_~`\\]/g, '')));
            const titleAttr = title ? ` title="${escapeAttr(title)}"` : '';
            tokens.push({ type: 'html', html: `<img src="${escapeAttr(href)}" alt="${altText}"${titleAttr}>` });
          } else {
            const innerHTML = parseInline(linkText, linkMap, depth + 1);
            const titleAttr = title ? ` title="${escapeAttr(title)}"` : '';
            tokens.push({ type: 'html', html: `<a href="${escapeAttr(href)}"${titleAttr}>${innerHTML}</a>` });
          }
          i = nextIdx;
          continue;
        }
      }
    }

    // 7. Strikethrough delimiter ~~
    if (ch === '~' && i + 1 < len && text[i + 1] === '~') {
      const prevChar = i > 0 ? text[i - 1] : '\n';
      const nextChar = i + 2 < len ? text[i + 2] : '\n';
      const leftFlanking = !isWhitespace(nextChar) && (!isPunctuation(nextChar) || isWhitespace(prevChar) || isPunctuation(prevChar));
      const rightFlanking = !isWhitespace(prevChar) && (!isPunctuation(prevChar) || isWhitespace(nextChar) || isPunctuation(nextChar));

      tokens.push({
        type: 'delim',
        char: '~',
        count: 2,
        canOpen: leftFlanking,
        canClose: rightFlanking,
        active: true
      });
      i += 2;
      continue;
    }

    // 8. Emphasis delimiters * and _
    if (ch === '*' || ch === '_') {
      let run = 0;
      while (i + run < len && text[i + run] === ch) run++;

      const prevChar = i > 0 ? text[i - 1] : '\n';
      const nextChar = i + run < len ? text[i + run] : '\n';

      const leftFlanking = !isWhitespace(nextChar) && (!isPunctuation(nextChar) || isWhitespace(prevChar) || isPunctuation(prevChar));
      const rightFlanking = !isWhitespace(prevChar) && (!isPunctuation(prevChar) || isWhitespace(nextChar) || isPunctuation(nextChar));

      let canOpen = leftFlanking;
      let canClose = rightFlanking;
      if (ch === '_') {
        canOpen = leftFlanking && (!rightFlanking || isPunctuation(prevChar));
        canClose = rightFlanking && (!leftFlanking || isPunctuation(nextChar));
      }

      tokens.push({
        type: 'delim',
        char: ch,
        count: run,
        canOpen,
        canClose,
        active: true
      });
      i += run;
      continue;
    }

    // 9. Plain text character
    tokens.push({ type: 'text', text: ch });
    i++;
  }

  // --- Process Delimiter Stack for Emphasis and Strikethrough ---
  for (let k = 0; k < tokens.length; k++) {
    const closer = tokens[k];
    if (closer.type !== 'delim' || !closer.canClose || !closer.active) continue;

    for (let j = k - 1; j >= 0; j--) {
      const opener = tokens[j];
      if (opener.type !== 'delim' || opener.char !== closer.char || !opener.canOpen || !opener.active) continue;

      // Rule of 3 check
      if ((opener.canClose || closer.canOpen) && (opener.count + closer.count) % 3 === 0 && (opener.count % 3 !== 0 || closer.count % 3 !== 0)) {
        continue;
      }

      const use = (opener.count >= 2 && closer.count >= 2) ? 2 : 1;
      const tag = (opener.char === '~') ? 'del' : (use === 2 ? 'strong' : 'em');

      // Wrap intermediate tokens
      const openTag = { type: 'html', html: `<${tag}>` };
      const closeTag = { type: 'html', html: `</${tag}>` };

      tokens.splice(k, 0, closeTag);
      tokens.splice(j + 1, 0, openTag);
      k += 2;

      opener.count -= use;
      closer.count -= use;

      if (opener.count === 0) opener.active = false;
      if (closer.count === 0) closer.active = false;

      if (closer.count > 0 && closer.active) {
        // Continue matching closer
        k--;
      }
      break;
    }
  }

  // Render tokens into final HTML
  let out = '';
  for (const token of tokens) {
    if (token.type === 'html') {
      out += token.html;
    } else if (token.type === 'text') {
      out += escapeHTML(token.text);
    } else if (token.type === 'delim') {
      if (token.count > 0) {
        out += escapeHTML(token.char.repeat(token.count));
      }
    }
  }

  return out;
}

function parseBlocks(markdown) {
  if (!markdown) return '';

  const rawLines = markdown.split(/\r?\n/);
  const { linkMap, cleanedLines: lines } = collectLinkReferences(rawLines);

  const out = [];
  let i = 0;
  const n = lines.length;

  while (i < n) {
    let line = lines[i];

    // Blank line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // 1. Fenced Code Block
    const fenceMatch = line.match(/^[ ]{0,3}(`{3,}|~{3,})[ \t]*(.*)$/);
    if (fenceMatch) {
      const fenceChar = fenceMatch[1][0];
      const fenceLen = fenceMatch[1].length;
      const infoStr = fenceMatch[2].trim();
      const langToken = infoStr ? infoStr.split(/\s+/)[0] : '';
      const codeLines = [];
      i++;

      while (i < n) {
        const curr = lines[i];
        const closeMatch = curr.match(/^[ ]{0,3}(`{3,}|~{3,})[ \t]*$/);
        if (closeMatch && closeMatch[1][0] === fenceChar && closeMatch[1].length >= fenceLen) {
          i++;
          break;
        }
        codeLines.push(curr);
        i++;
      }

      const escapedCode = escapeHTML(codeLines.join('\n'));
      const classAttr = langToken ? ` class="language-${escapeHTML(langToken)}"` : '';
      out.push(`<pre><code${classAttr}>${escapedCode}\n</code></pre>\n`);
      continue;
    }

    // 2. Indented Code Block
    if (/^(?: {4}|\t)/.test(line)) {
      const codeLines = [];
      while (i < n && (/^(?: {4}|\t)/.test(lines[i]) || lines[i].trim() === '')) {
        codeLines.push(lines[i].replace(/^(?: {4}|\t)/, ''));
        i++;
      }
      // Trim trailing blank lines
      while (codeLines.length > 0 && codeLines[codeLines.length - 1].trim() === '') {
        codeLines.pop();
      }
      const escapedCode = escapeHTML(codeLines.join('\n'));
      out.push(`<pre><code>${escapedCode}\n</code></pre>\n`);
      continue;
    }

    // 3. ATX Heading
    const atxMatch = line.match(/^[ ]{0,3}(#{1,6})(?:[ \t]+(.*))?$/);
    if (atxMatch) {
      const level = atxMatch[1].length;
      let rawContent = (atxMatch[2] || '').trim();
      rawContent = rawContent.replace(/(^|[ \t])#+[ \t]*$/, '$1').trim();
      const inlineHTML = parseInline(rawContent, linkMap);
      out.push(`<h${level}>${inlineHTML}</h${level}>\n`);
      i++;
      continue;
    }

    // 4. Thematic Break (hr)
    if (/^[ ]{0,3}(?:\*[\t ]*){3,}$|^[ ]{0,3}(?:-[\t ]*){3,}$|^[ ]{0,3}(?:_[\t ]*){3,}$/.test(line)) {
      out.push('<hr>\n');
      i++;
      continue;
    }

    // 5. HTML Block
    if (/^[ ]{0,3}<(?:script|pre|style|textarea)(?:[\s>]|$)/i.test(line)) {
      const htmlLines = [];
      while (i < n) {
        htmlLines.push(lines[i]);
        if (/<\/(?:script|pre|style|textarea)>/i.test(lines[i])) { i++; break; }
        i++;
      }
      out.push(applyTagFilter(htmlLines.join('\n')) + '\n');
      continue;
    }
    if (/^[ ]{0,3}<!--/.test(line)) {
      const htmlLines = [];
      while (i < n) {
        htmlLines.push(lines[i]);
        if (/-->/.test(lines[i])) { i++; break; }
        i++;
      }
      out.push(applyTagFilter(htmlLines.join('\n')) + '\n');
      continue;
    }
    if (/^[ ]{0,3}<\?/.test(line)) {
      const htmlLines = [];
      while (i < n) {
        htmlLines.push(lines[i]);
        if (/\?>/.test(lines[i])) { i++; break; }
        i++;
      }
      out.push(applyTagFilter(htmlLines.join('\n')) + '\n');
      continue;
    }
    if (/^[ ]{0,3}<!\[CDATA\[/.test(line)) {
      const htmlLines = [];
      while (i < n) {
        htmlLines.push(lines[i]);
        if (/\]\]>/.test(lines[i])) { i++; break; }
        i++;
      }
      out.push(applyTagFilter(htmlLines.join('\n')) + '\n');
      continue;
    }
    if (/^[ ]{0,3}<![A-Z]/.test(line)) {
      const htmlLines = [];
      while (i < n) {
        htmlLines.push(lines[i]);
        if (/>/.test(lines[i])) { i++; break; }
        i++;
      }
      out.push(applyTagFilter(htmlLines.join('\n')) + '\n');
      continue;
    }
    if (/^[ ]{0,3}<\/?(?:address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h1|h2|h3|h4|h5|h6|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|nav|noframes|ol|optgroup|option|p|param|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul)(?:[\s>\/]|$)/i.test(line)) {
      const htmlLines = [];
      while (i < n && lines[i].trim() !== '') {
        htmlLines.push(lines[i]);
        i++;
      }
      out.push(applyTagFilter(htmlLines.join('\n')) + '\n');
      continue;
    }
    if (/^[ ]{0,3}<[a-zA-Z][a-zA-Z0-9-]*\b[^>]*>/.test(line)) {
      const htmlLines = [];
      while (i < n && lines[i].trim() !== '') {
        htmlLines.push(lines[i]);
        i++;
      }
      out.push(applyTagFilter(htmlLines.join('\n')) + '\n');
      continue;
    }

    // 6. Table (GFM)
    if (i + 1 < n && line.includes('|') && /^[ ]{0,3}\|?(?:\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?[ \t]*$/.test(lines[i + 1])) {
      const splitRow = r => {
        let cells = r.trim();
        if (cells.startsWith('|')) cells = cells.slice(1);
        if (cells.endsWith('|')) cells = cells.slice(0, -1);
        return cells.split('|').map(c => c.trim());
      };

      const headerCells = splitRow(lines[i]);
      const delimCells = splitRow(lines[i + 1]);

      const aligns = delimCells.map(c => {
        const left = c.startsWith(':');
        const right = c.endsWith(':');
        if (left && right) return 'center';
        if (left) return 'left';
        if (right) return 'right';
        return null;
      });

      i += 2;
      const bodyRows = [];
      while (i < n && lines[i].trim() !== '' && lines[i].includes('|')) {
        bodyRows.push(splitRow(lines[i]));
        i++;
      }

      let tblHTML = '<table>\n<thead>\n<tr>\n';
      for (let c = 0; c < headerCells.length; c++) {
        const alignAttr = aligns[c] ? ` align="${aligns[c]}"` : '';
        tblHTML += `<th${alignAttr}>${parseInline(headerCells[c], linkMap)}</th>\n`;
      }
      tblHTML += '</tr>\n</thead>\n';

      if (bodyRows.length > 0) {
        tblHTML += '<tbody>\n';
        for (const row of bodyRows) {
          tblHTML += '<tr>\n';
          for (let c = 0; c < headerCells.length; c++) {
            const alignAttr = aligns[c] ? ` align="${aligns[c]}"` : '';
            const cellVal = c < row.length ? row[c] : '';
            tblHTML += `<td${alignAttr}>${parseInline(cellVal, linkMap)}</td>\n`;
          }
          tblHTML += '</tr>\n';
        }
        tblHTML += 'tbody>\n';
      }
      tblHTML += '</table>\n';
      out.push(tblHTML);
      continue;
    }

    // 7. Blockquote
    if (/^[ ]{0,3}>/.test(line)) {
      const bqLines = [];
      while (i < n && (/^[ ]{0,3}>/.test(lines[i]) || (lines[i].trim() === '' && i + 1 < n && /^[ ]{0,3}>/.test(lines[i + 1])))) {
        bqLines.push(lines[i].replace(/^[ ]{0,3}>[ \t]?/, ''));
        i++;
      }
      const bqHTML = parseBlocks(bqLines.join('\n'));
      out.push(`<blockquote>\n${bqHTML}</blockquote>\n`);
      continue;
    }

    // 8. Lists (Bullet & Ordered)
    const listMatch = line.match(/^[ ]{0,3}(?:([-*+])|(\d{1,9})[.)])[ \t]+/);
    if (listMatch) {
      const isOrdered = Boolean(listMatch[2]);
      const startNum = isOrdered ? parseInt(listMatch[2], 10) : 1;

      const items = [];
      let isLoose = false;

      while (i < n) {
        const itemMatch = lines[i].match(/^[ ]{0,3}(?:([-*+])|(\d{1,9})[.)])[ \t]+/);
        if (!itemMatch) break;

        const indent = itemMatch[0].length;
        const itemLines = [lines[i].slice(indent)];
        i++;

        let itemHadBlank = false;
        while (i < n) {
          if (lines[i].trim() === '') {
            itemHadBlank = true;
            i++;
            continue;
          }
          const nextItemMatch = lines[i].match(/^[ ]{0,3}(?:([-*+])|(\d{1,9})[.)])[ \t]+/);
          if (nextItemMatch && lines[i].search(/\S/) < indent) {
            break;
          }
          if (lines[i].search(/\S/) >= indent) {
            if (itemHadBlank) isLoose = true;
            itemLines.push(lines[i].slice(indent));
            i++;
          } else {
            break;
          }
        }
        items.push(itemLines.join('\n'));
      }

      const listTag = isOrdered ? (startNum !== 1 ? `<ol start="${startNum}">\n` : '<ol>\n') : '<ul>\n';
      let listHTML = listTag;

      for (let itemText of items) {
        // GFM Task list item check
        let checkbox = '';
        const taskMatch = itemText.match(/^\[([ xX])\][ \t]+/);
        if (taskMatch) {
          const checked = taskMatch[1].toLowerCase() === 'x';
          checkbox = checked ? '<input checked="" disabled="" type="checkbox"> ' : '<input disabled="" type="checkbox"> ';
          itemText = itemText.slice(taskMatch[0].length);
        }

        if (isLoose) {
          const innerBlocks = parseBlocks(itemText);
          listHTML += `<li>\n${checkbox}${innerBlocks}</li>\n`;
        } else {
          const inlineText = parseInline(itemText.trim(), linkMap);
          listHTML += `<li>${checkbox}${inlineText}</li>\n`;
        }
      }

      listHTML += isOrdered ? '</ol>\n' : '</ul>\n';
      out.push(listHTML);
      continue;
    }

    // 9. Paragraph & Setext Heading
    const paraLines = [line];
    i++;
    let isSetext = false;
    let setextLevel = 0;

    while (i < n) {
      const curr = lines[i];
      if (curr.trim() === '') break;
      if (/^[ ]{0,3}(=+|-+)[ \t]*$/.test(curr)) {
        isSetext = true;
        setextLevel = curr.trim().startsWith('=') ? 1 : 2;
        i++;
        break;
      }
      if (/^[ ]{0,3}(#{1,6}|`{3,}|~{3,}|>|[-*+]\s|\d{1,9}[.)]\s)/.test(curr)) {
        break;
      }
      paraLines.push(curr);
      i++;
    }

    const paraContent = paraLines.join('\n').trim();
    if (isSetext) {
      const inlineHTML = parseInline(paraContent, linkMap);
      out.push(`<h${setextLevel}>${inlineHTML}</h${setextLevel}>\n`);
    } else if (paraContent.length > 0) {
      const inlineHTML = parseInline(paraContent, linkMap);
      out.push(`<p>${inlineHTML}</p>\n`);
    }
  }

  return out.join('');
}

export function parse(markdown) {
  if (markdown === null || markdown === undefined || markdown === '') {
    return '';
  }
  return parseBlocks(markdown);
}

export default parse;
