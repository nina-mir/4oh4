const puppeteer = require('puppeteer');
const fs = require('fs');
const data = require('./data/claude-Top-100-Tech-Companies-UserBase.json');
const path = require('path');
const urlMaker = require('./url-maker'); // to make a valid url for puppeteer


// import the url list 
let urlList = [];
for (const item of data) {
    urlList.push(item.url)
};

// design a path and directory tree to store the info 
// scraped HTML is stored in /scraped-html
// screenshots are stored in /screenshots
const htmlStorage = path.join(__dirname, 'scraped-html');
const imageStorage = path.join(__dirname, 'screenshots');

(async () => {
    const browser = await puppeteer.launch({ headless: true });

    for (let i = 5; i < urlList.length ; i++) {
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
            await page.goto(validUrl, { waitUntil: 'networkidle2' });

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
            console.error(`Error scraping ${urlList[i]}:`, error);
        } finally {
            await page.close();
        }

        // Small delay to avoid hitting the server too fast
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    await browser.close();
})();





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
