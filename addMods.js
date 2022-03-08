require("dotenv").config();
const puppeteer = require("puppeteer");
const fs = require("fs");

const modsJSON = fs.readFileSync("./mods.json", "utf-8");
const mods = JSON.parse(modsJSON);

async function run() {
  //launch browser
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--start-maximized"],
    defaultViewport: null,
  });
  console.log(browser);
  //store page in page variable
  const pages = await browser.pages();
  const page = pages[0];

  //navigate to the url
  await page.goto("https://hackerrank.com/");

  //click login
  await page.waitForSelector("a[data-event-action='Login']");
  await page.click("a[data-event-action='Login']");

  //click login
  await page.waitForSelector("a[href='https://www.hackerrank.com/login']");
  await page.click("a[href='https://www.hackerrank.com/login']");

  //enter username and password
  await page.waitForSelector("input[name='username']");
  await page.type("input[name='username']", process.env.USERID, { delay: 30 });

  await page.waitForSelector("input[name='password']");
  await page.type("input[name='password']", process.env.PASSWORD, {
    delay: 30,
  });

  await page.waitForSelector("button[data-analytics='LoginPassword']");
  await page.click("button[data-analytics='LoginPassword']");

  //click login
  await page.waitForSelector("a[data-analytics='NavBarContests']");
  await page.click("a[data-analytics='NavBarContests']");

  //click compete
  await page.waitForSelector("a[href='/contests']");
  await page.click("a[href='/contests']");

  //click manage contests
  await page.waitForSelector("a[href='/administration/contests/']");
  await page.click("a[href='/administration/contests/']");

  //find number of pages of contests
  await page.waitForSelector("a[data-attr1='Last']");
  const numPages = await page.$eval("a[data-attr1='Last']", (atag) => {
    const totPages = parseInt(atag.getAttribute("data-page"));
    return totPages;
  });

  for (let i = 0; i < numPages; i++) {
    await handleAllContestsOfPage(page, browser);

    if (i != numPages) {
      await page.waitForSelector("a[data-attr1='Right']");
      await page.click("a[data-attr1='Right']");
    }
  }

  page.close();
}

async function handleAllContestsOfPage(page, browser) {
  //find all urls of the contest pages
  await page.waitForSelector("a.backbone.block-center");
  let contest_urls = await page.$$eval("a.backbone.block-center", (atags) => {
    let urls = [];

    for (let i = 0; i < atags.length; i++) {
      let url = atags[i].getAttribute("href");
      urls.push(url);
    }

    return urls;
  });

  //console.log(contest_urls);

  for (let i = 0; i < contest_urls.length; i++) {
    let ctab = await browser.newPage();

    await saveModToContest(ctab, "https://hackerrank.com" + contest_urls[i]);

    await ctab.waitFor(1000);

    await ctab.close();
    //console.log("ctab closed");

    //console.log("waiting for 3 secs on page");
    await page.waitFor(3000);
    //console.log("3 sec wait on page over");
  }
}

async function saveModToContest(ctab, url) {
  await ctab.bringToFront();
  //console.log("ctab is now in focus");
  await ctab.goto(url);
  //console.log("url visited");

  //console.log("waiting for 3 secs on ctab");
  await ctab.waitFor(3000);
  //console.log("3 sec wait on ctab over");

  //click on moderators
  //console.log("waiting for moderators button");
  await ctab.waitForSelector("li[data-tab='moderators']");
  await ctab.click("li[data-tab='moderators']");
  //console.log("clicked on moderators");

  //type in moderators
  for (let j = 0; j < mods.moderators.length; j++) {
    await ctab.waitForSelector("input#moderator");
    await ctab.type("input#moderator", mods.moderators[j], { delay: 50 });
    await ctab.keyboard.press("Enter");
  }
}

run();
