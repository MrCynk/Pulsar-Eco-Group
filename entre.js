function calculer() {
    const e = energie.value;
    const dim = dimensionnementPanneaux(e);
    const cout = coutInstallation(dim.kwc);

    resultat.innerHTML = `
    <b>Panneaux :</b> ${dim.panneaux} <br>
    <b>Puissance installée :</b> ${dim.kwc} kWc <br>
    <b>Coût estimé :</b> ${cout.toLocaleString()} FCFA <br>
    <b>Solution :</b> Système hybride avec batteries
    `;
}