 $(document).ready(function() {
	
	
	window.onload = function WindowLoad() {
			
		query = window.location.search.substring(1).split("&");
		
		if (query[0] !== '') {
			params = new String();
			for (p = 0; p < query.length; p++) {
				params[query[p].split("=")[0]] = query[p].split("=")[1] 
			}

		if (params.q == undefined) { keyword = '*:*'}
			else { keyword = params.q };
		if (params.offset == undefined) { offset = 0 }
			else { offset = Number(params.offset) };
		loadresults(Number(offset))
				}
	}
	
	$('#keyword').keypress(function(enter){
		if(enter.keyCode==13)
		$('#input').click();
		});
	$('#jumpval').keypress(function(enter){
		if(enter.keyCode==13)
		$('#jump').click();
		});
	
	function loadresults(offset) {
		var start = offset + 1;
		var end = offset + 25;
		$('#file_unit_results').html('<center><img width=500 src="https://catalog.archives.gov/images/loader.gif"/></center>');
		var url = 'https://catalog.archives.gov/OpaAPI/iapi/v1?action=search&f.locationIds=7&highlight=true&facet=true&facet.fields=oldScope,level,materialsType,fileFormat,locationIds,dateRangeFacet' + '&q=' + keyword + '&rows=25&offset=' + offset
	$('#json').html('<small>See results in: <a href="' + url + '">JSON</a> | <a href="' + url + '&format=xml">XML</a></small><br/><br/>');
	$.getJSON(url, function(t) {
			var results = t.opaResponse.results['@total'].toLocaleString("en");
			var time = new Date(t.opaResponse.header.time);
			time = time.toString()
			if (end > results) {
				count = end - results;
				end = results
				};
			if (results < 25) {
			$('#results').html('<ul><ul>There are <u>' + results + '</u> results for this search. Displaying results ' + start + ' – ' + results + ':</ul></ul></ul></ul><br/><br/>')
			}
			else {
			$('#results').html('<ul><ul>There are <u>' + results + '</u> results. Displaying results ' + start + ' – ' + end + ':</ul></ul><br/><br/>');
			$('#paginate').show();
			$('#paginatebottom').show();
			}
			$('#time').html('<small>This data was generated at<br/>' + time + '<br/> </small>');
			$('#json').show();
			var result = ''
			if (offset < t.opaResponse.results['@total']) {
				for (n = 0; n < t.opaResponse.results.result.length; n++) {
					teaser = t.opaResponse.results.result[n].teaser;
					title = '';
					date = '';
					local_identifier = '';
					creator = '';
					series = '';
					collection = '';
					naid = '';
					
					metadata = t.opaResponse.results.result[n].briefResults.metadataArea
					for (r = 0; r < metadata.length; r++) {
						if (metadata[r].name == 'naId') {
							naid = metadata[r].value
							}
						if (metadata[r].name == 'localId') {
							local_identifier = metadata[r].value
							}
						if (metadata[r].name == 'creators') {
							creator = metadata[r].value[0]
							}
						if (metadata[r].name == 'collectionIdentifier') {
							collection = metadata[r].value
							}
						if (metadata[r].name == 'seriesTitle') {
							series = metadata[r].value
							}
					}
					titleline = t.opaResponse.results.result[n].briefResults.titleLine
					for (r = 0; r < titleline.length; r++) {
						if (titleline[r].name == 'title') {
							title = titleline[r].value
							}
						if (titleline[r].name == 'date') {
							date = titleline[r].value
							}
					}
					if (t.opaResponse.results.result[n].thumbnailFile != '') {
						thumbnail = 'https://catalog.archives.gov/OpaAPI/media/' + naid + '/' + t.opaResponse.results.result[n].thumbnailFile;
					}
					else {
						iconType = t.opaResponse.results.result[n].iconType;
						if (iconType == 'nara/item') {
							icon = 'item'
						}
						if (iconType == 'nara/item') {
							icon = 'item'
						}
						if (iconType == 'nara/file-unit') {
							icon = 'fileunit'
						}
						if (iconType == 'nara/collection') {
							icon = 'collection'
						}
						if (iconType == 'nara/series') {
							icon = 'series'
						}
						if (iconType == 'nara/itemAv') {
							icon = 'video'
						}
						if (iconType == 'nara/record-group') {
							icon = 'recordgroup'
						}
						thumbnail = 'https://catalog.archives.gov/images/' + icon + '.svg'
					}
					
					if (date != '') {
						date = ', ' + date
						}					
					if (collection != '') {
						collection = '<br/>From collection: <strong>' + collection + '</strong>'
						}					
					if (series != '') {
						series = '<br/>From series: <strong>' + series + '</strong>'
						}					
					if (local_identifier != '') {
						local_identifier =  ' &nbsp; &nbsp; &nbsp; Local identifier: <strong>' + local_identifier + '</strong>'
						}
					
					result = result + '<tr><td class="results" width="10%" valign="top" align="left"><a href="https://catalog.archives.gov/id/' + naid + '"><img width="65" src="' + thumbnail + '"/></a></td><td class="results" width="85%"><a href="https://catalog.archives.gov/id/' + naid + '">"<strong>' + title + '</strong>"</a>' + date + '<br/>National Archives Identifier: <strong>' + naid + '</strong>' + local_identifier + collection + series + '<br/>Creator: <strong>' + creator + '</strong><br/><blockquote>' + teaser + '</blockquote><br/></td></tr>'
				}
			}
			else {
				if (t.opaResponse.results['@total'] > 0) {
					result = '<p><strong>There are no further results for this search. Please use the buttons above to navigate to a page with results.</strong></p>';
			$('#results').html('<ul><ul>There are <u>' + results + '</u> <span style="color:#993333">file units</span> for this search.</ul></ul><br/><br/>')
					}
				else {
					result = '';
			$('#results').html('<ul><ul><strong>There are no results for this search. Please try again.</strong></ul></ul><br/><br/>')
			}
				}
			$('#display_results').html(result);
	   });
	}
	 $("#input").click(function(event){
		
		var url = window.location.pathname;
		
		keyword = $('#keyword').val();
		if (keyword !== '') { keyword = '&q=' + keyword };
		newParam = '?offset=0' + keyword
		newUrl=url.replace(newParam,"");
		newUrl+=newParam;
		window.location.href = newUrl;

		});
		
	$("#next").click(function(event){
		offset = offset + 25;
		var url = window.location.href;
		newUrl = url.replace(/offset=[0-9]*(&*)/g,'offset=' + offset + '$1');
		window.location.href = newUrl
	});
	
	$("#prev").click(function(event){
		if (offset > 24) {
			offset = offset - 25;
			var url = window.location.href;
		newUrl = url.replace(/offset=[0-9]*(&*)/g,'offset=' + offset + '$1');
			window.location.href = newUrl
		}
	});
	$("#nextbot").click(function(event){
		offset = offset + 25;
		var url = window.location.href;
		newUrl = url.replace(/offset=[0-9]*(&*)/g,'offset=' + offset + '$1');
		window.location.href = newUrl
	});
	$("#prevbot").click(function(event){
		if (offset > 24) {
			offset = offset - 25;
			var url = window.location.href;
		newUrl = url.replace(/offset=[0-9]*(&*)/g,'offset=' + offset + '$1');
			window.location.href = newUrl
		}
	});
	$("#jump").click(function(event){
		var jumpval = $('#jumpval').val();
		offset = (jumpval - 1) * 25;
		var url = window.location.href;
		newUrl = url.replace(/offset=[0-9]*(&*)/g,'offset=' + offset + '$1');
		window.location.href = newUrl
});
})