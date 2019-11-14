/**
 * @license
 * Visual Blocks Language
 *
 * Copyright 2014 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Helper functions for generating Dart for blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Franzininho');

goog.require('Blockly.Generator');


/**
 * Dart code generator.
 * @type {!Blockly.Generator}
 */
Blockly.Franzininho = new Blockly.Generator('Franzininho');

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
// Blockly.Franzininho.addReservedWords(
//     // https://www.dartlang.org/docs/spec/latest/dart-language-specification.pdf
//     // Section 16.1.1
//     'assert,break,case,catch,class,const,continue,default,do,else,enum,' +
//     'extends,false,final,finally,for,if,in,is,new,null,rethrow,return,super,' +
//     'switch,this,throw,true,try,var,void,while,with,' +
//     // https://api.dartlang.org/dart_core.html
//     'print,identityHashCode,identical,BidirectionalIterator,Comparable,' +
//     'double,Function,int,Invocation,Iterable,Iterator,List,Map,Match,num,' +
//     'Pattern,RegExp,Set,StackTrace,String,StringSink,Type,bool,DateTime,' +
//     'Deprecated,Duration,Expando,Null,Object,RuneIterator,Runes,Stopwatch,' +
//     'StringBuffer,Symbol,Uri,Comparator,AbstractClassInstantiationError,' +
//     'ArgumentError,AssertionError,CastError,ConcurrentModificationError,' +
//     'CyclicInitializationError,Error,Exception,FallThroughError,' +
//     'FormatException,IntegerDivisionByZeroException,NoSuchMethodError,' +
//     'NullThrownError,OutOfMemoryError,RangeError,StackOverflowError,' +
//     'StateError,TypeError,UnimplementedError,UnsupportedError'
// );

Blockly.Franzininho.addReservedWords(
  // https://www.dartlang.org/docs/spec/latest/dart-language-specification.pdf
  // Section 16.1.1
  'Blockly,' +  // In case JS is evaled in the current window.
    'setup,loop,if,else,for,switch,case,while,do,break,continue,return,goto,' +
    'define,include,HIGH,LOW,INPUT,OUTPUT,INPUT_PULLUP,true,false,integer,' +
    'constants,floating,point,void,boolean,char,unsigned,byte,int,word,long,' +
    'float,double,string,String,array,static,volatile,const,sizeof,pinMode,' +
    'digitalWrite,digitalRead,analogReference,analogRead,analogWrite,tone,' +
    'noTone,shiftOut,shitIn,pulseIn,millis,micros,delay,delayMicroseconds,' +
    'min,max,abs,constrain,map,pow,sqrt,sin,cos,tan,randomSeed,random,' +
    'lowByte,highByte,bitRead,bitWrite,bitSet,bitClear,bit,attachInterrupt,' +
    'detachInterrupt,interrupts,noInterrupts'
);

/**
 * Order of operation ENUMs.
 * https://www.dartlang.org/docs/dart-up-and-running/ch02.html#operator_table
 */
Blockly.Franzininho.ORDER_ATOMIC = 0;         // 0 "" ...
Blockly.Franzininho.ORDER_UNARY_POSTFIX = 1;  // expr++ expr-- () [] . ?.
Blockly.Franzininho.ORDER_UNARY_PREFIX = 2;   // -expr !expr ~expr ++expr --expr
Blockly.Franzininho.ORDER_MULTIPLICATIVE = 3; // * / % ~/
Blockly.Franzininho.ORDER_ADDITIVE = 4;       // + -
Blockly.Franzininho.ORDER_SHIFT = 5;          // << >>
Blockly.Franzininho.ORDER_BITWISE_AND = 6;    // &
Blockly.Franzininho.ORDER_BITWISE_XOR = 7;    // ^
Blockly.Franzininho.ORDER_BITWISE_OR = 8;     // |
Blockly.Franzininho.ORDER_RELATIONAL = 9;     // >= > <= < as is is!
Blockly.Franzininho.ORDER_EQUALITY = 10;      // == !=
Blockly.Franzininho.ORDER_LOGICAL_AND = 11;   // &&
Blockly.Franzininho.ORDER_LOGICAL_OR = 12;    // ||
Blockly.Franzininho.ORDER_IF_NULL = 13;       // ??
Blockly.Franzininho.ORDER_CONDITIONAL = 14;   // expr ? expr : expr
Blockly.Franzininho.ORDER_CASCADE = 15;       // ..
Blockly.Franzininho.ORDER_ASSIGNMENT = 16;    // = *= /= ~/= %= += -= <<= >>= &= ^= |=
Blockly.Franzininho.ORDER_NONE = 99;          // (...)

