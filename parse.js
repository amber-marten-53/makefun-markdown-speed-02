// parse.js - Dependency-free ES module exporting parse(markdown) matching marked 18.1.3
// GFM true, breaks false

// --- HTML Entities Lookup Table ---
const ENTITIES = {
  nbsp: '\u00A0', iexcl: '¡', cent: '¢', pound: '£', curren: '¤', yen: '¥', brvbar: '¦', sect: '§',
  uml: '¨', copy: '©', ordf: 'ª', laquo: '«', not: '¬', shy: '\u00AD', reg: '®', macr: '¯',
  deg: '°', plusmn: '±', sup2: '²', sup3: '³', acute: '´', micro: 'µ', para: '¶', middot: '·',
  cedil: '¸', sup1: '¹', ordm: 'º', raquo: '»', frac14: '¼', frac12: '½', frac34: '¾', iquest: '¿',
  Agrave: 'À', Aacute: 'Á', Acirc: 'Â', Atilde: 'Ã', Auml: 'Ä', Aring: 'Å', AElig: 'Æ', Ccedil: 'Ç',
  Egrave: 'È', Eacute: 'É', Ecirc: 'Ê', Euml: 'Ë', Igrave: 'Ì', Iacute: 'Í', Icirc: 'Î', Iuml: 'Ï',
  ETH: 'Ð', Ntilde: 'Ñ', Ograve: 'Ò', Oacute: 'Ó', Ocirc: 'Ô', Otilde: 'Õ', Ouml: 'Ö', times: '×',
  Oslash: 'Ø', Ugrave: 'Ù', Uacute: 'Ú', Ucirc: 'Û', Uuml: 'Ü', Yacute: 'Ý', THORN: 'Þ', szlig: 'ß',
  agrave: 'à', aacute: 'á', acirc: 'â', atilde: 'ã', auml: 'ä', aring: 'å', aelig: 'æ', ccedil: 'ç',
  egrave: 'è', eacute: 'é', ecirc: 'ê', euml: 'ë', igrave: 'ì', iacute: 'í', icirc: 'î', iuml: 'ï',
  eth: 'ð', ntilde: 'ñ', ograve: 'ò', oacute: 'ó', ocirc: 'ô', otilde: 'õ', ouml: 'ö', divide: '÷',
  oslash: 'ø', ugrave: 'ù', uacute: 'ú', ucirc: 'û', uuml: 'ü', yacute: 'ý', thorn: 'þ', yuml: 'ÿ',
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'",
  OElig: 'Œ', oelig: 'œ', Scaron: 'Š', scaron: 'š', Yuml: 'Ÿ', fnof: 'ƒ',
  circ: 'ˆ', tilde: '˜', Alpha: 'Α', Beta: 'Β', Gamma: 'Γ', Delta: 'Δ', Epsilon: 'Ε', Zeta: 'Ζ',
  Eta: 'Η', Theta: 'Θ', Iota: 'Ι', Kappa: 'Κ', Lambda: 'Λ', Mu: 'Μ', Nu: 'Ν', Xi: 'Ξ', Omicron: 'Ο',
  Pi: 'Π', Rho: 'Ρ', Sigma: 'Σ', Tau: 'Τ', Upsilon: 'Υ', Phi: 'Φ', Chi: 'Χ', Psi: 'Ψ', Omega: 'Ω',
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', zeta: 'ζ', eta: 'η', theta: 'θ',
  iota: 'ι', kappa: 'κ', lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', omicron: 'ο', pi: 'π', rho: 'ρ',
  sigmaf: 'ς', sigma: 'σ', tau: 'τ', upsilon: 'υ', phi: 'φ', chi: 'χ', psi: 'ψ', omega: 'ω',
  thetasym: 'ϑ', upsih: 'ϒ', piv: 'ϖ', ensp: '\u2002', emsp: '\u2003', thinsp: '\u2009',
  zwnj: '\u200C', zwj: '\u200D', lrm: '\u200E', rlm: '\u200F', ndash: '–', mdash: '—',
  lsquo: '‘', rsquo: '’', sbquo: '‚', ldquo: '“', rdquo: '”', bdquo: '„', dagger: '†', Dagger: '‡',
  bull: '•', hellip: '…', permil: '‰', prime: '′', Prime: '″', oline: '‾', frasl: '⁄', weierp: '℘',
  image: 'ℑ', real: 'ℜ', trade: '™', alefsym: 'ℵ', larr: '←', uarr: '↑', rarr: '→', darr: '↓',
  harr: '↔', crarr: '↵', lArr: '⇐', uArr: '⇑', rArr: '⇒', dArr: '⇓', hArr: '⇔', forall: '∀',
  part: '∂', exist: '∃', empty: '∅', nabla: '∇', isin: '∈', notin: '∉', ni: '∋', prod: '∏',
  sum: '∑', minus: '−', lowast: '∗', radic: '√', prop: '∝', infin: '∞', ang: '∠', and: '∧',
  or: '∨', cap: '∩', cup: '∪', int: '∫', there4: '∴', sim: '∼', cong: '≅', asymp: '≈',
  ne: '≠', equiv: '≡', le: '≤', ge: '≥', sub: '⊂', sup: '⊃', nsub: '⊄', sube: '⊆', supe: '⊇',
  oplus: '⊕', otimes: '⊗', perp: '⊥', sdot: '⋅', lceil: '⌈', rceil: ' me', lfloor: '⌊', rfloor: '⌋',
  lang: '⟨', rang: '⟩', loz: '◊', spades: '♠', clubs: '♣', hearts: '♥', diams: '♦',
  Dcaron: 'Ď', dcaron: 'ď',
};

