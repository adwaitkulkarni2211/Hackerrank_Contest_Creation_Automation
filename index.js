require("dotenv").config();
const puppeteer = require("puppeteer");

async function run() {
  //launch browser
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--start-maximized"],
    defaultViewport: null,
  });
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

  //creating 3 contests
  for (let i = 1; i <= 3; i++) {
    //opening create contest page in 3 different tabs
    const p = await browser.newPage();
    await p.goto("https://www.hackerrank.com/administration/contests/create");

    //entering contest details
    await p.waitForSelector("input#name");
    await p.type("input#name", "Contest" + i, { delay: 30 });

    await p.waitForSelector("input#startdate");
    await p.type("input#startdate", "11/" + (i + 10) + "/2021", { delay: 30 });

    await p.waitForSelector("input#starttime");
    await p.type("input#starttime", "15:00", { delay: 30 });

    await p.waitForSelector("input#enddate");
    await p.type("input#enddate", "11/" + (i + 10) + "/2021", { delay: 30 });

    await p.waitForSelector("input#endtime");
    await p.type("input#endtime", "17:00", { delay: 30 });

    //selecting 4th option from dropdown
    await p.waitForSelector("a[href='javascript:void(0)']");
    await p.click("a[href='javascript:void(0)']");
    for (let j = 0; j < 4; j++) {
      await p.keyboard.press("ArrowDown");
    }
    await p.keyboard.press("Enter");

    await p.waitForSelector("input#organization_name");
    await p.type("input#organization_name", "trial", { delay: 30 });

    await p.waitForSelector("button[data-analytics='CreateContestButton']");
    await p.click("button[data-analytics='CreateContestButton']");
  }
}

run();
