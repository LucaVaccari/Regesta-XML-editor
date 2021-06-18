// Global variables
let model = {}; // the mvc model
let lastId = 0; // id used to generate ids
let dataQueue = []; // used to store model.data changes
let dataQueueIndex = 0; //used in undo / redo
var formatter = XMLFormatter;

model.preview =
  '<Configuration xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns=""><AccessPoint/><ReconnectTimeOut>0</ReconnectTimeOut><DefaultFormID>-2147483648</DefaultFormID><BarcodePluginAssembly/><BarcodePluginClassname/><CameraPluginAssembly/><CameraPluginClassname/><SapLogicalSystem/><SapLogicalPort/><Client/><BasicType/><MessageType/><PartnerNumber/><PartnerType/><Port>MESUS20</Port><LogicalSystem>MESUS20</LogicalSystem><Function/><WarehouseNumber>U02</WarehouseNumber><Plant>US20</Plant><AllowedWarehouse><string>0500</string><string>0200</string><string>0400</string><string>0110</string></AllowedWarehouse><StockTakeHUKey>h4ndl1n6</StockTakeHUKey><StockTakeMMKey>m473r141</StockTakeMMKey><StockTakeCCKey>c0c3n73r</StockTakeCCKey></Configuration>';

let json = XMLtoJSON(model.preview);
model.data = JSONtoCustomJSON(json);


json = customJSONtoJSON(model);
dataQueue[0] = JSON.parse(JSON.stringify(model.data));
dataQueueIndex = 0;
