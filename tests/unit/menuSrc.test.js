import { describe, it, expect } from 'vitest';
import { isTrustedMenuSrc } from '../../src/script.js';

describe('isTrustedMenuSrc', () => {
  // --- Valid paths ---
  it('accepts a plain relative json filename', () => {
    expect(isTrustedMenuSrc('menu.json')).toBe(true);
  });

  it('accepts a relative path with subdirectory', () => {
    expect(isTrustedMenuSrc('data/menu.json')).toBe(true);
  });

  it('accepts a filename with hyphens and underscores', () => {
    expect(isTrustedMenuSrc('my-menu_v2.json')).toBe(true);
  });

  // --- Absolute URLs ---
  it('rejects an http URL', () => {
    expect(isTrustedMenuSrc('http://evil.com/menu.json')).toBe(false);
  });

  it('rejects an https URL', () => {
    expect(isTrustedMenuSrc('https://evil.com/menu.json')).toBe(false);
  });

  it('rejects a data: URI', () => {
    expect(isTrustedMenuSrc('data:application/json,{}')).toBe(false);
  });

  it('rejects a javascript: URI', () => {
    expect(isTrustedMenuSrc('javascript:alert(1)')).toBe(false);
  });

  // --- Protocol-relative ---
  it('rejects a protocol-relative URL', () => {
    expect(isTrustedMenuSrc('//evil.com/menu.json')).toBe(false);
  });

  // --- Absolute paths ---
  it('rejects an absolute path starting with /', () => {
    expect(isTrustedMenuSrc('/etc/passwd.json')).toBe(false);
  });

  // --- Path traversal ---
  it('rejects a path with ..', () => {
    expect(isTrustedMenuSrc('../secret.json')).toBe(false);
  });

  it('rejects a path with .. in the middle', () => {
    expect(isTrustedMenuSrc('data/../secret.json')).toBe(false);
  });

  // --- Non-JSON extension ---
  it('rejects a .js file', () => {
    expect(isTrustedMenuSrc('menu.js')).toBe(false);
  });

  it('rejects a file with no extension', () => {
    expect(isTrustedMenuSrc('menu')).toBe(false);
  });

  it('rejects a .txt file', () => {
    expect(isTrustedMenuSrc('menu.txt')).toBe(false);
  });

  // --- Special characters ---
  it('rejects a path with spaces', () => {
    expect(isTrustedMenuSrc('my menu.json')).toBe(false);
  });

  it('rejects a path with query string', () => {
    expect(isTrustedMenuSrc('menu.json?foo=bar')).toBe(false);
  });

  it('rejects a path with hash', () => {
    expect(isTrustedMenuSrc('menu.json#section')).toBe(false);
  });

  // --- Edge cases ---
  it('rejects an empty string', () => {
    expect(isTrustedMenuSrc('')).toBe(false);
  });

  it('rejects a whitespace-only string', () => {
    expect(isTrustedMenuSrc('   ')).toBe(false);
  });

  it('rejects undefined', () => {
    expect(isTrustedMenuSrc(undefined)).toBe(false);
  });

  it('rejects null', () => {
    expect(isTrustedMenuSrc(null)).toBe(false);
  });

  it('rejects a number', () => {
    expect(isTrustedMenuSrc(42)).toBe(false);
  });
});
