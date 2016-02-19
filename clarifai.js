function getCredentials(cb) {
    var data = {
        'grant_type': 'client_credentials',
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    };

    return $.ajax({
        'url': 'https://api.clarifai.com/v1/token',
        'data': data,
        'type': 'POST'
    })
            .then(function (r) {
                localStorage.setItem('accessToken', r.access_token);
                localStorage.setItem('tokenTimestamp', Math.floor(Date.now() / 1000));
                cb();
            });
}

// Called by .run
// Function to make the POST request to the Clarifai API using credentials somehow
// INPUTS: imgurl - the url of the image to be parsed for color
function postImage(imgurl) {
    var data = {
        'url': imgurl
    };
    //var accessToken = localStorage.getItem('accessToken');
    var accessToken = 'ciugyihB0ruV5cwSGypIfnXaxQX3Wz';

// Changed url to use color model instead of regular tag
    return $.ajax({
        'url': 'https://api.clarifai.com/v1/color',
        'headers': {
            'Authorization': 'Bearer ' + accessToken
        },
        'data': data,
        'type': 'POST'
    }).then(function (r) {
        parseResponse(r);
    });
}

var tags = [];
var densities = [];
var sortd = [];

// Called by .postImage
// Obtains colors and densities from Clarifai's API
// INPUT: resp - JSON response from Clarifai's API
function parseResponse(resp) {

    if (resp.status_code === 'OK') {
        var results = resp.results;
        for (i = 0; i < results[0].colors.length; i++) {
            tags[i] = results[0].colors[i].w3c.hex;
            densities[i] = results[0].colors[i].density;
        }
        
        // SORT SOME JAMS
        // sortd array holds the indeces of the colors/densities 
        // in order of decreasing weight
        var absMax = 1;
        var max;
        var maxI;
        for (i=0;i<densities.length; i++){
            max = 0;
            for(j=0;j<densities.length; j++){
                if(densities[j]<absMax && densities[j]>max){
                    max = densities[j];
                    maxI = j;
                }
            }
            sortd[i] = maxI;
            absMax = densities[sortd[i]];
            
        }

    } else {
        console.log('Sorry, something is wrong.');
    }

    $('#tags').text(tags.toString().replace(/,/g, ', '));
    $('#dens').text(densities.toString().replace(/,/g, ', '));
    setColor(elements);
    return tags;
}

function returnTags() {
    return tags;
}

function returnWeights() {
    return densities;
}

var elements = [];  // global

// Function that takes in a variable length array and sets colors?
function requestColor(imgurl, divelmt) {
    // Set css property of div argument with jQuery
    //divelmt.css("backgroundColor", "red")
    elements = divelmt;
    run(imgurl);
}

// Called by .parseResponse
// Sets the css background property of elements using jQuery
// Input: elmt - the HTML element(s) to be modified
function setColor(elmt) {
    for (i = 0; i < elmt.length; i++) {
        j=i%(tags.length);
        elmt[i].css("backgroundColor", tags[sortd[j]]);
    }
}

// Called in index.html
// Makes the request and calls postImage using the input url
// INPUT: imgurl - the url of the image to be parsed for color
function run(imgurl) {
    if (localStorage.getItem('tokenTimeStamp') - Math.floor(Date.now() / 1000) > 86400
            || localStorage.getItem('accessToken') === null) {
        getCredentials(function () {
            postImage(imgurl);
        });

    } else {
        postImage(imgurl);
    }
}