// Global variables
let model = {}; // the mvc model
let lastElementId = 0; // id used to generate ids
let dataQueue = []; // used to store model.data changes
let dataQueueIndex = 0; //used in undo / redo

let test = `<grid tablename="tblRisorse" keyfieldname="IDRisorsa" caption="RISORSA" pagesize="20" where="Attivi|Attivo=1;Sospesi|Attivo=0 and (iif('$$isAdmin'='True','1','0')=1 or iif('$$isSys'='True','1','0')=1)" orderby="Risorsa" enabledeleting="$$isAdmin" showfilterrowmenu="true" showcustomizationwindow="true" variantcontroller="/Variant"> <field name="IDSocieta" caption="Società" type="ComboBoxSearch" widthedit="250" width="80"> <propertiescombobox datasource="tblSocieta" valuefield="IDSocieta" defaultvalue="1" textfield="Societa" orderby="Societa"/></field> <field name="Risorsa" isrequiredmessage="Obbligatorio" width="200" widthedit="150" autofiltercondition="Contains"/> <field name="RisorsaOrdinamento" caption="Cognome Nome" visible="false" isrequiredmessage="Obbligatorio" width="200" widthedit="150" autofiltercondition="Contains"/> <field name="Login" widthedit="150" autofiltercondition="Contains">SAS</field> <field name="Email" widthedit="200" autofiltercondition="Contains"/> <field name="Tel1" caption="Cell.aziend." widthedit="100"/> <field name="Tel2" caption="Cell.pers." widthedit="100"/> <field name="Efficienza" caption="% EFF" visible="$$isAdmin" type="SpinEdit" numbertype="Float" numberformat="Number" minvalue="0" maxvalue="1" dbtype="decimal" width="100" widthedit="100" totalsummary="Sum" visibleexport="false"/> <field name="Tempo" caption="% DEV" visible="$$isAdmin" type="SpinEdit" numbertype="Float" numberformat="Number" minvalue="0" maxvalue="1" dbtype="decimal" width="100" widthedit="100" totalsummary="Sum" visibleexport="false"/> <field name="Team" type="ComboBoxSearch" widthedit="200"> <propertiescombobox datasource="tblTeam" valuefield="Descrizione" textfield="Descrizione"/> </field> <field name="Ruolo" type="ComboBoxSearch" visible="$$isAdmin" widthedit="200"> <propertiescombobox> <item text="Junior Consultant"/> <item text="Consultant"/> <item text="Senior Consultant"/> </propertiescombobox> </field> <field name="GiorniForfait" widthedit="200" visible="$$isAdmin or $$isHr" visibleedit="$$isAdmin or $$isHr" visibleexport="false"/> <field name="TipoAuto" visible="$$isAdmin" widthedit="200" width="200"/> <field name="LoginICMS" visible="$$isAdmin or $$isHr" visibleedit="$$isAdmin or $$isHr" visibleexport="false"/> <field name="Supervisore" visible="$$isAdmin or $$isHr" visibleedit="$$isAdmin or $$isHr"/> <field name="Permessi" type="TokenBox" visible="$$isAdmin or $$isSys" visibleedit="$$isAdmin or $$isSys" visibleexport="false"> <propertiescombobox> <item text="USER"/> <item text="TEAML"/> <item text="MANAGER"/> <item text="PM"/> <item text="CEO"/> <item text="SYS"/> <item text="HR"/> <item text="ADMIN"/> </propertiescombobox> </field> <field name="AreeFunzionali" type="TokenBox" visible="$$isAdmin"> <propertiescombobox datasource="tblAreeFunzionali" valuefield="AreaFunzionale" textfield="AreaFunzionale" orderby="AreaFunzionale"/> </field> <field name="Alert" type="Checkbox" visible="$$isAdmin" defaultvalue="false" width="10" widthedit="10" visibleexport="false"/> <field name="NotaSpese" caption="Export nota spese" type="Checkbox" defaultvalue="false" width="10" widthedit="10" visible="false" visibleedit="$$isAdmin or $$isHr" visibleexport="false"/> <field name="ElaborazionePaga" caption="Elaborazione busta paga" type="Checkbox" defaultvalue="true" width="10" widthedit="10" visible="false" visibleedit="$$isAdmin or $$isHr" visibleexport="false"/> <field name="SapCodice" caption="Codice SAP" widthedit="200" width="200" visible="false" visibleedit="$$isAdmin or $$isHr" visibleexport="false"/> <field name="MatricolaCedolino" caption="Mat.Cedolino" widthedit="200" width="200" visible="false" visibleedit="$$isAdmin or $$isHr" visibleexport="false"/> <field name="Costo" type="SpinEdit" visible="false" visibleedit="$$isAdmin or $$isHr" width="40" widthedit="100" dbtype="int" visibleexport="false"/> <field name="Foto" caption="Foto" type="file" height="80" zoomable="true" resize="400" rename="true" allowedfileextensions=".jpg,.png" visibleexport="false"/> <field name="Attivo" type="Checkbox" visible="$$isAdmin" defaultvalue="true" width="10" widthedit="10"/> <field name="DataFineRapporto" caption="Data fine rapporto" type="DateTime" dbtype="datetime" width="100" widthedit="100" visibile="false" visibleedit="$$isAdmin or $$isHr" visibleexport="false"/> <detail name="tblRisorsaSkills" caption="Skills" visible="$$isAdmin"/> </grid>`;
let test1 = `<Config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"> <environment>test</environment> <dbConn>Data Source=GNUTTIKST02\REGORC;Initial Catalog=NETORC_TGN;Persist Security Info=True;User ID=netorc;Password=regesta08</dbConn> <sapRfcConnection>ASHOST=161.27.223.173 SYSNR=00 CLIENT=100 USER=regorc PASSWD=regesta08</sapRfcConnection> <sapMandante>100</sapMandante> <sapServer>161.27.223.173</sapServer> <sapServerPort>50000</sapServerPort> <sapWSUsr>regorc</sapWSUsr> <sapWSPwd>regesta08</sapWSPwd> <sapLSPartner>TGNCLNT100</sapLSPartner> <sapLSPort>SAPTGN</sapLSPort> <regWSMiddleware>http://161.27.223.177:84</regWSMiddleware> </Config>`;
let test2 = `<ConfigAdvanced xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><NoPrintLabelPlants><string>IN10</string><string>SE10</string><string>SE50</string><string>SE20</string><string>IT14</string><string>CZ10</string><string>CA20</string></NoPrintLabelPlants><NoPrintLabelControlKeys><string>PP06</string><string>ZP06</string></NoPrintLabelControlKeys><NoTimeTicketControlKeys><string>ZP06</string></NoTimeTicketControlKeys><TaktControlKeys><string>ZP04</string><string>ZP05</string><string>ZP15</string></TaktControlKeys><NoConfirmationControlKeys><string>PP07</string></NoConfirmationControlKeys><NoScrapControlKeys><string>ZP06</string></NoScrapControlKeys><TecoPlants><string>IT10</string><string>SE10</string><string>SE20</string><string>IT14</string><string>SE50</string><string>CZ10</string><string>CA20</string></TecoPlants><RinvPlants><string>IT10:RINV</string></RinvPlants><RequiredRILPlants><string>SE50</string><string>CZ10</string><string>CA20</string></RequiredRILPlants><NeedTimeTicketPlants><string>SE10</string></NeedTimeTicketPlants><ShiftControlPlants><string>IT10</string><string>SE50</string></ShiftControlPlants><ShiftTolerance> 15 </ShiftTolerance><ComponentsPlants><string>SE50</string><string>CA20</string></ComponentsPlants><CustomDevReason><string>SE50</string><string>CZ10</string></CustomDevReason><OrderTypeForPlletTraciability><string>ZP07</string><string>ZP11</string><string>ZP13</string><string>ZP14</string><string>ZP15</string><string>ZP16</string></OrderTypeForPlletTraciability><DefaultListenerForLocalPrint>http://10.1.10.4:82/default.aspx</DefaultListenerForLocalPrint><OperationControlKeyForHuManagement><string>ZP01</string><string>ZP04</string></OperationControlKeyForHuManagement><PlantListThatNotAllowIntermecPrintingForHU><string>CZ10</string><string>SE50</string><string>CN10</string><string>CN20</string><string>CA20</string><string>IT10</string></PlantListThatNotAllowIntermecPrintingForHU><QuiescencePeriodInMinutes>5</QuiescencePeriodInMinutes><PlantListWhichRequireSummaryPopup><string>SE50</string><string>CZ10</string></PlantListWhichRequireSummaryPopup><PlantListWitchRequireHUChoice><string>CZ10</string></PlantListWitchRequireHUChoice><PlantListWitchRequireHUChoiceTest><string>CZ10</string></PlantListWitchRequireHUChoiceTest><NoSerialCheckOrderTypes><string>ZP13</string></NoSerialCheckOrderTypes></ConfigAdvanced>`;

model.allAttributes = [];
model.selectedAttributes = [];
dataQueueIndex = 0;
let jsonModel, selectedItem, popoverView, view, originalTree;

model.preview = {};

// buttons active
model.somethingChanged = false;
model.somethingUndone = false;
model.fileChanged = false;
model.somethingSelected = false;
model.isRootSelected = false;
model.preview.fontSize = 20;
model.preview.mimeType = "text/xml";
model.preview.showAttributes = true;
model.editingTitle = false;

const XMLformatter = new HTMLFormatter(
  "purple",
  "#346187",
  "#FF6600",
  "red",
  "#73C2E1",
  false
);
const compactXMLformatter = new HTMLFormatter(
  "purple",
  "#346187",
  "#FF6600",
  "red",
  "#73C2E1",
  true
);
const JSONformatter = new JSONHTMLFormatter(
  "purple",
  "#346187",
  "#FF6600",
  "red",
  "#73C2E1",
  false
);
const cleanFormatter = new Formatter("");

const XMLPreviewFormatter = new Formatter("    ", false);
const compactXMLPreviewFormatter = new Formatter("    ", true);
const JSONPreviewFormatter = new JSONFormatter();

let formatter = XMLformatter;
let previewFormatter = XMLPreviewFormatter;
