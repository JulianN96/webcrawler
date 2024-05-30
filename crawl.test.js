import { test, expect, jest } from '@jest/globals';
import { normalizeURL, getURLsFromHTML } from './crawl';

test('Tests for normalize url validity', () => {
  expect(normalizeURL('https://google.com')).toBe('google.com/');
});
test('Tests for normalize url validity', () => {
  expect(normalizeURL('https://link.com/path')).toBe('link.com/path');
});
test('Tests for normalize url validity', () => {
  expect(normalizeURL('https://www.anotherlink.com/path/longer')).toBe('www.anotherlink.com/path/longer');
});

test('Tests for getting URLs from HTML', () => {
  const html = `
    <html>
      <body>
        <a href="https://example.com">Example</a>
        <a href="/relative/path">Relative Path</a>
        <a href="another/relative/path">Another Relative Path</a>
      </body>
    </html>
  `;

  const baseURL = 'https://base.com';
  const expectedLinks = [
    'https://example.com/',
    'https://base.com/relative/path',
    'https://base.com/another/relative/path'
  ];
  expect(getURLsFromHTML(html, baseURL)).toEqual(expectedLinks);
});