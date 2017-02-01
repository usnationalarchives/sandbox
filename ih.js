jQuery(document).ready(function($){
	$( function() {
    	$( document ).tooltip();
	} );
	$(document).ready(function() {
		$("#input").ready(function(event){
			function generate(o) {
				$("#images").html('<center><img width=500 src="https://catalog.archives.gov/images/loader.gif"/></center>');
				var images = '';
				$.getJSON('https://catalog.archives.gov/OpaAPI/iapi/v1?action=search&q=%22citizen%20contributor%22&tabType=online&sort=naIdSort%20desc&rows=500&offset=' + o, function(t) {
					for (i = 0; i < t.opaResponse.results.result.length; i++) {
						images = images + '<a href="https://catalog.archives.gov/id/' + t.opaResponse.results.result[i].naId + '"><img title="Title: ' + t.opaResponse.results.result[i].briefResults.titleLine[0].value + '; Creator: ' + t.opaResponse.results.result[i].briefResults.metadataArea[2].value + '; National Archives Identifier: ' + t.opaResponse.results.result[i].briefResults.metadataArea[0].value + '" src="https://catalog.archives.gov/OpaAPI/media/' + t.opaResponse.results.result[i].naId + '/' + t.opaResponse.results.result[i].thumbnailFile + '" height="50" width="50" alt="' + t.opaResponse.results.result[i].briefResults.titleLine[0].value + '"/></a>';
						}
					total = t.opaResponse.results['@total']
			$('#images').html('<p>There are currently <strong>' + total + '</strong> records with citizen-contributed images. Showing 500:</p><br/>' + images)
			});
		}
			o = 0;
			generate(o)
		
		$("#more").click(function(event){
			$(window).scrollTop(0);
			o = o + 500;
			generate(o)
		});
		
		});
	});
});
