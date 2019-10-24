'use strict';

goog.provide('Blockly.Blocks.ES');

goog.require('Blockly.Blocks');

Blockly.Blocks.ES.HUE = 230;

Blockly.Blocks['es_digitalwrite'] = {
  /**
   * Block for creating a 'set pin' to a state.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl('http://arduino.cc/en/Reference/DigitalWrite');
    this.setColour(Blockly.Blocks.ES.HUE);
    this.appendValueInput('STATE')
        .appendField("coloque o pino digital ")
        .appendField(new Blockly.FieldDropdown(
          Blockly.Franzininho.Placas.versoes.rv1.pinosDigitais), 'PIN')
        .appendField(" em ")
        .setCheck("Boolean");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("");
  }
};

Blockly.Blocks['es_highlow'] = {
    /**
     * Block for creating a pin state.
     * @this Blockly.Block
     */
    init: function() {
      this.setHelpUrl('http://arduino.cc/en/Reference/Constants');
      this.setColour(Blockly.Blocks.ES.HUE);
      this.appendDummyInput()
          .appendField(
              new Blockly.FieldDropdown([['HIGH', 'HIGH'], ['LOW', 'LOW']]),
             'BOOL');
      this.setOutput(true, "Boolean");
      // this.outputConnection.setCheck('Boolean');
      this.setTooltip("");
    }
  };

  Blockly.Blocks['es_analogpins'] = {
    /**
     * Block for creating a pin state.
     * @this Blockly.Block
     */
    init: function() {
      this.setHelpUrl('http://arduino.cc/en/Reference/Constants');
      this.setColour(Blockly.Blocks.ES.HUE);
      this.appendDummyInput()
           .appendField("pino analógico")
          .appendField(
              new Blockly.FieldDropdown(Blockly.Franzininho.Placas.versoes.rv1.pinosAnalogicosDD),
             'PIN');
      this.setOutput(true);

      this.setTooltip("");
    }
  };

  Blockly.Blocks['es_digitalread'] = {
    /**
     * Block for creating a 'read pin'.
     * @this Blockly.Block
     */
    init: function() {
      this.setHelpUrl('http://arduino.cc/en/Reference/DigitalRead');
      this.setColour(Blockly.Blocks.ES.HUE);
      this.appendDummyInput()
          .appendField("ler pino digital")
          .appendField(new Blockly.FieldDropdown(
            Blockly.Franzininho.Placas.versoes.rv1.pinosDigitais), 'PIN');
      this.setOutput(true, "Boolean");
      this.setTooltip("");
    }
  };

  Blockly.Blocks['es_led_embutido'] = {
    /**
     * Block for setting built-in LED to a state.
     * @this Blockly.Block
     */
    init: function() {
      this.setHelpUrl('http://arduino.cc/en/Reference/DigitalWrite');
      this.setColour(Blockly.Blocks.ES.HUE);
      this.appendValueInput('STATE')
          .appendField("coloque o led embutido em")
          .appendField(new Blockly.FieldDropdown(
            Blockly.Franzininho.Placas.versoes.rv1.ledEmbutido), 'BUILT_IN_LED')
          .appendField("em")
          .setCheck("Boolean");
      this.setInputsInline(false);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip("");
    }
  };

  Blockly.Blocks['es_analogwrite'] = {
    /**
     * Block for creating a 'set pin' to an analogue value.
     * @this Blockly.Block
     */
    init: function() {
      this.setHelpUrl('http://arduino.cc/en/Reference/AnalogWrite');
      this.setColour(Blockly.Blocks.ES.HUE);
      this.appendValueInput('NUM')
          .appendField("coloque o pino analógico")
          .appendField(new Blockly.FieldDropdown(
              Blockly.Franzininho.Placas.versoes.rv1.pinosPwm), 'PIN')
          .appendField("em")
          .setCheck('Number');
      this.setInputsInline(false);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip("");
    }
  };

  Blockly.Blocks['es_analogread'] = {
    /**
     * Block for reading an analogue input.
     * @this Blockly.Block
     */
    init: function() {
      this.setHelpUrl('http://arduino.cc/en/Reference/AnalogRead');
      this.setColour(Blockly.Blocks.ES.HUE);
      this.appendDummyInput()
          .appendField("leia o pino analógico")
          .appendField(new Blockly.FieldDropdown(
            Blockly.Franzininho.Placas.versoes.rv1.pinosAnalogicos), 'PIN');
      this.setOutput(true, "Number");
      this.setTooltip("");
    }
  };

  Blockly.Blocks['inout_custom_digital_write'] = {
    init: function() {
      this.setHelpUrl('http://arduino.cc/en/Reference/AnalogRead');
      this.setColour(Blockly.Blocks.ES.HUE);
      this.appendValueInput("PIN")
        .setCheck("Number")
        .appendField("coloque o pino digital");
      this.appendValueInput("STAT")
        .setCheck()
        .appendField("em")
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip("");
    }
  };

  Blockly.Blocks['inout_custom_digital_read'] = {
    init: function() {
      this.setHelpUrl('http://arduino.cc/en/Reference/AnalogRead');
      this.setColour(Blockly.Blocks.ES.HUE);
      this.appendValueInput("PIN_READ")
        .setCheck("Number")
        .appendField('leia o pino digital');
      this.setInputsInline(true);
      this.setOutput(true);
      this.setTooltip('');
    }
  };

  Blockly.Blocks['inout_custom_analog_write'] = {
    init: function() {
      this.setHelpUrl('');
      this.setColour(Blockly.Blocks.ES.HUE);
      this.appendValueInput("PIN_ANALOGWRITE")
        .setCheck("Number")
        .appendField('coloque o pino analógico');
      this.appendValueInput("NUM")
        .setCheck("Number")
        .appendField('em (0-255)');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip('');
    }
  };
  
  Blockly.Blocks['inout_custom_analog_read'] = {
    init: function() {
      this.setHelpUrl('');
      this.setColour(Blockly.Blocks.ES.HUE);
      this.appendValueInput("PIN_ANALOGREAD")
        .setCheck("Number")
        .appendField('leia o pino analógico');
      this.setInputsInline(true);
      this.setOutput(true, 'Number');
      this.setTooltip('');
    }
  };