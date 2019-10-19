'use strict';

goog.provide('Blockly.Franzininho.arduino_start');

goog.require('Blockly.Franzininho');


Blockly.Franzininho['arduino_start'] = function(block) {
    var statementsSetup = Blockly.Franzininho.statementToCode(block, 'setup');
    var statementsLoop = Blockly.Franzininho.statementToCode(block, 'loop');

    var preSetupCode = '';

    for (var key in Blockly.Franzininho.setupCode_) {
        preSetupCode += Blockly.Franzininho.setupCode_[key] || '';
    }

    return '\n\n\nvoid setup() { \n' +
            preSetupCode +
            statementsSetup + '\n' +
        '}\n\n\nvoid loop() { \n' +
        statementsLoop + '\n' + 
        '}';
    
};