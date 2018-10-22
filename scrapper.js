const Sequelize = require('sequelize');
const tress = require('tress');
const needle = require('needle');
const cheerio = require('cheerio');

const sequelize = new Sequelize('wp', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

sequelize
    .query(
        `SELECT option_value FROM wp_options WHERE option_name LIKE "ni-site-%"`,
    )
    .then(sites => {
        new Parser(sites[0].map(site => {
            return site.option_value;
        }));
    })

class Parser {
    constructor(websitesList) {
        this.websitesList = websitesList;
        this.paginates = tress(this.performPaginates);
        this.news = tress(this.performNews);

        // this.news.drain = this.finished('news');

        this.websitesList.forEach(websiteUrl => {
            if (websiteUrl) {
                needle('get', websiteUrl)
                    .then((res) => {
                        let $ = cheerio.load(res.body);
                        $('h3 a').each((i, elem) => {
                            this.news.push($(elem).attr('href'));
                        })
                    })
                    .catch((err) => {
                        debugger;
                    })
            }

        })
    }

    performPaginates(url, callback) {}

    performNews(newsUrl, callback) {
        needle('get', newsUrl)
            .then((res) => {
                let $ = cheerio.load(res.body),
                    title = $('h1').text(),
                    body = $('.the_content_wrapper p').map((i, elem) => {
                        return $(elem).text();
                    });
                console.log(newsUrl, title, body);
                // callback();
                
            })
            .catch((err) => {
                debugger;
            })

    }
    finished(type) {
        console.log(`${type} Done!!!`);
    }
}

//     var sql = "SELECT `option_value` FROM `wp_options1` WHERE `option_name` LIKE 'ni-site-%'";

// error => {
//     connection.connect();
//     var sql = "UPDATE `wp_options` SET `option_value` = '"+error+"' WHERE `option_name` = 'ni-status'";
//     connection.query(sql, function (err, result) {
//         if (result) console.log(error)
//     })
//     connection.end();
// });