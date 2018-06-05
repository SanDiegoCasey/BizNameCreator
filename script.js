const NAMEURL = "https://uzby.com/api.php"

// get data from api
function getDataFromApi(value, callback){
  const QUERY = {
    min:`${value}`,
    max:`${value}`
  }
  $.getJSON(NAMEURL, QUERY, callback)
}

function renderResult(result){
  return `${result}`;
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
