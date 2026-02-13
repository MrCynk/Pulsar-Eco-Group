function calculer() {
    const surf = parseFloat(document.getElementById("surface").value);
    const clt = parseFloat(document.getElementById("culture").value);
    const ef = parseFloat(document.getElementById("efficiency").value);

    const dp = parseFloat(document.getElementById("depth").value);
    const th = parseFloat(document.getElementById("tankHeight").value);
    const hr = parseFloat(document.getElementById("hours").value);

    const psh = parseFloat(document.getElementById("psh").value);
    const panelPower = parseFloat(document.getElementById("panelPower").value);

    if (surf < 0 || dp < 0) {
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
    const waterNeed = surf * clt * 10 / ef;

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
    <h2>📊 Résultats</h2>
    <b>Besoin en eau : </b>${waterNeed.toFixed(1)} m³/j <br>
    <b>Débit requis : </b>${flow.toFixed(2)} m³/h <br>
    <b>Hauteur Manométrique Totale(HMT) : </b>${HMT.toFixed(1)} m <br>
    <b>Puissance pompe : </b>${(pumpPower / 1000).toFixed(2)} kW <br>
    <b>Puissance PV : </b>${(pvPower / 1000).toFixed(2)} kWc <br>
    <b>Nombre panneaux : </b>${nbPanels}
    `;
}