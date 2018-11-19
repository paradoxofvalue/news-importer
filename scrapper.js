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
        `SELECT option_name, option_value FROM wp_options WHERE option_name LIKE "ni-site-%"`,
    )
    .then(sites => {
      let websitesConfigurations = [
        {
          websiteUrl: '',
          linksSelector: '',
          paginationLinksSelector: '',
          titleSelector: '',
          contentSelector: '',
        }
      ];
      console.info('Data fetched from WP!');
      new Parser(sites[0]);
    });

class Parser {
  constructor(websitesList) {
    console.info('Parser constructor!');
    this.websitesList = this.performDataFromWPDB(websitesList);
    this.paginates = tress(this.performPaginates.bind(this));
    this.news = tress(this.performNews.bind(this));
    console.info('Websites List:', this.websitesList);
    this.currentWebsite = {};

    // this.websitesList.forEach(websiteConfiguration => {
      let websiteConfiguration = this.websitesList[1];
      this.currentWebsite = websiteConfiguration;
      console.info('Website taken:', this.currentWebsite);
      if (websiteConfiguration && websiteConfiguration.websiteUrl) {
        needle('get', websiteConfiguration.websiteUrl)
            .then((res) => {
              let $ = cheerio.load(res.body);

              if ($(`${this.currentWebsite.linksSelector}`).length > 5) {
                $(`${this.currentWebsite.linksSelector}`).each((i, elem) => {
                  this.news.push($(elem).attr('href'));
                });
              }

              if (this.currentWebsite.paginationLinksSelector) {
                if ($(`${this.currentWebsite.paginationLinksSelector}`).length > 5 &&
                    $(`${this.currentWebsite.paginationLinksSelector}`).length < 50) {
                  $(`${this.currentWebsite.paginationLinksSelector}`).each((i, elem) => {
                    this.paginates.push($(elem).attr('href'));
                  })
                }
              }

            })
            .catch((err) => {
              debugger;
            })
      }
    // });

    // this.news.drain = this.finished('news');
  }

  performDataFromWPDB(array) {
    let tempArray = [];
    array.forEach((item, key) => {
      let index = item.option_name.substr(item.option_name.length - 1, item.option_name.length);
      if (item.option_name.length && !tempArray[index]) {
        tempArray[index] = {};
      }
      if (item.option_name.includes('ni-site-url')) {
        tempArray[index]['websiteUrl'] = item.option_value;
      }
      if (item.option_name.includes('ni-site-title')) {
        tempArray[index]['linksSelector'] = item.option_value;
      }
      if (item.option_name.includes('ni-site-pagination')) {
        tempArray[index]['paginationLinksSelector'] = item.option_value;
      }
      if (item.option_name.includes('ni-site-news-title')) {
        tempArray[index]['titleSelector'] = item.option_value;
      }
      if (item.option_name.includes('ni-site-news-text')) {
        tempArray[index]['contentSelector'] = item.option_value;
      }
    });
    return tempArray;
  }

  performPaginates(url, callback) {
    needle('get', url)
        .then((res) => {
          let $ = cheerio.load(res.body);
          if ($(`${this.currentWebsite.linksSelector}`).length > 5) {
            $(`${this.currentWebsite.linksSelector}`).each((i, elem) => {
              this.news.push($(elem).attr('href'));
            });
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

          if ($(`${this.currentWebsite.titleSelector}`).length) {
            title = $(`${this.currentWebsite.titleSelector}`)[0];
            title = $(title).text();
          }
          if ($(`${this.currentWebsite.contentSelector}`).length) {
            text = $(`${this.currentWebsite.contentSelector}`).text();
          }

          if ($(`${this.currentWebsite.contentSelector} img`).length) {
            $(`${this.currentWebsite.contentSelector} img`).each((i, elem) => {
              images.push({
                src: $(elem).attr('src'),
                alt: $(elem).attr('alt')
              })
            })
          }

          if ($(`${this.currentWebsite.contentSelector} iframe`).length) {
            $(`${this.currentWebsite.contentSelector} iframe`).each((i, elem) => {
              let src = $(elem).attr('src'),
                  type = '';
              if ($(`${this.currentWebsite.contentSelector} iframe`).attr('src').match(/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/)) {
                type = 'youtube';
              }
              iframes.push({
                src: src,
                type: type,
              })
            })
          }
          console.log(title, text, images);
          this.saveToDraft({title, text, images, iframes}, callback);

        })
        .catch((err) => {
          debugger;
        })

  }

  saveToDraft(data, callback) {
    let date = new Date(),
        dateString = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    sequelize
        .query(
            `INSERT INTO wp_posts (ID, post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt, post_status, comment_status, ping_status, post_password, post_name, to_ping, pinged, post_modified, post_modified_gmt, post_content_filtered, post_parent, guid, menu_order, post_type, post_mime_type, comment_count) VALUES ('0', '1', '${dateString}', '${dateString}', '${data.text}', '${data.title}', '', 'draft', 'open', 'open', '', '', '', '', '${dateString}', '${dateString}', '', '0', '', '0', 'post', '', '0')`,
        )
        .then(res => {
          debugger;
          callback();
        });

  }

  finished(type) {
    debugger;
    console.log(`${type} Done!!!`);
  }
}