// source: 
// https://screenshotone.com/blog/how-to-hide-cookie-banners-when-taking-a-screenshot-with-puppeteer/#a-custom-but-generic-logic-for-every-site
// extension source: 
// https://stackoverflow.com/questions/59618456/pupeteer-how-can-i-accept-cookie-consent-prompts-automatically-for-any-url
// https://gist.github.com/jirivrany/fa16f25d25142a074ab3ca14fe987eee


const puppeteer = require('puppeteer');
const fs = require('fs');
const data = require('./data/claude-Top-100-Tech-Companies-UserBase.json');
const path = require('path');
const urlMaker = require('./url-maker'); // to make a valid url for puppeteer


// import the url list 
let urlList = [
    "www.broadcom.com",
    "www.crowdstrike.com",
    "www.zoom.us"
];
// for (const item of data) {
//     urlList.push(item.url)
// };

// design a path and directory tree to store the info 
// scraped HTML is stored in /scraped-html
// screenshots are stored in /screenshots
const htmlStorage = path.join(__dirname, 'scrapedData/html-extensions');
const imageStorage = path.join(__dirname, 'scrapedData/screenshots-extensions');

(async () => {
    const pathToExtension = require('path').join(__dirname, 'extensions/3.4.5_0');

    const browser = await puppeteer.launch({
        // headless: true,
        args: [
            `--disable-extensions-except=${pathToExtension}`,
            `--load-extension=${pathToExtension}`,
        ],
    });

    for (let i = 0; i < urlList.length; i++) {
        const page = await browser.newPage();

        // await page.setViewport({
        //     width: 720,
        //     height: 540,
        //     deviceScaleFactor: 2,
        // });

        console.log(`Scraping: ${urlList[i]}`);

        const validUrl = urlMaker(urlList[i], 'trans-rights-are-human-rights')


        const imagePath = path.join(imageStorage, `${urlList[i]}.png`)

        try {
            await page.goto(validUrl, { waitUntil: ['load', 'domcontentloaded', 'networkidle0'] });

            // await page.evaluate(_ => {
            //     const selector = 'a[id*=cookie i], a[class*=cookie i], button[id*=cookie i] , button[class*=cookie i]';
            //     const expectedText = /^(Accept|Accept all cookies|Agree|Accept all|Allow|Allow all|Allow all cookies|OK)$/gi;
            //     const elements = document.querySelectorAll(selector);
            //     for (const element of elements) {
            //         if (element.textContent.trim().match(expectedText)) {
            //             element.click();
            //             return;
            //         }
            //     }
            // });
            /* 
            Interaction with cookie consent pop-ups can cause your code to break i
            f the page reloads (page navigation error). To circumvent this, I use a fixed time 
            delay of 3000-4000 ms after await page.evaluate( ... );
            */
            // const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
            // await delay(3500);

            // Take a screenshot
            await page.screenshot({ path: imagePath, fullPage: true });

            // Get the HTML content
            const html = await page.content();

            console.log(`Captured HTML for: ${urlList[i]}`);

            const htmlPath = path.join(htmlStorage, `${data[i].name}.html`)

            fs.writeFile(htmlPath, html.toString(), (err) => {
                if (err) {
                    console.log('🚒🧨error occured in writing to file! ', htmlPath)
                } else {
                    console.log('✅file written successfully!✨')
                }
            })

        } catch (error) {
            console.error(`Error scraping ${urlList[i]}:`);
            fs.writeFile('Error-log-EXTENSIONS.out', error.toString(), (err) => {
                if (err) {
                    console.error('🚒🧨error occured in writing to Error log!')
                }
            })
        } finally {
            await page.close();
        }

        // Small delay to avoid hitting the server too fast
        await wait(3500);
    }

    await browser.close();
})();


async function wait(delay) {
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, delay);
    });
}


// (async () => {


//     const browser = await puppeteer.launch({ headless: true }); // Run in headless mode
//     const page = await browser.newPage();

//     await page.goto(urlCashapp, { waitUntil: 'networkidle2' });

//     // Take a screenshot of the 404 page
//     await page.screenshot({ path: '404_page_cashapp.png', fullPage: true });

//     // Get and log the HTML content
//     const html = await page.content();
//     console.log(html);
//     fs.writeFile('4040cashapp.html', html.toString(), (err) => {
//         if (err){
//             console.log('error occured in writing to file!')
//         } else {
//             console.log('fiel written successfully!')
//         }
//     })

//     await browser.close();
//     console.log("Screenshot saved, HTML captured.");
// })();
