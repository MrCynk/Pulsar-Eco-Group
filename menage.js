let devices = [];
function addRow(){
    let table = document.getElementById("equipmentTable");
    let row = table.insertRow();

    row.innerHTML = `
    <td><input type="text" placeholder="Ex: Climatiseur"></td>
    <td><input type="number" placeholder="1200"></td>
    <td><input type="number" placeholder="2"></td>
    <td><input type="number" placeholder="6"></td>
    <td><button class="del-btn" onclick="deleteRow(this)">X</button></td>
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
    let bud = document.getElementById("bud").value;
    let efficiency = document.getElementById("efficiency").value;

    let pvPower = totalEnergy / (hsp * efficiency);
    let batteryWh = totalEnergy * autonomy;

    let inverterPower = totalEnergy / 5 * 1.25;

    let panelCount = Math.ceil(pvPower / 400);
    let batteryCount = Math.ceil(batteryWh / 2400);
    let regOnd = 250000

    let estimatedCost = panelCount * 150000 + batteryCount * 300000 + regOnd;
    let mainDoeuvre = panelCount * 10000;

    document.getElementById("results").innerHTML = `
        <p><strong>Consommation journalière : </strong>${totalEnergy.toFixed(0)} Wh </p>
        <p><strong>Puissance panneaux requise : </strong>${pvPower.toFixed(0)} W </p>
        <p><strong>Nombre de panneaux 400W : </strong>${panelCount} </p>
        <p><strong>Capacité batterie requise : </strong>${batteryWh.toFixed(0)} Wh </p>
        <p><strong>Nombre batteries 2.5 kWh : </strong>${batteryCount}<br>
        <p><strong>Puissance onduleur recommandée : </strong>${inverterPower.toFixed(0)} W </p>
        <p><strong>Régulateur MPPT + Onduleur(220V domestique): <strong>${regOnd} FCFA </p>
        <p><strong>Coût estimé : </strong>${estimatedCost} FCFA </p>
        <p><strong>Main d'oeuvre : </strong>${mainDoeuvre} FCFA </p>
        <p><strong>Coût Total : <strong>${(estimatedCost + mainDoeuvre)} FCFA </p>
    `;
}

function generateQuoteNumber(){
    const now = new Date();
    const datePart = now.getFullYear().toString() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
    const randomPart = Math.floor(Math.random() * 900) + 100;

    return `PEG-${datePart}-${randomPart}`;
}

function addWatermark(doc) {
    doc.setTextColor(220);
    doc.setFontSize(60);
    doc.text("PULSAR ECO GROUP", 150, 220, {
        align: "center",
        angle: 45
    });
    doc.setTextColor(0);
}

function addFooter(doc) {
    doc.setFontSize(9);
    doc.setTextColor(100);

    doc.line(20, 280, 190, 280);
    doc.text("PULSAR ECO GROUP - Solutions solaires intelligentes", 20, 287);
    doc.text("Email :  pulsarecogroup@gmail.com", 120, 287);
    doc.text("Lomé - Togo", 120, 292);
    doc.text("Téléphone :  +228 92196727 / +228 90104393 / +228 93775800", 20, 292);


    doc.setTextColor(0);
}

async function generatePDF() {
    if (!devices){
        alert("Veuillez saisir des données pour effectuer le calcul");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const today = new Date();
    const qoteNumber = generateQuoteNumber();
    const formatedDate = today.toLocaleDateString("fr-FR")
    const logo = document.getElementById("logo");

    addWatermark(doc);

    //doc.addImage(logo, "JPEG", 150, 10, 40, 20);

    let content = document.getElementById("results").innerText;

    doc.setFontSize(18);
    doc.text("DEVIS Solaire Résidentiel", 20, 25);

    doc.setFontSize(11);
    doc.text(`N° Devis : ${qoteNumber}`, 20, 35);
    doc.text(`Date : ${today}`, 20, 42);
    doc.line(20, 48, 190, 48);

    doc.setFontSize(18)
    doc.text(content, 20, 80);

    addFooter(doc);

    doc.save(`Devis_${qoteNumber}.pdf`);
}
