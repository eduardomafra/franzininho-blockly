/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
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
 * @fileoverview Utility functions for handling variables.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

/**
 * @name Blockly.Variables
 * @namespace
 */
goog.provide('Blockly.Variables');

goog.require('Blockly.Blocks');
goog.require('Blockly.constants');
goog.require('Blockly.VariableModel');
goog.require('Blockly.Workspace');
goog.require('Blockly.Xml');

goog.require('goog.string');


/**
 * Constant to separate variable names from procedures and generated functions
 * when running generators.
 * @deprecated Use Blockly.VARIABLE_CATEGORY_NAME
 */
Blockly.Variables.NAME_TYPE = Blockly.VARIABLE_CATEGORY_NAME;

/**
 * Find all user-created variables that are in use in the workspace.
 * For use by generators.
 * To get a list of all variables on a workspace, including unused variables,
 * call Workspace.getAllVariables.
 * @param {!Blockly.Workspace} ws The workspace to search for variables.
 * @return {!Array.<!Blockly.VariableModel>} Array of variable models.
 */
Blockly.Variables.allUsedVarModels = function(ws) {
  var blocks = ws.getAllBlocks(false);
  var variableHash = Object.create(null);
  // Iterate through every block and add each variable to the hash.
  for (var i = 0; i < blocks.length; i++) {
    var blockVariables = blocks[i].getVarModels();
    if (blockVariables) {
      for (var j = 0; j < blockVariables.length; j++) {
        var variable = blockVariables[j];
        var id = variable.getId();
        if (id) {
          variableHash[id] = variable;
        }
      }
    }
  }
  // Flatten the hash into a list.
  var variableList = [];
  for (var id in variableHash) {
    variableList.push(variableHash[id]);
  }
  return variableList;
};

/**
 * Find all user-created variables that are in use in the workspace and return
 * only their names.
 * For use by generators.
 * To get a list of all variables on a workspace, including unused variables,
 * call Workspace.getAllVariables.
 * @deprecated January 2018
 */
Blockly.Variables.allUsedVariables = function() {
  console.warn('Deprecated call to Blockly.Variables.allUsedVariables. ' +
      'Use Blockly.Variables.allUsedVarModels instead.\nIf this is a major ' +
      'issue please file a bug on GitHub.');
};

/**
 * @private
 * @type {Object<string,boolean>}
 */
Blockly.Variables.ALL_DEVELOPER_VARS_WARNINGS_BY_BLOCK_TYPE_ = {};

/**
 * Find all developer variables used by blocks in the workspace.
 * Developer variables are never shown to the user, but are declared as global
 * variables in the generated code.
 * To declare developer variables, define the getDeveloperVariables function on
 * your block and return a list of variable names.
 * For use by generators.
 * @param {!Blockly.Workspace} workspace The workspace to search.
 * @return {!Array.<string>} A list of non-duplicated variable names.
 */
Blockly.Variables.allDeveloperVariables = function(workspace) {
  var blocks = workspace.getAllBlocks(false);
  var variableHash = Object.create(null);
  for (var i = 0, block; block = blocks[i]; i++) {
    var getDeveloperVariables = block.getDeveloperVariables;
    if (!getDeveloperVariables && block.getDeveloperVars) {
      // August 2018: getDeveloperVars() was deprecated and renamed
      // getDeveloperVariables().
      getDeveloperVariables = block.getDeveloperVars;
      if (!Blockly.Variables.ALL_DEVELOPER_VARS_WARNINGS_BY_BLOCK_TYPE_[
          block.type]) {
        console.warn('Function getDeveloperVars() deprecated. Use ' +
            'getDeveloperVariables() (block type \'' + block.type + '\')');
        Blockly.Variables.ALL_DEVELOPER_VARS_WARNINGS_BY_BLOCK_TYPE_[
            block.type] = true;
      }
    }
    if (getDeveloperVariables) {
      var devVars = getDeveloperVariables();
      for (var j = 0; j < devVars.length; j++) {
        variableHash[devVars[j]] = true;
      }
    }
  }

  // Flatten the hash into a list.
  return Object.keys(variableHash);
};

