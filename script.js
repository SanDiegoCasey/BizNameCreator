const NAMEURL = "https://uzby.com/api.php"
const NAME = ""
const NAMEIP = "107.201.225.22"
const NAMECOMMAND = "namecheap.domains.check"
const NAMECHEAPURL = "https://api.sandbox.namecheap.com/xml.response"
const NAMECHEAPUSER = "SanDiegoCasey"
const NAMECHEAPAPI = "518bfd94312a49c595938b11e78d1ee2"

// SAMPLE STRING https://api.sandbox.namecheap.com/xml.response?ApiUser=SanDiegoCasey&ApiKey=518bfd94312a49c595938b11e78d1ee2&UserNAme=SanDiegoCasey&ClientIp=107.201.225.22&Command=namecheap.domains.check&DomainList=somthing3333.com,something.com

// get data from api
function getDataFromApi(value, callback){
  const QUERY = {
    min:value,
    max:value
  }
  $.getJSON(NAMEURL, QUERY, callback);
}

function renderResult(result){
  return result;
}

// render results to page
function displayName(data){
  console.log(data);
  const results = renderResult(data);
  $('.nameResult').html(results);
}

// wait for user to submit
function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('#js-dropValue');
    const thisquery = queryTarget.val();
    getDataFromApi(thisquery, displayName);
  });
}
// running the watch submit function waiting for click
$(watchSubmit);
