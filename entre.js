
let equipements = [];

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

    const HSP = 5.5;
    const rendement = 0.8;
    const puissancePanneau = 550;

    let puissancePV = energie / (HSP * rendement);
    let nbPanneaux = Math.ceil(puissancePV / puissancePanneau);

    let type = document.getElementById("typeInstallation").value;

    let batteries = 0;
    if(type !== "reseau"){
        batteries = Math.ceil((energie / (48 * 0.8)) / 200);
    }

    let onduleur = Math.ceil((puissancePV * 1.3)/1000);

    let prixPanneau = 180000;
    let prixOnduleur = 1200000;
    let prixBatterie = 950000;

    let coutTotal = (nbPanneaux * prixPanneau) + 
                    (onduleur * prixOnduleur) +
                    (batteries * prixBatterie);

    document.getElementById("resultat").innerHTML = `
    <h3>Résultats</h3>
    <p><strong>Consommation journalière :</strong> ${energieKwh.toFixed(2)} kWh</p>
    <p><strong>Panneaux recommandés :</strong> ${nbPanneaux} panneaux 550W</p>
    <p><strong>Onduleur recommandé :</strong> ${onduleur} kVA</p>
    <p><strong>Batteries :</strong> ${type !== "reseau" ? batteries + " unités 48V" : "Non requises"}</p>
    <p><strong>Coût estimatif :</strong> ${coutTotal.toLocaleString()} FCFA</p>
    `;
}

/*function genererPDF(){

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("DEVIS - SYSTEME SOLAIRE PME", 20, 20);
    doc.text(document.getElementById("resultat").innerText, 20, 40);

    doc.save("Devis_PME_Solaire.pdf");
}*/
async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let content = document.getElementById("resultat").innerText;

    doc.text("DEVIS SYSTEME SOLAIRE PME", 10, 10);
    doc.text(content, 10, 30);

    doc.save("Devis_Solaire_PME.pdf");
}