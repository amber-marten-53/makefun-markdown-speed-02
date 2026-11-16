import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from './parse.js';

const inputDir = process.env.MAKEFUN_INPUT_DIR ?? '/input';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const casesJson = readFileSync(join(inputDir, 'cases.json'), 'utf8');
const cases = JSON.parse(casesJson) as { id: string; markdown: string }[];

const results = cases.map(c => parse(c.markdown));

writeFileSync(join(outputDir, 'html.json'), JSON.stringify(results));