/**
 * Construct the elements (blocks and button) required by the flyout for the
 * variable category.
 * @param {!Blockly.Workspace} workspace The workspace containing variables.
 * @return {!Array.<!Element>} Array of XML elements.
 */
Blockly.Variables.flyoutCategory = function (workspace) {
  var xmlList = [];
  var btnNumVariable = document.createElement('button');
  btnNumVariable.setAttribute('text', 'Create Number Variable');
  btnNumVariable.setAttribute('callbackKey', 'CREATE_NUM_VARIABLE');

  workspace.registerButtonCallback('CREATE_NUM_VARIABLE', function (button) {
      Blockly.Variables.createVariableButtonHandler(button.getTargetWorkspace(), function () {
          var numVariableBlock = workspace.newBlock('variables_set_number');
          numVariableBlock.initSvg();
          numVariableBlock.render();

          var mathBlock = workspace.newBlock('math_number');
          mathBlock.setShadow(false);
          mathBlock.setFieldValue(0, 'NUM');
          mathBlock.initSvg();
          mathBlock.render();
          numVariableBlock.getInput('VALUE').connection.connect(mathBlock.outputConnection);

          Blockly.Variables.connectedCreatedVariableToStartBlock(numVariableBlock);

      }, 'Number');
  });

  xmlList.push(btnNumVariable);

  var btnStringVariable = document.createElement('button');

  btnStringVariable.setAttribute('text', 'Create String Variable');
  btnStringVariable.setAttribute('callbackKey', 'CREATE_STRING_VARIABLE');

  workspace.registerButtonCallback('CREATE_STRING_VARIABLE', function (button) {
      Blockly.Variables.createVariableButtonHandler(button.getTargetWorkspace(), function () {
          var stringVariableBlock = workspace.newBlock('variables_set_string');
          stringVariableBlock.initSvg();
          stringVariableBlock.render();

          var textBlock = workspace.newBlock('text');
          textBlock.setShadow(false);
          textBlock.setFieldValue('abc', 'TEXT');
          textBlock.initSvg();
          textBlock.render();
          stringVariableBlock.getInput('VALUE').connection.connect(textBlock.outputConnection);

          Blockly.Variables.connectedCreatedVariableToStartBlock(stringVariableBlock);

      }, 'String');
  });

  xmlList.push(btnStringVariable);

  var btnBoolVariable = document.createElement('button');
  btnBoolVariable.setAttribute('text', 'Create Boolean Variable');
  btnBoolVariable.setAttribute('callbackKey', 'CREATE_BOOLEAN_VARIABLE');

  workspace.registerButtonCallback('CREATE_BOOLEAN_VARIABLE', function (button) {
      Blockly.Variables.createVariableButtonHandler(button.getTargetWorkspace(), function () {
          var boolVariableBlock = workspace.newBlock('variables_set_boolean');
          boolVariableBlock.initSvg();
          boolVariableBlock.render();

          var boolBlock = workspace.newBlock('logic_boolean');
          boolBlock.setShadow(false);
          boolBlock.initSvg();
          boolBlock.render();
          boolVariableBlock.getInput('VALUE').connection.connect(boolBlock.outputConnection);

          Blockly.Variables.connectedCreatedVariableToStartBlock(boolVariableBlock);

      }, 'Boolean');

  });

  xmlList.push(btnBoolVariable);

  // var btnColourVariable = document.createElement('button');

  // btnColourVariable.setAttribute('text', 'Create Color Variable');
  // btnColourVariable.setAttribute('callbackKey', 'CREATE_COLOUR_VARIABLE');

  // workspace.registerButtonCallback('CREATE_COLOUR_VARIABLE', function (button) {
  //     Blockly.Variables.createVariableButtonHandler(button.getTargetWorkspace(), function () {
  //         var colourVariableBlock = workspace.newBlock('variables_set_colour');
  //         colourVariableBlock.initSvg();
  //         colourVariableBlock.render();

  //         var colourBlock = workspace.newBlock('colour_picker');
  //         colourBlock.setShadow(false);
  //         colourBlock.initSvg();
  //         colourBlock.render();
  //         colourVariableBlock.getInput('VALUE').connection.connect(colourBlock.outputConnection);

  //         Blockly.Variables.connectedCreatedVariableToStartBlock(colourVariableBlock);

  //     }, 'Colour');

  // });

  // xmlList.push(btnColourVariable);

  var blockList = Blockly.Variables.flyoutCategoryBlocks(workspace);
  xmlList = xmlList.concat(blockList);
  return xmlList;
};

