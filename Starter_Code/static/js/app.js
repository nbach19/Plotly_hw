var json = './samples.json'

// initialize dashboard
generateData('940');
//update subject id when the dropdown id is selected
function optionChanged(){
    var dropdownMenu = d3.select('#selDataset');
    var subjectID = dropdownMenu.property('value');
    console.log(subjectID);
    generateData(subjectID);
};
function generateData(subjectID){
    d3.json(json).then(function(data) {
        // Create dropdown list
        var samples = data.samples;
        var idOptions=[];
        for (var i=0; i<samples.length; i++){
            idOptions.push(samples[i].id);
        };
        //Populate the dropdown box
        idOptions.forEach(function(d){
            d3.select('#selDataset')
            .append('option')
            .attr('value',d)
            .text(d);
        });
        //gives array of subject_ids
        subject_id = subjectID; 

        //loop through the subject_id array for values
        for (var i=0;i<data.samples.length;i++){
            if (subject_id == data.samples[i].id) {
                otu_ids = data.samples[i].otu_ids;
                sample_values = data.samples[i].sample_values;
                otu_labels = data.samples[i].otu_labels; 
                id = data.metadata[i].id;
                ethnicity = data.metadata[i].ethnicity;
                gender = data.metadata[i].gender;
                age = data.metadata[i].age;
                subLocation = data.metadata[i].location;
                bbtype = data.metadata[i].bbtype;
                wfreq = data.metadata[i].wfreq;
            };       
        };
        // Add 'OTU' to the ids for the graph labels
        var string_otu_ids = [];
        for (var j=0;j<otu_ids.length;j++){
            string_otu_ids[j]="OTU "+otu_ids[j];
        };
        // slice the first 10 values of each array
        var topOtuIds = string_otu_ids.slice(0,10);
        var topSampleValues = sample_values.slice(0,10);
        var topOtuLabels = otu_labels.slice(0,10);
        // Create the bar graph
        var trace1 = {
            type: 'bar',
            name: subject_id,
            x: topSampleValues,
            y: topOtuIds,
            text: topOtuLabels,
            orientation: 'h'
        };
        var data = [trace1];
        var layout = {
            title: `Counts of top 10 OTUs for Subject ID ${subject_id}`,
            yaxis: {autorange: 'reversed'}
        };
        Plotly.newPlot('bar',data,layout);
        // update the demographic info with new Subject ID data
        d3.select('#sample-metadata').html('');
        d3.select('#sample-metadata')
                    .data(data)    
                    .append('metadata')
                    .append('p')
                    .text(`ID: ${id}`)
                    .append('p')
                    .text(`Ethnicity: ${ethnicity}`)
                    .append('p')
                    .text(`Gender: ${gender}`)
                    .append('p')
                    .text(`Age: ${age}`)
                    .append('p')
                    .text(`Location: ${subLocation}`)
                    .append('p')
                    .text(`BBType: ${bbtype}`)
                    .append('p')
                    .text(`wFreq: ${wfreq}`);
        var bubbleTrace = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: 'Greens'
            }
        }];
        var bubbleLayout = {
            showlegend: false,
            };
        Plotly.newPlot('bubble',bubbleTrace,bubbleLayout);
    });
};