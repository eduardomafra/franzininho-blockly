//CONFIGURAÇÕES INICIAIS

var configIni = require('config.ini');
var fs = require('fs');
var DEFAULT_OS = detectOS();
var SKETCH;
var COMPILER;
var DEFAULT_DEVICE;
var workspace1;
const editJsonFile = require("edit-json-file");

function saveConfig(){
    let file = editJsonFile(`./config.json`);
    var compiler_path = document.getElementById('compiler_path');
    var sketch_path = document.getElementById('sketches_path');

    file.set("path.arduino", compiler_path.value);
    file.set("path.sketch", sketch_path.value);
    file.save();

    SKETCH = sketch_path.value;
    COMPILER = compiler_path.value;
}

function updateConfig(){
    let file = editJsonFile(`./config.json`);
    var compiler_path = document.getElementById('compiler_path');
    var sketch_path = document.getElementById('sketches_path');

    compiler_path.value = file.get("path.arduino");
    sketch_path.value = file.get("path.sketch");

}

function attCfg(){ //GAMBIARRA PARA CONSERTAR O BUG DO TITULO JUNTO COM TEXTO
    var compiler_path = document.getElementById('compiler_path');
    var sketch_path = document.getElementById('sketches_path');

    compiler_path.value = "."
    sketch_path.value = "."
}

