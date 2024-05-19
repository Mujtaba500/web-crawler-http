import { crawlPage, listOfEmails } from "./crawl.js";

async function main() {
  if (process.argv.length < 3) {
    console.log("No website provided");
    process.exit(1);
  }
  if (process.argv.length > 3) {
    console.log("Too many command line args");
    process.exit(1);
  }
  const baseURL = process.argv[2];
  console.log(`Started crawl of ${baseURL}`);

  //   const pages = await crawlPage(baseURL, baseURL, {});

  //   const emails = [];
  //   for (const page of Object.keys(pages)) {
  //     console.log(page);
  //   }

  await crawlPage(baseURL, baseURL, {});

  console.log(listOfEmails);
}

main();
