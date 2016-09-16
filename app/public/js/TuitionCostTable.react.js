'use strict'
//@flow

const React = require('react');
const SchoolScripts = require('./SchoolScripts');
const Table = require('react-bootstrap').Table;

class TuitionCostTable extends React.Component {
    render() {
        var headerComponents = this.generateHeaders();
        var rowComponents = this.generateRows();
        return <Table striped bordered condensed hover>
                    <thead><tr>{headerComponents}</tr></thead>
                    <tbody>{rowComponents}</tbody>
                </Table>;
    }

   generateHeaders() {
       var cols = [
         {key:"descrip",label:"Cost"},
         {key:"perChild",label:"Per Child"},
         {key:"perFam",label:"Total Cost"}
      ];
      return cols.map(function(colData, index){
            return <th key={index} className="text-center">{colData.label}</th>;
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
            return <tr key={'tr'+index} className="text-center">{cells}</tr>;
        });
    }
}

module.exports = TuitionCostTable;
