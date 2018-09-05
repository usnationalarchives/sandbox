var listseries
var listfileitem
var listitem
var listrg

$(document).ready(function() {


 	window.onload = function WindowLoad() {
	
	params = window.location.search.substring(1).split("=");
	
	if (params[0] == 'id') {
		parse(params[1]);
	}
	else {
		listrg();
	}
	}

load = function() {
$('#listrecords').hide()
$('#loading').html('<center><img width="300px" src="https://upload.wikimedia.org/wikipedia/commons/a/a3/Lightness_rotate_36f_cw.gif"> <h1>Loading time: <span id="seconds"></span> seconds.</h1></center>')

window.setInterval((function(){
   var start = Date.now();
   var textNode = document.createTextNode('0');
   document.getElementById('seconds').appendChild(textNode);
   return function() {
        textNode.data = Math.floor((Date.now()-start).toFixed(3))/1000;
        };
   }()), 1);
}

parse = function(naid) {
	load();
	url = 'https://catalog.archives.gov/api/v1?resultFields=description&naIds=' + naid
	$.getJSON(url, function(t) {
		level = Object.keys(t.opaResponse.results.result[0].description)[0]
		if (level === 'recordGroup') {
			RGnaid = t.opaResponse.results.result[0].description.recordGroup.naId
			RG = t.opaResponse.results.result[0].description.recordGroup.recordGroupNumber
			RGtitle = t.opaResponse.results.result[0].description.recordGroup.title
			listseries(RGnaid, RG, RGtitle)
		}
		if (level === 'series') {
			seriesnaid = t.opaResponse.results.result[0].description.series.naId
			seriesname = t.opaResponse.results.result[0].description.series.title
			seriesdate = ' (' + t.opaResponse.results.result[0].description.series.inclusiveDates.inclusiveStartDate.year + '&ndash;' + t.opaResponse.results.result[0].description.series.inclusiveDates.inclusiveEndDate.year + ')'
			listfileitem(seriesnaid, seriesname, seriesdate)
		}
		if (level === 'fileUnit') {
			filenaid = t.opaResponse.results.result[0].description.fileUnit.naId
			filename = t.opaResponse.results.result[0].description.fileUnit.title
			listitem(seriesnaid, seriesname, seriesdate)
		}
	});
}


up = function(naid) {
	load();
	url = 'https://catalog.archives.gov/api/v1?resultFields=description&naIds=' + naid
	$.getJSON(url, function(t) {
		level = Object.keys(t.opaResponse.results.result[0].description)[0]
		if ((level === 'recordGroup') || (level === 'recordGroup')) {
			listrg()
		}
		if (level === 'series') {
			RGnaid = t.opaResponse.results.result[0].description.series.parentRecordGroup.naId
			RG = t.opaResponse.results.result[0].description.series.parentRecordGroup.recordGroupNumber
			RGtitle = t.opaResponse.results.result[0].description.series.parentRecordGroup.title
			listseries(RGnaid, RG, RGtitle)
		}
		if (level === 'fileUnit') {
			seriesnaid = t.opaResponse.results.result[0].description.fileUnit.parentSeries.naId
			seriesname = t.opaResponse.results.result[0].description.fileUnit.parentSeries.title
			seriesdate = ' (' + t.opaResponse.results.result[0].description.fileUnit.parentSeries.inclusiveDates.inclusiveStartDate.year + '&ndash;' + t.opaResponse.results.result[0].description.fileUnit.parentSeries.inclusiveDates.inclusiveEndDate.year + ')'
			listfileitem(seriesnaid, seriesname, seriesdate)
		}
	});
}

listrg = function() {

load();
$('#nowviewing').html('<h2>Now viewing: All Record Groups</h2>')

url = 'https://catalog.archives.gov/api/v1?resultTypes=recordGroup&resultFields=num,naId,description.recordGroup.seriesCount,description.recordGroup.title,description.recordGroup.recordGroupNumber&rows=1000'
$.getJSON(url, function(t) {

titles = []

for (f = 0; f < t.opaResponse.results.result.length; f++) {
	naid = t.opaResponse.results.result[f].naId
	series_count = t.opaResponse.results.result[f].description.recordGroup.seriesCount
	RG = t.opaResponse.results.result[f].description.recordGroup.recordGroupNumber
	if (series_count > 0) {
	titles.push({title: '<button class="button" href="#" onclick="listseries(\'' + naid + '\', \'' + RG + '\', \'' + t.opaResponse.results.result[f].description.recordGroup.title + '\');">+ ' + 'Record Group ' + RG + ': ' + t.opaResponse.results.result[f].description.recordGroup.title + '</button><br/>', RG: RG})
	}
	else {
	titles.push({title: '<button class="non-button" onclick="window.open(\'https://catalog.archives.gov/id/' + naid + '\', \'_blank\')" href="https://catalog.archives.gov/id/' + naid + '" >&ndash; &nbsp;Record Group ' + RG + ': ' + t.opaResponse.results.result[f].description.recordGroup.title + '</button><br/>', RG: RG})
	}
	}
	
	titles.sort(function(a, b){
		return a.RG - b.RG;
	});
	
	sortedtitles = [];
	for (w = 0; w < titles.length; w++) {
		sortedtitles.push(titles[w].title)
	};
$('#loading').hide()
offset = 0
$('#listrecords').html('<h3>' + t.opaResponse.results.total + ' record groups:</h3>' + sortedtitles.slice(offset,offset + 50).join('<br/>') + '<br/>');
$('#listrecords').show()

});

}

// scroll = function() {
//  $(window).on("scroll", function() {
// 	var scrollHeight = $(document).height();
// 	var scrollPosition = $(window).height() + $(window).scrollTop();
// 	if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
// 		offset = offset + 50
// 		$('#listrecords').append(sortedtitles.slice(offset,offset + 50).join('<br/>') + '<br/>');
// 	}
// });
// }

listseries = function(RGnaid, RG, RGtitle) {

$('#loading').show()
load();
$('#nowviewing').html('<h2>Now viewing:<br/><br/><button class="button" href="#" onclick="up(' + RGnaid + ')">^ Record Group ' + RG + ': ' + RGtitle + '</button></h2>')
offset = 0;
$('#listrecords').html('')

getresults = function(offset) {
url = 'https://catalog.archives.gov/api/v1?resultTypes=series&description.series.parentRecordGroup.recordGroupNumber=' + RG + '&resultFields=num,naId,description.series.title,description.series.fileUnitCount,description.series.itemCount,description.series.itemAvCount,description.series.inclusiveDates&rows=50&sort=titleSort asc&offset=' + offset
$.getJSON(url, function(j) {

titles = '';

if (offset < j.opaResponse.results.total) { 
	for(f = 0; f < j.opaResponse.results.result.length; f++) {
		
		file_units = Number(j.opaResponse.results.result[f].description.series.fileUnitCount)
		items = Number(j.opaResponse.results.result[f].description.series.itemCount) + Number(j.opaResponse.results.result[f].description.series.itemAvCount)
		naid = j.opaResponse.results.result[f].naId
		name = j.opaResponse.results.result[f].description.series.title
		date = ' (' + j.opaResponse.results.result[f].description.series.inclusiveDates.inclusiveStartDate.year + '&ndash;' + j.opaResponse.results.result[f].description.series.inclusiveDates.inclusiveEndDate.year + ')'

		if ((file_units + items) > 0) {
		titles = titles + '<button class="button" href="#" onclick="listfileitem(\'' + naid + '\', \'' + name + '\', \'' + date + '\');">+ "' + name + '"' + date + '</button><br/><br/>'
		}
		else {
		titles = titles + '<button class="non-button" onclick="window.open(\'https://catalog.archives.gov/id/' + naid + '\', \'_blank\')" href="https://catalog.archives.gov/id/' + naid + '" >&ndash; &nbsp;"' + name + '"' + date + '</button><br/><br/>'
		}
		}

$('#listrecords').append('<h3>' + j.opaResponse.results.total + ' series:</h3>' + titles);
$('#listrecords').show()
}
$('#loading').hide()
});
}

getresults(offset);
//  $(window).on("scroll", function() {
// 	var scrollHeight = $(document).height();
// 	var scrollPosition = $(window).height() + $(window).scrollTop();
// 	if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
// 		offset = offset + 50
// 		$('#loading').show()
// 		$('#loading').html('<center><img width="50px" src="https://upload.wikimedia.org/wikipedia/commons/a/a3/Lightness_rotate_36f_cw.gif"> Loading more...</center>')
// 		getresults(offset)
// 	}
// });



}

listfileitem = function(seriesnaid, seriesname, seriesdate) {
$('#loading').show()
load();
$('#nowviewing').html('<h2>Now viewing: <button class="button" href="#" onclick="up(' + seriesnaid + ')">^ Series "' + seriesname + '"' + seriesdate + '</h2>')

// <button class="accordion">Section 1</button>
// <div class="panel">
//   <p>Lorem ipsum...</p>
// </div>

url = 'https://catalog.archives.gov/api/v1?type=description&naIds=' + seriesnaid + '&resultFields=num,naId,description'
$.getJSON(url, function(l) {

	try {
		RG = l.opaResponse.results.result[0].description.series.parentRecordGroup.recordGroupNumber
		RGnaid = l.opaResponse.results.result[0].description.series.parentRecordGroup.naId
		RGtitle = l.opaResponse.results.result[0].description.series.parentRecordGroup.title
	}
	catch(err) {
		RG = l.opaResponse.results.result[0].description.series.parentCollection.collectionIdentifier
		RGnaid = l.opaResponse.results.result[0].description.series.parentCollection.naId
		RGtitle = l.opaResponse.results.result[0].description.series.parentCollection.title
	}

	$('#nowviewing').html('<font size="5">Now viewing:</font><br/><font size="4"><button style="margin-left: 30px; margin-top: 5px; margin-bottom: 5px" class="button" href="#" onclick="up(' + RGnaid + ')">^ Record Group ' + RG + ': ' + RGtitle + '</button><br/><button style="margin-left: 60px; margin-top: 5px" class="button" href="#" onclick="up(' + seriesnaid + ')">^ Series "' + seriesname + '"' + seriesdate + '</button></font><hr/>')


});

titles = ''
totals=''

url = 'https://catalog.archives.gov/api/v1?type=description&description.fileUnit.parentSeries.naId=' + seriesnaid + '&resultFields=num,naId,description.fileUnit.title,description.fileUnit.itemCount,description.fileUnit.itemAvCount&rows=1000&sort=titleSort asc'
$.getJSON(url, function(j) {
	totals = Number(totals) + Number(j.opaResponse.results.total);
	if (j.opaResponse.results.total > 0) {
		for(f = 0; f < j.opaResponse.results.result.length; f++) {
			try {
				items = Number(j.opaResponse.results.result[f].description.fileUnit.itemCount) + Number(j.opaResponse.results.result[f].description.fileUnit.itemAvCount)
			} catch (err){
				items = 0;
				}
			naid = j.opaResponse.results.result[f].naId
			name = j.opaResponse.results.result[f].description.fileUnit.title
		
			if (items > 0) {
			titles = titles + '<button class="button" href="#" onclick="listitem(\'' + naid + '\', \'' + name + '\');">+ ' + name + '</button><br/><br/>'
			}
			else {
			titles = titles + '<button class="non-button" onclick="window.open(\'https://catalog.archives.gov/id/' + naid + '\', \'_blank\')" href="https://catalog.archives.gov/id/' + naid + '" >&ndash; &nbsp;' + name + '</button><br/><br/>'
			}
			}
		}
url = 'https://catalog.archives.gov/api/v1?type=description&description.item.parentSeries.naId=' + seriesnaid + '&resultFields=num,naId,description.item.title&rows=1000&sort=titleSort asc'
$.getJSON(url, function(j) {
	totals = Number(totals) + Number(j.opaResponse.results.total);
	if (j.opaResponse.results.total > 0) {
		for(f = 0; f < j.opaResponse.results.result.length; f++) {
			naid = j.opaResponse.results.result[f].naId
			name = j.opaResponse.results.result[f].description.item.title
		
			titles = titles + '<button class="non-button" onclick="window.open(\'https://catalog.archives.gov/id/' + naid + '\', \'_blank\')" href="https://catalog.archives.gov/id/' + naid + '" >&ndash; &nbsp;' + name + '</button><br/><br/>'
			}
		}

url = 'https://catalog.archives.gov/api/v1?type=description&description.itemAv.parentSeries.naId=' + seriesnaid + '&resultFields=num,naId,description.itemAv.title&rows=1000&sort=titleSort asc'
$.getJSON(url, function(j) {
	totals = Number(totals) + Number(j.opaResponse.results.total);
	if (j.opaResponse.results.total > 0) {
		for(f = 0; f < j.opaResponse.results.result.length; f++) {
			naid = j.opaResponse.results.result[f].naId
			name = j.opaResponse.results.result[f].description.itemAv.title
		
			titles = titles + '<button class="non-button" onclick="window.open(\'https://catalog.archives.gov/id/' + naid + '\', \'_blank\')" href="https://catalog.archives.gov/id/' + naid + '" >&ndash; &nbsp;' + name + '</button><br/><br/>'
			}
		}
		
$('#loading').hide()
$('#listrecords').html('<h3>' + totals + ' items and/or file units:</h3><table>' + titles + '</table>');
$('#listrecords').show()
	});
	});
		});
}

listitem = function(filenaid, filename) {
$('#loading').show()
load();
url = 'https://catalog.archives.gov/api/v1?type=description&naIds=' + filenaid + '&resultFields=num,naId,description'
$.getJSON(url, function(l) {

	try {
		RG = l.opaResponse.results.result[0].description.fileUnit.parentSeries.parentRecordGroup.recordGroupNumber
		RGnaid = l.opaResponse.results.result[0].description.fileUnit.parentSeries.parentRecordGroup.naId
		RGtitle = l.opaResponse.results.result[0].description.fileUnit.parentSeries.parentRecordGroup.title
	}
	catch(err) {
		RG = l.opaResponse.results.result[0].description.fileUnit.parentSeries.parentCollection.collectionIdentifier
		RGnaid = l.opaResponse.results.result[0].description.fileUnit.parentSeries.parentCollection.naId
		RGtitle = l.opaResponse.results.result[0].description.fileUnit.parentSeries.parentCollection.title
	}
	
	seriesnaid = l.opaResponse.results.result[0].description.fileUnit.parentSeries.naId
	seriesname = l.opaResponse.results.result[0].description.fileUnit.parentSeries.title
	seriesdate = ' (' + l.opaResponse.results.result[0].description.fileUnit.parentSeries.inclusiveDates.inclusiveStartDate.year + '&ndash;' + l.opaResponse.results.result[0].description.fileUnit.parentSeries.inclusiveDates.inclusiveEndDate.year + ')'

	$('#nowviewing').html('<font size="5">Now viewing:</font><br/><font size="4"><button style="margin-left: 30px; margin-top: 5px; margin-bottom: 5px" class="button" href="#" onclick="up(' + RGnaid + ')">^ Record Group ' + RG + ': ' + RGtitle + '</button><br/><button style="margin-left: 60px; margin-top: 5px; margin-bottom: 5px" class="button" href="#" onclick="up(' + seriesnaid + ')">^ Series "' + seriesname + '"' + seriesdate + '</button><br/><button style="margin-left: 90px; margin-top: 5px" class="button" href="#" onclick="up(' + filenaid + ')">^ File unit "' + filename + '"</button></font><hr/>')


});

// <button class="accordion">Section 1</button>
// <div class="panel">
//   <p>Lorem ipsum...</p>
// </div>

titles = ''
totals=''

url = 'https://catalog.archives.gov/api/v1?type=description&description.item.parentFileUnit.naId=' + filenaid + '&resultFields=num,naId,description.item.title&rows=1000&sort=titleSort asc'
$.getJSON(url, function(j) {
	totals = Number(totals) + Number(j.opaResponse.results.total);
	if (j.opaResponse.results.total > 0) {
		for(f = 0; f < j.opaResponse.results.result.length; f++) {
			naid = j.opaResponse.results.result[f].naId
			name = j.opaResponse.results.result[f].description.item.title
			titles = titles + '<button class="non-button" onclick="window.open(\'https://catalog.archives.gov/id/' + naid + '\', \'_blank\')" href="https://catalog.archives.gov/id/' + naid + '" >&ndash; &nbsp;' + name + '</button><br/><br/>'
			}
		}
url = 'https://catalog.archives.gov/api/v1?type=description&description.itemAv.parentFileUnit.naId=' + filenaid + '&resultFields=num,naId,description.itemAv.title&rows=1000&sort=titleSort asc'
$.getJSON(url, function(j) {
	totals = Number(totals) + Number(j.opaResponse.results.total);
	if (j.opaResponse.results.total > 0) {
		for(f = 0; f < j.opaResponse.results.result.length; f++) {
			naid = j.opaResponse.results.result[f].naId
			name = j.opaResponse.results.result[f].description.itemAv.title
		
			titles = titles + '<button class="non-button" onclick="window.open(\'https://catalog.archives.gov/id/' + naid + '\', \'_blank\')" href="https://catalog.archives.gov/id/' + naid + '" >&ndash; &nbsp;' + name + '</button><br/><br/>'
			}
		}
$('#loading').hide()
$('#listrecords').html('<h3>' + totals + ' items:</h3><table>' + titles + '</table>');
$('#listrecords').show()
	});
		});
}

});