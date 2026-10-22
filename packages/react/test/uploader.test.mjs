import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  DropZone,
  FileItem,
  FileUploader,
  MediaUploader,
  defaultUploaderMessages,
  formatFileSize,
  matchesAccept,
  validateFiles,
} from '../dist/index.js';

const r = (el) => renderToStaticMarkup(el);
const MB = 1024 * 1024;
const files = [
  { id: 'a', name: 'Passport-scan-front.pdf', size: 2.4 * MB, status: 'uploading', progress: 64 },
  { id: 'b', name: 'Contract.pdf', size: 2.4 * MB, status: 'done' },
  { id: 'c', name: 'Big.pdf', status: 'error', error: 'Upload failed — file is over 10 MB' },
];

test('formatFileSize: B · KB · MB with one decimal under 10', () => {
  assert.equal(formatFileSize(512), '512 B');
  assert.equal(formatFileSize(2.4 * MB), '2.4 MB');
  assert.equal(formatFileSize(12 * MB), '12 MB');
  assert.equal(formatFileSize(1536), '1.5 KB');
});

test('matchesAccept: extension, wildcard MIME and exact MIME', () => {
  const pdf = { name: 'Scan.PDF', type: 'application/pdf' };
  const png = { name: 'a.png', type: 'image/png' };
  assert.equal(matchesAccept(pdf, '.pdf,.jpg'), true);
  assert.equal(matchesAccept(png, 'image/*'), true);
  assert.equal(matchesAccept(png, 'application/pdf'), false);
  assert.equal(matchesAccept(png, undefined), true);
});

test('validateFiles: type, size and single-file rules', () => {
  const f = (name, type, size) => ({ name, type, size });
  const { accepted, rejected } = validateFiles(
    [
      f('a.pdf', 'application/pdf', MB),
      f('b.exe', 'application/x', MB),
      f('c.pdf', 'application/pdf', 20 * MB),
      f('d.pdf', 'application/pdf', MB),
    ],
    { accept: '.pdf', maxSize: 10 * MB },
  );
  assert.deepEqual(
    accepted.map((x) => x.name),
    ['a.pdf'],
  );
  assert.deepEqual(
    rejected.map((x) => x.reason),
    ['file-invalid-type', 'file-too-large', 'too-many-files'],
  );
  assert.equal(
    validateFiles([f('a.pdf', '', 1), f('b.pdf', '', 1)], { multiple: true }).accepted.length,
    2,
  );
  assert.equal(defaultUploaderMessages.tooLarge(10 * MB), 'Upload failed — file is over 10 MB');
});

