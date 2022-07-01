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
    const stop = await driver
      .findElement(
        By.className("CbirSection CbirSection_decorated CbirOtherSizes")
      )
      .getAttribute("innerText");

    if (stop.split(" ").find((el) => el === "найдено")) {
      await driver.quit();
      return [];
    }

    const btn = await driver
      .findElement(By.className("CbirSites-Items"))
      .getAttribute("innerHTML");
    const root = parse(btn);
    const links = root
      .querySelectorAll("a")
      .map((tag) => {
        const parseObj = {
          resultName: tag.lastChild.innerText,
          link: tag.attributes.href,
          type: "YandexSearch",
        };
        return parseObj;
      })
      .filter((a, i, arr) => a.resultName && a.link !== arr[i + 1]?.link);

    await driver.quit();
    return links.slice(0, 10);
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
    const stop = await driver
      .findElement(By.className("O1id0e"))
      .getAttribute("innerHTML");
    if (stop === "Изображения других размеров не найдены") {
      await driver.quit();
      return [];
    }
    // console.log(stop);

    const result = await driver.findElements({ className: "ULSxyf" });
    const last = result.pop();

    const render = await last.getAttribute("innerHTML");
    // console.log(result, "result");
    const root = parse(render);
    const links = root
      .querySelectorAll("a")
      .map((tag) => {
        const parseObj = {
          resultName: tag.innerText,
          link: tag.attributes.href,
          type: "GoogleSearch",
        };
        return parseObj;
      })
      .filter(
        (a, i, arr) =>
          a.resultName &&
          a.link !== arr[i + 1]?.link &&
          a.resultName !== "Сохраненная&nbsp;копия" &&
          a.resultName !== "Похожие изображения"
      );
    await driver.quit();
    // console.log(links, "links");
    return links.slice(0, 10);
  } catch (e) {
    console.log(e);
    await driver.quit();
    return [];
  }
};

module.exports = { parseYandexImages, parseGoogleImages };
