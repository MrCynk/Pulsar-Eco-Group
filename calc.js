function calculEnergie(charges){
    let total = 0;
    charges.forEach(c => {
        total += c.puissance * c.heures;
    });
    return total;
}

function dimensionnementPanneaux(energieWh) {
    const kwc = energieWh / (SOLAR_DATA.irradiation * 1000 * SOLAR_DATA.rendement);
    const panneaux = Math.ceil((kwc * 1000) / SOLAR_DATA.panneau_w);

    return{
        kwc: kwc.toFixed(2),
        panneaux
    };
}

function inclinaison(latitude){
    return latitude + 10;
}

function coutInstallation(kwc) {
    return Math.round(kwc * SOLAR_DATA.cout_installation_kwc);
}

function roi(cout, economieAnnuelle) {
    return (cout / economieAnnuelle).toFixed(1);
}

function puissancePompe (debit, hauteur) {
    const rho = 1000;
    const g=9.81;
    const rendement = 0.6;

    return(((rho * g * hauteur * (debit/3600)) / rendement) / 1000).toFixed(2);
}

function afficher(id, html) {
    document.getElementById(id).innerHTML = html;
}