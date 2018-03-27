function draw_structure(distortion) {
  keys = Object.keys(distortion)
  var frames = new Array();

  for (var i in keys){
    var plot_data = new Array();
    sub_keys = Object.keys(distortion[i]['unitcell'])

    // Create unitcell plot
    for (var j in sub_keys){
      var unitcell_line = {
        type: 'scatter3d',
        line: {
          width: 3,
          color: 'rgb(0,0,0)'
        },
        x: distortion[i]['unitcell'][j][0],
        y: distortion[i]['unitcell'][j][1],
        z: distortion[i]['unitcell'][j][2],
        mode: 'lines',
        name: j,
        showlegend: false
      }
      plot_data.push(unitcell_line);
    }

    // Create coordinates plot
    var atoms = distortion[i]['atoms']

    var legend = distortion[i]['legend']

    species = Object.keys(atoms)
    for (var i in species) {
      coord_plot = {
        x: atoms[species[i]]['x'],
        y: atoms[species[i]]['y'],
        z: atoms[species[i]]['z'],
        type: 'scatter3d',
        marker: {
          size: 10,
          // color: atoms['atomic_numbers']
          color: legend[species[i]],
        },
        mode: 'markers',
        name: species[i],
        showlegend: true,
      }
      plot_data.push(coord_plot)

    }

    var new_frame = {data: plot_data}
    frames.push(new_frame)
  }

  var layout = {
    margin: {l: 0, r: 0, b: 0, t: 0},
    width: 600,
    height: 300,
    // showlegend: false,
    scene: {
      xaxis: {showgrid: false,
              zeroline: false,
              showline: false,
              showticklabels: false,
              title: 'a'},
      yaxis: {showgrid: false,
              zeroline: false,
              showline: false,
              showticklabels: false,
              title: 'b'},
      zaxis: {showgrid: false,
              zeroline: false,
              showline: false,
              showticklabels: false,
              title: 'c'},
    },
    updatemenus: [{
      type: 'buttons',
      buttons: [{
        label: 'Distort',
        method: 'animate',
        args: [
          null,
          {
            frame: {duration: 50, redraw: false},
            fromcurrent: true,
            transition: {duration: 300, easing: 'quadratic-in-out'}
          }
        ]
      }]
    }]
  };

  new_frames = frames.slice().reverse()
  all_frames = frames.concat(new_frames)

  var struct_plot = document.getElementById('structure');
  Plotly.plot(struct_plot,
    {
      data: frames[0]['data'],
      layout: layout,
      frames: all_frames
    }
  );

}

function draw_polarization(polarization) {
  // Make polarization plot
  var plot_data = []
  var color_dict = {'ro': '#fb2e01', 'bo': '#0a2c74'}
  var axis_dict = {'a': '1', 'b': '2', 'c': 3}

  axes = Object.keys(polarization)
  for (var axis in axes){
    var axis_label = axes[axis]
    var xaxis_label = 'x' + axis_dict[axis_label]
    var yaxis_label = 'y' + axis_dict[axis_label]
    var pol_data = polarization[axis_label]['quanta']['data']
    var pol_index = Object.keys(pol_data)
    for (var i in pol_index){
      var line = polarization[axis_label]['quanta']['data'][i]
      var x_values = Array.apply(
        null, {length: line.length}
      ).map(Number.call, Number)
      var marker_color = polarization[axis_label]['quanta']['color'][i]
      var trace = {
        x: x_values,
        y: line,
        type: 'scatter',
        mode: 'markers',
        xaxis: xaxis_label,
        yaxis: yaxis_label,
        marker: {
          color: color_dict[marker_color]
        }
      }
      plot_data.push(trace)
    }
    var spline = polarization[axis_label]['splines']
    var trace = {
      x: spline['x'],
      y: spline['y'],
      mode: 'lines',
      type: 'scatter',
      xaxis: xaxis_label,
      yaxis: yaxis_label,
      line: {
        color: color_dict['ro']
      }
    }
    plot_data.push(trace)
  }

  var layout = {
    // margin: {l: 0, r: 0, b: 0, t: 0},
    showlegend: false,
    width: 800,
    height: 400,
    xaxis: {
      range: polarization['a']['plot_xlim'],
      domain: [0, 0.3],
    },
    yaxis: {
      range: polarization['a']['plot_ylim'],
      anchor: 'x1',
      title: 'Polarization in microCoulomb per cm^2'
    },
    xaxis2: {
      range: polarization['b']['plot_xlim'],
      domain: [0.34, 0.6]
    },
    yaxis2: {
      range: polarization['b']['plot_ylim'],
      anchor: 'x2'
    },
    xaxis3: {
      range: polarization['c']['plot_xlim'],
      domain: [0.67, 1.0]
    },
    yaxis3: {
      range: polarization['c']['plot_ylim'],
      anchor: 'x3',
    },
  }

  var pol_plot = document.getElementById('polarization');
  Plotly.newPlot(pol_plot, plot_data, layout)
}

