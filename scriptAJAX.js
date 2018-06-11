const DOMAINRURLSTATUS = "https://domainr.p.mashape.com/v2/status"
const UZBYURL = "https://cors-anywhere.herokuapp.com/https://uzby.com/api.php?"
var DOMAINRKEY = config.DOMAINRKEY;

// get data from domainr api
function getDataFromDomainrApi(value, callback) {
  const QUERY = {
    "mashape-key": DOMAINRKEY,
    domain: `${value}.com,${value}.net,${value}.org,${value}.biz`
  }
  $.getJSON(DOMAINRURLSTATUS, QUERY, callback);
}

// create the code that will display for the domain availability
function renderResult(result) {
  const OUTPUT = $('#domainContainer');
  OUTPUT
    .prop('hidden', false);
  if (result.summary == "inactive") {
    return `<div class="domain">${result.domain}<span class="buyButton"><a href="https://www.namecheap.com/domains/registration/results.aspx?domain=${result.domain}" target="_blank">Buy it!</a></span></div>`;
  } else if (result.summary == "active") {
    return `<div class="domainUnavail">${result.domain}<span class="sold">Unavailable</span></div>`;
  } else {
    return `<div class="domainUnavail">${result.domain}<span class="sold">Unavailable</span></div>`;
  }
}

// render results to page (will bring in renderResult code from above.)
function displayDomainResults(data) {
  const RESULTS = data.status.map((item, index) => renderResult(item));
  $('#domainResults').html(RESULTS);
}

//Wait for user to click "create my name" button
function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    var minlen = $('#js-dropValue').val();
    var maxlen = $('#js-dropValue').val();
    var param = `min=${minlen}&max=${maxlen}`;
//Get random name result
    $.ajax({
      type: 'GET',
      url: `${UZBYURL}${param}`,
      success: function(result) {
        const NAMEOUTPUT = $('#nameResult');
        NAMEOUTPUT
          .prop('hidden', false);
        const NAME = result;
        $('#nameResult').html(NAME);
        getDataFromDomainrApi(result, displayDomainResults);
      },
      error: function(){
        alert('error loading names');
      }
    });
  });
}
$(watchSubmit);