Blockly.Variables.connectedCreatedVariableToStartBlock = function (variableBlock) {
  var arduinoStartBlocks = Blockly.mainWorkspace.getTopBlocks().filter(function(block) {
      return block.type == 'arduino_start';
  });

  if (arduinoStartBlocks.length == 0) {
      return;
  }

  var arduinoStartBlock = arduinoStartBlocks[0];
  var parentConnection = arduinoStartBlock.getInput('setup').connection;
  parentConnection.connect(variableBlock.previousConnection);
};

/**
 * Construct the blocks required by the flyout for the variable category.
 * @param {!Blockly.Workspace} workspace The workspace containing variables.
 * @return {!Array.<!Element>} Array of XML block elements.
 */
Blockly.Variables.flyoutCategoryBlocks = function (workspace) {

  var numVariables = workspace.getVariablesOfType('Number');
  var stringVariables = workspace.getVariablesOfType('String');
  var boolVariables = workspace.getVariablesOfType('Boolean');
  // var colourVariables = workspace.getVariablesOfType('Colour');

  var xmlList = [];
  if (numVariables.length > 0) {

      var blockTextSetNum = '<xml>' +
          '<block type="variables_set_number" gap="8">' +
          Blockly.Variables.generateVariableFieldXmlString(numVariables[0]) +
          '<value name="VALUE"> <block type="math_number"> <field name="NUM">0</field></block> </value>' +
          '</block>' +
          '</xml>';
      var blockSetNum = Blockly.Xml.textToDom(blockTextSetNum).firstChild;
      xmlList.push(blockSetNum);

      var blockTextGetNum = '<xml>' +
          '<block type="variables_get_number" gap="24">' +
          Blockly.Variables.generateVariableFieldXmlString(numVariables[0]) +
          '</block>' +
          '</xml>';
      var blockGetNum = Blockly.Xml.textToDom(blockTextGetNum).firstChild;
      xmlList.push(blockGetNum);

  }

  if (stringVariables.length > 0) {

      var blockTextSetString = '<xml>' +
          '<block type="variables_set_string" gap="24">' +
          Blockly.Variables.generateVariableFieldXmlString(stringVariables[0]) +
          '<value name="VALUE"> <block type="text"> <field name="TEXT">abc</field> </block> </value>' +
          '</block>' +
          '</xml>';
      var blockSetString = Blockly.Xml.textToDom(blockTextSetString).firstChild;

      xmlList.push(blockSetString);

      var blockTextGetString = '<xml>' +
          '<block type="variables_get_string" gap="24">' +
          Blockly.Variables.generateVariableFieldXmlString(stringVariables[0]) +
          '</block>' +
          '</xml>';
      var blockGetString = Blockly.Xml.textToDom(blockTextGetString).firstChild;
      xmlList.push(blockGetString);
  }

  if (boolVariables.length > 0) {

      var blockTextSetBool = '<xml>' +
          '<block type="variables_set_boolean" gap="24">' +
          Blockly.Variables.generateVariableFieldXmlString(boolVariables[0]) +
          '<value name="VALUE"> <block type="logic_boolean"> </block> </value>' +
          '</block>' +
          '</xml>';
      var blockSetBool = Blockly.Xml.textToDom(blockTextSetBool).firstChild;
      xmlList.push(blockSetBool);

      var blockTextGetBool = '<xml>' +
          '<block type="variables_get_boolean" gap="24">' +
          Blockly.Variables.generateVariableFieldXmlString(boolVariables[0]) +
          '</block>' +
          '</xml>';
      var blockGetBool = Blockly.Xml.textToDom(blockTextGetBool).firstChild;
      xmlList.push(blockGetBool);
  }

  // if (colourVariables.length > 0) {

  //     var blockTextSetColour = '<xml>' +
  //         '<block type="variables_set_colour" gap="24">' +
  //         Blockly.Variables.generateVariableFieldXmlString(colourVariables[0]) +
  //         '<value name="VALUE"> <block type="colour_picker"> </block> </value>' +
  //         '</block>' +
  //         '</xml>';
  //     var blockSetColour = Blockly.Xml.textToDom(blockTextSetColour).firstChild;
  //     xmlList.push(blockSetColour);

  //     var blockTextGetColour = '<xml>' +
  //         '<block type="variables_get_colour" gap="24">' +
  //         Blockly.Variables.generateVariableFieldXmlString(colourVariables[0]) +
  //         '</block>' +
  //         '</xml>';
  //     var blockGetColour = Blockly.Xml.textToDom(blockTextGetColour).firstChild;
  //     xmlList.push(blockGetColour);
  // }

  return xmlList;
};

