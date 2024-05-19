import { listOfEmails } from "./crawl.js";

function printReport() {
  console.log("=======");
  console.log("REPORT");
  console.log("=======");

  for (const email of listOfEmails) {
    console.log(email[0]);
  }
}

export { printReport };
