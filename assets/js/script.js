document.addEventListener('DOMContentLoaded', function() {
    fetch('data/players.json')
        .then(response => response.json())
        .then(players => {
            const playerRanking = document.getElementById('playerRanking');
            players.forEach(player => {
                const li = document.createElement('li');
                li.innerHTML = `<img src="https://crafatar.com/avatars/${player.uuid}?size=50&overlay=true" alt="${player.name}">
                                <span>${player.name} - ${player.elo} Elo</span>`;
                li.onclick = () => {
                    window.location.href = `player.html?uuid=${player.uuid}`;
                };
                playerRanking.appendChild(li);
            });
        });

    fetch('data/factions.json')
        .then(response => response.json())
        .then(factions => {
            const factionRanking = document.getElementById('factionRanking');
            factions.forEach(faction => {
                const li = document.createElement('li');
                li.innerHTML = `<img src="assets/images/faction-icon.png" alt="${faction.name}">
                                <span>${faction.name} - ${faction.elo} Elo</span>`;
                li.onclick = () => {
                    window.location.href = `faction.html?name=${faction.name}`;
                };
                factionRanking.appendChild(li);
            });
        });
});
