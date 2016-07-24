var data;

//Request data from server
function loadData(){
    var req = new XMLHttpRequest();
    req.open("GET", "http://localhost:3000/sourcedata", true);
    req.addEventListener("load",function(){
                         data = JSON.parse(req.responseText);
                         });
    req.send(null);
}

function getData(){
    return data;
}

//compiles templates
function createMenu() {
  // Grab the template script
    var theTemplateScript = document.getElementById("school-selection-form").innerHTML;
  // Compile the template
  var theTemplate = Handlebars.compile(theTemplateScript);
  // Pass our data to the template
  var theCompiledHtml = theTemplate({dataset:data});
  // Add the compiled html to the page
  document.getElementById("school-dropdown").innerHTML=theCompiledHtml;
};
