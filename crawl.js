import { JSDOM } from "jsdom";

async function crawlPage(currentURL) {
  console.log(`Actively crawling ${currentURL}`);

  try {
    const res = await fetch(currentURL);
    if (res.status > 399) {
      console.log(
        `error with status code: ${res.status} on page: ${currentURL}`
      );
      return;
    }

    const contentType = res.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.log(
        `non html response, content type : ${contentType}, on page: ${currentURL} `
      );
      return;
    }
    console.log(await res.text());
  } catch (err) {
    console.log(`error in fetch: ${err.message}, on page: ${currentURL}`);
  }
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
