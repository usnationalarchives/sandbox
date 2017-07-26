jQuery(document).ready(function($){
	$( function() {
    	$("#imageswidget").tooltip();
    	$("#images").tooltip();
    	
	} );
	$(document).ready(function() {
	
		$("#input").ready(function(event){
	
	window.onload = function WindowLoad() {
	
	params = window.location.search.substring(1).split("=");
	
	o = 0;
	pg = 1;
	
	if (params[0] == 'pg') {
		pg = params[1];
		o = (+pg * 500) - 500;
		$(window).scrollTop(0);
		generate(o)
		}
	else {
		generate(o)
	}
	}
			function generate(o) {
				$("#images").html('<center><img width=500 src="https://catalog.archives.gov/images/loader.gif"/></center>');
				var images = '';
				rows= 500;
				if (location.href.split("/").slice(-1) == 'innovation-hub.html') { rows = 20 };
				$.getJSON('https://catalog.archives.gov/OpaAPI/iapi/v1?action=search&q=%22citizen%20contributor%22&tabType=online&sort=naIdSort%20desc&rows=' + rows + '&f.locationIds=32 or 36&offset=' + o, function(t) {
					for (i = 0; i < t.opaResponse.results.result.length; i++) {
						for (d = 0; d < t.opaResponse.results.result[i].briefResults.metadataArea.length; d++) {
							if (t.opaResponse.results.result[i].briefResults.metadataArea[d].name == 'creators') {
								creators = t.opaResponse.results.result[i].briefResults.metadataArea[d].value
								if (creators.isArray == 'True') {
									creatorarray = creators
									creators = creatorarray[0]
// 									for (c = 0; c < creators.length; c++) {
// 										creators = creators + '&#013;' + creatorarray[c]
// 										}
									}
								}
							if (t.opaResponse.results.result[i].briefResults.metadataArea[d].name == 'naId') { naid = t.opaResponse.results.result[i].briefResults.metadataArea[d].value }
						}
						if (t.opaResponse.results.result[i].thumbnailFile.startsWith('http', 0) == true) {
							images = images + '<a href="https://catalog.archives.gov/id/' + t.opaResponse.results.result[i].naId + '"><img data-html="true" title="Title:&#013;&#34;' + t.opaResponse.results.result[i].briefResults.titleLine[0].value + '&#34;&#013;&#013;Creator:&#013;' + creators + '&#013;&#013;National Archives Identifier: ' + naid + '&#013;&#013;(Click image for full catalog record.)" src="' + t.opaResponse.results.result[i].thumbnailFile + '" style="width:50px; height:50px" /></a>';
							}
						else {
							images = images + '<a href="https://catalog.archives.gov/id/' + t.opaResponse.results.result[i].naId + '"><img data-html="true" title="Title:&#013;&#34;' + t.opaResponse.results.result[i].briefResults.titleLine[0].value + '&#34;&#013;&#013;Creator:&#013;' + creators + '&#013;&#013;National Archives Identifier: ' + naid + '&#013;&#013;(Click image for full catalog record.)" src="https://catalog.archives.gov/OpaAPI/media/' + t.opaResponse.results.result[i].naId + '/' + t.opaResponse.results.result[i].thumbnailFile + '" style="width:50px; height:50px" /></a>';
						}						}
					total = t.opaResponse.results['@total']
			if ((t.opaResponse.results.result.length == 500) && ((total - o) !== 500)) {
				$('#images').html('<p>There are currently <strong>' + total + '</strong> records with citizen-contributed images. Showing 500:</p><br/>' + images);
				$('#more').show()
			}
			else {
				$('#more').hide();
				$('#images').html('<p>There are currently <strong>' + total + '</strong> records with citizen-contributed images. This is the end of the results set. Showing final ' + t.opaResponse.results.result.length + ':</p><br/>' + images)
				$('#imageswidget').html('<p>There are currently <strong>' + total + '</strong> records with citizen-contributed images from the Innovation Hub. Here are the last 20:</p><br/>' + images);
				
			}
			});
		}
		
		$("#more").click(function(event){
			pg = +pg + 1;
			var url = window.location.pathname;
			newParam="?pg=" + pg;
			newUrl=url.replace(newParam,"");
			newUrl+=newParam;
			window.location.href = newUrl;
		});
		
		});
	});
});
