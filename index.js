const puppeteer = require('puppeteer');
const fs = require('fs');
const { Console } = require("console"); // get the Console class


// make a new logger
const Logger = new Console({
    stdout: fs.createWriteStream("normalStdout.txt"),
    stderr: fs.createWriteStream("errStdErr.txt"),
});

// saving to normalStdout.txt file
//Logger.log("This will be saved in normalStdout.txt file");

// saving to errStdErr.txt file
//Logger.error("This will be saved in errStdErr.txt file");


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
        else if (process.argv[3].length < 5) {
            throw Error('Missing url.');
        }
        else if (process.argv[4] < 3) {
            throw Error('Time too short! (< 3 secs)');
        }
    } catch (error) {
        throw Error('Missing arguments!');
    }
}

async function mainloop(url, waittime) {
    checkarguments();

    try {
        while (true) {
            await wait(waittime);
            sourcecode(url);//.then(() => console.log('source saved'));
        }
    } catch (error) {
        console.log(error);
        Logger.error(error);
    }
}


// 'https://www.pelando.com.br/recentes'
// mainloop(website, seconds)
mainloop(process.argv[3], process.argv[4]);
