#!/usr/bin/env node
// Validates data/races/*.json against data/SCHEMA.md. No dependencies.
// Usage: node scripts/validate-data.mjs [--quiet] [--json]
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = new Set(process.argv.slice(2));
const quiet = args.has('--quiet');
const asJson = args.has('--json');
const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'data', 'races');

const OFFICES = ['senate', 'governor'];
const STATUSES = ['called', 'uncalled', 'runoff'];
const PARTIES = ['Democratic', 'Republican', 'Independent', 'Libertarian', 'Green', 'Other'];
const ISSUES = ['economy', 'healthcare', 'immigration', 'education', 'climate', 'abortion'];
const JUDGMENT = [
  'extreme', 'extremist', 'radical', 'common-sense', 'commonsense', 'disastrous',
  'failed', 'failing', 'dangerous', 'reckless', 'devastating', 'terrible', 'corrupt',
];
const judgmentRe = new RegExp(`\\b(${JUDGMENT.join('|')})\\b`, 'i');

const isStr = (v) => typeof v === 'string';
const isNonEmpty = (v) => isStr(v) && v.trim() !== '';
const isUrl = (v) => isStr(v) && /^https?:\/\/\S+$/i.test(v.trim());
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const stripQuotes = (s) => s.replace(/"[^"]*"|“[^”]*”/g, ' ');

