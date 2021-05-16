// IntelliBoard - Copyright (C) 2021 Moritz Kaufmann
// Update for the board and the overview

// Update the content by a post ajax request
function updateContent(content: object) {
    //@ts-ignore
    postAjax("/update", { newcontent: JSON.stringify(content).replaceAll("´", "&#96;").replaceAll("`", "&#96;")}, (data) => {
        // Check if code is 200
        if (!(data.startsWith("200"))) {
            console.log("Error on updating Content: " + data)
        }
    })
}

// Make a Post Request
function postAjax(url:string, data:any, success:any) {
    // Generate Parameter
    var params = typeof data == 'string' ? data : Object.keys(data).map(
        function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
    ).join('&');

    // Create Request
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open('POST', url);
    xhr.onreadystatechange = function() {
        if (xhr.readyState>3 && xhr.status==200) { success(xhr.responseText); }
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    // Send Parameter
    xhr.send(params);
    return xhr;
}