/**
 * Return a new variable name that is not yet being used. This will try to
 * generate single letter variable names in the range 'i' to 'z' to start with.
 * If no unique name is located it will try 'i' to 'z', 'a' to 'h',
 * then 'i2' to 'z2' etc.  Skip 'l'.
 * @param {!Blockly.Workspace} workspace The workspace to be unique in.
 * @return {string} New variable name.
 */
Blockly.Variables.generateUniqueName = function(workspace) {
  var variableList = workspace.getAllVariables();
  var newName = '';
  if (variableList.length) {
    var nameSuffix = 1;
    var letters = 'ijkmnopqrstuvwxyzabcdefgh';  // No 'l'.
    var letterIndex = 0;
    var potName = letters.charAt(letterIndex);
    while (!newName) {
      var inUse = false;
      for (var i = 0; i < variableList.length; i++) {
        if (variableList[i].name.toLowerCase() == potName) {
          // This potential name is already used.
          inUse = true;
          break;
        }
      }
      if (inUse) {
        // Try the next potential name.
        letterIndex++;
        if (letterIndex == letters.length) {
          // Reached the end of the character sequence so back to 'i'.
          // a new suffix.
          letterIndex = 0;
          nameSuffix++;
        }
        potName = letters.charAt(letterIndex);
        if (nameSuffix > 1) {
          potName += nameSuffix;
        }
      } else {
        // We can use the current potential name.
        newName = potName;
      }
    }
  } else {
    newName = 'i';
  }
  return newName;
};

/**
 * Handles "Create Variable" button in the default variables toolbox category.
 * It will prompt the user for a varibale name, including re-prompts if a name
 * is already in use among the workspace's variables.
 *
 * Custom button handlers can delegate to this function, allowing variables
 * types and after-creation processing. More complex customization (e.g.,
 * prompting for variable type) is beyond the scope of this function.
 *
 * @param {!Blockly.Workspace} workspace The workspace on which to create the
 *     variable.
 * @param {function(?string=)=} opt_callback A callback. It will be passed an
 *     acceptable new variable name, or null if change is to be aborted (cancel
 *     button), or undefined if an existing variable was chosen.
 * @param {string=} opt_type The type of the variable like 'int', 'string', or
 *     ''. This will default to '', which is a specific type.
 */
