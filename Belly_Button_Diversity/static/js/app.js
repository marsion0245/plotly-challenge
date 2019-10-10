
/*
	Plotty challenge homework, martin hrbac, 10/05/2019
*/

function buildCharts(sample) {
	d3.json("/samples/" + sample).then( sampleValues  => {

		// Pie chart
		const SampleCount = 10;
		const piePlotDiv = 'pie-crt';
		
		let readSamplesCount = sampleValues.otu_ids.length;
		
		let piePlotTrace = {
			values: sampleValues.sample_values.slice(0,SampleCount),
			labels: sampleValues.otu_ids.slice(0,SampleCount),
			type: 'pie'
		};
		
		let piePlotLayout = {
			title: `Top Results (${Math.min(SampleCount, readSamplesCount)})`,
		};

		// Draw new or update existing chart
		let plotFnc = d3.select(`#${piePlotDiv}`).classed('js-plotly-plot') ? Plotly.react : Plotly.newPlot;
		plotFnc(piePlotDiv, [piePlotTrace], piePlotLayout);
		
		// Bubble chart
		const bubblePlotDiv = 'bubble-crt';
		//let bubbleLabels = sampleValues.otu_ids.map( (val, idx) => `(${val}, ${sampleValues.sample_values[idx]})<br>${sampleValues.otu_labels[idx]}`);
		let bubbleLabels = sampleValues.otu_ids.map( (val, idx) => `${val}<br>${sampleValues.otu_labels[idx]}`);
		
		// Colors : this is just an approximation to what is shown, we know how to interpolate number series, right
		let minIds = Math.min(...sampleValues.otu_ids);
		let maxIds = Math.max(...sampleValues.otu_ids);
		let mapNr = d3.scaleLinear().domain([minIds, maxIds]).range([0, 1]);
		let bubbleColors = sampleValues.otu_ids.map( val => d3.interpolateRgbBasis(["royalblue", "greenyellow", "goldenrod"])(mapNr(val)));
		
		let bubblePlotTrace = {
			x: sampleValues.otu_ids,
			y: sampleValues.sample_values,
			type: "scatter",
			mode: 'markers',
			text: bubbleLabels,
			marker: {
				size: sampleValues.sample_values.map(x => x * 20),
				sizemode: 'area', // area was chosen intentionaly to make even small values visible; other option is to less degrating formula (root with base smaler than 2)
				color: bubbleColors
			}
		};
				
		let bubblePlotLayout = {
			title: `All Results (${readSamplesCount})`,
			xaxis: {
				autorange: true,
				type: "linear",
				title: {
					text: 'OTU ID',
					font: {
						family: 'Arial',
						size: 14,
						color: 'black'
					}
				}
			},
			yaxis: {
				autorange: true,
				type: "linear"
			},
		};
		Plotly.newPlot(bubblePlotDiv, [bubblePlotTrace], bubblePlotLayout);
	});
}

function buildGauge(value){
	
	// let stepColors = [0x70924e, 0x809c5a, 0x8fa667, 0x9fb073, 0xafba80, 0xbec38c, 0xcecd98, 0xddd7a5, 0xede1b1];
	let stepColors = ['coral', 'coral', 'yellow', 'yellow', 'green', 'green', 'darkgreen', 'darkgreen', 'darkgreen'];
	// https://codepen.io/njmcode/pen/axoyD/
	var data = [
	  {
		type: "indicator",
		//mode: "gauge+number+delta",
		mode: "gauge+number",
		value: value,
		title: { text: "Belly Button Washing Frequency", font: { size: 28 } },
		// delta: { reference: 5, increasing: { color: "RebeccaPurple" } },
		gauge: {
		  axis: { 
			range: [null, 9], 
			tickwidth: 1, 
			tickcolor: "darkblue",
			//labels: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9']			
		  },
		  bar: { color: "darkblue" },
		  // bgcolor: "white",
		  borderwidth: 0,
		  bordercolor: "gray",
		  steps: stepColors.map((val, idx) => { return { range: [idx, idx + 1], color: val } }), 
		  // threshold: {
			// line: { color: "red", width: 4 },
			// thickness: 0.75,
			// value: 490
		  // }
		}
	  }
	];

	var layout = {
	  // margin: { t: 25, r: 25, l: 25, b: 25 },
	  // paper_bgcolor: "lavender",
	  font: { color: "black", family: "Arial" }
	};

	Plotly.newPlot('gauge-crt', data, layout);
}

// This is IIFE - bundles all code inside an annonymous function (~module desing pattern)
(function () {
	
  // ---- Init Section ----
  // Grab a reference to the dropdown select element
  const selector = d3.select("#selDataset");

  // Event handler for the sample selector
  selector.on('change', function(){
	let sampleId = this.value;
    buildCharts(sampleId);
    buildMetadata(sampleId);
  });

  // Use the list of sample names to populate the select options
  d3.json("/names").then( sampleNames  => {
    sampleNames.forEach( sample => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    // Use the first sample from the list to build the initial plots; this would better be one by triggering change event
    const firstSample = sampleNames[0];
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
  
  // ---- Functions Section ----
  // Fill in metadata
  let buildMetadata = function(sample){
	const sampleMetadata = d3.select("#sample-metadata");
	d3.json("/metadata/" + sample).then( metaData  => {
		sampleMetadata.html(''); // remove previous entries
		let noWFREQ = true;
		Object.entries(metaData).forEach(val => { 
			sampleMetadata.append("div").text(val.join(': '));
			if(val[0] == 'WFREQ'){
				buildGauge(val[1]); 
				noWFREQ = false;
			}
		});
		if(noWFREQ){buildGauge(0)};
	});
  }
})();

