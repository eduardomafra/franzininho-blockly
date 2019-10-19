'use strict';

goog.provide('Blockly.Blocks.funcoes');
goog.require('Blockly.Blocks');


/** Common HSV hue for all blocks in this category. */
Blockly.Blocks.funcoes.HUE = 290;

Blockly.Blocks['franzininho_funcoes'] = {
  /**
   * Block for defining the Arduino setup() and loop() functions.
   * @this Blockly.Block
   */
  init: function() {
    this.appendDummyInput()
        .appendField("Franzininho execute primeiro:");
    this.appendStatementInput('SETUP_FUNC');
    this.appendDummyInput()
        .appendField("Franzininho loop eterno:");
    this.appendStatementInput('LOOP_FUNC');
    this.setInputsInline(false);
    this.setColour(Blockly.Blocks.funcoes.HUE);
    this.setTooltip("");
    this.setHelpUrl('https://arduino.cc/en/Reference/Loop');
    this.contextMenu = false;
  }
};
