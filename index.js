const Nightmare = require('nightmare');
const vo = require('vo')
const jquery = require('jquery');
const NM = new Nightmare({ show: false, minWidth: 1280, minHeight: 3840 });
const URL = require('./URLs')

vo(run)((err, result) => {
  if (err) throw err;
  result.forEach(function (text) {
    console.log('company', text);
  })
})

function *run() {
  const sizeDropDown = '#DKFilters > div > div > div.filter.more.expandable.expanded > div > div:nth-child(6) > span.labelArrow';
  const sizeSelection = '#DKFilters > div > div > div.filter.more.expandable.expanded > div > ul > li:nth-child(2) > span.label';
  const applyFiltersButton = '#DKFilters > div > div > div.filter.more.expandable.expanded.applied > div > div.buttons.hideHH.borderBot > button';
  yield NM
  .goto(URL)
  .viewport(1280, 3840)
  .insert('.keyword', 'software engineer')
  .evaluate(() => document.getElementById('LocationSearch').value = '')
  .insert('.loc', 'San Francisco, CA (US)')
  .click('.gd-btn-mkt')
  .wait(2000)
  .viewport(1280, 3840)
  .click('.more')
  .wait(2000)
  .click(sizeDropDown)
  .wait(2000)
  .click(sizeSelection)
  .wait(2000)
  .click(applyFiltersButton)
  .wait(5000)
  .viewport(1280, 3840)
  let cleanCompanyArray = [];
  for (let i = 0; i < 4; i++) {
    yield NM
    .wait('#FooterPageNav > div > ul > li.page.current', 5000)
    .on('console', (log, message) => console.log(message))
    .evaluate((cleanCompanyArray) => {
      const companyCleaner = (rawHTML) => rawHTML.slice(rawHTML.indexOf('>') + 1).split('<')[0].replace(/[^\w\s]/gi, '').trim();
      const cleanNodeList = () => {
        companyNodeList.forEach((node) => {
          if (!cleanCompanyArray.contains(companyCleaner(node.innerHTML))) cleanCompanyArray.push(companyCleaner(node.innerHTML));
        });
      };
      const totalPages = Number(document.getElementById('TotalPages').value);
      const currentPage = Number(document.querySelector('#FooterPageNav > div > ul > li.page.current').innerText);
      const companyNodeList = document.querySelectorAll('.empLoc');
      const test = () => console.log(cleanCompanyArray);
      cleanNodeList()
      test()
      return cleanCompanyArray;
    }, cleanCompanyArray)
    .click('#FooterPageNav > div > ul > li.next > a > i')
    .wait(5000)
  } yield NM
  .end()
  .then(data => console.log(data))
  .catch(err => console.error('Search failed:', err));
}