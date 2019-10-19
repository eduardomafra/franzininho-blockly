/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Generating Arduino code for the logic blocks.
 */
'use strict';

goog.provide('Blockly.Franzininho.logic');

goog.require('Blockly.Franzininho');


/**
 * Code generator to create if/if else/else statement.
 * Arduino code: loop { if (X)/else if ()/else { X } }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Franzininho['controls_if'] = function(block) {
  var n = 0;
  var argument = Blockly.Franzininho.valueToCode(block, 'IF' + n,
      Blockly.Franzininho.ORDER_NONE) || 'false';
  var branch = Blockly.Franzininho.statementToCode(block, 'DO' + n);
  var code = 'if (' + argument + ') {\n' + branch + '}';
  for (n = 1; n <= block.elseifCount_; n++) {
    argument = Blockly.Franzininho.valueToCode(block, 'IF' + n,
        Blockly.Franzininho.ORDER_NONE) || 'false';
    branch = Blockly.Franzininho.statementToCode(block, 'DO' + n);
    code += ' else if (' + argument + ') {\n' + branch + '}';
  }
  if (block.elseCount_) {
    branch = Blockly.Franzininho.statementToCode(block, 'ELSE');
    code += ' else {\n' + branch + '}';
  }
  return code + '\n';
};

/**
 * Code generator for the comparison operator block.
 * Arduino code: loop { X operator Y }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Franzininho['logic_compare'] = function(block) {
  var OPERATORS = {
    'EQ': '==',
    'NEQ': '!=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  var operator = OPERATORS[block.getFieldValue('OP')];
  var order = (operator == '==' || operator == '!=') ?
      Blockly.Franzininho.ORDER_EQUALITY : Blockly.Franzininho.ORDER_RELATIONAL;
  var argument0 = Blockly.Franzininho.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.Franzininho.valueToCode(block, 'B', order) || '0';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.Franzininho['logic_compare1'] = function() {
  // Comparison operator.
  var mode = this.getFieldValue('OP');
  var operator = Blockly.Franzininho.logic_compare.OPERATORS[mode];
  var order = (operator == '==' || operator == '!=') ?
      Blockly.Franzininho.ORDER_EQUALITY : Blockly.Franzininho.ORDER_RELATIONAL;
  var argument0 = Blockly.Franzininho.valueToCode(this, 'A', order) || '0';
  var argument1 = Blockly.Franzininho.valueToCode(this, 'B', order) || '0';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.Franzininho['logic_compare3'] = function(block) {
  var OPERATORS = {
    'EQ': '==',
    'NEQ': '!=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  var operator = OPERATORS[block.getFieldValue('OP')];
  var order = (operator == '==' || operator == '!=') ?
      Blockly.Franzininho.ORDER_EQUALITY : Blockly.Franzininho.ORDER_RELATIONAL;
  var argument0 = Blockly.Franzininho.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.Franzininho.valueToCode(block, 'B', order) || '0';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.Franzininho.logic_compare.OPERATORS = {
  EQ: '==',
  NEQ: '!=',
  LT: '<',
  LTE: '<=',
  GT: '>',
  GTE: '>='
};

// Blockly.Franzininho['logic_compare1'] = function(block) {
//   var OPERATORS = {
//     'EQ': '==',
//     'NEQ': '!=',
//     'LT': '<',
//     'LTE': '<=',
//     'GT': '>',
//     'GTE': '>='
//   };
//   var operator = OPERATORS[block.getFieldValue('OP')];
//   var order = (operator == '==' || operator == '!=') ?
//       Blockly.Franzininho.ORDER_EQUALITY : Blockly.Franzininho.ORDER_RELATIONAL;
//   var argument0 = Blockly.Franzininho.valueToCode(block, 'A', order) || '0';
//   var argument1 = Blockly.Franzininho.valueToCode(block, 'B', order) || '0';
//   var code = argument0 + ' ' + operator + ' ' + argument1;
//   return [code, order];
// };


/**
 * Code generator for the logic operator block.
 * Arduino code: loop { X operator Y }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Franzininho['logic_operation'] = function(block) {
  var operator = (block.getFieldValue('OP') == 'AND') ? '&&' : '||';
  var order = (operator == '&&') ? Blockly.Franzininho.ORDER_LOGICAL_AND :
      Blockly.Franzininho.ORDER_LOGICAL_OR;
  var argument0 = Blockly.Franzininho.valueToCode(block, 'A', order) || 'false';
  var argument1 = Blockly.Franzininho.valueToCode(block, 'B', order) || 'false';
  if (!argument0 && !argument1) {
    // If there are no arguments, then the return value is false.
    argument0 = 'false';
    argument1 = 'false';
  } else {
    // Single missing arguments have no effect on the return value.
    var defaultArgument = (operator == '&&') ? 'true' : 'false';
    if (!argument0) {
      argument0 = defaultArgument;
    }
    if (!argument1) {
      argument1 = defaultArgument;
    }
  }
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

/**
 * Code generator for the logic negate operator.
 * Arduino code: loop { !X }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Franzininho['logic_negate'] = function(block) {
  var order = Blockly.Franzininho.ORDER_UNARY_PREFIX;
  var argument0 = Blockly.Franzininho.valueToCode(block, 'BOOL', order) || 'false';
  var code = '!' + argument0;
  return [code, order];
};

/**
 * Code generator for the boolean values true and false.
 * Arduino code: loop { true/false }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Franzininho['logic_boolean'] = function(block) {
  var code = (block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
  return [code, Blockly.Franzininho.ORDER_ATOMIC];
};

/**
 * Code generator for the null value.
 * Arduino code: loop { X ? Y : Z }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Franzininho['logic_null'] = function(block) {
  var code = 'NULL';
  return [code, Blockly.Franzininho.ORDER_ATOMIC];
};

/**
 * Code generator for the ternary operator.
 * Arduino code: loop { NULL }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 *
 * TODO: Check types of THEN and ELSE blocks and add warning to this block if
 *       they are different from each other.
 */
Blockly.Franzininho['logic_ternary'] = function(block) {
  var valueIf = Blockly.Franzininho.valueToCode(block, 'IF',
      Blockly.Franzininho.ORDER_CONDITIONAL) || 'false';
  var valueThen = Blockly.Franzininho.valueToCode(block, 'THEN',
      Blockly.Franzininho.ORDER_CONDITIONAL) || 'null';
  var valueElse = Blockly.Franzininho.valueToCode(block, 'ELSE',
      Blockly.Franzininho.ORDER_CONDITIONAL) || 'null';
  var code = valueIf + ' ? ' + valueThen + ' : ' + valueElse;
  return [code, Blockly.Franzininho.ORDER_CONDITIONAL];
};
