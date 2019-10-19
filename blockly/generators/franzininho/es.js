'use strict';

goog.provide('Blockly.Franzininho.ES');

goog.require('Blockly.Franzininho');

Blockly.Franzininho['es_highlow'] = function(block) {
    // Boolean values true and false.
    var code = (this.getFieldValue('BOOL') == 'HIGH') ? 'HIGH' : 'LOW';
  return [code, Blockly.Franzininho.ORDER_ATOMIC];
  };

Blockly.Franzininho['es_digitalwrite'] = function(block) {
    var pin = block.getFieldValue('PIN');
    var stateOutput = Blockly.Franzininho.valueToCode(
        block, 'STATE', Blockly.Franzininho.ORDER_ATOMIC) || 'LOW';
  
    var pinSetupCode = 'pinMode(' + pin + ', OUTPUT);';
    Blockly.Franzininho.addSetup('io_' + pin, pinSetupCode, false);
  
    var code = 'digitalWrite(' + pin + ', ' + stateOutput + ');\n';
    return code;
  };


/**
 * Function for reading a digital pin (X).
 * Arduino code: setup { pinMode(X, INPUT); }
 *               loop  { digitalRead(X)     }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Franzininho['es_digitalread'] = function(block) {
  
  var pin = block.getFieldValue('PIN');

  var pinSetupCode = 'pinMode(' + pin + ', INPUT);';
  Blockly.Franzininho.addSetup('io_' + pin, pinSetupCode, false);

  var code = 'digitalRead(' + pin + ')';
  return [code, Blockly.Franzininho.ORDER_ATOMIC];
};

/**
 * Function for setting the state (Y) of a built-in LED (X).
 * Arduino code: setup { pinMode(X, OUTPUT); }
 *               loop  { digitalWrite(X, Y); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Franzininho['es_led_embutido'] = function(block) {
  var pin = block.getFieldValue('BUILT_IN_LED');
  var stateOutput = Blockly.Franzininho.valueToCode(
      block, 'STATE', Blockly.Franzininho.ORDER_ATOMIC) || 'LOW';

  // Blockly.Franzininho.reservePin(
  //     block, pin, Blockly.Franzininho.PinTypes.OUTPUT, 'Set LED');

  var pinSetupCode = 'pinMode(' + pin + ', OUTPUT);';
  Blockly.Franzininho.addSetup('io_' + pin, pinSetupCode, false);

  var code = 'digitalWrite(' + pin + ', ' + stateOutput + ');\n';
  return code;
};

/**
 * Function for setting the state (Y) of an analogue output (X).
 * Arduino code: setup { pinMode(X, OUTPUT); }
 *               loop  { analogWrite(X, Y);  }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Franzininho['es_analogwrite'] = function(block) {
  var pin = block.getFieldValue('PIN');
  var stateOutput = Blockly.Franzininho.valueToCode(
      block, 'NUM', Blockly.Franzininho.ORDER_ATOMIC) || '0';

  // Blockly.Franzininho.reservePin(
  //     block, pin, Blockly.Franzininho.PinTypes.OUTPUT, 'Analogue Write');

  var pinSetupCode = 'pinMode(' + pin + ', OUTPUT);';
  Blockly.Franzininho.addSetup('io_' + pin, pinSetupCode, false);

  // Warn if the input value is out of range
  if ((stateOutput < 0) || (stateOutput > 255)) {
    block.setWarningText('The analogue value set must be between 0 and 255',
                         'pwm_value');
  } else {
    block.setWarningText(null, 'pwm_value');
  }

  var code = 'analogWrite(' + pin + ', ' + stateOutput + ');\n';
  return code;
};

/**
 * Function for reading an analogue pin value (X).
 * Arduino code: setup { pinMode(X, INPUT); }
 *               loop  { analogRead(X)      }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Franzininho['es_analogread'] = function(block) {
  var pin = block.getFieldValue('PIN');
  // Blockly.Franzininho.reservePin(
  //     block, pin, Blockly.Franzininho.PinTypes.INPUT, 'Analogue Read');

  var pinSetupCode = 'pinMode(' + pin + ', INPUT);';
  Blockly.Franzininho.addSetup('io_' + pin, pinSetupCode, false);

  var code = 'analogRead(' + pin + ')';
  return [code, Blockly.Franzininho.ORDER_ATOMIC];
};

Blockly.Franzininho['inout_custom_digital_write'] = function() {
  var pin = Blockly.Franzininho.valueToCode(this, 'PIN', Blockly.Franzininho.ORDER_ATOMIC) || '13'
  var stat = Blockly.Franzininho.valueToCode(this, 'STAT', Blockly.Franzininho.ORDER_ATOMIC) || 'HIGH'
  Blockly.Franzininho.setups_['setup_output_' + pin] = 'pinMode(' + pin + ', OUTPUT);';
  var code = 'digitalWrite(' + pin + ', ' + stat + ');\n'
  return code;
};

Blockly.Franzininho['inout_custom_digital_read'] = function() {
  var pin_read = Blockly.Franzininho.valueToCode(this, 'PIN_READ', Blockly.Franzininho.ORDER_ATOMIC);
  Blockly.Franzininho.setups_['setup_output_' + pin_read] = 'pinMode(' + pin_read + ', INPUT);';

  var code = 'digitalRead(' + pin_read + ')';
  return [code, Blockly.Franzininho.ORDER_ATOMIC];
};

Blockly.Franzininho['inout_custom_analog_write'] = function() {
  var pin = Blockly.Franzininho.valueToCode(this, 'PIN_ANALOGWRITE', Blockly.Franzininho.ORDER_ATOMIC)
  var value_num = Blockly.Franzininho.valueToCode(this, 'NUM', Blockly.Franzininho.ORDER_ATOMIC) || '255'
  Blockly.Franzininho.setups_['setup_output_' + pin] = 'pinMode(' + pin + ', OUTPUT);';

  var code = 'analogWrite(' + pin + ', ' + value_num + ');\n';
  return code;
};

Blockly.Franzininho['inout_custom_analog_read'] = function() {
  var pin = Blockly.Franzininho.valueToCode(this, 'PIN_ANALOGREAD', Blockly.Franzininho.ORDER_ATOMIC)
  //Blockly.Franzininho.setups_['setup_input_'+dropdown_pin] = 'pinMode('+dropdown_pin+', INPUT);';
  var code = 'analogRead(' + pin + ')';
  return [code, Blockly.Franzininho.ORDER_ATOMIC];
};
