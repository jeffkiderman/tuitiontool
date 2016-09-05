'use strict'
//@flow

const React = require('react');
const SchoolScripts = require('./SchoolScripts');

class TuitionCostTable extends React.Component {
    render() {
        var headerComponents = this.generateHeaders();
        var rowComponents = this.generateRows();
        return <table>
                    <thead><tr>{headerComponents}</tr></thead>
                    <tbody>{rowComponents}</tbody>
                </table>;
    }

   generateHeaders() {
       var cols = [
         {key:"descrip",label:"Cost"},
         {key:"perChild",label:"Per Child"},
         {key:"perFam",label:"Total Cost"}
      ];
      return cols.map(function(colData, index){
            return <th key={index}>{colData.label}</th>;
        });
    }

    generateRows() {
        var cols = [
          {key:"descrip",label:"Cost"},
          {key:"perChild",label:"Per Child"},
          {key:"perFam",label:"Total Cost"}
        ];
        var data = this.props.bill;
        if (data === null) {
          return null;
        }
        return data.map(function(item, index){
            var cells = cols.map(function(colData, index2){
                return <td key={'td' + index + '.' + index2}>{item[colData.key]}</td>
            });
            return <tr key={'tr'+index}>{cells}</tr>;
        });
    }
}

module.exports = TuitionCostTable;
