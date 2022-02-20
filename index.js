const puppeteer = require('puppeteer');
const fs = require('fs');

async function sourcecode(url) {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-gpu",
        ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(url, {
        timeout: 0,
        waitUntil: 'domcontentloaded', // 'domcontentloaded' || 'networkidle0'
    });
    const pageSource = await page.content();
    if (!!pageSource) {
        fs.writeFileSync(process.argv[2] + 'source.html', pageSource);
    } else {
        throw Error('Unable get source');
    }

    await page.close();
    await browser.close();
}

function wait(sec) {
    return new Promise(resolve => {
        setTimeout(() => { resolve('') }, 1000 * sec);
    })
}

function checkarguments() {
    try {
        if (process.argv[2].length < 5) {
            throw Error('Missing path argument to save source.');
        }
    } catch (error) {
        throw Error('Missing path argument to save source.');
    }
}

async function mainloop(url, waittime) {
    checkarguments();

    while (true) {
        await wait(waittime);
        sourcecode(url);//.then(() => console.log('source saved'));
    }
}



// mainloop(website, seconds)
mainloop('https://www.pelando.com.br/recentes', 20);
