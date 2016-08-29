'use strict';

const Cols = require('./Cols');
//Request data from server
const SchoolScripts = {
  //Creates an object representing the information of the school in the spreadsheet at row "num"
  createSchoolObj: function(d) {
    var school = {
        basicInfo: getBasicInfoProps(d),
        contact: getContactProps(d),
        inSession: getInSessionProps(d),
        students: getStudentsProps(d),
        baseTuition: getBaseTuitionProps(d),
        inclusionTuition: getInclusionTuitionProps(d),
        activities: getActivitiesProps(d),
        registration: getRegistrationProps(d),
        gradFee: getGradFeeProps(d),
        ptaFees: getPtaFeesProps(d),
        familyCommitments: getFamilyCommitmentsProps(d),
        security: getSecurityProps(d),
        building: getBuildingProps(d),
        discount: getDiscountProps(d),
        optionalLunch: ~~d[Cols.optionalLunch]
      };
      // since totalTuition uses lots of funcions defined in school,
      // add it to school after the rest of the school definition is created
      school.totalTuition = function(kids, yearsInSchool, dateRegistered) {
        if(school.basicInfo.isTuitOnline() == false) {
          return "Tuition information not available for this school";
        }
        var total = 0;
        var bill = [];
          
        var base = school.baseTuition.baseSubtotal(kids);
        total += base;
        var fees = school.activities.activitiesSubtotal(kids) + school.gradFee.gradFeeSubtotal(kids) + school.ptaFees.ptaFeeSubtotal(kids);
        total += fees;
        var reg = school.registration.registrationSubtotal(kids,yearsInSchool,dateRegistered);
        total += reg;
        var familyCom = school.familyCommitments.familyCommitmentsSubtotal();
        total += familyCom;
        var build = school.security.securityFeeSubtotal(kids) + school.building.buildingSubtotal(kids,yearsInSchool);
        total += build;
        var discount = school.discount.discountSubtotal(kids);
        total += discount;
          
        bill = [{id:1, descrip:"Base Tuition", perChild:(base/kids.length).toLocaleString(), perFam:base.toLocaleString()},
               {id:2, descrip:"Fees", perChild:fees/kids.length, perFam:fees},
               {id:3, descrip:"Registration Fees", perChild:reg/kids.length, perFam:reg},
                {id:4, descrip:"Family Commitment", perChild:familyCom/kids.length, perFam:familyCom},
                {id:5, descrip:"Building & Security Fees/Fund", perChild:build/kids.length, perFam:build},
                {id:6, descrip:"Discount", perChild:discount/kids.length, perFam:discount},
                {id:7, descrip:"Total Cost", perChild:total/kids.length, perFam:total}
               ];
          
        return bill;
      };
    return school;
  },

//Creates object representing a family, with array of children
  createFamilyObj: function() {
      var family = {
          name: "Friedmann",
          yearsInSchool: 0,
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
};

function getBasicInfoProps(d){
    const name = d[Cols.schoolName];
    const type = d[Cols.category];
    const website = d[Cols.website];
    const tuitOnline = d[Cols.tuitOnline];
    const tuitYear = d[Cols.tuitYear];
    const schoolNotes = d[Cols.schoolNotes];
    const tuitionNotes = d[Cols.tuitionNotes];
    return {
      isTuitOnline: function(){
          if(tuitOnline == "Yes"){return true;}
          return false;
      }
    };
}
function getContactProps(d){
    const address = d[Cols.address];
    const city = d[Cols.city];
    const state = d[Cols.state];
    const zip = d[Cols.zip];
    const longlat = d[Cols.longlat];
    const phone = d[Cols.phone];
    const fax = d[Cols.fax];
    return {
      fullAddress: function(){return (address + ", " + city + ", " + state + ", " + zip);}
    };
}
// doesn't do anything yet
function getInSessionProps(d){
    const schoolDays = d[Cols.schoolDays];
    const hours = d[Cols.hours];
}
function getStudentsProps(d){
    const grades = d[Cols.grades];
    const fte = d[Cols.fte];
    const enrollByGrade = [~~d[Cols.enrollpreK],
                   ~~d[Cols.enrollK],
                   ~~d[Cols.enroll1st],
                   ~~d[Cols.enroll2nd],
                   ~~d[Cols.enroll3rd],
                   ~~d[Cols.enroll4th],
                   ~~d[Cols.enroll5th],
                   ~~d[Cols.enroll6th],
                   ~~d[Cols.enroll7th],
                   ~~[Cols.enroll8th],
                   ~~d[Cols.enroll9th],
                   ~~d[Cols.enroll10th],
                   ~~d[Cols.enroll11th],
                   ~~d[Cols.enroll12th]];
    return {
      getEnrollment: function(grade){return enrollbyGrade[grade];}
    };
}
function getBaseTuitionProps(d){
    const baseByGrade = [~~d[Cols.baseK],
                  ~~d[Cols.base1st],
                  ~~d[Cols.base2nd],
                  ~~d[Cols.base3rd],
                  ~~d[Cols.base4th],
                  ~~d[Cols.base5th],
                  ~~d[Cols.base6th],
                  ~~d[Cols.base7th],
                  ~~d[Cols.base8th],
                  ~~d[Cols.base9th],
                  ~~d[Cols.base10th],
                  ~~d[Cols.base11th],
                  ~~d[Cols.base12th]];
    const getBase = function(grade){return baseByGrade[grade];};
    return {
      getBase: getBase,
      baseSubtotal: function(kids){
        var sub = 0;
        for(var i=0;i<kids.length;i++){
            // note: this is calling the const, not the 1st key in this obj
            sub += getBase(kids[i].grade);
        }
        return sub;
      }
    };
}
function getInclusionTuitionProps(d){
    const inclusionByGrade = [~~d[Cols.inclusionK],
                      ~~d[Cols.inclusion1st],
                      ~~d[Cols.inclusion2nd],
                      ~~d[Cols.inclusion3rd],
                      ~~d[Cols.inclusion4th],
                      ~~d[Cols.inclusion5th],
                      ~~d[Cols.inclusion6th],
                      ~~d[Cols.inclusion7th],
                      ~~d[Cols.inclusion8th],
                      ~~d[Cols.inclusion9th],
                      ~~d[Cols.inclusion10th],
                      ~~d[Cols.inclusion11th],
                      ~~d[Cols.inclusion12th]];
    return {
      getInclusion: function(grade){return getInclusion[grade];},
      inclusionSubtotal: function(kids){
        var sub = 0;
        for(var i=0;i<kids.length;i++){
            sub += getInclusion(kids[i].grade);
        }
        return sub;
      }
  };
}
function getActivitiesProps(d){
    const activitiesByGrade = [~~d[Cols.activitiesK],
                       ~~d[Cols.activities1st],
                       ~~d[Cols.activities2nd],
                       ~~d[Cols.activities3rd],
                       ~~d[Cols.activities4th],
                       ~~d[Cols.activities5th],
                       ~~d[Cols.activities6th],
                       ~~d[Cols.activities7th],
                       ~~d[Cols.activities8th],
                       ~~d[Cols.activities9th],
                       ~~d[Cols.activities10th],
                       ~~d[Cols.activities11th],
                       ~~d[Cols.activities12th]];
    const getActivities = function(grade){return activitiesByGrade[grade];};
    return {
      getActivities: getActivities,
      activitiesSubtotal: function(kids){
        var sub = 0;
        for(var i=0;i<kids.length;i++){
            sub += getActivities(kids[i].grade);
        }
        return sub;
    }
  };
}
function getRegistrationProps(d) {
  const regPerKidNew = ~~d[Cols.regPerKidNew];
  const regPerKidReturn = ~~d[Cols.regPerKidReturn];
  const regDate = ~~d[Cols.regDate];
  const regLateFee = ~~d[Cols.regLateFee];
  const regPerFamNew = ~~d[Cols.regPerFamNew];
  const regPerFamReturn = ~~d[Cols.regPerFamReturn];
  const regKDiscount = ~~d[Cols.regKDiscount];

  var regIsLate = function(dateRegistered){
      if(regDate == undefined) return false;
      return dateRegistered>regDate;
  };
  var regPerKid = function(returning,grade,dateRegistered){
      var reg = 0;
      if(!returning){ reg += regPerKidNew;}
      else {reg += egPerKidReturn;}
      if(grade == 0){reg -= regKDiscount;}
      if (regIsLate(dateRegistered)){reg += regLateFee;}
      return reg;
  };
  var regPerFamily = function(returning, dateRegistered) {
          var reg = 0;
          if(!returning){reg += regPerFamNew;}
          else{reg += regPerFamReturn;}
          if (regIsLate(dateRegistered)){reg += regLateFee;}
          return reg;
    };
  var registrationSubtotal = function(kids,returning,dateRegistered) {
      var reg = 0;
      for(var i=0; i < kids.length; i++){
          reg += regPerKid(returning,kids[0].grade,dateRegistered);
      }
      reg += regPerFamily(returning,dateRegistered);
      return reg;
  };
    return {
      regIsLate: regIsLate,
      regPerKid: regPerKid,
      regPerFamily: regPerFamily,
      registrationSubtotal: registrationSubtotal
    };
  }
function getGradFeeProps(d){
    const gradFee8th = ~~d[Cols.gradFee8th];
    const gradFee12th = ~~d[Cols.gradFee12th];
    const getGradFee = function(grade){
        if(grade == 8){ return gradFee8th; }
        if(grade == 12){ return gradFee12th; }
        return 0;
    };
    return {
      getGradFee: getGradFee,
      gradFeeSubtotal: function(kids){
        var sub = 0;
        for(var i=0;i<kids.length;i++){
            sub += getGradFee(kids[i].grade);
        }
        return sub;
      }
    };
}
function getPtaFeesProps(d){
    const ptaPerKid = ~~d[Cols.ptaPerKid];
    const ptaPerFam = ~~d[Cols.ptaPerFam];
    return {
      ptaFeeSubtotal: function(kids){
        var sub = ptaPerFam;
        sub += (ptaPerKid * kids.length);
        return sub;
    }
  };
}
function getFamilyCommitmentsProps(d){
    const scholarship = ~~d[Cols.scholarshipPerKid];
    const familyObligation = ~~d[Cols.familyObligation];
    const scripPerFam = ~~d[Cols.scripPerFam];
    return {
      familyCommitmentsSubtotal : function(){return scholarship + familyObligation + scripPerFam;}
  };
}
function getSecurityProps(d){
    const securityPerKid = ~~d[Cols.securityPerKid];
    const securityPerFam = ~~d[Cols.securityPerFam];
    return {
      securityFeeSubtotal : function(kids){
        var sub = securityPerFam;
        sub += (securityPerKid * kids.length);
        return sub;
      }
    };
}
function getBuildingProps(d){
    const buildingPerKid = ~~d[Cols.buildingPerKid];
    const buildingPerFamAnnual = ~~d[Cols.buildingPerFamAnnual];
    const buildingPerFamByYr = [~~d[Cols.buildingPerFamYr1],
                        ~~d[Cols.buildingPerFamYr2],
                        ~~d[Cols.buildingPerFamYr3],
                        ~~d[Cols.buildingPerFamYr4],
                        ~~d[Cols.buildingPerFamYr5],
                        ~~d[Cols.buildingPerFamYr6],
                        ~~d[Cols.buildingPerFamYr7],
                        ~~d[Cols.buildingPerFamYr8]];
    return {
      buildingSubtotal: function(kids,yearsInSchool){
        var sub = buildingPerFamAnnual;
        sub += (buildingPerKid * kids.length);
        // FIXME:  Jeff, I edited this line from year - 1 to yearsInSchool - 1
        // either fix or remove this comment :)
        if(yearsInSchool <= buildingPerFamByYr.length){sub += buildingPerFamByYr[yearsInSchool];}
        return sub;
    }
  };
}
function getDiscountProps(d){
    const discountMultiKid = [0,
                      0,
                      ~~d[Cols.discount2Kids],
                      ~~d[Cols.discount3Kids],
                      ~~d[Cols.discount4Kids],
                      ~~d[Cols.discount5Kids]];
    return {
      discountSubtotal : function(kids){return (-1)*(discountMultiKid[Math.max(kids.length,5)])}
    };
}

module.exports = SchoolScripts;
