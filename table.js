// https://gist.github.com/AMDS/4a61497182b8fcb05906
// https://stackoverflow.com/questions/33825725/data-sorting-in-table-in-d3

function getTable(error, data) {
  if (error) throw error;

  var sortAscending = true;
  var table = d3.select('#table').append('table');
  var titles = d3.keys(data[0]);
  var headers = table.append('thead').append('tr')
                   .selectAll('th')
                   .data(titles).enter()
                   .append('th')
                   .text(function (d) {
	                    return d;
                    })
                   .on('click', function (d) {
                     headers.attr('class', 'header');
                	   if (sortAscending) {
                	     rows.sort(function(a, b) {
                         var b_float = parseFloat(b[d]);
                         var a_float = parseFloat(a[d]);
                         if (!isNaN(b_float) && !isNaN(a_float)){
                           return d3.ascending(b_float, a_float);
                         }
                         return d3.ascending(b[d], a[d]);
                       });
                	     sortAscending = false;
                	     this.className = 'aes';
                	   } else {
                		 rows.sort(function(a, b) {
                       var b_float = parseFloat(b[d]);
                       var a_float = parseFloat(a[d]);
                       if (!isNaN(b_float) && !isNaN(a_float)){
                         return d3.descending(b_float, a_float);
                       }
                       return d3.descending(b[d], a[d]);
                     });
                		 sortAscending = true;
                		 this.className = 'des';
                	   }

                   });

  var rows = table.append('tbody').selectAll('tr')
               .data(data).enter()
               .append('tr');
  rows.selectAll('td')
    .data(function (d) {
    	return titles.map(function (k) {
    		return { 'value': d[k], 'name': k};
    	});
    }).enter()
    .append('td')
    .attr('data-th', function (d) {
    	return d.name;
    })
    .html(function (d) {
    	return d.value;
    });

  // Create global plots

};

// https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

console.log(getParameterByName("category"))
d3.csv("csv/" + getParameterByName("category") + "_table_data.csv", getTable);
