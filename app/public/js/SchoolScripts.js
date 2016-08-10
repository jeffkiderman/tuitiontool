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
    selector.addEventListener('change', () => {
            var sch = SchoolScripts.createSchoolObj(selector.value);
            document.getElementById("print-tuition").innerHTML="<h2>"+SchoolScripts.calculateTuition(sch, SchoolScripts.createFamilyObj())+"</h2>";
    });
  },

  //Creates an object representing the information of the school in the spreadsheet at row "num"
  createSchoolObj: function(num) {
    var d = data[num];
    console.log(d);
    var school = {
        basicInfo: {
            name: d[schoolName],
            type: d[category],
            website: d[website],
            tuitOnline: d[tuitOnline],
            tuitYear: d[tuitYear],
            schoolNotes: d[schoolNotes],
            tuitionNotes: d[tuitionNotes]
        },
        contact: {
            address: d[address],
            city: d[city],
            state: d[state],
            zip: d[zip],
            longlat: d[longlat], 
            phone: d[phone],
            fax: d[fax],
            fullAddress: function(){return (address + ", " + city + ", " + state + ", " + zip);}
        },
        inSession: {
            schoolDays: d[schoolDays],
            hours: d[hours]  
        },    
        students: {
            grades: d[grades],
            fte: d[fte],
            enrollByGrade: [d[enrollpreK],
                           d[enrollK],
                           d[enroll1st],
                           d[enroll2nd],
                           d[enroll3rd],
                           d[enroll4th],
                           d[enroll5th],
                           d[enroll6th],
                           d[enroll7th],
                           d[enroll8th],
                           d[enroll9th],
                           d[enroll10th],
                           d[enroll11th],
                           d[enroll12th]],
            getEnrollment: function(grade){return enrollbyGrade[grade];}
        },
        baseTuition: {
            baseByGrade: [d[baseK],
                          d[base1st],
                          d[base2nd],
                          d[base3rd],
                          d[base4th],
                          d[base5th],
                          d[base6th],
                          d[base7th],
                          d[base8th],
                          d[base9th],
                          d[base10th],
                          d[base11th],
                          d[base12th]],
            getBase: function(grade){return baseByGrade[grade];},
            baseSubtotal: function(kids){
                var sub = 0;
                for(var i=0;i<kids.length;i++){
                    sub += getBase(kids[i].grade);
                }
                return sub;
            }
        },
        inclusionTuition: {
            inclusionByGrade: [d[inclusionK],
                              d[inclusion1st],
                              d[inclusion2nd],
                              d[inclusion3rd],
                              d[inclusion4th],
                              d[inclusion5th],
                              d[inclusion6th],
                              d[inclusion7th],
                              d[inclusion8th],
                              d[inclusion9th],
                              d[inclusion10th],
                              d[inclusion11th],
                              d[inclusion12th]],
            getInclusion: function(grade){return getInclusion[grade];},
            inclusionSubtotal: function(kids){
                var sub = 0;
                for(var i=0;i<kids.length;i++){
                    sub += getInclusion(kids[i].grade);
                }
                return sub;
            }
        },
        activities: {
            activitiesByGrade: [d[activitiesK],
                               d[activities1st],
                               d[activities2nd],
                               d[activities3rd],
                               d[activities4th],
                               d[activities5th],
                               d[activities6th],
                               d[activities7th],
                               d[activities8th],
                               d[activities9th],
                               d[activities10th],
                               d[activities11th],
                               d[activities12th]],
            getActivities: function(grade){return activitiesByGrade[grade];},
            activitiesSubtotal: function(kids){
                var sub = 0;
                for(var i=0;i<kids.length;i++){
                    sub += getActivities(kids[i].grade);
                }
                return sub;
            }
        },
        registration: {
            regPerKidNew: d[regPerKidNew],
            regPerKidReturn: d[regPerKidReturn],
            regDate: d[regDate],
            regLateFee: d[regLateFee],
            regPerFamNew: d[regPerFamNew],
            regPerFamReturn: d[regPerFamReturn],
            regKDiscount: d[regKDiscount],
            regIsLate: function(dateRegistered){
                if(regDate == undefined) return false;
                return dateRegistered>regDate;
            },
            regPerKid: function(returning,grade,dateRegistered){
                var reg = 0;
                if(!returning){ reg += regPerKidNew;}
                else {reg += egPerKidReturn;}
                if(grade == 0){reg -= regKDiscount;}
                if (regIsLate(dateRegistered)){reg += regLateFee;}
                return reg;
            },
            regPerFamily: function(returning,dateRegistered){
                var reg = 0;
                if(!returning){reg += regPerFamNew;}
                else{reg += regPerFamReturn;}
                if (regIsLate(dateRegistered)){reg += regLateFee;}
                return reg;
            },
            registrationSubtotal: function(kids,returning,dateRegistered){
                var reg = 0;
                for(var i=0; i < kids.length; i++){
                    reg += regPerKid(returning,kids[0].grade,dateRegistered);
                }
                reg += regPerFamily(returning,dateRegistered);
                return reg;
            }
        },
        gradFee: {
            gradFee8th: d[gradFee8th],
            gradFee12th: d[gradFee12th],
            getGradFee: function(grade){
                if(grade == 8){ return gradFee8th; }
                if(grade == 12){ return gradFee12th; }
                return 0;
            },
            gradFeeSubtotal: function(kids){
                var sub = 0;
                for(var i=0;i<kids.length;i++){
                    sub += getGradFee(kids[i].grade);
                }
                return sub;
            }
        },
        ptaFees: {
            ptaPerKid: d[ptaPerKid],
            ptaPerFam: d[ptaPerFam],
            ptaFeeSubtotal: function(kids){
                var sub = ptaPerFam;
                sub += (ptaPerKid * kids.length);
                return sub; 
            }
        },
        familyCommitments: {
            scholarship: d[scholarshipPerKid],
            familyObligation: d[familyObligation],
            scripPerFam: d[scripPerFam],
            familyCommitmentsSubtotal: function(){return scholarship + familyObligation + scripPerFam;}
        },
        security: {
            securityPerKid: d[securityPerKid],
            securityPerFam: d[securityPerFam],
            securityFeeSubtotal: function(kids){
                var sub = securityPerFam;
                sub += (securityPerKid * kids.length);
                return sub; 
            }
        },
        building: {
            buildingPerKid: d[buildingPerKid],
            buildingPerFamAnnual: d[buildingPerFamAnnual],
            buildingPerFamByYr: [d[buildingPerFamYr1],
                                d[buildingPerFamYr2],
                                d[buildingPerFamYr3],
                                d[buildingPerFamYr4],
                                d[buildingPerFamYr5],
                                d[buildingPerFamYr6],
                                d[buildingPerFamYr7],
                                d[buildingPerFamYr8]],
            buildingSubtotal: function(kids,yearsInSchool){
                var sub = buildingPerFamAnnual;
                sub += (buildingPerKid * kids.length);
                if(yearInSchool <= buildingPerFamByYr.length){sub += buildingPerFamByYr[year-1];}
                return sub;
            }
        },
        discount: {
            discountMultiKid: [0,
                              0,
                              d[discount2Kids],
                              d[discount3Kids],
                              d[discount4Kids],
                              d[discount5Kids]],
            discountSubtotal: function(kids){return (-1)*(discountMultiKid[Math.max(kids.length,5)])}
        },
        optionalLunch: d[optionalLunch],
        totalTuition: function(kids,yearsInSchool,dateRegistered){
            var total = 0;
            total += baseTuition.baseSubtotal(kids);
            total += activities.activitiesSubtotal(kids);
            total += registration.registrationSubtotal(kids,yearsInSchool,dateRegistered);
            total += gradFee.gradFeeSubtotal(kids);
            total += ptaFees.ptaFeeSubtotal(kids);
            total += familyCommitments.familyCommitmentsSubtotal();
            total += security.securityFeeSubtotal(kids);
            total += building.buildingSubtotal(kids,yearsInSchool);
            total += discount.discountSubtotal(kids);
            return total;
        }
    };
    return school;
  },
    /*
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
    console.log(school.baseTuition.getBase(3));
    //console.log(calculateTuition(school,createFamilyObj()));
  },*/

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
      /*if(sch.tuitionSaved == undefined){
          return "Tuition information not available for this school";
      }
      return "$"+(sch.perChild(fam.kids).reduce(function(a,b){return a+b;},0) + sch.perFamily + sch.registration(fam.returning,fam.kids)).toLocaleString();*/
    if(sch.basicInfo.tuitOnline == undefined) {return "Tuition information not available for this school";}
    return "$"+(sch.totalTuition(fam.kids,0,20160422)).toLocaleString();
  }
};

