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
        // new Parser(sites[0].map(site => {
        //     return site.option_value;
        // }));
        new Parser([sites[0][0].option_value]);
    });

class Parser {
    constructor(websitesList) {
        this.websitesList = websitesList;
        this.paginates = tress(this.performPaginates.bind(this));
        this.news = tress(this.performNews);

        this.news.drain = this.finished('news');

        this.websitesList.forEach(websiteUrl => {
            if (websiteUrl) {
                needle('get', websiteUrl)
                    .then((res) => {
                        let $ = cheerio.load(res.body);
                        /**
                         * получаем новости
                         */
                        if ($('h3 a').length > 5) {
                            $('h3 a').each((i, elem) => {
                                this.news.push($(elem).attr('href'));
                            })
                        }
                        if ($('h2 a').length > 5) {
                            $('h2 a').each((i, elem) => {
                                this.news.push($(elem).attr('href'));
                            })
                        }
                        if ($('h1 a').length > 5) {
                            $('h1 a').each((i, elem) => {
                                this.news.push($(elem).attr('href'));
                            })
                        }

                        /**
                         * получаем пагинацию
                         */
                        if ($(`[class*="pag"] a`).length > 5 && $(`[class*="pag"] a`).length < 20) {
                            $(`[class*="pag"] a`).each((i, elem) => {
                                this.paginates.push($(elem).attr('href'));
                            })
                        }
                    })
                    .catch((err) => {
                        debugger;
                    })
            }

        })
    }

    performPaginates(url, callback) {
        let self = this;
        needle('get', url)
            .then((res) => {
                let $ = cheerio.load(res.body);
                /**
                 * получаем новости n2
                 */
                if ($('h3 a').length > 5) {
                    $('h3 a').each((i, elem) => {
                        self.news.push($(elem).attr('href'));
                    })
                }
                if ($('h2 a').length > 5) {
                    $('h2 a').each((i, elem) => {
                        self.news.push($(elem).attr('href'));
                    })
                }
                if ($('h1 a').length > 5) {
                    $('h1 a').each((i, elem) => {
                        self.news.push($(elem).attr('href'));
                    })
                }
              callback();

            })
            .catch((err) => {
                debugger;
            })
    }

    performNews(newsUrl, callback) {
        needle('get', newsUrl)
            .then((res) => {
                let $ = cheerio.load(res.body),
                    title = '',
                    text = '',
                    images = [],
                    iframes = [];
                if ($('h1').length) {
                    title = $('h1')[0];
                    title = $(title).text();
                }
                /**
                 * для dailytechinfo - просто шикарное форматирование...
                 */
                if ($('.content [id*="news"]').length) {
                    text = $('.content [id*="news"]').text();
                }
                if ($('.content [id*="news"] img').length) {
                    $('.content [id*="news"] img').each((i, elem) => {
                        images.push({
                            src: $(elem).attr('src'),
                            alt: $(elem).attr('alt')
                        })
                    })
                }
                if ($('.content [id*="news"] iframe').length) {
                    $('.content [id*="news"] iframe').each((i, elem) => {
                        let src = $(elem).attr('src'),
                            type = '';
                        if ($('.content [id*="news"] iframe').attr('src').match(/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/)) {
                            type = 'youtube';
                        }
                        iframes.push({
                            src: src,
                            type: type,
                        })
                    })
                }

                console.log(title, text, images);

                callback();

            })
            .catch((err) => {
                debugger;
            })

    }
    finished(type) {
      debugger
      console.log(`${type} Done!!!`);
    }
}