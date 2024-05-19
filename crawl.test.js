import { normalizeURL, getURLSfromHTML } from "./crawl.js";
import { test, expect } from "@jest/globals";

test("normalizeURL strip protocol", () => {
  const input = "https://google.com/path";
  const actual = normalizeURL(input);
  const expected = "google.com/path";
  expect(actual).toEqual(expected);
});

test("normalizeURL strip trailing slash", () => {
  const input = "https://google.com/path/";
  const actual = normalizeURL(input);
  const expected = "google.com/path";
  expect(actual).toEqual(expected);
});

test("normalizeURL capitals", () => {
  const input = "https://Google.com/path/";
  const actual = normalizeURL(input);
  const expected = "google.com/path";
  expect(actual).toEqual(expected);
});

test("normalizeURL strip http", () => {
  const input = "http://Google.com/path/";
  const actual = normalizeURL(input);
  const expected = "google.com/path";
  expect(actual).toEqual(expected);
});

test("getURLSFromhtml absolute", () => {
  const htmlBody = `
  <html>
  <body>
  <a href="https://blog.boot.dev/path">
  Boot.dev blog
  </body>
 </html> 
  `;
  const baseURL = "https://blog.boot.dev/path";
  const actual = getURLSfromHTML(htmlBody, baseURL);
  const expected = ["https://blog.boot.dev/path"];
  expect(actual).toEqual(expected);
});

test("getURLSFromhtml relative", () => {
  const htmlBody = `
  <html>
  <body>
  <a href="/path/">
  Boot.dev blog
  </body>
 </html> 
  `;
  const baseURL = "https://blog.boot.dev";
  const actual = getURLSfromHTML(htmlBody, baseURL);
  const expected = ["https://blog.boot.dev/path/"];
  expect(actual).toEqual(expected);
});

test("getURLSFromhtml relative & double", () => {
  const htmlBody = `
  <html>
    <body>
      <a href="https://blog.boot.dev/path1/">
        Boot.dev blog path 1
      </a>
      <a href="/path2/">
        Boot.dev blog path 2
      </a>
  </body>
 </html> 
  `;
  const baseURL = "https://blog.boot.dev";
  const actual = getURLSfromHTML(htmlBody, baseURL);
  const expected = [
    "https://blog.boot.dev/path1/",
    "https://blog.boot.dev/path2/",
  ];
  expect(actual).toEqual(expected);
});

test("getURLSFromhtml invalid", () => {
  const htmlBody = `
  <html>
  <body>
  <a href="invalid">
  invalid url
  </body>
 </html> 
  `;
  const baseURL = "https://blog.boot.dev";
  const actual = getURLSfromHTML(htmlBody, baseURL);
  const expected = [];
  expect(actual).toEqual(expected);
});
