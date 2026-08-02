function setup_page(page_matadata) {
    for(let i = 0; i < page_matadata.tags.len(); i++) {
        let tag_name = page_matadata.tags[i];
        let new_tag_elem = document.createElement("span");
        new_tag_elem.innerHTML = tag_name;
        new_tag_elem.className = "tag";
        document.getElementById("tag-list").appendChild(new_tag_elem);
    }
}

function get_page_name() {
    return document.getElementById("post-id").innerHTML;
}

function begin_post_metadata_load() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4){
        	if (xmlHttp.status == 200){
        		let object_ = JSON.parse(xmlHttp.responseText);
                setup_page(object_[get_page_name()]);
        	}
        	window.waitingForServer = false;
        }
    }
    window.waitingForServer = true;
    xmlHttp.open("GET", "/posts_metadata.json", true);// true for asynchronous
    xmlHttp.send(null);
}

window.onload = begin_post_metadata_load;