function validate(file, issues) {
  const err = (m) => issues.push({ level: 'ERROR', message: m });
  const warn = (m) => issues.push({ level: 'WARNING', message: m });

  let r;
  try {
    r = JSON.parse(readFileSync(join(dir, file), 'utf8'));
  } catch (e) {
    err(`invalid JSON: ${e.message}`);
    return;
  }
  if (!r || typeof r !== 'object' || Array.isArray(r)) return err('top level is not an object');

  const req = (obj, key, check, desc, where = '') => {
    if (!(key in obj)) { err(`${where}missing required field "${key}"`); return false; }
    if (!check(obj[key])) { err(`${where}field "${key}" must be ${desc}`); return false; }
    return true;
  };

  req(r, 'id', isNonEmpty, 'a non-empty string');
  if (isStr(r.id) && r.id !== basename(file, '.json')) err(`id "${r.id}" does not match filename "${file}"`);
  req(r, 'state', isNonEmpty, 'a non-empty string');
  req(r, 'stateName', isNonEmpty, 'a non-empty string');
  if (req(r, 'office', isStr, 'a string') && !OFFICES.includes(r.office)) err(`office "${r.office}" not in ${OFFICES.join('|')}`);
  req(r, 'special', (v) => typeof v === 'boolean', 'a boolean');
  req(r, 'electionDate', isNonEmpty, 'a non-empty string');
  if (req(r, 'status', isStr, 'a string') && !STATUSES.includes(r.status)) err(`status "${r.status}" not in ${STATUSES.join('|')}`);
  req(r, 'winnerId', (v) => v === null || isStr(v), 'a string or null');
  req(r, 'summary', isNonEmpty, 'a non-empty string');
  req(r, 'lastVerified', isNonEmpty, 'a non-empty string');
  // crossChecked is a race-level field: the result was confirmed against a second source.
  if (r.crossChecked !== true) warn('crossChecked is not true');
  if (req(r, 'sources', Array.isArray, 'an array')) {
    r.sources.forEach((s, i) => { if (!isUrl(s)) err(`sources[${i}] is not an http(s) URL`); });
  }
  if (!req(r, 'candidates', Array.isArray, 'an array')) return;

  const ids = new Set();
  const called = r.status === 'called';
  const nums = [];
  let nullShare = false;

  r.candidates.forEach((c, ci) => {
    const w = `candidate[${ci}]${c && isStr(c.id) ? ` (${c.id})` : ''}: `;
    if (!c || typeof c !== 'object') return err(`${w}not an object`);
    if (req(c, 'id', isNonEmpty, 'a non-empty string', w)) {
      if (ids.has(c.id)) err(`${w}duplicate candidate id "${c.id}"`);
      ids.add(c.id);
    }
    req(c, 'name', isNonEmpty, 'a non-empty string', w);
    if (req(c, 'party', isStr, 'a string', w) && !PARTIES.includes(c.party)) err(`${w}party "${c.party}" not allowed`);
    if ('partyLabel' in c && !isStr(c.partyLabel)) err(`${w}partyLabel must be a string`);
    req(c, 'major', (v) => typeof v === 'boolean', 'a boolean', w);
    req(c, 'incumbent', (v) => typeof v === 'boolean', 'a boolean', w);
    if (req(c, 'voteShare', (v) => v === null || isNum(v), 'a number or null', w)) {
      if (c.voteShare === null) nullShare = true;
      else {
        nums.push(c.voteShare);
        if (c.voteShare < 0 || c.voteShare > 100) err(`${w}voteShare ${c.voteShare} outside 0-100`);
      }
    }
    req(c, 'bio', (v) => v === null || isStr(v), 'a string or null', w);
    req(c, 'website', (v) => v === null || isStr(v), 'a string or null', w);
    if (req(c, 'sources', Array.isArray, 'an array', w)) {
      c.sources.forEach((s, i) => { if (!isUrl(s)) err(`${w}sources[${i}] is not an http(s) URL`); });
    }

    const positions = Array.isArray(c.positions) ? c.positions : null;
    if (!positions) err(`${w}"positions" must be an array`);
    if (c.major === true) {
      if (c.bio === null) warn(`${w}major candidate has null bio`);
      if (c.website === null) warn(`${w}major candidate has null website`);
      if (positions && positions.length < 4) warn(`${w}major candidate has only ${positions.length} positions (<4)`);
    }
    const seen = new Set();
    (positions || []).forEach((p, pi) => {
      const pw = `${w}positions[${pi}]: `;
      if (!p || typeof p !== 'object') return err(`${pw}not an object`);
      if (req(p, 'issue', isStr, 'a string', pw)) {
        if (!ISSUES.includes(p.issue)) err(`${pw}issue "${p.issue}" not allowed`);
        else if (seen.has(p.issue)) err(`${pw}duplicate issue "${p.issue}"`);
        seen.add(p.issue);
      }
      if (req(p, 'summary', isStr, 'a string', pw) && p.summary.trim() === '') err(`${pw}empty summary`);
      if (req(p, 'source', isStr, 'a string', pw)) {
        if (!isUrl(p.source)) err(`${pw}source is not an http(s) URL`);
        else if (/wikipedia\.org|ontheissues\.org/i.test(p.source)) warn(`${pw}cites ${/wikipedia/i.test(p.source) ? 'wikipedia.org' : 'ontheissues.org'}`);
      }
      if (isStr(p.summary)) {
        const m = stripQuotes(p.summary).match(judgmentRe);
        if (m) warn(`${pw}judgment word "${m[1]}" outside quotes`);
      }
      if ('factCheckNote' in p && !isStr(p.factCheckNote)) err(`${pw}factCheckNote must be a string`);
    });
    if ('factCheckNote' in c && !isStr(c.factCheckNote)) err(`${w}factCheckNote must be a string`);
  });

  if (isStr(r.winnerId) && !ids.has(r.winnerId)) err(`winnerId "${r.winnerId}" is not among the candidates`);
  if (r.status === 'called' && r.winnerId === null) err('status "called" but winnerId is null');
  if (r.status !== 'called' && STATUSES.includes(r.status) && r.winnerId !== null) err(`status "${r.status}" but winnerId is not null`);

  if (called && nullShare) warn('called race has null voteShare');
  if (nums.length) {
    const sum = nums.reduce((a, b) => a + b, 0);
    if (sum > 100.5) err(`voteShares sum to ${sum.toFixed(2)} (>100.5)`);
    else if (sum < 98.5 && !(called && nullShare && false)) warn(`voteShares sum to ${sum.toFixed(2)} (<98.5)`);
  }
}

const files = readdirSync(dir).filter((f) => f.endsWith('.json')).sort();
const results = files.map((file) => {
  const issues = [];
  validate(file, issues);
  return { file, issues };
});

const count = (lvl) => results.reduce((n, r) => n + r.issues.filter((i) => i.level === lvl).length, 0);
const totals = { files: files.length, errors: count('ERROR'), warnings: count('WARNING') };

if (asJson) {
  const out = results
    .map((r) => ({ file: r.file, issues: quiet ? r.issues.filter((i) => i.level === 'ERROR') : r.issues }))
    .filter((r) => r.issues.length);
  console.log(JSON.stringify({ totals, results: out }, null, 2));
} else {
  for (const r of results) {
    const shown = quiet ? r.issues.filter((i) => i.level === 'ERROR') : r.issues;
    if (!shown.length) continue;
    console.log(r.file);
    for (const i of shown) console.log(`  ${i.level === 'ERROR' ? 'ERROR  ' : 'WARNING'} ${i.message}`);
    console.log();
  }
  console.log(`${totals.files} files checked: ${totals.errors} errors, ${totals.warnings} warnings`);
}
process.exit(totals.errors ? 1 : 0);