Blockly.Variables.createVariableButtonHandler = function(
    workspace, opt_callback, opt_type) {
  var type = opt_type || '';
  // This function needs to be named so it can be called recursively.
  var promptAndCheckWithAlert = function(defaultName) {
    Blockly.Variables.promptName(Blockly.Msg['NEW_VARIABLE_TITLE'], defaultName,
        function(text) {
          if (text) {
            var existing =
                Blockly.Variables.nameUsedWithAnyType_(text, workspace);
            if (existing) {
              var lowerCase = text.toLowerCase();
              if (existing.type == type) {
                var msg = Blockly.Msg['VARIABLE_ALREADY_EXISTS'].replace(
                    '%1', lowerCase);
              } else {
                var msg =
                    Blockly.Msg['VARIABLE_ALREADY_EXISTS_FOR_ANOTHER_TYPE'];
                msg = msg.replace('%1', lowerCase).replace('%2', existing.type);
              }
              Blockly.alert(msg,
                  function() {
                    promptAndCheckWithAlert(text);  // Recurse
                  });
            } else {
              // No conflict
              workspace.createVariable(text, type);
              if (opt_callback) {
                opt_callback(text);
              }
            }
          } else {
            // User canceled prompt.
            if (opt_callback) {
              opt_callback(null);
            }
          }
        });
  };
  promptAndCheckWithAlert('');
};
goog.exportSymbol('Blockly.Variables.createVariableButtonHandler',
    Blockly.Variables.createVariableButtonHandler);

/**
 * Original name of Blockly.Variables.createVariableButtonHandler(..).
 * @deprecated Use Blockly.Variables.createVariableButtonHandler(..).
 *
 * @param {!Blockly.Workspace} workspace The workspace on which to create the
 *     variable.
 * @param {function(?string=)=} opt_callback A callback. It will be passed an
 *     acceptable new variable name, or null if change is to be aborted (cancel
 *     button), or undefined if an existing variable was chosen.
 * @param {string=} opt_type The type of the variable like 'int', 'string', or
 *     ''. This will default to '', which is a specific type.
 */
Blockly.Variables.createVariable =
    Blockly.Variables.createVariableButtonHandler;
goog.exportSymbol('Blockly.Variables.createVariable',
    Blockly.Variables.createVariable);

/**
 * Rename a variable with the given workspace, variableType, and oldName.
 * @param {!Blockly.Workspace} workspace The workspace on which to rename the
 *     variable.
 * @param {Blockly.VariableModel} variable Variable to rename.
 * @param {function(?string=)=} opt_callback A callback. It will
 *     be passed an acceptable new variable name, or null if change is to be
 *     aborted (cancel button), or undefined if an existing variable was chosen.
 */
Blockly.Variables.renameVariable = function(workspace, variable,
    opt_callback) {
  // This function needs to be named so it can be called recursively.
  var promptAndCheckWithAlert = function(defaultName) {
    var promptText =
        Blockly.Msg['RENAME_VARIABLE_TITLE'].replace('%1', variable.name);
    Blockly.Variables.promptName(promptText, defaultName,
        function(newName) {
          if (newName) {
            var existing = Blockly.Variables.nameUsedWithOtherType_(newName,
                variable.type, workspace);
            if (existing) {
              var msg = Blockly.Msg['VARIABLE_ALREADY_EXISTS_FOR_ANOTHER_TYPE']
                  .replace('%1', newName.toLowerCase())
                  .replace('%2', existing.type);
              Blockly.alert(msg,
                  function() {
                    promptAndCheckWithAlert(newName);  // Recurse
                  });
            } else {
              workspace.renameVariableById(variable.getId(), newName);
              if (opt_callback) {
                opt_callback(newName);
              }
            }
          } else {
            // User canceled prompt.
            if (opt_callback) {
              opt_callback(null);
            }
          }
        });
  };
  promptAndCheckWithAlert('');
};

/**
 * Prompt the user for a new variable name.
 * @param {string} promptText The string of the prompt.
 * @param {string} defaultText The default value to show in the prompt's field.
 * @param {function(?string)} callback A callback. It will return the new
 *     variable name, or null if the user picked something illegal.
 */
