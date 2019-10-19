'use strict';

goog.provide('Blockly.Blocks.tempo');

goog.require('Blockly.Blocks');
goog.require('Blockly.Types');


/** Common HSV hue for all blocks in this category. */
Blockly.Blocks.tempo.HUE = 140;

Blockly.Blocks['tempo_delay'] = {
  /**
   * Delay block definition
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl('http://arduino.cc/en/Reference/Delay');
    this.setColour(Blockly.Blocks.tempo.HUE);
    this.appendValueInput('DELAY_TIME_MILI')
        .setCheck("Number")
        .appendField("espere");
    this.appendDummyInput()
        .appendField("milissegundos");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("");
  }
};

Blockly.Blocks['tempo_delay_micro'] = {
  /**
   * delayMicroseconds block definition
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl('http://arduino.cc/en/Reference/DelayMicroseconds');
    this.setColour(Blockly.Blocks.tempo.HUE);
    this.appendValueInput('DELAY_TIME_MICRO')
        .setCheck("Number")
        .appendField("espere");
    this.appendDummyInput()
        .appendField("microssegundos");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("");
  }
};

Blockly.Blocks['tempo_mili'] = {
  /**
   * Elapsed time in milliseconds block definition
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl('http://arduino.cc/en/Reference/Millis');
    this.setColour(Blockly.Blocks.tempo.HUE);
    this.appendDummyInput()
        .appendField("tempo decorrido (milissegundos)");
    this.setOutput(true, "Number");
    this.setTooltip("");
  },
  /** @return {string} The type of return value for the block, an integer. */
  getBlockType: function() {
    return Blockly.Types.LARGE_NUMBER;
  }
};

Blockly.Blocks['tempo_micro'] = {
  /**
   * Elapsed time in microseconds block definition
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl('http://arduino.cc/en/Reference/Micros');
    this.setColour(Blockly.Blocks.tempo.HUE);
    this.appendDummyInput()
        .appendField("tempo decorrido (microssegundos)");
    this.setOutput(true, "Number");
    this.setTooltip("");
  },
  /**
   * Should be a long (32bit), but  for for now an int.
   * @return {string} The type of return value for the block, an integer.
   */
  getBlockType: function() {
    return Blockly.Types.LARGE_NUMBER;
  }
};

Blockly.Blocks['tempo_loop_infinito'] = {
  /**
   * Waits forever, end of program.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl('');
    this.setColour(Blockly.Blocks.tempo.HUE);
    this.appendDummyInput()
        .appendField("aguarde para sempre (fim do programa)");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setTooltip("");
  }
};
