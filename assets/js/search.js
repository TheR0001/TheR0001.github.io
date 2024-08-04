document.getElementById('searchPlayer').addEventListener('input', function(e) {
    const searchQuery = e.target.value.toLowerCase();
    const players = document.querySelectorAll('#playerRanking li');
    players.forEach(player => {
        const playerName = player.textContent.toLowerCase();
        if (playerName.includes(searchQuery)) {
            player.style.display = '';
        } else {
            player.style.display = 'none';
        }
    });
});

document.getElementById('searchFaction').addEventListener('input', function(e) {
    const searchQuery = e.target.value.toLowerCase();
    const factions = document.querySelectorAll('#factionRanking li');
    factions.forEach(faction => {
        const factionName = faction.textContent.toLowerCase();
        if (factionName.includes(searchQuery)) {
            faction.style.display = '';
        } else {
            faction.style.display = 'none';
        }
    });
});
