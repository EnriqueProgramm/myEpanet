const {Project, Workspace} = require('epanet-js')
var fs = require('fs');
const { get } = require('http');
const { table } = require('console');

window.onload = function () {

document.getElementById('simulation').onclick = function (){
  const data = runSimulation();
  const tableValues = data.myArrayValues;
  const tableTimes = data.myArrayTimes;
  const nodeId = data.nodeName;
  const xValues = [];
  const yValues = [];
  tableValues.forEach(element => {
    xValues.push((element).toFixed(2));
    console.log(element);
  });
  tableTimes.forEach(element => {
    yValues.push((element));
    console.log(element);
  });  
  
  var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'line',    
    data: {
        labels: yValues,        
        datasets: [{
            label: `Pressure (m) at node ${nodeId}`,
            borderWidth: 1,
            pointRadius: 1,
            borderColor: "blue",
            data: xValues, 
            fill: false      
        }]
    },
    options: {
      scales: {
        xAxes: [{
            gridLines: {
                color: "rgba(0, 0, 0, 0)",
            }
        }],
        yAxes: [{
            gridLines: {
                color: "rgba(0, 0, 0, 0)",
            }   
        }]
    }
  }
  });

}

//runSimulation();
function runSimulation() {


const net1 = fs.readFileSync('net1.inp')

const ws = new Workspace();
const model = new Project(ws);

ws.writeFile('net1.inp', net1);
model.open('net1.inp', 'report.rpt', 'out.bin');
const nodeName = '11'
const n11Index = model.getNodeIndex(nodeName);
model.openH();
model.initH(11);
const myArrayValues = [];
const myArrayTimes = [];
let tStep = Infinity;
do {
  const cTime = model.runH();
  const pressure = model.getNodeValue(n11Index, 11)    
  myArrayTimes.push((cTime/3600).toFixed(0));
  myArrayValues.push(pressure);                          
  tStep = model.nextH();
} while (tStep > 0);
model.saveH();
model.closeH();
return {myArrayValues, myArrayTimes, nodeName};
}
}