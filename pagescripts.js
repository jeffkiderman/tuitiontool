var data;

//Request data from server
function loadData(){
    var req = new XMLHttpRequest();
    req.open("GET", "http://localhost:3000/sourcedata", true);
    req.addEventListener("load",function(){
                         data = req.responseText;
                         });
    req.send(null);
}

function getData(){
    return data;
}

//compiles templates
function createMenu() {
  // Grab the template script
console.log(data);
console.log("isArray returned "+ Array.isArray(data));
    var theTemplateScript = document.getElementById("school-selection-form").innerHTML;
console.log("theTemplateScript:   " + theTemplateScript);
  // Compile the template
  var theTemplate = Handlebars.compile(theTemplateScript);
console.log("theTemplate:   " + theTemplate);
  // Pass our data to the template
  var theCompiledHtml = theTemplate(data);
console.log("theCompiledHtml:   "+ theCompiledHtml);
  // Add the compiled html to the page
  document.getElementById("school-dropdown").innerHTML=theCompiledHtml;
};
