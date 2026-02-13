function calculer() {
    const p = puissance.value;
    const h = heures.value;
    const lat = Number(document.getElementById("lat").value);

    const energie = calculEnergie([{
        puissance: p,
        heures: h
    }]);
    const dim = dimensionnementPanneaux(energie);
    const cout = coutInstallation(dim.kwc);

    resultat.innerHTML = `
    <b>Consommation :</b> ${energie} Wh/jour <br>
    <b>Panneaux :</b> ${dim.panneaux} <br>
    <b>Puissance installée :</b> ${dim.kwc} kWc<br>
    <b>Inclinaison conseillée :</b> ${inclinaison(lat)}°<br>
    <b>Coût estimé :</b> ${cout.toLocaleString()} FCFA
    `;
}