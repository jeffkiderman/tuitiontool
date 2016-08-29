'use strict'
//@flow

const React = require('react');
const SchoolScripts = require('./SchoolScripts');

var TuitionCostTable = React.createClass({
    render: function() {
        var headerComponents = this.generateHeaders();
        var rowComponents = this.generateRows();
        return <table>
                    <thead><tr>{headerComponents}</tr></thead>
                    <tbody>{rowComponents}</tbody>
                </table>;
    },
 
   generateHeaders: function() { 
       var cols = [{key:"descrip",label:"Cost"}, {key:"perChild",label:"Per Child"}, {key:"perFam",label:"Total Cost"}];
       return cols.map(function(colData){
            return <th key={colData.key}>{colData.label}</th>;
        });
    },
    
    generateRows: function() {
        var cols = [{key:"descrip",label:"Cost"}, {key:"perChild",label:"Per Child"}, {key:"perFam",label:"Total Cost"}]; 
        var data = this.props.bill;
            return data.map(function(item){
                var cells = cols.map(function(colData){
                    return <td>{item[colData.key]}</td>
                });
                return <tr key={item.id}>{cells}</tr>;
            });
    }
                                         
});

module.exports = TuitionCostTable;