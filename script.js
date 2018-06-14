const DOMAINRURLSTATUS = "https://domainr.p.mashape.com/v2/status"
const UZBYURL = "https://cors-anywhere.herokuapp.com/https://uzby.com/api.php?"
const DOMAINRKEY = config.DOMAINRKEY;
const MARKERUSER = config.MARKERUSPTOUSER;
const MARKERPASS = config.MARKERUSPTOPASS;
const MARKERURL = "https://cors-anywhere.herokuapp.com/https://www.markerapi.com/api/v1/trademark/search/"

// sample marker https://cors-anywhere.herokuapp.com/https://www.markerapi.com/api/v1/trademark/search/rair/username/SanDiegoCasey/password/mqbJxHvP36

// get data from domainr api
function getDataFromDomainrApi(value, callback) {
  const OUTPUT = $('#domainContainer');
  OUTPUT.prop('hidden', false);
  $('#domainResults').html('<br><img src="ajax-loader-light.gif" alt="ajax-loader">');

  const QUERY = {
    "mashape-key": DOMAINRKEY,
    domain: `${value}.com,${value}.net,${value}.org,${value}.biz`
  }
  $.getJSON(DOMAINRURLSTATUS, QUERY, callback)
  .fail(function(){alert("Domain connection not working?")});
}

// get data from Marker api
function getDataFromMarkerApi(value) {
  const OUTPUT = $('#markerContainer');
  OUTPUT.prop('hidden', false);
  $('#markerResults').html('<br><img src="ajax-loader-light.gif" alt="ajax-loader">');
  // console.log(value);
  $.ajax({
      type:'GET',
      url: `${MARKERURL}${value}/username/${MARKERUSER}/password/${MARKERPASS}`,
      success: function(result){
        $("#markerResults").html(renderMarkerResult(result, value));
      },
      error: function(){
        $("#markerResults").html("No Results Found");
      }
    });
}

// create the code that will display for the domain availability
function renderResult(result) {

  if (result.summary == "inactive") {
    return `<div class="domain">${result.domain}<span class="buyButton"><a href="https://www.namecheap.com/domains/registration/results.aspx?domain=${result.domain}" target="_blank">Buy it!</a></span></div>`;
  } else if (result.summary == "active") {
    return `<div class="domainUnavail"><a class="domainLink" href="http://www.${result.domain}" target="_blank">${result.domain}</a><span class="sold">Unavailable</span></div>`;
  } else {
    return `<div class="domainUnavail"><a class="domainLink" href="http://www.${result.domain}" target="_blank">${result.domain}</a><span class="sold">Unavailable</span></div>`;
  }
}

// create the code that will display for the trademark availability
function renderMarkerResult(result, name) {
  if (result.count == "0") {
    return `<div class="TMavail"><span class="TM">${name}</span> is available! <span class="buyButton"><a href="https://www.uspto.gov/trademarks-application-process/filing-online" target="_blank">Apply now!</a></span></div>`;
} else {
    return `<div class="TMcontainer"><div class="TMregisteredHead"><span class="TM">${result.trademarks[0].wordmark}</span> has been registered.</div>
    <div class="TMregistered"><span class="TM">Description:</span> ${result.trademarks[0].description}</div></div>`;
  }
}

// render results to page (will bring in renderResult code from above.)
function displayDomainResults(data) {
  const RESULTS = data.status.map((item, index) => renderResult(item));
  $('#domainResults').html(RESULTS);
}

function displayMarkerResults(data){
  const MKRRESULTS = renderMarkerResult(data);
  $('#markerResults').html(MKRRESULTS);
}

//Wait for user to click "create my name" button
function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    //unhide name section
    $('#domainResults').html('');
    $('#markerResults').html('');
    // $('#markerContainer').html('');
    const NAMEOUTPUT = $('#nameResult');
    NAMEOUTPUT.prop('hidden', false);
    // add loading image for latency
    $('#nameResult').html('<img src="ajax-loader.gif" alt="ajax-loader">');
    // set variables for get request
    var minlen = $('#js-dropValue').val();
    var maxlen = $('#js-dropValue').val();
    var param = `min=${minlen}&max=${maxlen}`;
    //Get random name result
    $.ajax({
      type: 'GET',
      url: `${UZBYURL}${param}`,
      success: function(result) {
        const NAME = result;
        $('#nameResult').html(NAME);
        getDataFromDomainrApi(result, displayDomainResults);
        getDataFromMarkerApi(result, displayMarkerResults);
      },
      error: function() {
        alert('error loading names');
      }
    });
  });
}
$(watchSubmit);