/**
 * Initialise the database of variable names.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
// Blockly.Franzininho.init = function(workspace) {
//   // Create a dictionary of definitions to be printed before the code.
//   Blockly.Franzininho.definitions_ = Object.create(null);
//   // Create a dictionary mapping desired function names in definitions_
//   // to actual function names (to avoid collisions with user functions).
//   Blockly.Franzininho.functionNames_ = Object.create(null);

//   if (!Blockly.Franzininho.variableDB_) {
//     Blockly.Franzininho.variableDB_ =
//         new Blockly.Names(Blockly.Franzininho.RESERVED_WORDS_);
//   } else {
//     Blockly.Franzininho.variableDB_.reset();
//   }

//   Blockly.Franzininho.variableDB_.setVariableMap(workspace.getVariableMap());

//   var defvars = [];
//   // Add developer variables (not created or named by the user).
//   var devVarList = Blockly.Variables.allDeveloperVariables(workspace);
//   for (var i = 0; i < devVarList.length; i++) {
//     defvars.push(Blockly.Franzininho.variableDB_.getName(devVarList[i],
//         Blockly.Names.DEVELOPER_VARIABLE_TYPE));
//   }

//   // Add user variables, but only ones that are being used.
//   var variables = Blockly.Variables.allUsedVarModels(workspace);
//   for (var i = 0; i < variables.length; i++) {
//     defvars.push(Blockly.Franzininho.variableDB_.getName(variables[i].getId(),
//         Blockly.Variables.NAME_TYPE));
//   }

//   // Declare all of the variables.
//   if (defvars.length) {
//     Blockly.Franzininho.definitions_['variables'] =
//         'var ' + defvars.join(', ') + ';';
//   }
// };

// /**
//  * Prepend the generated code with the variable definitions.
//  * @param {string} code Generated code.
//  * @return {string} Completed code.
//  */
// Blockly.Franzininho.finish = function(code) {
//   // Indent every line.
//   if (code) {
//     code = Blockly.Franzininho.prefixLines(code, Blockly.Franzininho.INDENT);
//   }
//   code = 'main() {\n' + code + '}';

//   // Convert the definitions dictionary into a list.
//   var imports = [];
//   var definitions = [];
//   for (var name in Blockly.Franzininho.definitions_) {
//     var def = Blockly.Franzininho.definitions_[name];
//     if (def.match(/^import\s/)) {
//       imports.push(def);
//     } else {
//       definitions.push(def);
//     }
//   }
//   // Clean up temporary data.
//   delete Blockly.Franzininho.definitions_;
//   delete Blockly.Franzininho.functionNames_;
//   Blockly.Franzininho.variableDB_.reset();
//   var allDefs = imports.join('\n') + '\n\n' + definitions.join('\n\n');
//   return allDefs.replace(/\n\n+/g, '\n\n').replace(/\n*$/, '\n\n\n') + code;
// };

