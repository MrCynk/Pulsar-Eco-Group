function calculer() {
    const surface = parseFloat(document.getElementById("surface").value);
    const culture = parseFloat(document.getElementById("culture").value);
    const ef = parseFloat(document.getElementById("efficiency").value);

    const dp = parseFloat(document.getElementById("depth").value);
    const th = parseFloat(document.getElementById("tankHeight").value);
    const hr = parseFloat(document.getElementById("hours").value);

    const psh = parseFloat(document.getElementById("psh").value);
    const panelPower = parseFloat(document.getElementById("panelPower").value);

    if (surface < 0 || dp < 0) {
        alert("Veuillez entrer des valeurs positives pour la surface et la profondeur !");
        return;
    }
    else if (hr < 0 || hr > 24) {
        alert("Veuillez entrer des heures comprises entre 0 et 24 !");
        return;
    }
    else if (th < 0 || panelPower < 0) {
        alert("Veuillez entrer des valeurs positives pour la Hauteur réservoir et la Puissance panneau !");
        return;
    }

    // Besoin en eau (m³/j)
    const waterNeed = surface * culture * 10 / ef;

    // Débit (m³/h)
    const flow = waterNeed / hr;

    // Hauteur Manométrique Totale (HMT)
    const HMT = (dp + th) * 1.1;

    // Puissance hydraulique
    const Q = flow / 3600;
    const rho = 1000;
    const g = 9.81;
    const Ph = rho * g * Q * HMT;

    // Puissance électrique pompe
    const pumpPower = Ph / 0.5;

    // Champ PV
    const pvPower = pumpPower / (psh * 0.75);

    // Nombre panneaux
    const nbPanels = Math.ceil(pvPower / panelPower);

    document.getElementById("results").innerHTML = `
    <h2>RESULTATS DE L'ANALYSE :</h2> <br>
    <b>Besoin en eau : </b>${waterNeed.toFixed(1)} m³/j <br>
    <b>Débit requis : </b>${flow.toFixed(2)} m³/h <br>
    <b>Hauteur Manométrique Totale(HMT) : </b>${HMT.toFixed(1)} m <br>
    <b>Puissance pompe : </b>${(pumpPower / 1000).toFixed(2)} kW <br>
    <b>Puissance PV : </b>${(pvPower / 1000).toFixed(2)} kWc <br>
    <b>Nombre panneaux : </b>${nbPanels}
    `;
}

function generateQuoteNumber(){
    const now = new Date();
    const datePart = now.getFullYear().toString() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
    const randomPart = Math.floor(Math.random() * 900) + 100;

    return `PE-${datePart}-${randomPart}`;
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
    doc.text("Email :  contact@pulsarecogroup.com", 120, 287);
    doc.text("Lomé - Togo", 120, 292);

    doc.setTextColor(0);
}

async function generatePDF() {
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
    doc.text("DEVIS Pompage Solaire Agricole", 20, 25);

    doc.setFontSize(11);
    doc.text(`N° Devis : ${qoteNumber}`, 20, 35);
    doc.text(`Date : ${today}`, 20, 42);
    doc.line(20, 48, 190, 48);

    doc.setFontSize(22)
    doc.text(content, 20, 90);

    addFooter(doc);

    doc.save(`Devis_${qoteNumber}.pdf`);
}

/*async function generatePDF() {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let content = document.getElementById("results").innerText;

    doc.setFontSize(16);
    doc.text("DEVIS - SYSTÈME DE POMPAGE SOLAIRE", 20, 20);
    doc.text(content, 10, 30);

    doc.setFontSize(11);
    doc.text(`<b></b>Surface : </b>${devisData.surface} ha`, 20, 42);
    doc.text(`<b>Culture : </b>${devisData.culture}`, 20, 49);

    doc.line(20, 55, 190, 55);

    doc.text("=== Résultats techniques ===", 20, 65);

    doc.text(`<b></b>Besoin eau : </b>${devisData.waterNeed.toFixed(1)} m3/j`, 20, 75);
    doc.text(`<b>Débit : </b>${devisData.flow.toFixed(2)} m3/h`, 20, 82);
    doc.text(`<b>HMT : </b>${devisData.HMT.toFixed(1)} m`, 20, 89);
    doc.text(`<b>Puissance pompe : </b>${(devisData.pumpPower / 1000).toFixed(2)} kW`, 20, 96);
    doc.text(`<b>Puissance champ PV : </b>${(devisData.pvPower / 1000).toFixed(2)} kWc`, 20, 103);
    doc.text(`<b>Nombre panneaux : </b>${devisData.nbPanels}`, 20, 110);

    doc.line(20, 118, 190, 118);

    doc.text("=== Fournitures estimées ===", 20, 128);

    doc.text(` <b>Pompe solaire </b>${(devisData.pumpPower / 1000).toFixed(2)} kW`, 20, 138);
    doc.text(` ${devisData.nbPanels} panneaux PV`, 20, 145);
    doc.text(" Contrôleur MPPT", 20, 152);
    doc.text(" Structures", 20, 159);
    doc.text(" Protections DC", 20, 166);
    doc.text(" Câblage & tuyauterie", 20, 173);

    doc.line(20, 180, 190, 180);

    // Estimation coût très simple (prototype)
    const costPV = devisData.nbPanels * 180;
    const costPump = (devisData.pumpPower / 1000) * 600;
    const total = costPV + costPump;

    doc.text("=== Estimation financière ===", 20, 190);

    doc.text(`<b>Champ PV : </b>${costPV.toFixed(0)} €`, 20, 200);
    doc.text(`<b>Pompe : </b>${costPump.toFixed(0)} €`, 20, 207);
    doc.text(`<b></b>TOTAL estimé : </b>${total.toFixed(0)} €`, 20, 217);

    doc.save("devis_pompage_solaire.pdf");
}*/

