'use strict';

goog.provide('Blockly.Franzininho.Placas');

goog.require('Blockly.Franzininho');

Blockly.Franzininho.Placas.versoes = new Object();
Blockly.Franzininho.Placas.selecionada = Blockly.Franzininho.Placas.versoes.rv1;
Blockly.Franzininho.Placas.a = 'a';

Blockly.Franzininho.Placas.versoes.rv1 = {

    pinosDigitais: [['1', '1'], ['2', '2']],
    ledEmbutido: [['BUILTIN_1', '1']],
    pinosPwm: [['0', '0'], ['1', '1'], ['4', '4']],
    pinosAnalogicos: [ ['A0', '5'], ['A1', '2'], ['A2', '4'], ['A3', '3'] ]

};