Blockly.Franzininho.init = function(workspace) {
  // Create a dictionary of definitions to be printed at the top of the sketch
  Blockly.Franzininho.includes_ = Object.create(null);
  // Create a dictionary of global definitions to be printed after variables
  Blockly.Franzininho.definitions_ = Object.create(null);
  // Create a dictionary of variables
  Blockly.Franzininho.variables_ = Object.create(null);
  // Create a dictionary of functions from the code generator
  Blockly.Franzininho.codeFunctions_ = Object.create(null);
  // Create a dictionary of functions created by the user
  Blockly.Franzininho.userFunctions_ = Object.create(null);
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions)
  Blockly.Franzininho.functionNames_ = Object.create(null);
  // Create a dictionary of setups to be printed in the setup() function
  Blockly.Franzininho.setups_ = Object.create(null);
  // Create a dictionary of pins to check if their use conflicts
  Blockly.Franzininho.pins_ = Object.create(null);

  // if (!Blockly.Franzininho.variableDB_) {
  //   Blockly.Franzininho.variableDB_ =
  //       new Blockly.Names(Blockly.Franzininho.RESERVED_WORDS_);
  // } else {
  //   Blockly.Franzininho.variableDB_.reset();
  // }

  // Blockly.Franzininho.variableDB_.setVariableMap(workspace.getVariableMap());

  // var defvars = [];
  // // Add developer variables (not created or named by the user).
  // var devVarList = Blockly.Variables.allDeveloperVariables(workspace);
  // for (var i = 0; i < devVarList.length; i++) {
  //   defvars.push(Blockly.Franzininho.variableDB_.getName(devVarList[i],
  //       Blockly.Names.DEVELOPER_VARIABLE_TYPE));
  // }

  // // Add user variables, but only ones that are being used.
  // var variables = Blockly.Variables.allUsedVarModels(workspace);
  // for (var i = 0; i < variables.length; i++) {
  //   defvars.push(Blockly.Franzininho.variableDB_.getName(variables[i].getId(),
  //       Blockly.Variables.NAME_TYPE));
  // }

  // // Declare all of the variables.
  // if (defvars.length) {
  //   Blockly.Franzininho.definitions_['variables'] =
  //       'var ' + defvars.join(', ') + ';';
  // }
  Blockly.Franzininho.variablesInitCode_ = '';

  if (!Blockly.Franzininho.variableDB_) {
      Blockly.Franzininho.variableDB_ =
          new Blockly.Names(Blockly.Franzininho.RESERVED_WORDS_);
  } else {
      Blockly.Franzininho.variableDB_.reset();
  }

  Blockly.Franzininho.variableDB_.setVariableMap(workspace.getVariableMap());

  // We don't have developer variables for now
  // // Add developer variables (not created or named by the user).
  // var devVarList = Blockly.Variables.allDeveloperVariables(workspace);
  // for (var i = 0; i < devVarList.length; i++) {
  //     defvars.push(Blockly.Franzininho.variableDB_.getName(devVarList[i],
  //         Blockly.Names.DEVELOPER_VARIABLE_TYPE));
  // }

  var doubleVariables = workspace.getVariablesOfType('Number');
  var i = 0;
  var variableCode = '';
  for (i = 0; i < doubleVariables.length; i += 1) {
      variableCode += 'int ' + doubleVariables[i].name + '; \n\n';
  }

  var stringVariables = workspace.getVariablesOfType('String');
  for (i = 0; i < stringVariables.length; i += 1) {
      variableCode += 'String ' + stringVariables[i].name + '; \n\n';
  }

  var booleanVariables = workspace.getVariablesOfType('Boolean');
  for (i = 0; i < booleanVariables.length; i += 1) {
      variableCode += 'boolean ' + booleanVariables[i].name + '; \n\n';
  }

  // var colourVariables = workspace.getVariablesOfType('Colour');
  // for (i = 0; i < colourVariables.length; i += 1) {
  //     variableCode += 'RGB ' + colourVariables[i].name + ' = {0, 0, 0}; \n\n';
  // }

  Blockly.Franzininho.variables_[Blockly.Franzininho.variables_.length+1] = variableCode;
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.Franzininho.finish = function(code) {

  var includes = [], definitions = [], variables = [], functions = [];
  for (var name in Blockly.Franzininho.includes_) {
    includes.push(Blockly.Franzininho.includes_[name]);
  }
  if (includes.length) {
    includes.push('\n');
  }
  for (var name in Blockly.Franzininho.variables_) {
    variables.push(Blockly.Franzininho.variables_[name]);
  }
  if (variables.length) {
    variables.push('\n');
  }
  for (var name in Blockly.Franzininho.definitions_) {
    definitions.push(Blockly.Franzininho.definitions_[name]);
  }
  if (definitions.length) {
    definitions.push('\n');
  }
  for (var name in Blockly.Franzininho.codeFunctions_) {
    functions.push(Blockly.Franzininho.codeFunctions_[name]);
  }
  for (var name in Blockly.Franzininho.userFunctions_) {
    functions.push(Blockly.Franzininho.userFunctions_[name]);
  }
  if (functions.length) {
    functions.push('\n');
  }

    // userSetupCode added at the end of the setup function without leading spaces
    var setups = [''], userSetupCode= '';
    if (Blockly.Franzininho.setups_['userSetupCode'] !== undefined) {
      userSetupCode = '\n' + Blockly.Franzininho.setups_['userSetupCode'];
      delete Blockly.Franzininho.setups_['userSetupCode'];
    }
    for (var name in Blockly.Franzininho.setups_) {
      setups.push(Blockly.Franzininho.setups_[name]);
    }
    if (userSetupCode) {
      setups.push(userSetupCode);
    }

    // Clean up temporary data
    delete Blockly.Franzininho.includes_;
    delete Blockly.Franzininho.definitions_;
    delete Blockly.Franzininho.codeFunctions_;
    delete Blockly.Franzininho.userFunctions_;
    delete Blockly.Franzininho.functionNames_;
    delete Blockly.Franzininho.setups_;
    delete Blockly.Franzininho.pins_;
    Blockly.Franzininho.variableDB_.reset();

    var allDefs = includes.join('\n') +// variables.join('') +
        definitions.join('\n') + functions.join('\n\n');
    var setup = 'void setup() {\n' + variables.join('') + setups.join('\n  ') + '\n}\n\n';
    var loop = 'void loop() {\n  ' + code.replace(/\n/g, '\n  ') + '\n}';
    return allDefs + setup + loop;
  // // Indent every line.
  // if (code) {
  //   code = Blockly.Franzininho.prefixLines(code, Blockly.Franzininho.INDENT);
  // }
  // code = 'main() {\n' + code + '}';

  // // Convert the definitions dictionary into a list.
  // var imports = [];
  // var definitions = [];
  // for (var name in Blockly.Franzininho.definitions_) {
  //   var def = Blockly.Franzininho.definitions_[name];
  //   if (def.match(/^import\s/)) {
  //     imports.push(def);
  //   } else {
  //     definitions.push(def);
  //   }
  // }
  // // Clean up temporary data.
  // delete Blockly.Franzininho.definitions_;
  // delete Blockly.Franzininho.functionNames_;
  // Blockly.Franzininho.variableDB_.reset();
  // var allDefs = imports.join('\n') + '\n\n' + definitions.join('\n\n');
  // return allDefs.replace(/\n\n+/g, '\n\n').replace(/\n*$/, '\n\n\n') + code;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.  A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.Franzininho.scrubNakedValue = function(line) {
  return line + ';\n';
};