function start(){
    attCfg();

    //JQUERY

    $('.dropdown-trigger').dropdown();
    $(document).ready(function() {
        $('.sidenav').sidenav();
    });

    $(document).ready(function() {
        $('.modal').modal();
    });

    $(document).ready(function() {
        $('select').formSelect();
    });

    $(document).ready(function() {
        $('.collapsible').collapsible();
    });

    $(document).ready(function(){
        $('.fixed-action-btn').floatingActionButton();
    });

    $(document).ready(function(){
        $('.tooltipped').tooltip();
    });

    $(document).ready(function(){
        $('.tabs').tabs();
      });
    //BLOCKLY CONFIGS

    var workspace = Blockly.inject('blocklyDiv',
    {toolbox: document.getElementById('toolbox'),
     zoom:
         {controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2},
    move:{
        scrollbars: true,
        drag: true,
        wheel: false},
    
     trashcan: true});


    function myUpdateFunction(event) {
        var code = Blockly.Franzininho.workspaceToCode(workspace);
        document.getElementById('textarea').value = code;
    }

    workspace.addChangeListener(myUpdateFunction);
    workspace1 = workspace;

    //CONFIGURAÇÕES

    $("#img_circuit").hide();

    let file = editJsonFile(`./config.json`);

    if (file.get("path.arduino") == "" || file.get("path.sketch") == ""){

        if (DEFAULT_OS == 'Mac OS X'){
            var default_path = '/Applications/Arduino.app/Contents/MacOS/Arduino';

            file.set("path.arduino", default_path);
            file.set("path.sketch", (__dirname) + '/FranzininhoSketches/');
            file.save();

        } else if (DEFAULT_OS == 'Windows'){
        
            var default_path = 'C:\\Program Files (x86)\\Arduino\\arduino_debug.exe';

            file.set("path.arduino", default_path);
            file.set("path.sketch", (__dirname) + '\\FranzininhoSketches\\');
            file.save();

        }
        SKETCH = file.get("path.sketch");
        COMPILER = file.get("path.arduino");

    }
}
//FUNÇÕES

 function detectOS(){
(function (window) {
    {
        var unknown = '-';

        // browser
        var nAgt = navigator.userAgent;

        // system
        var os = unknown;
        var clientStrings = [
            {s:'Windows 10', r:/(Windows 10.0|Windows NT 10.0)/},
            {s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
            {s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
            {s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
            {s:'Windows Vista', r:/Windows NT 6.0/},
            {s:'Windows Server 2003', r:/Windows NT 5.2/},
            {s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/},
            {s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/},
            {s:'Windows ME', r:/(Win 9x 4.90|Windows ME)/},
            {s:'Windows 98', r:/(Windows 98|Win98)/},
            {s:'Windows 95', r:/(Windows 95|Win95|Windows_95)/},
            {s:'Windows NT 4.0', r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
            {s:'Windows CE', r:/Windows CE/},
            {s:'Windows 3.11', r:/Win16/},
            {s:'Android', r:/Android/},
            {s:'Open BSD', r:/OpenBSD/},
            {s:'Sun OS', r:/SunOS/},
            {s:'Linux', r:/(Linux|X11)/},
            {s:'iOS', r:/(iPhone|iPad|iPod)/},
            {s:'Mac OS X', r:/Mac OS X/},
            {s:'Mac OS', r:/(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
            {s:'QNX', r:/QNX/},
            {s:'UNIX', r:/UNIX/},
            {s:'BeOS', r:/BeOS/},
            {s:'OS/2', r:/OS\/2/},
            {s:'Search Bot', r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
        ];
        for (var id in clientStrings) {
            var cs = clientStrings[id];
            if (cs.r.test(nAgt)) {
                os = cs.s;
                break;
            }
        }

        var osVersion = unknown;

        if (/Windows/.test(os)) {
            osVersion = /Windows (.*)/.exec(os)[1];
            os = 'Windows';
        }

        switch (os) {
            case 'Mac OS X':
                osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
                break;

            case 'Android':
                osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
                break;

            case 'iOS':
                osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
                osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
                break;
        }

    }

    window.jscd = {
        os: os,
        osVersion: osVersion
    };
}(this));

    return String(jscd.os) 

 }

function oi(){
    var variaveis = workspace1.getAllVariables();
    for(let i in variaveis){
        if(variaveis[i].name == 'estadoAtualBT'){
            workspace1.deleteVariableById(variaveis[i].id_);
        }
        
    }
}

function sendSketch(){

    if (DEFAULT_DEVICE != undefined){
        saveSketch();

        var usbDetect = require('usb-detection');

        var t1 = document.getElementById('t1')
        var t2 = document.getElementById('t2')
        // console.log(t1)
        t1.innerHTML = "Detectando a placa franzininho."; 
        var counter = 0;
        usbDetect.startMonitoring();
        var timer = setInterval(function() {
        t1.innerHTML = t1.innerHTML + '.';

        usbDetect.on('add', function(device) {
            console.log('add', device); 
            if(device.deviceName == DEFAULT_DEVICE){
                counter = 7;
            }
        });
        

        if( counter == 7 ) {
            usbDetect.stopMonitoring();
            t1.innerHTML = t1.innerHTML + " <font color='green'> Ok </font> " 
            Compile();
            clearInterval( timer );
        } else if ( counter == 6 ){
            t1.innerHTML = t1.innerHTML + " <font color='red'>Placa não detectada</font> <br> Certifique-se de que o botão RESET da placa foi pressionado durante a detecção " 
            usbDetect.stopMonitoring();
            clearInterval( timer );
        }
        
        console.log( counter++ );
        }, 1000);
        
    } else {
        var t1 = document.getElementById('t1')
        t1.innerHTML = " <font color='red'>Atenção, placa não configurada!</font> <br> Configure em Menu -> Detectar Franzininho " 
    }

}

function Compile() {
    "use strict;"
    expandTerminal();
    var exec = require('child_process').exec;
    
    if (DEFAULT_OS == 'Mac OS X'){
        var cmd = COMPILER + ' --upload ' + SKETCH + 'FranzininhoSketches.ino';
    } else if(DEFAULT_OS == 'Windows'){
        var cmd = "\"" + COMPILER + "\"" + ' --upload ' + SKETCH + 'FranzininhoSketches.ino';
    }

    exec(cmd, {
        cwd: __dirname
    }, (err, stdout, stderr) => {
        console.log(stdout);
        var t2 = document.getElementById('t2');
        t2.innerHTML = stdout;
        if (err) {
            console.log(err);
            // if (String(err).indexOf("\n") > 0){
            //     var i = String(err).indexOf("\n");
            //     console.log(i);
            // }
            var t2 = document.getElementById('t2');
            var porra = String(err).replace("\n", "<br />");
            if (porra.indexOf("<br />") > 0){
                var i = porra.indexOf("<br />");
                console.log(i);
            }
            t2.innerHTML = porra;
        }
            // else runCommand(cmds, cb);
    });
}

function expandTerminal(){
    var terminalHeader = document.getElementById('ide_output_collapsible_header');
    terminalHeader.click();

}

function Verify() {
    "use strict;"
    saveSketch();
    expandTerminal();
    var exec = require('child_process').exec;
    
    if (DEFAULT_OS == 'Mac OS X'){
        var cmd = COMPILER + ' --verify ' + SKETCH + 'FranzininhoSketches.ino';
    } else if(DEFAULT_OS == 'Windows'){
        var cmd = "\"" + COMPILER + "\"" + ' --verify ' + SKETCH + 'FranzininhoSketches.ino';
    }

    exec(cmd, {
        cwd: __dirname
    }, (err, stdout, stderr) => {
        console.log(stdout);
        var t2 = document.getElementById('t2');
        t2.innerHTML = stdout;
        if (err) {
            console.log(err);
            // if (String(err).indexOf("\n") > 0){
            //     var i = String(err).indexOf("\n");
            //     console.log(i);
            // }
            var t2 = document.getElementById('t2');
            var porra = String(err).replace("\n", "<br />");
            if (porra.indexOf("<br />") > 0){
                var i = porra.indexOf("<br />");
                console.log(i);
            }
            t2.innerHTML = porra;
        }
            // else runCommand(cmds, cb);
    });
}

function saveSketch() {

    const fs = require("fs");
    const {
        dialog
    } = require("electron").remote;

    var cod = document.getElementById('textarea').value;
    fs.writeFile('FranzininhoSketches/FranzininhoSketches.ino', cod, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });

    // const {
    //     exec
    // } = require("child_process")
    // exec('Arduino FranzininhoSketches/FranzininhoSketches.ino').unref()

}

function setBoard(){

    var select = document.getElementById("sel_board");
    DEFAULT_DEVICE = select.options[select.selectedIndex].text;

// Detect add/insert
// usbDetect.on('add', function(device) { console.log('add', device); });
// usbDetect.on('add:vid', function(device) { console.log('add', device); });
// usbDetect.on('add:vid:pid', function(device) { console.log('add', device); });

// // Detect remove
// usbDetect.on('remove', function(device) { console.log('remove', device); });
// usbDetect.on('remove:vid', function(device) { console.log('remove', device); });
// usbDetect.on('remove:vid:pid', function(device) { console.log('remove', device); });

// // Detect add or remove (change)
// usbDetect.on('change', function(device) { console.log('change', device); });
// usbDetect.on('change:vid', function(device) { console.log('change', device); });
// usbDetect.on('change:vid:pid', function(device) { console.log('change', device); });

// // Get a list of USB devices on your system, optionally filtered by `vid` or `pid`
// usbDetect.find(function(err, devices) { console.log('find', devices, err); });
// usbDetect.find(vid, function(err, devices) { console.log('find', devices, err); });
// usbDetect.find(vid, pid, function(err, devices) { console.log('find', devices, err); });
// // Promise version of `find`:
// usbDetect.find().then(function(devices) { console.log(devices); }).catch(function(err) { console.log(err); });

// Allow the process to exit
// usbDetect.stopMonitoring()

}

function detectBoard(){
    var usbDetect = require('usb-detection');
    var placa;
    // console.log(t1)
    var counter = 0;
    usbDetect.startMonitoring();
    $("#progresso").append('<div class="progress"><div class="indeterminate"></div></div>');
    $("#detecting").html("Detectando.");
    var timer = setInterval(function() {
    $("#detecting").html($("#detecting").html() + '.');
    usbDetect.on('add', function(device) { 
        console.log('add', device); 
        placa = device.deviceName;
        counter = 8;
    });

    if( counter == 8 ) {
        
        if (placa != undefined){
            $('#sel_board').append('<option value="franzininho" >'+ placa +'</option>');
        }
        $("#detecting").html('<font color="green"> Detectado </font> <i class="small material-icons">check</i>');
        usbDetect.stopMonitoring();
        // $("#progresso").remove(".progress, .indeterminate");
        $(".progress").remove();
        $(".indeterminate").remove();
        clearInterval( timer );
    } else if( counter == 7 ){
        $("#detecting").html('<font color="red"> Placa não detectada </font> <i class="small material-icons">error</i>');
        usbDetect.stopMonitoring();
        // $("#progresso").remove(".progress, .indeterminate");
        $(".progress").remove();
        $(".indeterminate").remove();
        clearInterval( timer );
    }
    
    console.log( counter++ );
    }, 1000);


}

function tst1(){
    console.log(DEFAULT_DEVICE)
}

function openIde(){

    saveSketch();

    const {
        exec
    } = require("child_process")
    exec('Arduino FranzininhoSketches/FranzininhoSketches.ino').unref()
}

//FUNÇÕES PARA IMPLEMENTAR EXEMPLOS
function limpar(){
    // $("#img_circuit").attr("src","");
    // $("#img_circuit").attr("alt","");
    $("#img_circuit").hide();

    workspace1.clear();

}
function save() {
    var xml = Blockly.Xml.workspaceToDom(workspace1);
    var data = Blockly.Xml.domToText(xml);
  
    // Store data in blob.
    // var builder = new BlobBuilder();
    // builder.append(data);
    // saveAs(builder.getBlob('text/plain;charset=utf-8'), 'blockduino.xml');
    console.log("saving blob");
    var blob = new Blob([data], {type: 'text/xml'});
    saveAs(blob, 'blockduino.xml');
  }

function loadExample(example, img){

    $("#img_circuit").show();
    $("#img_circuit").attr("src","./circuits/"+img+".png");
    $("#img_circuit").attr("alt",img);

    var xml = xmlToString(example);
    var xmlDoc = Blockly.Xml.textToDom(xml);
  // Blockly.mainWorkspace.clear();
    workspace1.clear();
    Blockly.Xml.domToWorkspace(workspace1, xmlDoc);
    // $('#porra').off("click");
} 

function xmlToString(xml){
    const xml2js = require('xml2js');
    const fs = require('fs');
    const parser = new xml2js.Parser({ attrkey: "ATTR" });
    
    // this example reads the file synchronously
    // you can read it asynchronously also
    let xml_string = fs.readFileSync(xml, "utf8");
    
    parser.parseString(xml_string, function(error, result) {
        if(error === null) {
            console.log(result);
        }
        else {
            console.log(error);
        }
    });
    return xml_string;
}