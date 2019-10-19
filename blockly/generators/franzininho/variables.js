// /**
//  * @license Licensed under the Apache License, Version 2.0 (the "License"):
//  *          http://www.apache.org/licenses/LICENSE-2.0
//  */

// /**
//  * @fileoverview Generating Arduino code for variables blocks.
//  */
// 'use strict';

// goog.provide('Blockly.Franzininho.variables');

// goog.require('Blockly.Franzininho');


// /**
//  * Code generator for variable (X) getter.
//  * Arduino code: loop { X }
//  * @param {Blockly.Block} block Block to generate the code from.
//  * @return {array} Completed code with order of operation.
//  */
// Blockly.Franzininho['variables_get'] = function(block) {
//   var code = Blockly.Franzininho.variableDB_.getName(block.getFieldValue('VAR'),
//       Blockly.Variables.NAME_TYPE);
//   return [code, Blockly.Franzininho.ORDER_ATOMIC];
// };

// /**
//  * Code generator for variable (X) setter (Y).
//  * Arduino code: type X;
//  *               loop { X = Y; }
//  * @param {Blockly.Block} block Block to generate the code from.
//  * @return {string} Completed code.
//  */
// Blockly.Franzininho['variables_set'] = function(block) {
//   var argument0 = Blockly.Franzininho.valueToCode(block, 'VALUE',
//       Blockly.Franzininho.ORDER_ASSIGNMENT) || '0';
//   var varName = Blockly.Franzininho.variableDB_.getName(
//       block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
//   return varName + ' = ' + argument0 + ';\n';
// };

// /**
//  * Code generator for variable (X) casting (Y).
//  * Arduino code: loop { (Y)X }
//  * @param {Blockly.Block} block Block to generate the code from.
//  * @return {array} Completed code with order of operation.
//  */
// Blockly.Franzininho['variables_set_type'] = function(block) {
//   var argument0 = Blockly.Franzininho.valueToCode(block, 'VARIABLE_SETTYPE_INPUT',
//       Blockly.Franzininho.ORDER_ASSIGNMENT) || '0';
//   var varType = Blockly.Franzininho.getArduinoType_(
//       Blockly.Types[block.getFieldValue('VARIABLE_SETTYPE_TYPE')]);
//   var code = '(' + varType + ')(' + argument0 + ')';
//   return [code, Blockly.Franzininho.ORDER_ATOMIC];
// };

'use strict';

goog.provide('Blockly.Franzininho.variables');

goog.require('Blockly.Franzininho');

var setVariableFunction = function (block) {
    var variableName = Blockly.Franzininho.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    var variableValue = Blockly.Franzininho.valueToCode(block, 'VALUE', Blockly.Franzininho.ORDER_ATOMIC);

    return variableName + ' = ' + variableValue + ';\n'
};

var getVariableFunction = function(block) {
    var variableName = Blockly.Franzininho.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);

    return [variableName, Blockly.Franzininho.ORDER_ATOMIC];

};

Blockly.Franzininho['variables_set_number'] = setVariableFunction;
Blockly.Franzininho['variables_set_boolean'] = setVariableFunction;
Blockly.Franzininho['variables_set_string'] = setVariableFunction;
Blockly.Franzininho['variables_set_colour'] = setVariableFunction;


Blockly.Franzininho['variables_get_number'] = getVariableFunction;
Blockly.Franzininho['variables_get_boolean'] = getVariableFunction;
Blockly.Franzininho['variables_get_string'] = getVariableFunction;
Blockly.Franzininho['variables_get_colour'] = getVariableFunction;
