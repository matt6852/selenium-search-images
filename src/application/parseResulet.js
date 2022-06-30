const { Builder, By, Key, until } = require("selenium-webdriver");
const { parse } = require("node-html-parser");
const miniO = "https://minio.intexco.org/test/";

/////////////      Yandex      ////

const parseYandexImages = async (img) => {
  // const img =
  //   "https://avatars.mds.yandex.net/get-images-cbir/995469/p2YEgbYCQGjvltx0jfwccA705/ocr";
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.get(
      `https://yandex.ru/images/search?lr=213&rpt=imageview&url=${miniO}${img}`
    );
    const btn = await driver
      .findElement(By.className("CbirSites-Items"))
      .getAttribute("innerHTML");
    const root = parse(btn);
    const links = root
      .querySelectorAll("a")
      .map((tag) => {
        const btn = {
          resultName: tag.lastChild.innerText,
          link: tag.attributes.href,
          type: "YandexSearch",
        };
        return btn;
      })
      .filter((a, i, arr) => a.resultName && a.link !== arr[i + 1]?.link);

    await driver.quit();
    return links;
  } catch (e) {
    console.log(e);
    await driver.quit();
    return [];
  }
};

////////       Gooogle      ///////

const parseGoogleImages = async (img) => {
  // const img =
  //   "https://avatars.mds.yandex.net/get-images-cbir/995469/p2YEgbYCQGjvltx0jfwccA705/ocr";
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.get(`https://www.google.ru/imghp?hl=ru`);
    const btn = await driver.findElement(By.className("ZaFQO"));
    //   .getAttribute("innerHTML");
    await btn.click();
    const test = await driver
      .findElement({ name: "image_url" })
      .sendKeys(`${miniO}${img}`, Key.RETURN);
    const result = await driver
      .findElement({ id: "search" })
      .getAttribute("innerHTML");
    const root = parse(result);
    const links = root
      .querySelectorAll("a")
      .map((tag) => {
        const btn = {
          resultName: tag.innerText,
          link: tag.attributes.href,
          type: "GoogleSearch",
        };
        return btn;
      })
      .filter(
        (a, i, arr) =>
          a.resultName &&
          a.link !== arr[i + 1]?.link &&
          a.resultName !== "Сохраненная&nbsp;копия"
      );
    await driver.quit();
    // console.log(links, "links");
    return links;
  } catch (e) {
    console.log(e);
    await driver.quit();
    return [];
  }
};

module.exports = { parseYandexImages, parseGoogleImages };