test('FileItem: uploading shows size · percent and a named progressbar', () => {
  const html = r(
    h(
      'ul',
      null,
      h(FileItem, {
        name: 'Passport-scan-front.pdf',
        status: 'uploading',
        fileSize: 2.4 * MB,
        progress: 64,
        onRemove: () => {},
      }),
    ),
  );
  assert.match(html, /<li class="bek-file-item bek-file-item--uploading">/);
  assert.match(html, /bek-file-item__meta">2\.4 MB · 64%</);
  assert.match(
    html,
    /role="progressbar"[^>]*aria-valuenow="64"[^>]*aria-label="Passport-scan-front\.pdf"/,
  );
  assert.match(html, /bek-button--flat bek-button--m bek-button--icon-only/);
  assert.match(html, /bek-visually-hidden">Remove Passport-scan-front\.pdf</);
});

test('FileItem: error shows reason, alert icon and Retry; done has no remove without handler', () => {
  const err = r(
    h(FileItem, {
      name: 'Big.pdf',
      status: 'error',
      meta: 'File is over 10 MB',
      onRetry: () => {},
    }),
  );
  assert.match(err, /bek-file-item--error/);
  assert.match(err, /bek-file-item__meta">File is over 10 MB</);
  assert.match(
    err,
    /<button type="button" class="bek-link bek-link--accent bek-link--s[^"]*">Retry<\/button>/,
  );
  const done = r(h(FileItem, { name: 'a.pdf', fileSize: 1024 }));
  assert.match(done, /bek-file-item--done/);
  assert.match(done, /1\.0 KB/);
  assert.doesNotMatch(done, /bek-button/);
  assert.doesNotMatch(done, /progressbar/);
});

test('FileUploader: hidden real file input, Button L/XL and a file list', () => {
  const html = r(
    h(FileUploader, { accept: '.pdf', multiple: true, name: 'docs', files, onRetry: () => {} }),
  );
  assert.match(
    html,
    /^<div class="bek-uploader bek-file-uploader bek-file-uploader--m" aria-busy="true">/,
  );
  assert.match(
    html,
    /<input type="file" accept="\.pdf" multiple="" tabindex="-1" aria-hidden="true" class="bek-visually-hidden" name="docs" aria-label="Upload file"\/>/,
  );
  assert.match(html, /bek-button--normal bek-button--l/);
  assert.match(html, /Upload another/);
  assert.equal(html.match(/<li class="bek-file-item/g).length, 3);
  assert.match(html, /role="status"/);
  const l = r(h(FileUploader, { size: 'l', disabled: true }));
  assert.match(l, /bek-file-uploader--l bek-uploader--disabled/);
  assert.match(l, /bek-button--xl/);
  assert.match(l, /Upload file/);
  assert.doesNotMatch(l, /<ul/);
});

test('DropZone: browse button is the keyboard path and is described by the hint', () => {
  const html = r(h(DropZone, { hint: 'PDF · up to 10 MB', files: files.slice(2) }));
  assert.match(html, /class="bek-uploader bek-drop-zone bek-drop-zone--error"/);
  assert.match(
    html,
    /Drag files here or <button type="button" class="bek-link bek-link--accent bek-link--m bek-focus-ring bek-uploader__link" aria-describedby="(bek-drop-zone-hint-[^"]+)">browse<\/button>/,
  );
  const id = html.match(/aria-describedby="(bek-drop-zone-hint-[^"]+)"/)[1];
  assert.match(html, new RegExp(`<p class="bek-drop-zone__hint" id="${id}">PDF · up to 10 MB</p>`));
  assert.match(html, /<input type="file"[^>]*aria-label="browse"/);
  const off = r(h(DropZone, { disabled: true }));
  assert.match(off, /bek-uploader--disabled/);
  assert.match(off, /<button type="button" [^>]*disabled=""/);
});

test('MediaUploader: empty, loading, filled and error tiles', () => {
  const empty = r(h(MediaUploader, {}));
  assert.match(empty, /bek-media-uploader bek-media-uploader--photo bek-media-uploader--s/);
  assert.match(empty, /accept="image\/\*"/);
  assert.match(
    empty,
    /<button type="button" class="bek-media-uploader__tile bek-media-uploader__action bek-focus-ring">/,
  );
  assert.match(empty, /bek-media-uploader__label">Add photo</);
  const noLabel = r(h(MediaUploader, { kind: 'video', size: 'l', showLabel: false }));
  assert.match(noLabel, /bek-media-uploader--video bek-media-uploader--l/);
  assert.match(noLabel, /aria-label="Add video"/);
  assert.doesNotMatch(noLabel, /bek-media-uploader__label/);
  const loading = r(h(MediaUploader, { size: 'm', status: 'uploading', progress: 64 }));
  assert.match(
    loading,
    /role="progressbar" aria-label="Uploading" aria-valuemin="0" aria-valuemax="100" aria-valuenow="64"/,
  );
  assert.match(loading, /64%/);
  assert.match(loading, /bek-spinner/);
  const filled = r(
    h(MediaUploader, {
      kind: 'video',
      src: '/p.jpg',
      alt: 'Clip',
      coverBadge: true,
      duration: '0:24',
      onRemove: () => {},
    }),
  );
  assert.match(filled, /bek-media-uploader--filled/);
  assert.match(filled, /<img src="\/p\.jpg" alt="Clip"\/>/);
  assert.match(filled, /bek-button--raised bek-button--m bek-button--icon-only/);
  assert.match(filled, /Remove video: Clip/);
  assert.match(filled, /bek-media-uploader__cover"><span class="bek-badge__label">Main</);
  assert.match(filled, /bek-media-uploader__duration"><span class="bek-badge__label">0:24</);
  const error = r(h(MediaUploader, { status: 'error' }));
  assert.match(error, /bek-media-uploader--error/);
  assert.match(error, />Retry</);
});
