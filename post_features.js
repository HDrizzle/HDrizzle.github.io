function setup_page(page_matadata_raw) {
    let page_matadata = JSON.parse(page_matadata_raw)[get_page_name()];
    for(let i = 0; i < page_matadata.tags.length; i++) {
        let tag_name = page_matadata.tags[i];
        let new_tag_elem = create_tag_element(tag_name);
        document.getElementById("tag-list").appendChild(new_tag_elem);
    }
}

function get_page_name() {
    return document.getElementById("post-id").innerHTML;
}

window.onload = function () {httpGetAsync("/posts_metadata.json", setup_page)};