const WIN1252 = {
  0x80: 0x20AC, 0x82: 0x201A, 0x83: 0x0192, 0x84: 0x201E, 0x85: 0x2026, 0x86: 0x2020, 0x87: 0x2021,
  0x88: 0x02C6, 0x89: 0x2030, 0x8A: 0x0160, 0x8B: 0x2039, 0x8C: 0x0152, 0x8E: 0x017D, 0x91: 0x2018,
  0x92: 0x2019, 0x93: 0x201C, 0x94: 0x201D, 0x95: 0x2022, 0x96: 0x2013, 0x97: 0x2014, 0x98: 0x02DC,
  0x99: 0x2122, 0x9A: 0x0161, 0x9B: 0x203A, 0x9C: 0x0153, 0x9E: 0x017E, 0x9F: 0x0178
};

function decodeCharRef(match, hex, dec, name) {
  if (hex) {
    let val = parseInt(hex, 16);
    if (isNaN(val) || val === 0 || (val >= 0xD800 && val <= 0xDFFF) || val > 0x10FFFF) return '\uFFFD';
    if (val >= 0x80 && val <= 0x9F) val = WIN1252[val] || val;
    return String.fromCodePoint(val);
  }
  if (dec) {
    let val = parseInt(dec, 10);
    if (isNaN(val) || val === 0 || (val >= 0xD800 && val <= 0xDFFF) || val > 0x10FFFF) return '\uFFFD';
    if (val >= 0x80 && val <= 0x9F) val = WIN1252[val] || val;
    return String.fromCodePoint(val);
  }
  if (name) {
    if (ENTITIES[name]) return ENTITIES[name];
  }
  return match;
}

