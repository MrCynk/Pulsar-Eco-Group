let devices = [];
function addRow(){
    let table = document.getElementById("equipmentTable");
    let row = table.insertRow();

    row.innerHTML = `
    <td><input type="text" placeholder="Ex: Climatiseur"></td>
    <td><input type="number" placeholder="1200"></td>
    <td><input type="number" placeholder="2"></td>
    <td><input type="number" placeholder="6"></td>
    <td><button onclick="deleteRow(this)">X</button></td>
    `;
}

function deleteRow(btn){
    let row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

function calculer() {
    let table = document.getElementById("equipmentTable");
    let totalEnergy = 0;

    for (let i = 1; i < table.rows.length; i++) {
        let power = table.rows[i].cells[1].children[0].value;
        let qty = table.rows[i].cells[2].children[0].value;
        let hours = table.rows[i].cells[3].children[0].value;

        totalEnergy += power * qty * hours;
    }

    let autonomy = document.getElementById("autonomy").value;
    let hsp = document.getElementById("hsp").value;
    let efficiency = document.getElementById("efficiency").value;

    let pvPower = totalEnergy / (hsp * efficiency);
    let batteryWh = totalEnergy * autonomy;

    let inverterPower = totalEnergy / 5 * 1.25;

    let panelCount = Math.ceil(pvPower / 550);
    let batteryCount = Math.ceil(batteryWh / 2400);

    let estimatedCost = panelCount * 150000 + batteryCount * 400000 + 300000;

    document.getElementById("results").innerHTML = `
        <b></b>Consommation journalière : </b>${totalEnergy.toFixed(0)} Wh<br>
        <b>Puissance panneaux requise : </b>${pvPower.toFixed(0)} W<br>
        <b>Nombre de panneaux 550W : </b>${panelCount}<br>
        <b>Capacité batterie requise : </b>${batteryWh.toFixed(0)} Wh<br>
        <b>Nombre batteries 2.4kWh : </b>${batteryCount}<br>
        <b>Puissance onduleur recommandée : </b>${inverterPower.toFixed(0)} W<br>
        <b>Coût estimé : </b>${estimatedCost.toLocaleString()} FCFA
    `;
}

async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let content = document.getElementById("results").innerText;

    doc.text("DEVIS SYSTEME SOLAIRE RESIDENTIEL", 10, 10);
    doc.text(content, 10, 30);

    doc.save("Devis_Solaire_Residentiel.pdf");
}
