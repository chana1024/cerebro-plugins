const request = require('superagent');
const cheerio = require('cheerio');

const BASE_URL = 'https://github.com';
const axios = require('axios').default;
  
const scrapeGitHubTrendingUsers = (path = '', query = {since: 'today'}) => {
    let url = `${BASE_URL}/trending/developers/${path}`;

    return request
        .get(url)
        .query(query)
        .then(res => {
            let $ = cheerio.load(res.text);
            let records = [];

            $('li.d-sm-flex').each(function() {
                let data = $(this);
                let record = {};

                let login = data.children().children().children().children('a').attr('href');
                let name = data.children().children().children().children().children('span.text-bold').text().trim();
                let repo = data.children().children().children('.repo-snipit').children('.repo-snipit-name').text().trim();

                record.login = login.slice(1);
                record.avatar_url = data.children().children().children('a').children('.rounded-1').attr('src');
                record.html_url = BASE_URL + login;
                record.name = name.slice(1, name.length - 1);
                record.repo = {};
                record.repo.name = repo;
                record.repo.full_name = login + '/' + repo;
                record.repo.html_url = BASE_URL + record.repo.full_name
                record.repo.slug = repo;
                record.repo.description = data.children().children().children('.repo-snipit').children('.repo-snipit-description').text().trim();

                records.push(record);
            })

            return records;
        });
};

const scrapeGitHubTrendingRepos = (path = 'trending', query = {since: 'today'}) => {
    let url = `${BASE_URL}/${path}`;

    return request
        .get(url)
        .query(query)
        .then(res => {
            let $ = cheerio.load(res.text);
            let records = [];

            $('li.d-block').each(function() {
                let data = $(this);
                let record = {};

                let name = data.children().children().children().attr('href');
                let color = data.children('.mt-2').find('span.repo-language-color');
                let updated =  data.children('.mt-2').find('relative-time').text().trim();

                record.name = name.split('/')[2];
                record.full_name = name.slice(1);
                record.html_url = BASE_URL + name;
                record.description = data.children().find('p').text().trim();
                record.language = data.children('.mt-2').find('span.mr-3').children('span').text().trim();
                record.language_color = color.length ? color.css('background-color') : '';
                record.stargazers_count = data.children('.mt-2').find('a.mr-3').eq(0).text().trim();
                record.stargazers_period = data.children('.mt-2').children('.float-sm-right').text().trim();
                record.forks = data.children('.mt-2').find('a.mr-3').eq(1).text().trim();
                record.updated = updated.length ? 'Updated on ' + updated : '';

                records.push(record);
            })

            return records;
        });
};

const scrapeGithubUsers = (query = {type: 'Users'}) => {
    let url = `${BASE_URL}/search`;

    return request
        .get(url)
        .query(query)
        .then(res => {
            let $ = cheerio.load(res.text);
            let records = [];

            $('div.user-list-item').each(function() {
                let data = $(this);
                let record = {};

                record.login = data.find('.user-list-info').find('a').eq(0).text().trim();
                record.avatar_url = data.find('.avatar').attr('src');
                record.html_url = BASE_URL + '/' + record.login;
                record.name = data.find('.user-list-info').find('span.ml-1').text().trim();
                record.location = data.find('.user-list-meta').find('li').eq(0).text().trim();
                record.bio = data.find('.user-list-info').find('p.mt-2').text().trim();
                record.email = data.find('.user-list-meta').find('li').eq(1).text().trim();

                records.push(record);
            })

            return records;
        });
};

const scrapeGithubRepos = (path = 'search', query = {type: 'Repositories'}) => {
    let url = `${BASE_URL}/${path}`;
    return axios.get(url+"?q="+query.q)
        .then(res => {
            let $ = cheerio.load(res.data);
            let records = [];
            $('li.repo-list-item').each(function() {
                let data = $(this);
                let record = {};

                let name = data.find('.v-align-middle').attr('href');
                let color = data.children().find('span.repo-language-color');
                let updated =  data.children().find('relative-time').text().trim();

                record.name = name.split('/')[2];
                record.full_name = name.slice(1);
                record.html_url = BASE_URL + name;
                record.description = data.children().find('p.col-9').text().trim();
                record.language = color.parent().text().trim();
                record.language_color = color.length ? color.css('background-color') : '';
                record.stargazers_count = data.children().find('a.muted-link').text().trim();
                record.updated = updated.length ? 'Updated on ' + updated : '';

                records.push(record);
            })
            console.log(records);
            return records;
        });
};

module.exports = {
    scrapeGitHubTrendingUsers,
    scrapeGitHubTrendingRepos,
    scrapeGithubUsers,
    scrapeGithubRepos
};