function draw_energy(energy_per_atom){
  var scalars = energy_per_atom['scalars']
  var x_values = Array.apply(
    null, {length: scalars.length}
  ).map(Number.call, Number)

  var points = {
    type: 'scatter',
    mode: 'markers',
    x: x_values,
    y: scalars,
    marker: {color: '#0a2c74'},
  }

  var spline = {
    type: 'scatter',
    mode: 'line',
    line: {color: '#0a2c74'},
    x: energy_per_atom['spline']['x'],
    y: energy_per_atom['spline']['y'],
  }

  var layout = {
    showlegend: false,
    width: 600,
    height: 400,
    yaxis: {
      title: 'Energy per atom in eV'
    },
  }

  var energy_plot = document.getElementById('energy');
  Plotly.newPlot(energy_plot, [points, spline], layout)
}

// Modified from
// http://bl.ocks.org/jfreels/6734025
function tabulate(data, columns, div_name) {
  var table = d3.select(div_name).append('table')
  var thead = table.append('thead')
  var	tbody = table.append('tbody');

  // append the header row
  thead.append('tr')
    .selectAll('th')
    .data(columns).enter()
    .append('th')
      .style('text-align', 'left')
      .text(function (column) { return column; });

  // create a row for each object in the data
  var rows = tbody.selectAll('tr')
    .data(data)
    .enter()
    .append('tr');

  // create a cell in each row for each column
  var cells = rows.selectAll('td')
    .data(function (row) {
      return columns.map(function (column) {
        var value = row[column]
        return {column: column, value: value};
      });
    })
    .enter()
    .append('td')
      .style('color', function (d) {
        var value = d.value
        if (value == true){
          // value = "<font color='#FFFFFF'>"
          value = '#85d104'
          // value += "</font>"
        }
        if (value == false){
          value = 'red'
        }
        return value
      })
      .style('text-align', 'left')
      .text(function (d) {
        var value = d.value
        if (value == true){
          // value = "<font color='#FFFFFF'>"
          value = String.fromCharCode(parseInt("2713",16))
          // value += "</font>"
        }
        if (value == false){
          value = String.fromCharCode(parseInt("2718",16))
        }
        return value
      })

  return table;
}

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

console.log(getParameterByName("wfid"))
// d3.json("wfid_1476040056.258909.json", function(data) {
// d3.json("wfid_1484694921.619765.json", function(data) {
// d3.json("wfid_1476040947.794782.json", function(data) {
d3.json("json/" + getParameterByName("wfid") + ".json", function(data) {
  console.log(window.location.href)
  keys = Object.keys(data)
  data = data[keys[0]]
  distortion = data['distortion']
  polarization = data['polarization']
  energy_per_atom = data['energy_per_atom']
  tasks = data['tasks']

  var wfid = getParameterByName("wfid")
  var heading = document.getElementById('heading');
  var heading_str = '<table style="width: 1000px"><tr>'
  category = data['category']
  heading_str += '<h2><a href="table.html?category='
  heading_str += category
  heading_str += '">Back to table</a></h2>'
  heading_str += "</tr></table>"
  heading.innerHTML += heading_str

  var stats = document.getElementById('stats');
  var stats_str = "<table>"
  stats_str += "<tr><td><h2>" +
    data['pretty_formula'] +
    "</h2></td></tr>"
  stats_str += "<tr><td><h2>" + wfid + "</h2></td></tr>"
  stats_str += "<tr><td><h2>" +
      '<a href="https://materialsproject.org/materials/' +
      data['nonpolar_id']+ '/">'+
      data['nonpolar_id'] + '</a>'+
      "&rarr;" +
      '<a href="https://materialsproject.org/materials/' +
      data['polar_id']+ '/">'+
      data['polar_id'] + '</a>'+
      "</h2></td></tr>";
  stats_str += "<tr><td><h2>" +
    data['nonpolar_spacegroup'] +
    "&rarr;" +
    data['polar_spacegroup'] +
    "</h2></td></tr>"
  stats_str += "</tr><td><h2>" + "Ps = "
  if ('polarization_change_norm' in data){
    stats_str += data['polarization_change_norm'].toFixed(1)
  } else {
    stats_str += "N/A"
  }
  stats_str += "<tr><td><h2>" +
      "WF Status: " +
      data['workflow_status'] +
      "</h2></td></tr>"
  stats_str += "</h2></td>"
  stats_str += "</tr></table>"
  stats.innerHTML += stats_str

  draw_structure(distortion)
  if (polarization){
    draw_polarization(polarization)
  }
  if (energy_per_atom){
    draw_energy(energy_per_atom)
  }

  console.log(tasks)

  relax_table = tasks['relaxation_task_labels']
  static_table = tasks['static_task_labels']
  pol_table = tasks['polarization_task_labels']

  tabulate(relax_table, ['task', 'complete'], "#relax_table");
  tabulate(static_table, ['task', 'complete'], "#static_table");
  tabulate(pol_table, ['task', 'complete'], "#pol_table"); // 2 column table

});
