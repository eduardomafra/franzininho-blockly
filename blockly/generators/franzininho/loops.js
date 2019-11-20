/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Generating Arduino code for the loop blocks.
 *
 * TODO: 'For each' block needs to have lists implemented.
 */
'use strict';

goog.provide('Blockly.Franzininho.loops');

goog.require('Blockly.Franzininho');


/**
 * Generator for the repeat block (number in a drop down) using a For loop
 * statement.
 * Arduino code: loop { for (int count = 0; count < X; count++) { Y } }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Franzininho['controls_repeat'] = function(block) {
  var repeats = Number(block.getFieldValue('TIMES'));
  var branch = Blockly.Franzininho.statementToCode(block, 'DO');
  branch = Blockly.Franzininho.addLoopTrap(branch, block.id);
  var loopVar = Blockly.Franzininho.variableDB_.getDistinctName(
      'count', Blockly.Variables.NAME_TYPE);
  var code = 'for (int ' + loopVar + ' = 0; ' +
      loopVar + ' < ' + repeats + '; ' +
      loopVar + '++) {\n' +
      branch + '}\n';
  return code;
};

/**
 * Generator for the repeat block (using external number block) using a
 * For loop statement.
 * Arduino code: loop { for (int count = 0; count < X; count++) { Y } }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Franzininho['controls_repeat_ext'] = function(block) {
  var repeats = Blockly.Franzininho.valueToCode(block, 'TIMES',
      Blockly.Franzininho.ORDER_ADDITIVE) || '0';
  var branch = Blockly.Franzininho.statementToCode(block, 'DO');
  branch = Blockly.Franzininho.addLoopTrap(branch, block.id);
  var code = '';
  var loopVar = Blockly.Franzininho.variableDB_.getDistinctName(
      'count', Blockly.Variables.NAME_TYPE);
  var endVar = repeats;
  if (!repeats.match(/^\w+$/) && !Blockly.isNumber(repeats)) {
    var endVar = Blockly.Franzininho.variableDB_.getDistinctName(
        'repeat_end', Blockly.Variables.NAME_TYPE);
    code += 'int ' + endVar + ' = ' + repeats + ';\n';
  }
  code += 'for (int ' + loopVar + ' = 0; ' +
      loopVar + ' < ' + endVar + '; ' +
      loopVar + '++) {\n' +
      branch + '}\n';
  return code;
};

/**
 * Generator for the repeat while block using a While statement.
 * Arduino code: loop { while (X) { Y } }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Franzininho['controls_whileUntil'] = function(block) {
  // Do while/until loop.
  var until = block.getFieldValue('MODE') == 'UNTIL';
  var argument0 = Blockly.Franzininho.valueToCode(block, 'BOOL',
      until ? Blockly.Franzininho.ORDER_LOGICAL_OR :
      Blockly.Franzininho.ORDER_NONE) || 'false';
  var branch = Blockly.Franzininho.statementToCode(block, 'DO');
  branch = Blockly.Franzininho.addLoopTrap(branch, block.id);
  if (until) {
    if (!argument0.match(/^\w+$/)) {
      argument0 = '(' + argument0 + ')';
    }
    argument0 = '!' + argument0;
  }
  return 'while (' + argument0 + ') {\n' + branch + '}\n';
};

/**
 * Generator for the For loop statements.
 * Arduino code: loop { for (i = X; i <= Y; i+=Z) { } }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Franzininho['controls_for'] = function(block) {
  var variable0 = Blockly.Franzininho.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var argument0 = Blockly.Franzininho.valueToCode(block, 'FROM',
      Blockly.Franzininho.ORDER_ASSIGNMENT) || '0';
  var argument1 = Blockly.Franzininho.valueToCode(block, 'TO',
      Blockly.Franzininho.ORDER_ASSIGNMENT) || '0';
  var increment = Blockly.Franzininho.valueToCode(block, 'BY',
      Blockly.Franzininho.ORDER_ASSIGNMENT) || '1';
  var branch = Blockly.Franzininho.statementToCode(block, 'DO');
  branch = Blockly.Franzininho.addLoopTrap(branch, block.id);
  var code;
  // if (Blockly.isNumber(argument0) && Blockly.isNumber(argument1) &&
  //     Blockly.isNumber(increment)) {
    // All arguments are simple numbers.
    var up = parseFloat(argument0) <= parseFloat(argument1);
    code = 'for (int ' + variable0 + ' = ' + argument0 + '; ' +
        variable0 + (up ? ' <= ' : ' >= ') + argument1 + '; ' +
        variable0;
    var step = Math.abs(parseFloat(increment));
    if (step == 1) {
      code += up ? '++' : '--';
    } else {
      code += (up ? ' += ' : ' -= ') + step;
    }
    code += ') {\n' + branch + '}\n';
  // } else {
  //   code = '';
  //   // Cache non-trivial values to variables to prevent repeated look-ups.
  //   var startVar = argument0;
  //   if (!argument0.match(/^\w+$/) && !Blockly.isNumber(argument0)) {
  //     var startVar = Blockly.Franzininho.variableDB_.getDistinctName(
  //         variable0 + '_start', Blockly.Variables.NAME_TYPE);
  //     code += 'int ' + startVar + ' = ' + argument0 + ';\n';
  //   }
  //   var endVar = argument1;
  //   if (!argument1.match(/^\w+$/) && !Blockly.isNumber(argument1)) {
  //     var endVar = Blockly.Franzininho.variableDB_.getDistinctName(
  //         variable0 + '_end', Blockly.Variables.NAME_TYPE);
  //     code += 'int ' + endVar + ' = ' + argument1 + ';\n';
  //   }
  //   // Determine loop direction at start, in case one of the bounds
  //   // changes during loop execution.
  //   var incVar = Blockly.Franzininho.variableDB_.getDistinctName(
  //       variable0 + '_inc', Blockly.Variables.NAME_TYPE);
  //   code += 'int ' + incVar + ' = ';
  //   if (Blockly.isNumber(increment)) {
  //     code += Math.abs(increment) + ';\n';
  //   } else {
  //     code += 'abs(' + increment + ');\n';
  //   }
  //   code += 'if (' + startVar + ' > ' + endVar + ') {\n';
  //   code += Blockly.Franzininho.INDENT + incVar + ' = -' + incVar + ';\n';
  //   code += '}\n';
  //   code += 'for (' + variable0 + ' = ' + startVar + ';\n' +
  //       '     ' + incVar + ' >= 0 ? ' +
  //       variable0 + ' <= ' + endVar + ' : ' +
  //       variable0 + ' >= ' + endVar + ';\n' +
  //       '     ' + variable0 + ' += ' + incVar + ') {\n' +
  //       branch + '}\n';
  // }
  return code;
};

/**
 * A "for each" block.
 * TODO: Removed for now from toolbox as lists are not yet implemented.
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Franzininho['controls_forEach'] = Blockly.Franzininho.noGeneratorCodeLine;

/**
 * Generator for the loop flow control statements.
 * Arduino code: loop { break;/continue; }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Franzininho['controls_flow_statements'] = function(block) {
  switch (block.getFieldValue('FLOW')) {
    case 'BREAK':
      return 'break;\n';
    case 'CONTINUE':
      return 'continue;\n';
  }
  throw 'Unknown flow statement.';
};
