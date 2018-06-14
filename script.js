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
    .fail(function() {
      alert("Domain connection not working?")
    });
}

// get data from Marker api
function getDataFromMarkerApi(value) {
  const OUTPUT = $('#markerContainer');
  OUTPUT.prop('hidden', false);
  $('#markerResults').html('<br><img src="ajax-loader-light.gif" alt="ajax-loader">');
  // console.log(value);
  $.ajax({
    type: 'GET',
    url: `${MARKERURL}${value}/username/${MARKERUSER}/password/${MARKERPASS}`,
    success: function(result) {
      $("#markerResults").html(renderMarkerResult(result, value));
    },
    error: function() {
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

function displayMarkerResults(data) {
  const MKRRESULTS = renderMarkerResult(data);
  $('#markerResults').html(MKRRESULTS);
}

//Wait for user to click "create my name" button
function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    //unhide name section
    if ($('select').val().length == 6) {
      alert.render("Please select the number of letters you would like your name to have.")
    } else {
      $('#domainResults').html('');
      $('#markerResults').html('');
      // $('#markerContainer').html('');
      const NAMEOUTPUT = $('#nameResult');
      NAMEOUTPUT.prop('hidden', false);
      // add loading image for latency
      $('#nameResult').html('<img src="ajax-loader.gif" alt="ajax-loader">');
      // set variables for get request
      var minlen = $('select').val();
      var maxlen = $('select').val();
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
    }
  });
}
$(watchSubmit);


// custom Drop Down Styling ---------------------------------------------------------------------------------------


var x, i, j, selElmnt, a, b, c;
/*look for any elements with the class "custom-select":*/
x = document.getElementsByClassName("custom-select");
for (i = 0; i < x.length; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  /*for each element, create a new DIV that will act as the selected item:*/
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /*for each element, create a new DIV that will contain the option list:*/
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 0; j < selElmnt.length; j++) {
    /*for each option in the original select element,
    create a new DIV that will act as an option item:*/
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function(e) {
      /*when an item is clicked, update the original select box,
      and the selected item:*/
      var y, i, k, s, h;
      s = this.parentNode.parentNode.getElementsByTagName("select")[0];
      h = this.parentNode.previousSibling;
      for (i = 0; i < s.length; i++) {
        if (s.options[i].innerHTML == this.innerHTML) {
          s.selectedIndex = i;
          h.innerHTML = this.innerHTML;
          y = this.parentNode.getElementsByClassName("same-as-selected");
          for (k = 0; k < y.length; k++) {
            y[k].removeAttribute("class");
          }
          this.setAttribute("class", "same-as-selected");
          break;
        }
      }
      h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {
    /*when the select box is clicked, close any other select boxes,
    and open/close the current select box:*/
    e.stopPropagation();
    closeAllSelect(this);
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
  });
}

function closeAllSelect(elmnt) {
  /*a function that will close all select boxes in the document,
  except the current select box:*/
  var x, y, i, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  for (i = 0; i < y.length; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < x.length; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}
/*if the user clicks anywhere outside the select box,
then close all select boxes:*/
document.addEventListener("click", closeAllSelect);


// custom alert --------------------------------------------------------------------------------------------------------

function customAlert() {
  this.render = function(dialog) {
    var winW = window.innerWidth;
    var winH = window.innerHeight;
    var errorOverlay = document.getElementById('errorOverlay');
    var errorBox = document.getElementById('errorBox');
    errorOverlay.style.display = "block";
    errorOverlay.style.height = `${winH}px`;
    errorBox.style.left = (winW / 2) - (300 / 2) + 'px';
    errorBox.style.top = "80px";
    errorBox.style.display = "block";
    document.getElementById('errorBoxBody').innerHTML = dialog;
    document.getElementById('errorBoxFooter').innerHTML = '<button class="btn" onclick="alert.ok()">OK</button>';
  }
  this.ok = function() {
    document.getElementById('errorBox').style.display = "none";
    document.getElementById('errorOverlay').style.display = "none";
  }
}
var alert = new customAlert();

// copyright ------------------------------------------------------------------------------------------
