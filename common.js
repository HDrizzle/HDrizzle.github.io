function httpGetAsync(url, callback)// copied from stackoverflow.com/questions/247483
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4){
        	if (xmlHttp.status == 200){
        		callback(xmlHttp.responseText);
        	}
        	window.waitingForServer = false;
        }
    }
    window.waitingForServer = true;
    xmlHttp.open("GET", url, true);// true for asynchronous
    xmlHttp.send(null);
}

function post_url_from_id(post_id) {
    return "/posts/" + post_id;
}

// returns: {tag-name: number of occurances}
function compile_all_tags(posts_metadata) {
    let out = {};
    for(let post_id in posts_metadata) {
        // Skip post if hidden
        if(posts_metadata[post_id].hasOwnProperty("hidden")) {
            if(posts_metadata[post_id]["hidden"]) {
                continue;
            }
        }
        let tags = posts_metadata[post_id]["tags"];
        for(let i = 0; i < tags.length; i++) {
            let tag = tags[i];
            if(out.hasOwnProperty(tag)) {
                out[tag] += 1;
            }
            else {
                out[tag] = 1;
            }
        }
    }
    return out;
}

function create_tag_element(tag) {
    let new_tag_elem = document.createElement("span");
    new_tag_elem.innerHTML = tag.toUpperCase();
    new_tag_elem.className = "tag";
    return new_tag_elem;
}