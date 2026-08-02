function create_post_thumbnail(post_id, post_metadata) {
    let elem = document.createElement("a");
    elem.className = "post-thumbnail";
    elem.id = "post-thumbnail-" + post_id;
    elem.innerHTML = post_metadata["name"];
    elem.attributes["href"] = post_url_from_id(post_id);
    return elem;
}

// Should be called on page load and whenever the tag search bar is edited
function list_top_tags() {
    let tag_search = document.getElementById("tag-search").value;
    // get array of tags and occurances, maybe filter them by search query
    let tags_array = [];// [[tag-name, N occurances], ...]
    for(let tag in tags_global) {
        if(tag_search.length > 0) {
            if(!tag.includes(tag_search)) {
                continue;
            }
        }
        tags_array.push([tag, tags_global[tag]]);
    }
    // Sort them
    tags_array.sort(function(a, b){a[1] - b[1]});
    // Add up to N of them to tag box
    let tag_box = document.getElementById("tag-box");
    tag_box.childNodes = [];// Make sure old stuff is deleted when refresh
    for(let i = 0; i < 10 & i < tags_array.length; i++) {
        // Create tag element
        let tag_elem = create_tag_element("+ " + tags_array[i][0] + " " + tags_array[i][1]);
        tag_elem.addEventListener("click", function(){add_tag_to_filter(tags_array[i][0])})
        tag_elem.id = "tag-box-entry-" + tags_array[i][0];
        tag_box.appendChild(tag_elem);
    }
}

// Called by event listener
function add_tag_to_filter(tag_name) {
    let filter_tags = document.getElementById("applied-filter-tags");
    // Make sure its not already there
    if(filter_tags.querySelector("#applied-filter-tag-" + tag_name) == null) {
        let tag_elem = create_tag_element("- " + tag_name + " " + tags_global[tag_name]);
        tag_elem.addEventListener("click", function(){remove_tag_from_filter(tag_name)})
        tag_elem.id = "applied-filter-tag-" + tag_name;
        filter_tags.appendChild(tag_elem);
    }
}

// Called by event listener
function remove_tag_from_filter(tag_name) {
    document.querySelector("#applied-filter-tags #applied-filter-tag-" + tag_name).remove();
}

var posts_metadata_global = {};
var tags_global = {}// tags should be: {tag-name: N occurances}

function setup_page_and_global_variables(posts_matadata_raw) {
    posts_metadata_global = JSON.parse(posts_matadata_raw);
    tags_global = compile_all_tags(posts_metadata_global);
    list_top_tags();
}

window.onload = function () {httpGetAsync("/posts_metadata.json", setup_page_and_global_variables)};