const DOMAINRURLSTATUS = "https://domainr.p.mashape.com/v2/status"
const DOMAINRKEY = "4QEWXh45IWmshVb3XvKWKF09djZkp15M5YXjsn0HlZtIxTnaB8"

// get data from domainr api
function getDataFromApi(value, callback) {
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
  while (result.domain === ".net" || ".com" || ".biz" || ".org"){
    return `<div class="domainUnavail">LOADING<span class="sold">LOADING</span></div>`;
  }
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

// script for random name generation
function get_new_name() {
  const OUTPUT = $('#nameResult');
  OUTPUT
    .prop('hidden', false);
  $('#nameResult').html(`<img src="ajax-loader.gif">`);
  var xmlhttp;
  if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest();
  } else {
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }

  // get value from drop down
  var
    minlen = document.getElementById('js-dropValue').value,
    maxlen = document.getElementById('js-dropValue').value,
    param = 'min=' + minlen + '&max=' + maxlen;
  // Get data from name generator
  xmlhttp.open('GET', 'https://cors-anywhere.herokuapp.com/https://uzby.com/api.php?' + param, true);
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      document.getElementById('nameResult').innerHTML = xmlhttp.responseText;
    }
    const THISQUERY = xmlhttp.responseText;
    getDataFromApi(THISQUERY, displayDomainResults);
  };
  xmlhttp.send();
  return false;
}
