//Used to make HTTP requests
var request = require('request');
//Used to parse and select HTML elements on the page
var cheerio = require('cheerio');
//Used to parse URLS
var URL = require('url-parse');


var pageToVisit = "http://www.arstechnica.com";

var counter = 1;

   var checker = function() {

       setTimeout(function(){

       request(pageToVisit, function (error, response, body) {
           console.log("Starting search now...")
           if (error) {
               console.log("Error:" + error);
           }
           //Check status code(200 is HTTP ok)
           console.log("Status code: " + response.statusCode);
           if (response.statusCode === 200) {
               //Parse the document body
               var $ = cheerio.load(body);
               //Log out the title name(testing if cheerio works)

               // console.log("Page title: " + $('title').text());

               var checkWords = searchForWords($, "firefox");
               if (checkWords) {
                   console.log("Word search completed. Founded the one word you requested");
               }
               ;


               collectInternalLinks($);

           }

       });

           if(counter < 10){
                checker();
           };

    }, 10000);
   };


checker();


function searchForWords($, word){
    var bodyText = $('html > body').text();
    if(bodyText.toLowerCase().indexOf(word.toLowerCase()) !== -1){
        return true;
    }
    return false;
}

function collectInternalLinks($){
    var allRelativeLinks = [];
    var allAbsoluteLinks = [];

    var relativeLinks = $("a[href^='/']");
    relativeLinks.each(function(){
       allRelativeLinks.push($(this).attr('href'));
    });

    var absoluteLinks = $("a[href^='http']");
    absoluteLinks.each(function(){
       allAbsoluteLinks.push($(this).attr('href'));
    });

    //Relative Links are links are in that domain
    console.log("Found " + allRelativeLinks.length + " relative Links");
    //Absoluite Links are links that are found leading to other sites
    console.log("Found " + allAbsoluteLinks.length + " absolute Links");

}