const schoolName = 0;
const address = 1;
const city = 2;
const state = 3;
const zip = 4;
const longlat = 5;
const grades = 6;
const category = 7;
const color = 8;
const schoolNotes = 9;
const website = 10;
const tuitOnline = 11;
const phone = 12;
const fax = 13;
const schoolDays = 14;
const hours = 15;
const library = 16;
const enrollPreschool = 17;
const enrollpreK = 18;
const enrollK = 19;
const enroll1st = 20;
const enroll2nd = 21;
const enroll3rd = 22;
const enroll4th = 23;
const enroll5th = 24;
const enroll6th = 25;
const enroll7th = 26;
const enroll8th = 27;
const enroll9th = 28;
const enroll10th = 29;
const enroll11th = 30;
const enroll12th = 31;
const enrollTotal = 32;
const enrollK12 = 33;
const fte = 34;
const tuitOnline2 = 35;
const tuitYear = 36;
const baseK = 37;
const base1st = 38;
const base2nd = 39;
const base3rd = 40;
const base4th = 41;
const base5th = 42;
const base6th = 43;
const base7th = 44;
const base8th = 45;
const base9th = 46;
const base10th = 47;
const base11th = 48;
const base12th = 49;
const inclusionK = 50;
const inclusion1st = 51;
const inclusion2nd = 52;
const inclusion3rd = 53;
const inclusion4th = 54;
const inclusion5th = 55;
const inclusion6th = 56;
const inclusion7th = 57;
const inclusion8th = 58;
const inclusion9th = 59;
const inclusion10th = 60;
const inclusion11th = 61;
const inclusion12th = 62;
const activitiesK = 63;
const activities1st = 64;
const activities2nd = 65;
const activities3rd = 66;
const activities4th = 67;
const activities5th = 68;
const activities6th = 69;
const activities7th = 70;
const activities8th = 71;
const activities9th = 72;
const activities10th = 73;
const activities11th = 74;
const activities12th = 75;
const regPerKidNew = 76;
const regPerKidReturn = 77;
const regDate = 78;
const regLateFee = 79;
const regKDiscount = 80;
const gradFee8th = 81;
const gradFee12th = 82;
const ptaPerKid = 83;
const buildingPerKid = 84;
const scholarshipPerKid = 85;
const securityPerKid = 86;
const optionalLunch = 87;
const scripPerFam = 88;
const regPerFamNew = 89;
const regPerFamReturn = 90;
const familyObligation = 91;
const securityPerFam = 92;
const ptaPerFam = 93;
const buildingPerFamAnnual = 94;
const buildingPerFamYr1 = 95;
const buildingPerFamYr2 = 96;
const buildingPerFamYr3 = 97;
const buildingPerFamYr4 = 98;
const buildingPerFamYr5 = 99;
const buildingPerFamYr6 = 100;
const buildingPerFamYr7 = 101;
const buildingPerFamYr8 = 102;
const discount2Kids = 103;
const discount3Kids = 104;
const discount4Kids = 105;
const discount5Kids = 106;
const discountShulMembership = 107;
const tuitionNotes = 108;

module.exports = SchoolScripts;
