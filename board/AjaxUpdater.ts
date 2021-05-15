function updateContent(content: object) {
    //@ts-ignore
    postAjax("/update", { newcontent: JSON.stringify(content).replaceAll("´", "&#96;").replaceAll("`", "&#96;")}, (data) => {
        if (!(data.startsWith("200"))) {
            console.log("Error on updating Content: " + data)
        }
    })
}


function postAjax(url:string, data:any, success:any) {
    var params = typeof data == 'string' ? data : Object.keys(data).map(
        function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
    ).join('&');

    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open('POST', url);
    xhr.onreadystatechange = function() {
        if (xhr.readyState>3 && xhr.status==200) { success(xhr.responseText); }
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);
    return xhr;
}
