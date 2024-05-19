import { JSDOM } from "jsdom";

async function crawlPage(baseURL, currentURL, pages) {
  const baseURLObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL);

  if (baseURLObj.hostname !== currentURLObj.hostname) {
    return pages;
  }

  const normalizedCurrentURL = normalizeURL(currentURL);
  if (pages[normalizedCurrentURL] > 0) {
    pages[normalizedCurrentURL]++;
    return pages;
  }
  pages[normalizedCurrentURL] = 1;

  console.log(`Actively crawling ${currentURL}`);

  try {
    const res = await fetch(currentURL);
    if (res.status > 399) {
      console.log(
        `error with status code: ${res.status} on page: ${currentURL}`
      );
      return pages;
    }

    const contentType = res.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.log(
        `non html response, content type : ${contentType}, on page: ${currentURL} `
      );
      return pages;
    }

    const htmlBody = await res.text();

    const nextURLs = getURLSfromHTML(htmlBody, baseURL);

    for (const nextURL of nextURLs) {
      pages = await crawlPage(baseURL, nextURL, pages);
    }
  } catch (err) {
    console.log(`error in fetch: ${err.message}, on page: ${currentURL}`);
  }
  return pages;
}

function getURLSfromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkEelements = dom.window.document.querySelectorAll("a");
  for (const linkele of linkEelements) {
    if (linkele.href.slice(0, 1) === "/") {
      // relative
      try {
        const urlObj = new URL(`${baseURL}${linkele.href}`);
        urls.push(urlObj.href);
      } catch (err) {
        console.log(`error with reletive url: ${err.message}`);
      }
    } else {
      // absolute
      try {
        const urlObj = new URL(linkele.href);
        urls.push(urlObj.href);
      } catch (err) {
        console.log(`error with absolute url: ${err.message}`);
      }
    }
  }
  return urls;
}

function normalizeURL(urlString) {
  const urlObj = new URL(urlString);
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
  if (hostPath.length > 0 && hostPath.slice(-1) == "/") {
    return hostPath.slice(0, -1);
  } else {
    return hostPath;
  }
}

export { normalizeURL, getURLSfromHTML, crawlPage };
