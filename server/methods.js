Meteor.methods({
	fetchRemoteData: function (urlString) {
		if(urlString.substring(0,4)!=="http"){
			urlString = "http://" + urlString;
		}
		console.log(urlString);
        try{
            var result = HTTP.get(urlString);
        } catch(e){
            new Error;
        }
        var Cheerio = Meteor.require('cheerio');          
		$ = Cheerio.load(result.content);
		if( $("meta[property='og:title']").attr("content") ){
			return [
				$("meta[property='og:title']").attr("content"),
				$("meta[property='og:image']").attr("content"),
				$("meta[property='og:description']").attr("content")
			];
		}

	}
});