function decodeEntities(str) {
  return str.replace(/&(?:#x([0-9a-fA-F]+)|#([0-9]+)|([a-zA-Z0-9]+));/g, decodeCharRef);
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function escapeAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function unescapePunctuation(str) {
  return str.replace(/\\([!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~])/g, '$1');
}

const TAGFILTER_RE = /<\/?(title|textarea|style|xmp|iframe|noembed|noframes|script|plaintext)[\s/>]/gi;
function gfmTagFilter(html) {
  return html.replace(TAGFILTER_RE, (match) => '&lt;' + match.slice(1));
}

function expandTabs(line) {
  if (!line.includes('\t')) return line;
  let res = '';
  let col = 0;
  for (let i = 0; i < line.length; i++) {
    let c = line[i];
    if (c === '\t') {
      let spaces = 4 - (col % 4);
      res += ' '.repeat(spaces);
      col += spaces;
    } else {
      res += c;
      col++;
    }
  }
  return res;
}

const HTML_BLOCK_OPEN_1 = /^ {0,3}<(script|pre|style|textarea)(?:[\s/>]|$)/i;
const HTML_BLOCK_OPEN_2 = /^ {0,3}<!--/;
const HTML_BLOCK_OPEN_3 = /^ {0,3}<\?/;
const HTML_BLOCK_OPEN_4 = /^ {0,3}<![A-Z]/;
const HTML_BLOCK_OPEN_5 = /^ {0,3}<!\[CDATA\[/;
const HTML_BLOCK_OPEN_6 = /^ {0,3}<\/?(address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h1|h2|h3|h4|h5|h6|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul)(?:[\s/>]|$)/i;
const HTML_BLOCK_OPEN_7 = /^ {0,3}(?:<[a-zA-Z][a-zA-Z0-9-]*([^>"]|"[^"]*")*>|<!--.*?-->|<\?[^>]*\?>|<![A-Z][^>]*>|<!\[CDATA\[.*?\]\]>)\s*$/;

function getHtmlBlockType(line) {
  if (HTML_BLOCK_OPEN_1.test(line)) return 1;
  if (HTML_BLOCK_OPEN_2.test(line)) return 2;
  if (HTML_BLOCK_OPEN_3.test(line)) return 3;
  if (HTML_BLOCK_OPEN_4.test(line)) return 4;
  if (HTML_BLOCK_OPEN_5.test(line)) return 5;
  if (HTML_BLOCK_OPEN_6.test(line)) return 6;
  if (HTML_BLOCK_OPEN_7.test(line)) return 7;
  return 0;
}

function checkHtmlBlockEnd(type, line) {
  if (type === 1) return /<\/(script|pre|style|textarea)>/i.test(line);
  if (type === 2) return /-->/.test(line);
  if (type === 3) return /\?>/.test(line);
  if (type === 4) return />/.test(line);
  if (type === 5) return /\]\]>/.test(line);
  if (type === 6 || type === 7) return /^\s*$/.test(line);
  return false;
}

const BULLET_LIST_RE = /^( {0,3})([*+-])([ \t]+.*|$)/;
const ORDERED_LIST_RE = /^( {0,3})([0-9]{1,9})([.)])([ \t]+.*|$)/;
const HR_RE = /^ {0,3}(?:(?:\* *){3,}|(?:- *){3,}|(?:_ *){3,})$/;
const FENCE_RE = /^( {0,3})(`{3,}|~{3,})(.*)$/;
const ATX_RE = /^( {0,3})(#{1,6})(?:[ \t]+(.*)|$)/;
const REF_DEF_RE = /^ {0,3}\[([^\]]+)\]:\s*<?([^\s>]+)>?(?:\s+["'(](.*)["')])?\s*$/;

function parseReferenceDefs(lines) {
  const defs = new Map();
  const filteredLines = [];
  let i = 0;
  while (i < lines.length) {
    let line = lines[i];
    let match = line.match(REF_DEF_RE);
    if (match) {
      let label = match[1].toLowerCase().trim().replace(/\s+/g, ' ');
      let dest = match[2];
      let title = match[3] || '';
      if (!defs.has(label)) {
        defs.set(label, { href: unescapePunctuation(decodeEntities(dest)), title: unescapePunctuation(decodeEntities(title)) });
      }
      i++;
      continue;
    }
    // Check multiline title definition
    let mStart = line.match(/^ {0,3}\[([^\]]+)\]:\s*<?([^\s>]+)>?\s*$/);
    if (mStart && i + 1 < lines.length) {
      let nextLine = lines[i + 1].trim();
      let mTitle = nextLine.match(/^["'(](.*)["')]$/);
      if (mTitle) {
        let label = mStart[1].toLowerCase().trim().replace(/\s+/g, ' ');
        let dest = mStart[2];
        let title = mTitle[1];
        if (!defs.has(label)) {
          defs.set(label, { href: unescapePunctuation(decodeEntities(dest)), title: unescapePunctuation(decodeEntities(title)) });
        }
        i += 2;
        continue;
      }
    }
    filteredLines.push(line);
    i++;
  }
  return { defs, lines: filteredLines };
}

function parseBlocks(rawMarkdown) {
  const rawLines = rawMarkdown.replace(/\r\n?/g, '\n').split('\n');
  const expandedLines = rawLines.map(expandTabs);
  const { defs, lines } = parseReferenceDefs(expandedLines);

  const root = { type: 'document', children: [] };
  const stack = [root];

  function top() { return stack[stack.length - 1]; }

  for (let l = 0; l < lines.length; l++) {
    let line = lines[l];
    let isBlank = /^\s*$/.test(line);
    let i = 0;

    // Check open containers
    let depth = 1;
    let lazy = false;

    while (depth < stack.length) {
      let container = stack[depth];

      if (container.type === 'blockquote') {
        let match = line.slice(i).match(/^ {0,3}> ?/);
        if (match) {
          i += match[0].length;
          depth++;
        } else if (isBlank) {
          depth++;
        } else {
          lazy = true;
          break;
        }
      } else if (container.type === 'list_item') {
        let leadingSpaces = 0;
        let p = i;
        while (p < line.length && line[p] === ' ') { leadingSpaces++; p++; }
        if (leadingSpaces >= container.indent) {
          i += container.indent;
          depth++;
        } else if (isBlank) {
          depth++;
        } else {
          lazy = true;
          break;
        }
      } else if (container.type === 'fenced_code') {
        depth++;
      } else if (container.type === 'html_block') {
        depth++;
      } else {
        depth++;
      }
    }

    // Close unmatched containers if not lazy
    if (!lazy) {
      while (stack.length > depth) {
        let closed = stack.pop();
        if (closed.type === 'paragraph' && closed.lines.length > 0) {
          // Keep paragraph
        }
      }
    }

    let current = top();

    // Check if in code block or html block
    if (current.type === 'fenced_code') {
      let mClose = line.slice(i).match(/^( {0,3})(`{3,}|~{3,})\s*$/);
      if (mClose && mClose[2][0] === current.fenceChar && mClose[2].length >= current.fenceLen) {
        stack.pop();
      } else {
        // Dedent up to opening fence indent
        let lineContent = line.slice(i);
        let dedent = 0;
        while (dedent < current.indent && dedent < lineContent.length && lineContent[dedent] === ' ') {
          dedent++;
        }
        current.lines.push(lineContent.slice(dedent));
      }
      continue;
    }

    if (current.type === 'html_block') {
      current.lines.push(line);
      if (checkHtmlBlockEnd(current.htmlType, line)) {
        stack.pop();
      }
      continue;
    }

    // Handle blank lines
    if (isBlank) {
      if (current.type === 'paragraph') {
        stack.pop();
      }
      for (let s = 1; s < stack.length; s++) {
        if (stack[s].type === 'list' || stack[s].type === 'list_item') {
          stack[s].hasBlankLine = true;
        }
      }
      continue;
    }

    let rest = line.slice(i);

    // Fenced Code Block
    let mFence = rest.match(FENCE_RE);
    if (mFence) {
      if (current.type === 'paragraph') stack.pop();
      let fenceChar = mFence[2][0];
      let fenceLen = mFence[2].length;
      let info = mFence[3].trim();
      let codeNode = { type: 'fenced_code', fenceChar, fenceLen, indent: mFence[1].length, info, lines: [] };
      top().children.push(codeNode);
      stack.push(codeNode);
      continue;
    }

    // ATX Heading
    let mAtx = rest.match(ATX_RE);
    if (mAtx) {
      if (current.type === 'paragraph') stack.pop();
      let level = mAtx[2].length;
      let text = (mAtx[3] || '').replace(/[ \t]+#+\s*$/, '').trim();
      top().children.push({ type: 'heading', level, text });
      continue;
    }

    // HR
    if (HR_RE.test(rest)) {
      if (current.type === 'paragraph') stack.pop();
      top().children.push({ type: 'hr' });
      continue;
    }

    // Blockquote
    let mBq = rest.match(/^ {0,3}> ?/);
    if (mBq) {
      if (current.type === 'paragraph') stack.pop();
      let bqNode = { type: 'blockquote', children: [] };
      top().children.push(bqNode);
      stack.push(bqNode);
      let contentAfterBq = rest.slice(mBq[0].length);
      if (contentAfterBq.length > 0) {
        let pNode = { type: 'paragraph', lines: [contentAfterBq] };
        bqNode.children.push(pNode);
        stack.push(pNode);
      }
      continue;
    }

    // HTML Block
    let htmlType = getHtmlBlockType(rest);
    if (htmlType > 0 && (htmlType !== 7 || current.type !== 'paragraph')) {
      if (current.type === 'paragraph') stack.pop();
      let htmlNode = { type: 'html_block', htmlType, lines: [line] };
      top().children.push(htmlNode);
      if (!checkHtmlBlockEnd(htmlType, line)) {
        stack.push(htmlNode);
      }
      continue;
    }

    // Setext Heading (underline directly after paragraph)
    if (current.type === 'paragraph') {
      let mSetext = rest.match(/^( {0,3})(=+|-+)\s*$/);
      if (mSetext) {
        let level = mSetext[2][0] === '=' ? 1 : 2;
        let text = current.lines.join('\n').trim();
        stack.pop(); // Pop paragraph
        top().children.push({ type: 'heading', level, text });
        continue;
      }
    }

    // Table matching (if paragraph has 1 line and delimiter row matches)
    if (current.type === 'paragraph' && current.lines.length === 1) {
      let headerLine = current.lines[0].trim();
      let delimLine = rest.trim();
      if (delimLine.includes('-') && delimLine.includes('|')) {
        let delimCells = splitTableCells(delimLine);
        let headerCells = splitTableCells(headerLine);
        if (delimCells.length === headerCells.length && delimCells.every(isDelimCell)) {
          let aligns = delimCells.map(getAlign);
          stack.pop(); // pop paragraph
          let tableNode = { type: 'table', header: headerCells, align: aligns, rows: [] };
          top().children.push(tableNode);
          stack.push(tableNode);
          continue;
        }
      }
    }

    if (current.type === 'table') {
      let rowLine = rest.trim();
      if (rowLine.includes('|') || rowLine.length > 0) {
        let cells = splitTableCells(rowLine);
        current.rows.push(cells);
        continue;
      } else {
        stack.pop();
        current = top();
      }
    }

    // List Items
    let mBullet = rest.match(BULLET_LIST_RE);
    let mOrdered = rest.match(ORDERED_LIST_RE);

    if (mBullet || mOrdered) {
      let isOrdered = !!mOrdered;
      let m = mBullet || mOrdered;
      let leading = m[1].length;
      let marker = m[2];
      let delim = isOrdered ? m[3] : '';
      let afterMarker = m[isOrdered ? 4 : 3];

      let canInterrupt = true;
      if (current.type === 'paragraph') {
        if (isOrdered && marker !== '1') canInterrupt = false;
        if (/^\s*$/.test(afterMarker)) canInterrupt = false;
      }

      if (canInterrupt) {
        if (current.type === 'paragraph') stack.pop();

        let spacesAfter = 0;
        let p = 0;
        while (p < afterMarker.length && (afterMarker[p] === ' ' || afterMarker[p] === '\t')) { spacesAfter++; p++; }
        let itemIndent = leading + marker.length + delim.length + (spacesAfter >= 5 || afterMarker.length === 0 ? 1 : spacesAfter);

        let parent = top();
        let listNode = parent.children.length > 0 ? parent.children[parent.children.length - 1] : null;

        if (!listNode || listNode.type !== 'list' || listNode.isOrdered !== isOrdered || listNode.marker !== (isOrdered ? delim : marker)) {
          listNode = {
            type: 'list',
            isOrdered,
            marker: isOrdered ? delim : marker,
            start: isOrdered ? parseInt(marker, 10) : 1,
            tight: true,
            children: []
          };
          top().children.push(listNode);
        }

        let itemNode = { type: 'list_item', indent: itemIndent, tight: true, children: [] };
        listNode.children.push(itemNode);
        stack.push(itemNode);

        // Put remainder of line into item
        let itemRest = afterMarker.slice(spacesAfter >= 5 ? 1 : spacesAfter);
        if (itemRest.length > 0) {
          let pNode = { type: 'paragraph', lines: [itemRest] };
          itemNode.children.push(pNode);
          stack.push(pNode);
        }
        continue;
      }
    }

    // Indented Code Block (4+ spaces, not in paragraph)
    let mIndented = line.match(/^( {4,})(.*)$/);
    if (mIndented && current.type !== 'paragraph') {
      let codeNode = { type: 'indented_code', lines: [line.slice(4)] };
      top().children.push(codeNode);
      stack.push(codeNode);
      continue;
    }

    if (current.type === 'indented_code') {
      if (line.startsWith('    ')) {
        current.lines.push(line.slice(4));
        continue;
      } else {
        stack.pop();
        current = top();
      }
    }

    // Paragraph continuation or new paragraph
    if (current.type === 'paragraph') {
      current.lines.push(rest);
    } else {
      let pNode = { type: 'paragraph', lines: [rest] };
      current.children.push(pNode);
      stack.push(pNode);
    }
  }

  // Compute looseness for lists
  function computeLooseness(node) {
    if (node.type === 'list') {
      let isLoose = node.hasBlankLine || false;
      for (let item of node.children) {
        if (item.hasBlankLine && item.children.length > 1) isLoose = true;
        if (item.children.length > 1) {
          let blockCount = 0;
          for (let child of item.children) {
            if (child.type === 'paragraph') blockCount++;
          }
          if (blockCount > 1) isLoose = true;
        }
      }
      if (isLoose) {
        node.tight = false;
        for (let item of node.children) item.tight = false;
      }
    }
    if (node.children) {
      for (let child of node.children) computeLooseness(child);
    }
  }

  computeLooseness(root);
  return { root, defs };
}

// Helper functions for GFM Table parsing
function splitTableCells(line) {
  let cells = [];
  let current = '';
  let inCode = false;
  let codeLen = 0;
  let i = 0;
  let str = line.trim();

  if (str.startsWith('|')) str = str.slice(1);
  if (str.endsWith('|') && !str.endsWith('\\|')) str = str.slice(0, -1);

  while (i < str.length) {
    let c = str[i];
    if (c === '`') {
      let j = i;
      while (j < str.length && str[j] === '`') j++;
      let run = j - i;
      if (!inCode) { inCode = true; codeLen = run; }
      else if (run === codeLen) { inCode = false; }
      current += str.slice(i, j);
      i = j;
      continue;
    }
    if (c === '\\' && i + 1 < str.length) {
      current += str[i] + str[i + 1];
      i += 2;
      continue;
    }
    if (c === '|' && !inCode) {
      cells.push(current.trim());
      current = '';
      i++;
      continue;
    }
    current += c;
    i++;
  }
  cells.push(current.trim());
  return cells;
}

function isDelimCell(cell) {
  return /^:?-+:?$/.test(cell.trim());
}

function getAlign(cell) {
  let c = cell.trim();
  let left = c.startsWith(':');
  let right = c.endsWith(':');
  if (left && right) return 'center';
  if (left) return 'left';
  if (right) return 'right';
  return null;
}

// --- Inline Parsing Engine ---

function renderInline(text, defs, options = {}) {
  if (!text) return '';

  let depth = options.depth || 0;
  if (depth > 100) return escapeHtml(text);

  let output = [];
  let pos = 0;

  // Process Task List Checkboxes at start of paragraph text
  if (options.isFirstInListItem && depth === 0) {
    if (text.startsWith('[ ] ')) {
      output.push('<input disabled="" type="checkbox"> ');
      text = text.slice(4);
    } else if (text.startsWith('[x] ') || text.startsWith('[X] ')) {
      output.push('<input checked="" disabled="" type="checkbox"> ');
      text = text.slice(4);
    }
  }

  // CommonMark Inline Scanner
  let tokens = [];
  let i = 0;

  while (i < text.length) {
    let c = text[i];

    // 1. Backslash escape
    if (c === '\\' && i + 1 < text.length) {
      let next = text[i + 1];
      if (next === '\n') {
        tokens.push({ type: 'html', val: '<br>\n' });
        i += 2;
        continue;
      }
      if (/[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/.test(next)) {
        tokens.push({ type: 'text', val: next });
        i += 2;
        continue;
      }
    }

    // 2. Code Span
    if (c === '`') {
      let j = i;
      while (j < text.length && text[j] === '`') j++;
      let backticks = text.slice(i, j);
      let closeIdx = text.indexOf(backticks, j);
      if (closeIdx !== -1) {
        let codeContent = text.slice(j, closeIdx).replace(/\n/g, ' ');
        if (codeContent.length > 2 && codeContent.startsWith(' ') && codeContent.endsWith(' ') && /[^\s]/.test(codeContent)) {
          codeContent = codeContent.slice(1, -1);
        }
        tokens.push({ type: 'html', val: `<code>${escapeHtml(codeContent)}</code>` });
        i = closeIdx + backticks.length;
        continue;
      }
    }

    // 3. Autolink / Raw HTML Tag
    if (c === '<') {
      // Standard URI Autolink
      let mAuto = text.slice(i).match(/^<([a-zA-Z][a-zA-Z0-9+.-]{1,31}:[^\s<>]*)>/);
      if (mAuto) {
        let url = escapeAttr(mAuto[1]);
        tokens.push({ type: 'html', val: `<a href="${url}">${url}</a>` });
        i += mAuto[0].length;
        continue;
      }
      // Email Autolink
      let mEmail = text.slice(i).match(/^<([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)>/);
      if (mEmail) {
        let email = escapeHtml(mEmail[1]);
        tokens.push({ type: 'html', val: `<a href="mailto:${email}">${email}</a>` });
        i += mEmail[0].length;
        continue;
      }
      // Inline HTML Tag
      let mTag = text.slice(i).match(/^<\/?([a-zA-Z][a-zA-Z0-9-]*)\s*([^>"]|"[^"]*")*\/?>|^<!--.*?-->|^<\?.*?\?>|^<![A-Z].*?>|^<!\[CDATA\[.*?\]\]>/s);
      if (mTag) {
        let tagHtml = gfmTagFilter(mTag[0]);
        tokens.push({ type: 'html', val: tagHtml });
        i += mTag[0].length;
        continue;
      }
    }

    // 4. Links and Images: [text](url) or ![alt](url)
    if ((c === '[' || (c === '!' && i + 1 < text.length && text[i + 1] === '[')) && !options.inLink) {
      let isImage = c === '!';
      let startIdx = isImage ? i + 1 : i;

      // Find balanced ]
      let d = 1;
      let j = startIdx + 1;
      let inSpan = false;
      let spanLen = 0;

      while (j < text.length && d > 0) {
        let ch = text[j];
        if (ch === '\\' && j + 1 < text.length) { j += 2; continue; }
        if (ch === '`') {
          let k = j;
          while (k < text.length && text[k] === '`') k++;
          let bLen = k - j;
          if (!inSpan) { inSpan = true; spanLen = bLen; j = k; continue; }
          else if (bLen === spanLen) { inSpan = false; j = k; continue; }
        }
        if (!inSpan) {
          if (ch === '[') d++;
          else if (ch === ']') d--;
        }
        j++;
      }

      if (d === 0) {
        let linkText = text.slice(startIdx + 1, j - 1);
        let remainder = text.slice(j);

        // Inline link (url "title")
        let mInline = remainder.match(/^[ \t\n]*\((<[^>]*>|[^()\s]+)(?:[ \t\n]+(["'])(.*?)\2|\s*\((.*?)\))?\s*\)/s);
        if (mInline) {
          let rawHref = mInline[1].startsWith('<') ? mInline[1].slice(1, -1) : mInline[1];
          let href = escapeAttr(unescapePunctuation(decodeEntities(rawHref)));
          let title = mInline[3] || mInline[4] || '';
          let titleAttr = title ? ` title="${escapeAttr(unescapePunctuation(decodeEntities(title)))}"` : '';

          if (isImage) {
            let altText = escapeAttr(decodeEntities(stripFormatting(linkText)));
            tokens.push({ type: 'html', val: `<img src="${href}" alt="${altText}"${titleAttr} />` });
          } else {
            let renderedContent = renderInline(linkText, defs, { ...options, inLink: true, depth: depth + 1 });
            tokens.push({ type: 'html', val: `<a href="${href}"${titleAttr}>${renderedContent}</a>` });
          }
          i = j + mInline[0].length;
          continue;
        }

        // Reference link
        let refLabel = null;
        let mFull = remainder.match(/^[ \t\n]*\[([^\]]*)\]/);
        if (mFull) {
          refLabel = mFull[1] || linkText;
          j += mFull[0].length;
        } else {
          refLabel = linkText;
        }

        let normLabel = refLabel.toLowerCase().trim().replace(/\s+/g, ' ');
        if (defs.has(normLabel)) {
          let def = defs.get(normLabel);
          let href = escapeAttr(def.href);
          let titleAttr = def.title ? ` title="${escapeAttr(def.title)}"` : '';

          if (isImage) {
            let altText = escapeAttr(decodeEntities(stripFormatting(linkText)));
            tokens.push({ type: 'html', val: `<img src="${href}" alt="${altText}"${titleAttr} />` });
          } else {
            let renderedContent = renderInline(linkText, defs, { ...options, inLink: true, depth: depth + 1 });
            tokens.push({ type: 'html', val: `<a href="${href}"${titleAttr}>${renderedContent}</a>` });
          }
          i = j;
          continue;
        }
      }
    }

    // 5. GFM Extended Autolinks (http://, https://, www., bare email)
    if (!options.inLink) {
      let rest = text.slice(i);
      let mGfm = rest.match(/^(https?:\/\/|ftp:\/\/|www\.)[^\s<]+/i);
      if (mGfm) {
        let rawUrl = mGfm[0];
        // Trim trailing punctuation per GFM spec
        let cleanUrl = rawUrl.replace(/[?!.,:*_~]+$/, '');
        if (cleanUrl.endsWith(')')) {
          let openP = (cleanUrl.match(/\(/g) || []).length;
          let closeP = (cleanUrl.match(/\)/g) || []).length;
          if (closeP > openP) cleanUrl = cleanUrl.slice(0, -1);
        }
        let href = cleanUrl.startsWith('www.') ? 'http://' + cleanUrl : cleanUrl;
        tokens.push({ type: 'html', val: `<a href="${escapeAttr(href)}">${escapeHtml(cleanUrl)}</a>` });
        i += cleanUrl.length;
        continue;
      }

      let mBareEmail = rest.match(/^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+)/);
      if (mBareEmail) {
        let email = mBareEmail[1].replace(/[?!.,:*_~]+$/, '');
        tokens.push({ type: 'html', val: `<a href="mailto:${escapeAttr(email)}">${escapeHtml(email)}</a>` });
        i += email.length;
        continue;
      }
    }

    // 6. Hard Breaks (2+ trailing spaces before newline)
    if (c === ' ' && text.slice(i).match(/^ {2,}\n/)) {
      tokens.push({ type: 'html', val: '<br>\n' });
      i = text.indexOf('\n', i) + 1;
      continue;
    }

    // 7. Delimiters (*, _, ~~) for Emphasis
    if (c === '*' || c === '_' || (c === '~' && text[i + 1] === '~')) {
      let delimChar = c;
      let runLen = (c === '~') ? 2 : 1;
      if (c !== '~') {
        while (i + runLen < text.length && text[i + runLen] === c) runLen++;
      }

      let prevChar = i > 0 ? text[i - 1] : ' ';
      let nextChar = i + runLen < text.length ? text[i + runLen] : ' ';

      let isLeftFlanking = !/\s/.test(nextChar) && (!/[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/.test(nextChar) || /\s|[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/.test(prevChar));
      let isRightFlanking = !/\s/.test(prevChar) && (!/[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/.test(prevChar) || /\s|[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/.test(nextChar));

      let canOpen = isLeftFlanking;
      let canClose = isRightFlanking;

      if (c === '_') {
        canOpen = isLeftFlanking && (!isRightFlanking || /[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/.test(prevChar));
        canClose = isRightFlanking && (!isLeftFlanking || /[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/.test(nextChar));
      }

      tokens.push({ type: 'delim', char: delimChar, count: runLen, canOpen, canClose, raw: text.slice(i, i + runLen) });
      i += runLen;
      continue;
    }

    // Default text char
    tokens.push({ type: 'text', val: c });
    i++;
  }

  // CommonMark Emphasis Delimiter Run Matching
  processDelimiters(tokens);

  // Combine tokens into final HTML output
  for (let tok of tokens) {
    if (tok.type === 'text') {
      output.push(escapeHtml(decodeEntities(tok.val)));
    } else if (tok.type === 'html') {
      output.push(tok.val);
    } else if (tok.type === 'delim') {
      output.push(escapeHtml(tok.raw));
    }
  }

  return output.join('');
}

function processDelimiters(tokens) {
  let stack = [];
  for (let i = 0; i < tokens.length; i++) {
    let tok = tokens[i];
    if (tok.type !== 'delim') continue;

    if (tok.canClose) {
      let openIdx = -1;
      for (let j = stack.length - 1; j >= 0; j--) {
        let opener = tokens[stack[j]];
        if (opener.char === tok.char && opener.canOpen) {
          // Rule of 3
          if ((opener.canClose || tok.canOpen) && (opener.count + tok.count) % 3 === 0) {
            if (opener.count % 3 !== 0 || tok.count % 3 !== 0) continue;
          }
          openIdx = j;
          break;
        }
      }

      if (openIdx !== -1) {
        let openerIdx = stack[openIdx];
        let opener = tokens[openerIdx];
        let useCount = (opener.char === '~' || (opener.count >= 2 && tok.count >= 2)) ? 2 : 1;

        let openTag = useCount === 2 ? (opener.char === '~' ? '<del>' : '<strong>') : '<em>';
        let closeTag = useCount === 2 ? (opener.char === '~' ? '</del>' : '</strong>') : '</em>';

        opener.count -= useCount;
        tok.count -= useCount;

        // Wrap contents between opener and closer
        tokens[openerIdx] = { type: 'html', val: (opener.count > 0 ? opener.raw.slice(0, opener.count) : '') + openTag };
        tokens[i] = { type: 'html', val: closeTag + (tok.count > 0 ? tok.raw.slice(0, tok.count) : '') };

        // Remove intervening stack delimiters
        stack.splice(openIdx);

        if (tok.count > 0) {
          i--; // Re-process remaining delimiter count
        }
        continue;
      }
    }

    if (tok.canOpen) {
      stack.push(i);
    }
  }
}

function stripFormatting(text) {
  return text.replace(/`([^`]+)`/g, '$1')
             .replace(/[*_~]+/g, '')
             .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
             .replace(/<[^>]+>/g, '');
}

// --- HTML Rendering Engine ---

function renderNode(node, defs, options = {}) {
  switch (node.type) {
    case 'document': {
      let html = node.children.map(c => renderNode(c, defs, options)).join('');
      return html;
    }
    case 'paragraph': {
      let text = node.lines.join('\n').trimEnd();
      let inlineHtml = renderInline(text, defs, options);
      return `<p>${inlineHtml}</p>\n`;
    }
    case 'heading': {
      let inlineHtml = renderInline(node.text, defs, options);
      return `<h${node.level}>${inlineHtml}</h${node.level}>\n`;
    }
    case 'hr': {
      return '<hr>\n';
    }
    case 'fenced_code': {
      let escaped = escapeHtml(node.lines.join('\n'));
      let lang = node.info ? node.info.split(/\s+/)[0] : '';
      let classAttr = lang ? ` class="language-${escapeAttr(lang)}"` : '';
      return `<pre><code${classAttr}>${escaped}\n</code></pre>\n`;
    }
    case 'indented_code': {
      let escaped = escapeHtml(node.lines.join('\n'));
      return `<pre><code>${escaped}\n</code></pre>\n`;
    }
    case 'html_block': {
      let content = node.lines.join('\n');
      return gfmTagFilter(content) + '\n';
    }
    case 'blockquote': {
      let inner = node.children.map(c => renderNode(c, defs, options)).join('');
      return `<blockquote>\n${inner}</blockquote>\n`;
    }
    case 'list': {
      let tag = node.isOrdered ? 'ol' : 'ul';
      let startAttr = (node.isOrdered && node.start !== 1) ? ` start="${node.start}"` : '';
      let itemsHtml = node.children.map(c => renderNode(c, defs, { ...options, tight: node.tight })).join('');
      return `<${tag}${startAttr}>\n${itemsHtml}</${tag}>\n`;
    }
    case 'list_item': {
      if (node.children.length === 0) return '<li></li>\n';

      let isTight = options.tight;
      let inner = '';

      for (let i = 0; i < node.children.length; i++) {
        let child = node.children[i];
        if (child.type === 'paragraph' && isTight) {
          let text = child.lines.join('\n').trimEnd();
          inner += renderInline(text, defs, { ...options, isFirstInListItem: i === 0 });
        } else {
          inner += renderNode(child, defs, { ...options, isFirstInListItem: i === 0 });
        }
      }

      return `<li>${inner}</li>\n`;
    }
    case 'table': {
      let html = '<table>\n<thead>\n<tr>\n';
      for (let i = 0; i < node.header.length; i++) {
        let align = node.align[i];
        let alignAttr = align ? ` align="${align}"` : '';
        let cellHtml = renderInline(node.header[i], defs, options);
        html += `<th${alignAttr}>${cellHtml}</th>\n`;
      }
      html += '</tr>\n</thead>\n';

      if (node.rows.length > 0) {
        html += '<tbody>\n';
        for (let row of node.rows) {
          html += '<tr>\n';
          for (let i = 0; i < node.header.length; i++) {
            let align = node.align[i];
            let alignAttr = align ? ` align="${align}"` : '';
            let cellText = i < row.length ? row[i] : '';
            let cellHtml = renderInline(cellText, defs, options);
            html += `<td${alignAttr}>${cellHtml}</td>\n`;
          }
          html += '</tr>\n';
        }
        html += '</tbody>\n';
      }
      html += '</table>\n';
      return html;
    }
    default:
      return '';
  }
}

export function parse(markdown) {
  if (!markdown) return '';
  const { root, defs } = parseBlocks(markdown);
  return renderNode(root, defs);
}