/**
 * Encode a string as a properly escaped Dart string, complete with quotes.
 * @param {string} string Text to encode.
 * @return {string} Dart string.
 * @private
 */
Blockly.Franzininho.quote_ = function(string) {
  // Can't use goog.string.quote since $ must also be escaped.
  string = string.replace(/\\/g, '\\\\')
                 .replace(/\n/g, '\\\n')
                 .replace(/\$/g, '\\$')
                 .replace(/'/g, '\\\'');
  return '\'' + string + '\'';
};

/**
 * Common tasks for generating Dart from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The Dart code created for this block.
 * @param {boolean=} opt_thisOnly True to generate code for only this statement.
 * @return {string} Dart code with comments and subsequent blocks added.
 * @private
 */
Blockly.Franzininho.scrub_ = function(block, code, opt_thisOnly) {
  var commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    comment = Blockly.utils.wrap(comment, Blockly.Franzininho.COMMENT_WRAP - 3);
    if (comment) {
      if (block.getProcedureDef) {
        // Use documentation comment for function comments.
        commentCode += Blockly.Franzininho.prefixLines(comment + '\n', '/// ');
      } else {
        commentCode += Blockly.Franzininho.prefixLines(comment + '\n', '// ');
      }
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var i = 0; i < block.inputList.length; i++) {
      if (block.inputList[i].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[i].connection.targetBlock();
        if (childBlock) {
          var comment = Blockly.Franzininho.allNestedComments(childBlock);
          if (comment) {
            commentCode += Blockly.Franzininho.prefixLines(comment, '// ');
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = opt_thisOnly ? '' : Blockly.Franzininho.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};

/**
 * Gets a property and adjusts the value while taking into account indexing.
 * @param {!Blockly.Block} block The block.
 * @param {string} atId The property ID of the element to get.
 * @param {number=} opt_delta Value to add.
 * @param {boolean=} opt_negate Whether to negate the value.
 * @param {number=} opt_order The highest order acting on this value.
 * @return {string|number}
 */
Blockly.Franzininho.getAdjusted = function(block, atId, opt_delta, opt_negate,
    opt_order) {
  var delta = opt_delta || 0;
  var order = opt_order || Blockly.Franzininho.ORDER_NONE;
  if (block.workspace.options.oneBasedIndex) {
    delta--;
  }
  var defaultAtIndex = block.workspace.options.oneBasedIndex ? '1' : '0';
  if (delta) {
    var at = Blockly.Franzininho.valueToCode(block, atId,
        Blockly.Franzininho.ORDER_ADDITIVE) || defaultAtIndex;
  } else if (opt_negate) {
    var at = Blockly.Franzininho.valueToCode(block, atId,
        Blockly.Franzininho.ORDER_UNARY_PREFIX) || defaultAtIndex;
  } else {
    var at = Blockly.Franzininho.valueToCode(block, atId, order) ||
        defaultAtIndex;
  }

  if (Blockly.isNumber(at)) {
    // If the index is a naked number, adjust it right now.
    at = parseInt(at, 10) + delta;
    if (opt_negate) {
      at = -at;
    }
  } else {
    // If the index is dynamic, adjust it in code.
    if (delta > 0) {
      at = at + ' + ' + delta;
      var innerOrder = Blockly.Franzininho.ORDER_ADDITIVE;
    } else if (delta < 0) {
      at = at + ' - ' + -delta;
      var innerOrder = Blockly.Franzininho.ORDER_ADDITIVE;
    }
    if (opt_negate) {
      if (delta) {
        at = '-(' + at + ')';
      } else {
        at = '-' + at;
      }
      var innerOrder = Blockly.Franzininho.ORDER_UNARY_PREFIX;
    }
    innerOrder = Math.floor(innerOrder);
    order = Math.floor(order);
    if (innerOrder && order >= innerOrder) {
      at = '(' + at + ')';
    }
  }
  return at;
};

Blockly.Franzininho.addSetup = function(setupTag, code, overwrite) {
  var overwritten = false;
  if (overwrite || (Blockly.Franzininho.setups_[setupTag] === undefined)) {
    Blockly.Franzininho.setups_[setupTag] = code;
    overwritten = true;
  }
  return overwritten;
};

Blockly.Franzininho.reservePin = function(block, pin, pinType, warningTag) {
  if (Blockly.Franzininho.pins_[pin] !== undefined) {
    if (Blockly.Franzininho.pins_[pin] != pinType) {
      block.setWarningText(Blockly.Msg.ARD_PIN_WARN1.replace('%1', pin)
		.replace('%2', warningTag).replace('%3', pinType)
		.replace('%4', Blockly.Franzininho.pins_[pin]), warningTag);
    } else {
      block.setWarningText(null, warningTag);
    }
  } else {
    Blockly.Franzininho.pins_[pin] = pinType;
    block.setWarningText(null, warningTag);
  }
};