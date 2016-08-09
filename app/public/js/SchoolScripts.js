'use strict';

const Handlebars = require('handlebars');
var data;

//Request data from server
const SchoolScripts = {
  loadData: function() {
    var req = new XMLHttpRequest();
    req.open("GET", "http://localhost:3000/sourcedata", true);
    req.addEventListener(
      "load",
      function() {
        data = JSON.parse(req.responseText);
        SchoolScripts.createMenu();
      }
    );
    req.send(null);
  },

  //compiles templates
  createMenu: function() {
    // Grab the template script
    var theTemplateScript = document.getElementById("school-selection-form").innerHTML;
    // Compile the template
    var theTemplate = Handlebars.compile(theTemplateScript);
    // Pass our data to the template
    var theCompiledHtml = theTemplate({dataset:data});
    // Add the compiled html to the page
    document.getElementById("school-dropdown").innerHTML=theCompiledHtml;

    const selector = document.getElementById('school-selector');
    selector.addEventListener('change', () => SchoolScripts.createSchoolObj(selector.value));
  },

  //Creates an object representing the information of the school in the spreadsheet at row "num"
  createSchoolObj: function(num) {
    console.log(arguments);
    var d = data[num];
    console.log(d);
    var school = {
        name: d[0],
        address: d[1],
        city: d[2],
        state: d[3],
        zip: d[4],
        tuitionSaved: d[36]
    };

    //Calculates total per-family costs for the school
    school.perFamily = (~~d[88])+(~~d[91])+(~~d[92])+(~~d[93])+(~~d[94]);

    //Calculates total per-child costs based on array of children passed in as parameter
    school.perChild = function(children){
        var perStudent = [];
        for(var i = 0; i < children.length; i++){
            var t = 0;
            var gr = children[i].grade;
            t = (~~d[(37+gr)])+(~~d[(63+gr)]);
            t += (~~d[83])+(~~d[84])+(~~d[85])+(~~d[86])+(~~d[87]);
            if(gr === 8){t += (~~d[81]);}
            else if(gr === 0){t += (~~d[80]);}
            else if(gr === 12){t += (~~d[82]);}
            perStudent.push(t);
        }
        return perStudent;
    };

    school.registration = function(returning,children){
        if(returning){
            return (~~d[77])*children.length + (~~d[90]);
        }
        else{
            return (~~d[76])*children.length + (~~d[89]);
        }
    };
    document.getElementById("print-tuition").innerHTML="<h2>"+SchoolScripts.calculateTuition(school, SchoolScripts.createFamilyObj())+"</h2>";
    //console.log(calculateTuition(school,createFamilyObj()));
  },

//Creates object representing a family, with array of children
  createFamilyObj: function() {
      var family = {
          name: "Friedmann",
          returning:false
      };
      family.kids = [
          {
              grade:0,
              female:false
          },
          {
              grade:3,
              female:true
          },
          {
              grade:5,
              female:true
          }
      ];
      return family;
  },

  //Calculates total tuition bill for a given family and school
  calculateTuition: function(sch, fam) {
      if(sch.tuitionSaved == undefined){
          return "Tuition information not available for this school";
      }
      return "$"+(sch.perChild(fam.kids).reduce(function(a,b){return a+b;},0) + sch.perFamily + sch.registration(fam.returning,fam.kids)).toLocaleString();
  }
};

module.exports = SchoolScripts;