Blockly.Variables.promptName = function(promptText, defaultText, callback) {
  Blockly.prompt(promptText, defaultText, function(newVar) {
    // Merge runs of whitespace.  Strip leading and trailing whitespace.
    // Beyond this, all names are legal.
    if (newVar) {
      newVar = newVar.replace(/[\s\xa0]+/g, ' ').replace(/^ | $/g, '');
      if (newVar == Blockly.Msg['RENAME_VARIABLE'] ||
          newVar == Blockly.Msg['NEW_VARIABLE']) {
        // Ok, not ALL names are legal...
        newVar = null;
      }
    }
    callback(newVar);
  });
};

/**
 * Check whether there exists a variable with the given name but a different
 * type.
 * @param {string} name The name to search for.
 * @param {string} type The type to exclude from the search.
 * @param {!Blockly.Workspace} workspace The workspace to search for the
 *     variable.
 * @return {Blockly.VariableModel} The variable with the given name and a
 *     different type, or null if none was found.
 * @private
 */
Blockly.Variables.nameUsedWithOtherType_ = function(name, type, workspace) {
  var allVariables = workspace.getVariableMap().getAllVariables();

  name = name.toLowerCase();
  for (var i = 0, variable; variable = allVariables[i]; i++) {
    if (variable.name.toLowerCase() == name && variable.type != type) {
      return variable;
    }
  }
  return null;
};

/**
 * Check whether there exists a variable with the given name of any type.
 * @param {string} name The name to search for.
 * @param {!Blockly.Workspace} workspace The workspace to search for the
 *     variable.
 * @return {Blockly.VariableModel} The variable with the given name,
 *     or null if none was found.
 * @private
 */
Blockly.Variables.nameUsedWithAnyType_ = function(name, workspace) {
  var allVariables = workspace.getVariableMap().getAllVariables();

  name = name.toLowerCase();
  for (var i = 0, variable; variable = allVariables[i]; i++) {
    if (variable.name.toLowerCase() == name) {
      return variable;
    }
  }
  return null;
};

/**
 * Generate XML string for variable field.
 * @param {!Blockly.VariableModel} variableModel The variable model to generate
 *     an XML string from.
 * @return {string} The generated XML.
 * @package
 */
Blockly.Variables.generateVariableFieldXmlString = function(variableModel) {
  // The variable name may be user input, so it may contain characters that
  // need to be escaped to create valid XML.
  var typeString = variableModel.type;
  if (typeString == '') {
    typeString = '\'\'';
  }
  var text = '<field name="VAR" id="' + variableModel.getId() +
      '" variabletype="' + goog.string.htmlEscape(typeString) +
      '">' + goog.string.htmlEscape(variableModel.name) + '</field>';
  return text;
};

/**
 * Generate DOM objects representing a variable field.
 * @param {!Blockly.VariableModel} variableModel The variable model to
 *     represent.
 * @return {Element} The generated DOM.
 * @public
 */
Blockly.Variables.generateVariableFieldDom = function(variableModel) {
  var xmlFieldString =
      Blockly.Variables.generateVariableFieldXmlString(variableModel);
  var text = '<xml>' + xmlFieldString + '</xml>';
  var dom = Blockly.Xml.textToDom(text);
  var fieldDom = dom.firstChild;
  return fieldDom;
};

/**
 * Helper function to look up or create a variable on the given workspace.
 * If no variable exists, creates and returns it.
 * @param {!Blockly.Workspace} workspace The workspace to search for the
 *     variable.  It may be a flyout workspace or main workspace.
 * @param {string} id The ID to use to look up or create the variable, or null.
 * @param {string=} opt_name The string to use to look up or create the
 *     variable.
 * @param {string=} opt_type The type to use to look up or create the variable.
 * @return {!Blockly.VariableModel} The variable corresponding to the given ID
 *     or name + type combination.
 */
Blockly.Variables.getOrCreateVariablePackage = function(workspace, id, opt_name,
    opt_type) {
  var variable = Blockly.Variables.getVariable(workspace, id, opt_name,
      opt_type);
  if (!variable) {
    variable = Blockly.Variables.createVariable_(workspace, id, opt_name,
        opt_type);
  }
  return variable;
};

