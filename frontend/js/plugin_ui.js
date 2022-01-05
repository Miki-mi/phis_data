var background = chrome.extension.getBackgroundPage();
var colors = {
    // "-1":"#58bc8a", //green
    // "0":"#ffeb3c", //yellow
    // "1":"#ff8b66" //red
    "-1":"#58bc8a", //green
    "0":"#FFDA3C", //yellow
    "1":"#e46666" //red
};
var featureList = document.getElementById("features");

var roundBtn = document.querySelector('.rounded-circle');
roundBtn.addEventListener('click', toggleSwitch);

var showResults = document.querySelector('#results');
showResults.addEventListener('click', toggleResults);

// RUN FIRST
chrome.storage.local.get('state', data => {
    if(!data.state)
        chrome.storage.local.set({state: 'on'});
    // alert('Extension is ' + data.state);
    changeUI();
    $("#features").hide();
});

function toggleResults(){
    chrome.storage.local.get('state', data => {
        if (data.state === 'on'){ //toggle results
            $("#features").toggle();
        }
    })
};

function toggleSwitch(){
    chrome.storage.local.get('state', data => {
        if (data.state == 'on'){ // turn off extension
            chrome.storage.local.set({state: 'off'});
            changeUI();
        }else if (data.state == 'off'){ // turn on extension
            chrome.storage.local.set({state: 'on'});
            changeUI();
            $("#site_msg").text("Refresh the page for changes to take effect.");
        }
    })
};

function changeUI(){
    chrome.storage.local.get('state', data => {
        if (data.state == 'on'){
            chrome.tabs.query({ currentWindow: true, active: true }, function(tabs){
                var result = background.results[tabs[0].id];
                var isPhish = background.isPhish[tabs[0].id];
                var legitimatePercent = background.legitimatePercents[tabs[0].id];
            
                for(var key in result){
                    var newFeature = document.createElement("li");
                    //console.log(key);
                    newFeature.textContent = key;
                    //newFeature.className = "rounded";
                    newFeature.style.backgroundColor=colors[result[key]];
                    featureList.appendChild(newFeature);
                }
                
                // alert(String(typeof(legitimatePercent)));
                
                $("#site_status").show();
                $("#results").show();

                if(isPhish) {
                    $("#res-circle").css("background", "#e46666");
                    $("#site_msg").text("This website may be a phishing attempt!");
                    $("#site_status").text("DANGER");
                    $("#site_score").text(parseInt(legitimatePercent)-20+"%");
                }
                else{
                    $("#res-circle").css("background", "#58bc8a");
                    $("#site_msg").text("This website is safe to use.");
                    $("#site_status").text("SAFE");
                    $("#site_score").text(parseInt(legitimatePercent)+"%");
                    if(String(typeof(legitimatePercent)) == "undefined"){ // If website is Whitelisted
                        $("#site_status").hide();
                        $("#results").hide();
                        $("#site_score").text("SAFE");
                        $("#site_msg").text("This website has been whitelisted and is safe to use.");
                    }
                }

                // $("#site_score").text("ON");
                // $("#site_msg").text("Extension is " + data.state);
            });
        }else if (data.state == 'off'){
            $("#res-circle").css("background", "#BFBFBF");
            $("#site_score").text("OFF");
            $("#site_msg").text("You're at risk of being phised!");
            $("#site_status").hide();
            $("#features").hide();
            $("#results").hide();
            // alert('Extension is ' + data.state);
            // $("#site_msg").text("Extension is " + data.state);
        };
    });
}