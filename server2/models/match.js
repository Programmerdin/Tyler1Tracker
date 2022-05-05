const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const matchSchema = new Schema({
    isThisFullyUpdated:{type: Boolean},
    matchId: {type: String},
    gameStartTimestamp: {type: Number},
    gameDuration: {type: Number},
    averageConvertedRank: {type: Number},//need to be computed and saved under this key every match, average rank excluding tyler
    averageTier: {type: String},
    averageRank: {type: String},
    averageLP: {type: Number},
    challgengerLpRequirement: {type: Number},
    grandmasterLpRequirement: {type: Number},
    gameNumber: {type: Number},// need to be commputed, 1st 2nd 3rd ...etc  ranked game of tyler
    mainPlayerSummonerId: {type: String},
    mainPlayerTeamId: {type: Number},
    mainPlayerChampionId: {type: Number},
    mainPalyerPuuid: {type: String},
    mainPlayerTier: {type: String},
    mainPlayerRank: {type: String},
    mainPlayerLeaguePoints: {type: Number},
    mainPlayerWins: {type: Number},
    mainPlayerLosses: {type: Number},
    mainPlayerKills: {type: Number},
    mainPlayerDeaths: {type: Number},
    mainPlayerDeathsByEnemyChampions: {type: Number},
    mainPlayerAssists: {type: Number},
    mainPlayerWin: {type: Boolean},
    participants: [
        {
            participantId: {type: Number},
            teamId: {type: Number},
            teamPosition: {type: String},
            puuid: {type: String},
            summonerName: {type: String},
            summonerId: {type: String},
            win: {type: Boolean},
            championId: {type: Number},
            championName: {type: String},
            kills: {type: Number},
            deaths: {type: Number},
            deathsByEnemyChamps: {type: Number}, //under challenges
            assists: {type: Number},
            totalMinionsKilled: {type: Number},
            totalDamageDealtToChampions: {type: Number},
            goldEarned: {type: Number},
            pentaKills: {type: Number},
            eligibleForProgression: {type: Boolean},
            tier: {type: String}, //from /lol/league/v4/entries/by-summoner/{encryptedSummonerId}
            rank: {type: String}, //from /lol/league/v4/entries/by-summoner/{encryptedSummonerId}
            leaguePoints: {type: Number}, //from /lol/league/v4/entries/by-summoner/{encryptedSummonerId}
            wins: {type: Number}, //from  /lol/league/v4/entries/by-summoner/{encryptedSummonerId}
            losses: {type: Number}, // /lol/league/v4/entries/by-summoner/{encryptedSummonerId}
        }
    ]    
    },{timestamps: true});

const MatchData = mongoose.model('MatchData', matchSchema);

module.exports = MatchData;

