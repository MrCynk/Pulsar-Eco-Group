
let equipements = [];

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

function calculer(){

    equipements = [];
    let table = document.getElementById("equipmentTable");

    for(let i=1; i<table.rows.length; i++){
        let cells = table.rows[i].cells;

        let nom = cells[0].children[0].value;
        let puissance = parseFloat(cells[1].children[0].value);
        let quantite = parseFloat(cells[2].children[0].value);
        let heures = parseFloat(cells[3].children[0].value);

        if(!isNaN(puissance) && !isNaN(quantite) && !isNaN(heures)){
            equipements.push({nom, puissance, quantite, heures});
        }
    }

    let energie = 0;

    equipements.forEach(eq=>{
        energie += eq.puissance * eq.quantite * eq.heures;
    });

    let energieKwh = energie / 1000;
    let hsp = document.getElementById("hsp").value;
    let efficiency = document.getElementById("efficiency").value;

    const puissancePanneau = 550;

    let puissancePV = energie / (hsp * efficiency);
    let nbPanneaux = Math.ceil(puissancePV / puissancePanneau);

    let type = document.getElementById("typeInstallation").value;

    let batteries = 0;
    if(type !== "reseau"){
        batteries = Math.ceil((energie / (48 * 0.8)) / 200);
    }

    let onduleur = Math.ceil((puissancePV * 1.3)/1000);

    let prixPanneau = 180000;
    let prixOnduleur = 300000;
    let prixBatterie = 450000;
    let main_doeuvre = nbPanneaux * 10000;

    let coutTotal = (nbPanneaux * prixPanneau) + (onduleur * prixOnduleur) +(batteries * prixBatterie);

    document.getElementById("results").innerHTML = `
    <p><strong>Consommation journalière :</strong> ${energieKwh.toFixed(2)} kWh</p>
    <p><strong>Panneaux recommandés :</strong> ${nbPanneaux} panneaux 550W</p>
    <p><strong>Onduleur recommandé :</strong> ${onduleur} kVA</p>
    <p><strong>Batteries :</strong> ${type !== "reseau" ? batteries + " unités 48V" : "Non requises"}</p>
    <p><strong>Coût estimatif :</strong> ${coutTotal} FCFA</p>
    <p><strong>Main d'oeuvre : </strong> ${main_doeuvre} FCFA </p>
    <p><strong>Coût Total : </strong> ${coutTotal + main_doeuvre} FCFA </p>
    `;
}

/*function addLogo(doc, callback){
    const img = new Image();
    img.src = "images/Pulsar Icon.jpeg";

    img.onload = function (){
        doc.addImage(img, "JPEG", 150, 10, 40, 20);
        callback();
    };

    img.onerror = function (){
        console.error("Erreur chargement logo");
        callback();
    };
}*/

function generateQuoteNumber(){
    if (!equipements){
        alert("Veuillez saisir des données pour effectuer le calcul");
        return;
    }

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
    doc.text("Email :  contact@pulsarecogroup.com", 120, 287);
    doc.text("Lomé - Togo", 120, 292);

    doc.setTextColor(0);
}

async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    /*addLogo(doc, function(){
        doc.setFontSize(15);
    })*/

    const today = new Date();
    const qoteNumber = generateQuoteNumber();
    const formatedDate = today.toLocaleDateString("fr-FR")

    addWatermark(doc);


    let content = document.getElementById("results").innerText;

    doc.setFontSize(18);
    doc.text("DEVIS Solaire PME", 20, 25);

    doc.setFontSize(11);
    doc.text(`N° Devis : ${qoteNumber}`, 20, 35);
    doc.text(`Date : ${today}`, 20, 42);
    doc.line(20, 48, 190, 48);

    doc.setFontSize(18)
    doc.text(content, 20, 80);

    addFooter(doc);

    doc.save(`Devis_${qoteNumber}.pdf`);
}