/**
 * Look up  a variable on the given workspace.
 * Always looks in the main workspace before looking in the flyout workspace.
 * Always prefers lookup by ID to lookup by name + type.
 * @param {!Blockly.Workspace} workspace The workspace to search for the
 *     variable.  It may be a flyout workspace or main workspace.
 * @param {string} id The ID to use to look up the variable, or null.
 * @param {string=} opt_name The string to use to look up the variable.
 *     Only used if lookup by ID fails.
 * @param {string=} opt_type The type to use to look up the variable.
 *     Only used if lookup by ID fails.
 * @return {Blockly.VariableModel} The variable corresponding to the given ID
 *     or name + type combination, or null if not found.
 * @package
 */
Blockly.Variables.getVariable = function(workspace, id, opt_name, opt_type) {
  var potentialVariableMap = workspace.getPotentialVariableMap();
  // Try to just get the variable, by ID if possible.
  if (id) {
    // Look in the real variable map before checking the potential variable map.
    var variable = workspace.getVariableById(id);
    if (!variable && potentialVariableMap) {
      variable = potentialVariableMap.getVariableById(id);
    }
    if (variable) {
      return variable;
    }
  }
  // If there was no ID, or there was an ID but it didn't match any variables,
  // look up by name and type.
  if (opt_name) {
    if (opt_type == undefined) {
      throw Error('Tried to look up a variable by name without a type');
    }
    // Otherwise look up by name and type.
    var variable = workspace.getVariable(opt_name, opt_type);
    if (!variable && potentialVariableMap) {
      variable = potentialVariableMap.getVariable(opt_name, opt_type);
    }
  }
  return variable;
};

/**
 * Helper function to create a variable on the given workspace.
 * @param {!Blockly.Workspace} workspace The workspace in which to create the
 * variable.  It may be a flyout workspace or main workspace.
 * @param {string} id The ID to use to create the variable, or null.
 * @param {string=} opt_name The string to use to create the variable.
 * @param {string=} opt_type The type to use to create the variable.
 * @return {!Blockly.VariableModel} The variable corresponding to the given ID
 *     or name + type combination.
 * @private
 */
Blockly.Variables.createVariable_ = function(workspace, id, opt_name,
    opt_type) {
  var potentialVariableMap = workspace.getPotentialVariableMap();
  // Variables without names get uniquely named for this workspace.
  if (!opt_name) {
    var ws = workspace.isFlyout ? workspace.targetWorkspace : workspace;
    opt_name = Blockly.Variables.generateUniqueName(ws);
  }

  // Create a potential variable if in the flyout.
  if (potentialVariableMap) {
    var variable = potentialVariableMap.createVariable(opt_name, opt_type, id);
  } else {  // In the main workspace, create a real variable.
    var variable = workspace.createVariable(opt_name, opt_type, id);
  }
  return variable;
};

/**
 * Helper function to get the list of variables that have been added to the
 * workspace after adding a new block, using the given list of variables that
 * were in the workspace before the new block was added.
 * @param {!Blockly.Workspace} workspace The workspace to inspect.
 * @param {!Array.<!Blockly.VariableModel>} originalVariables The array of
 *     variables that existed in the workspace before adding the new block.
 * @return {!Array.<!Blockly.VariableModel>} The new array of variables that
 *     were freshly added to the workspace after creating the new block,
 *     or [] if no new variables were added to the workspace.
 * @package
 */
Blockly.Variables.getAddedVariables = function(workspace, originalVariables) {
  var allCurrentVariables = workspace.getAllVariables();
  var addedVariables = [];
  if (originalVariables.length != allCurrentVariables.length) {
    for (var i = 0; i < allCurrentVariables.length; i++) {
      var variable = allCurrentVariables[i];
      // For any variable that is present in allCurrentVariables but not
      // present in originalVariables, add the variable to addedVariables.
      if (originalVariables.indexOf(variable) == -1) {
        addedVariables.push(variable);
      }
    }
  }
  return addedVariables;
};
