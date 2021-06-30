function download(filename, text, mimeType = "text/xml") {
    var element = document.createElement("a");
    element.setAttribute(
      "href",
      `data:${mimeType};charset=utf-8,` + encodeURIComponent(text)
    );
    element.setAttribute("download", filename);
  
    element.style.display = "none";
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }
  
  function formatDateToSQL(date) {
    return date.toISOString().slice(0, 19).replace("T", " ");
  }