import puppeteer from "puppeteer";

import { logger } from "@lib/logger";

import type { Browser, Page } from "puppeteer";

const aocUrl = "https://adventofcode.com";

export async function getProblemInput(
  year: number | string,
  day: number | string,
): Promise<string | null> {
  const aocInputUrl = `${aocUrl}/${year}/day/${day}/input`;
  const { AOC_SESSION, AOC_SESSION_EXPIRATION } = process.env;
  let text = null;

  if (AOC_SESSION === undefined || AOC_SESSION_EXPIRATION === undefined) {
    return text;
  }

  let browser: Browser | undefined;
  let page: Page | undefined;

  try {
    browser = await puppeteer.launch({ headless: "shell" });
    page = await browser.newPage();

    await page.setCookie({
      name: "session",
      value: AOC_SESSION,
      domain: ".adventofcode.com",
      path: "/",
      expires: new Date(AOC_SESSION_EXPIRATION).getTime(),
      httpOnly: true,
      secure: true,
      priority: "Medium",
    });

    const [response] = await Promise.all([
      page.waitForResponse(aocInputUrl),
      page.goto(aocInputUrl),
    ]);
    if (response.ok()) {
      text = await response.text();
      logger.log(text);
    } else {
      logger.error("Something went wrong fetching the data");
      logger.error(`${response.status()}: ${response.url()}`);
    }
  } catch (error) {
    logger.error(error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  return text;
}
