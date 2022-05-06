var express = require('express');
var cors = require('cors');
const axios = require('axios');
const { response } = require('express');
const res = require('express/lib/response');
const mongoose = require('mongoose');
const MatchData = require('./models/match');
const LpRequirement = require('./models/LpRequirement')
const e = require('cors');

const app = express();
app.use(cors());


//connect to mongodb
const dbURI = 'mongodb+srv://hong5250:970708Odin@matchdatatest.82g9o.mongodb.net/OdinH_Data?retryWrites=true&w=majority'
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology:true})
    .then((result)=>{
        console.log("connected to db")   
        app.listen(3000, function(){
            //console.log("server running on port 3000");
        }) //localhost:3000
    }).catch(err=>console.log(err));

app.get("/", (req, res)=>{
  res.send(global_data_PROFILE_STATS);
})

//Riot API Key
const API_KEY = "RGAPI-17313df0-c5f7-4085-aa0b-cd1465ae5db0";

const PLATFORM_ROUTING_VALUE_NA = "https://na1.api.riotgames.com";
const PLATFORM_ROUTING_VALUE_KR = "https://kr.api.riotgames.com";
const REGIONAL_ROUTING_VALUE_AMERICAS = "https://americas.api.riotgames.com";
const REGIONAL_ROUTING_VALUE_ASIA = "https://asia.api.riotgames.com";

const PUUID_Tyler1 ="6LeZJvSMRIq10lQuVKyKsLzswgYvKW-SnPkGG_kM2r_AlW-sbtmDByMLD13nX3zLoAs51MfTkNQEgg";
const PUUID_OdinH = "emc59JHj1cEGSjhamAw-VHxq2xrdJP91bW6dmZUI5si7yzVj1SVb20HIFnQuKaOGHXRNrlbxjnnpFA";

const summoner_Id_Tyler1 ="5sg3w0btZpB8QZIxDANIwKk9w8oTwf8Rq-SDUZJbCJkxf81Jk8SV7XnYYA";
const Summoner_Id_OdinH = "ONoisfMZ7kCfgy7u0ZwLji6ZNBDRJshn-4OEPKhz-p8RqX665LAs2QblSg"

const Summoner_Id_IN_USE = summoner_Id_Tyler1;
const PUUID_IN_USE = PUUID_Tyler1;


const global_data_PROFILE_STATS = {
  challengerLpRequirement: 500,
  tier: "",
  rank: "",
  leaguePoints: "",
  wins: 0,
  losses: 0,
  gamesPlayed: 0,
  timeSpentInGame: 0,
  kills: 0,
  deaths: 0,
  deathsByEnemyChamps: 0,
  assits: 0,
  uniqueChampionsPlayed: 0,
  pentaKill: 0,
  longestWinStreak: 0,
  longestLossStreak: 0,
  assignRateTop: 0,
  assignRateJg: 0,
  assignRateMid: 0,
  assignRateBot: 0,
  assignRateSup: 0,
  winRateTop: 0,
  winRateJg: 0,
  winRateMid: 0,
  winRateBot: 0,
  winRateSup: 0
};
const global_data_LP_GRAPH = []
const data_for_LP_GRAPH = {
  
}


//get last ranked game's match id 
//this will only need to be run everytime tyler1 finishes a game
function getLastMatchId(PUUID){
    return axios.get(REGIONAL_ROUTING_VALUE_ASIA+"/lol/match/v5/matches/by-puuid/"+PUUID+"/ids?"+"type=ranked&start=&count=1"+"&api_key="+API_KEY)
        .then(response=>{
            //console.log(response.data);
            return response.data;
        }).catch(err=>err);
}
//getLastMatchId(PUUID_IN_USE);




function getAllMatchId(PUUID, Summoner_ID){
    let matchIdArray = [];
    axios.get(PLATFORM_ROUTING_VALUE_KR+"/lol/league/v4/entries/by-summoner/"+Summoner_ID+"?api_key="+API_KEY)
        .then(response=>{
            let temporary_array_1 = response.data;

                //if riot API returns something that's not error or empty then it means the player is ranked 
                if(temporary_array_1.length>0){
                    let totalNumberofGames = temporary_array_1[0].wins + temporary_array_1[0].losses;
                    console.log("TotalNumber of games "+totalNumberofGames);

                    //then use totalNumberofGames to get all the past ranked games matchIds
                    //run loop by manipulating start value and count value to get all the past games' matchId

                    //loop through to get matchIds in increments of 100
                    for(let i=0; totalNumberofGames-i>=100; i+=100){
                        axios.get(REGIONAL_ROUTING_VALUE_ASIA+"/lol/match/v5/matches/by-puuid/"+PUUID+"/ids?type=ranked&start="+i.toString()+"&count=100"+"&api_key="+API_KEY)
                            .then(response=>{
                                matchIdArray.push(...response.data)
                            }).catch(err=>err)
                    }

                    //get left over matchIds that are less than 100
                    let matches_start_index = 100*Math.floor(totalNumberofGames/100)
                    let matches_remainder = totalNumberofGames%100;
                    axios.get(REGIONAL_ROUTING_VALUE_ASIA+"/lol/match/v5/matches/by-puuid/"+PUUID+"/ids?type=ranked&start="+matches_start_index.toString()+"&count="+matches_remainder.toString()+"&api_key="+API_KEY)
                        .then(response=>{
                            matchIdArray.push(...response.data);
                        }).catch(err=>err)
                } else {
                    //if response returns empty or error then it probably means that the player in unranked so just try to grab past 100 games 
                    axios.get(REGIONAL_ROUTING_VALUE_ASIA+"/lol/match/v5/matches/by-puuid/"+PUUID+"/ids?type=ranked&start=0&count=100"+"&api_key="+API_KEY)
                        .then(response=>{
                            matchIdArray.push(...response.data)
                            for(let i=0; i<=matchIdArray.length; i++){
                                getSingleMatchInfo(matchIdArray[i])
                            }
                        }).catch(err=>console.err)
                }
        }).catch(err=>err);
    }

//getAllMatchId(PUUID_IN_USE, Summoner_Id_IN_USE)




let challengerLpReq = 500;
let grandmasterLpReq = 200;
async function getLpRequirement(){
    let topRankList = [];

    //get playerlist from challenger gm and master 
    axios.get(PLATFORM_ROUTING_VALUE_KR+"/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5?api_key="+API_KEY)
        .then((response)=>{
            let challengerList = response.data.entries
            topRankList = [...topRankList, ...challengerList]

            axios.get(PLATFORM_ROUTING_VALUE_KR+"/lol/league/v4/grandmasterleagues/by-queue/RANKED_SOLO_5x5?api_key="+API_KEY)
                .then((response)=>{
                    let grandmasterList = response.data.entries
                    topRankList = [...topRankList, ...grandmasterList]

                    axios.get(PLATFORM_ROUTING_VALUE_KR+"/lol/league/v4/masterleagues/by-queue/RANKED_SOLO_5x5?api_key="+API_KEY)
                        .then(async(response)=>{
                            let masterList = response.data.entries
                            topRankList = [...topRankList, ...masterList]

                            //sort topRankList in order of LP, highest LP is index0
                            topRankList.sort((a,b)=>{
                                if(a.leaguePoints>b.leaguePoints){
                                    return -1
                                }
                                if(a.leaguePoints<b.leaguePoints){
                                    return 1
                                } return 0
                            })
                            
                            //update LPreq for Challenger and GM
                            if(topRankList[299].leaguePoints<500){
                                //if 300th rank player's lp is less than 500, challengerLpReq should be 500
                                challengerLpReq = 500
                            } else {
                                //if 300th rank player's lp is 500 or more, challengerLpReq should be updated to that player's current lp
                                challengerLpReq = topRankList[299].leaguePoints
                            }
                            if(topRankList[999].leaguePoints<200){
                                grandmasterLpReq = 200
                            } else {
                                grandmasterLpReq = topRankList[999].leaguePoints
                            }

                            //save LpReq to database
                            const extractedData = new LpRequirement({
                                challengerLpRequirement: challengerLpReq,
                                grandmasterLpRequirement: grandmasterLpReq
                            })
                            await extractedData.save();

                        }).catch(err=>err)
                }).catch(err=>err)
        }).catch(err=>err)
}


async function calculateAverageRank(matchId){
    let databaseObject = await MatchData.findOne({matchId: matchId})
    let unrankedPlayerCount = 0
    let summedPlayerConvertedRank = 0
    let convertedPlayerRank_array = [];

    let convertedPlayerTier = 0;
    let convertedPlayerRank = 0;
    let convertedPlayerLP = 0;

    for(let i = 0; i<10; i++){
        //if player is unranked
        if(databaseObject.participants[i].tier==="Unranked"){
            unrankedPlayerCount = unrankedPlayerCount+1;
        } else{
        //if player is ranked convert ranks in to a single number
            let playerTier = databaseObject.participants[i].tier
            let playerRank = databaseObject.participants[i].rank
            let playerLP = databaseObject.participants[i].leaguePoints

            //convert playerTier into number
            if(playerTier==="CHALLENGER"||playerTier==="GRANDMASTER"||playerTier==="MASTER"){convertedPlayerTier = 2400}
            else if(playerTier==="DIAMOND"){convertedPlayerTier=2000}
            else if(playerTier==="PLATINUM"){convertedPlayerTier=1600}
            else if(playerTier==="GOLD"){convertedPlayerTier=1200}
            else if(playerTier==="SILVER"){convertedPlayerTier=800}
            else if(playerTier==="BRONZE"){convertedPlayerTier=400}
            else if(playerTier==="IRON"){convertedPlayerTier=0}
            else if(playerTier==="Unranked"){convertedPlayerTier=0}
            //convert playerRank into number
            if(playerRank==="IV"){convertedPlayerRank = 100}
            else if (playerRank==="III"){convertedPlayerRank = 200}
            else if (playerRank==="II"){convertedPlayerRank = 300}
            else if (playerRank==="I"){convertedPlayerRank = 400}
            else if (playerRank==="Unranked"){convertedPlayerRank = 0}
            //convert leaguePoints(if negative due to dodges make it 0)
            if(playerLP<0){
                convertedPlayerLP = 0
            }else {
                convertedPlayerLP = playerLP
            }
        }

        //push to convertedPlayerRank_array 
        convertedSum = convertedPlayerTier+convertedPlayerRank+convertedPlayerLP
        convertedPlayerRank_array.push(convertedSum)
        //sum all converted variables and add it to summedPlayerConvertedRank
        summedPlayerConvertedRank = summedPlayerConvertedRank + convertedPlayerTier + convertedPlayerRank + convertedPlayerLP
    }
    
    //make sure at least one player in the game is ranked already
    if(10-unrankedPlayerCount>0){
        let averageConvertedRank = Math.round(summedPlayerConvertedRank/(10-unrankedPlayerCount))
        console.log("b4")
        databaseObject.averageConvertedRank = averageConvertedRank
        console.log("after")
        
        //calculate average tier 
        //lp requirement should be calculated somewhere else using ladder rank 
        let averageTier = ""
        let averageRank = ""
        let averageLP = 0
        //grab the lastest LpReq from database
        let container_LpReq = await LpRequirement.find().sort({createdAt: -1}).limit(1)
        let challengerLpReq = container_LpReq.challengerLpRequirement
        let grandmasterLpReq = container_LpReq.grandmasterLpRequirement
        
        //get quotient
        //if average comes out to be d1 100lp, just have it be master 0lp, always be biased to display the ranks higher
        if(averageConvertedRank<400){
            averageTier = "IRON"
            if(averageConvertedRank<100){
                averageRank = "IV"
                averageLP = averageConvertedRank
            } else if (averageConvertedRank<200){
                averageRank = "III"
                averageLP = averageConvertedRank-100
            } else if (averageConvertedRank<300){
                averageRank = "II"
                averageLP = averageConvertedRank-200
            } else if (averageConvertedRank<400){
                averageRank = "I"
                averageLP = averageConvertedRank-300
            }
        } else if(averageConvertedRank<800){
            averageTier = "BRONZE"
            if(averageConvertedRank<500){
                averageRank = "IV"
                averageLP = averageConvertedRank-400
            } else if (averageConvertedRank<600){
                averageRank = "III"
                averageLP = averageConvertedRank-500
            } else if (averageConvertedRank<700){
                averageRank = "II"
                averageLP = averageConvertedRank-600
            } else if (averageConvertedRank<800){
                averageRank = "I"
                averageLP = averageConvertedRank-700
            }
        } else if(averageConvertedRank<1200){
            averageTier = "SILVER"
            if(averageConvertedRank<900){
                averageRank = "IV"
                averageLP = averageConvertedRank-800
            } else if (averageConvertedRank<1000){
                averageRank = "III"
                averageLP = averageConvertedRank-900
            } else if (averageConvertedRank<1100){
                averageRank = "II"
                averageLP = averageConvertedRank-1000
            } else if (averageConvertedRank<1200){
                averageRank = "I"
                averageLP = averageConvertedRank-1100
            }
        } else if(averageConvertedRank<1600){
            averageTier = "GOLD"
            if(averageConvertedRank<1300){
                averageRank = "IV"
                averageLP = averageConvertedRank-1200
            } else if (averageConvertedRank<1400){
                averageRank = "III"
                averageLP = averageConvertedRank-1300
            } else if (averageConvertedRank<1500){
                averageRank = "II"
                averageLP = averageConvertedRank-1400
            } else if (averageConvertedRank<1600){
                averageRank = "I"
                averageLP = averageConvertedRank-1500
            }
        } else if(averageConvertedRank<2000){
            averageTier = "PLATINUM"
            if(averageConvertedRank<1700){
                averageRank = "IV"
                averageLP = averageConvertedRank-1600
            } else if (averageConvertedRank<1800){
                averageRank = "III"
                averageLP = averageConvertedRank-1700
            } else if (averageConvertedRank<1900){
                averageRank = "II"
                averageLP = averageConvertedRank-1800
            } else if (averageConvertedRank<2000){
                averageRank = "I"
                averageLP = averageConvertedRank-1900
            }
        } else if(averageConvertedRank<2400){
            averageTier = "DIAMOND"
            if(averageConvertedRank<2100){
                averageRank = "IV"
                averageLP = averageConvertedRank-2000
            } else if (averageConvertedRank<2200){
                averageRank = "III"
                averageLP = averageConvertedRank-2100
            } else if (averageConvertedRank<2300){
                averageRank = "II"
                averageLP = averageConvertedRank-2200
            } else if (averageConvertedRank<2400){
                averageRank = "I"
                averageLP = averageConvertedRank-2300
            }
        } else if (averageConvertedRank>=2400 && averageConvertedRank<grandmasterLpReq){
            averageTier = "MASTER"
            averageRank = "I"
            averageLP = averageConvertedRank-2400
        } else if (averageConvertedRank>=grandmasterLpReq && averageConvertedRank<challengerLpReq){
            averageTier ="GRANDMASTER"
            averageRank = "I"
            averageLP = averageConvertedRank-2400
        } else if (averageConvertedRank>=challengerLpReq){
            averageTier ="Challenger"
            averageRank = "I"
            averageLP = averageConvertedRank-2400
        }
    
        //and push to databaseObject
        databaseObject.averageTier = averageTier
        databaseObject.averageRank = averageRank
        databaseObject.averageLP = averageRank
        databaseObject.challgengerLpRequirement = challengerLpReq
        databaseObject.grandmasterLpRequirement = grandmasterLpReq
        await databaseObject.save();
    //if no one is ranked, then set averageTier as Unranked
    } else if(10-unrankedPlayerCount === 0){
        databaseObject.averageTier = "Unranked"
        await databaseObject.save();
    }

}

//get info from a match and only extract and save relevant data, some of the data i need isn't requires other api requests
//getSingletMatchinfo function will only update to database if data isn't fully updated on database
async function getSingleMatchInfo(MatchId){
    let databaseCheck1 = await MatchData.count({matchId: MatchId})

    if(databaseCheck1>0){
        //if the match exists then check if it has been fully updated
        let databaseObject = await MatchData.findOne({matchId: MatchId})
        let databaseCheck2 = databaseObject.isThisFullyUpdated
        if(databaseCheck2===true){
            //if data object in database is fully updated, no need to do anything
            console.log("No need to update")
        } else {
            //if data object in database is not fully updated it means that
            //only live game data has been updated, get res of match data
            axios.get(REGIONAL_ROUTING_VALUE_ASIA+"/lol/match/v5/matches/"+MatchId+"?api_key="+API_KEY)
                .then(async response=>{
                    let container_for_data = await MatchData.findOne({matchId: response.data.matchId})
                    container_for_data.gameStartTimestamp = response.data.info.gameStartTimestamp
                    container_for_data.gameDuration = response.data.info.gameDuration
                    container_for_data.isThisFullyUpdated = true
                    await container_for_data.save();
                    
                    //loop through participants and update data
                    for(let i = 0; i < 10; i++){   
                        container_for_data.participants[i].participantId = response.data.info.participants[i].participantId
                        container_for_data.participants[i].teamPosition = response.data.info.participants[i].teamPosition
                        container_for_data.participants[i].puuid = response.data.info.participants[i].puuid
                        container_for_data.participants[i].win = response.data.info.participants[i].win
                        container_for_data.participants[i].championName = response.data.info.participants[i].championName
                        container_for_data.participants[i].kills = response.data.info.participants[i].kills
                        container_for_data.participants[i].deaths = response.data.info.participants[i].deaths
                        container_for_data.participants[i].deathsByEnemyChamps = response.data.info.participants[i].challenges.deathsByEnemyChamps
                        container_for_data.participants[i].assists = response.data.info.participants[i].assists
                        container_for_data.participants[i].totalMinionsKilled = response.data.info.participants[i].totalMinionsKilled
                        container_for_data.participants[i].totalDamageDealtToChampions = response.data.info.participants[i].totalDamageDealtToChampions
                        container_for_data.participants[i].goldEarned = response.data.info.participants[i].goldEarned
                        container_for_data.participants[i].pentaKills = response.data.info.participants[i].pentaKills
                        container_for_data.participants[i].eligibleForProgression = response.data.info.participants[i].eligibleForProgression
                        await container_for_data.save();
                    }
                }).catch(err=>err)
        }
    } else{
        axios.get(REGIONAL_ROUTING_VALUE_ASIA+"/lol/match/v5/matches/"+MatchId+"?api_key="+API_KEY)
            .then(async response=>{
                //if matchId don't exist in database then create a new data point
                //create data structure and extract relevant data
                let temp_mainPlayerParticipantId = 0
                let temp_mainPlayerTeamPosition = ""
                let temp_mainPlayerPuuid = ""
                let temp_mainPlayerChampionId = 0
                let temp_mainPlayerTier = ""
                let temp_mainPlayerRank = ""
                let temp_mainPlayerLeaguePoints = 0 
                let temp_mainPlayerWins = 0
                let temp_mainPlayerLosses = 0
                let temp_mainPlayerKills = 0
                let temp_mainPlayerDeaths = 0
                let temp_mainPlayerDeathsByEnemyChampions = 0
                let temp_mainPlayerAssists = 0
                let temp_mainPlayerWin = false
                for(let i = 0; i<10; i++){
                  if(response.data.info.participants[i].puuid === PUUID_IN_USE){
                    temp_mainPlayerParticipantId = response.data.info.participants[i].participantId
                    temp_mainPlayerTeamPosition = response.data.info.participants[i].teamPosition
                    temp_mainPlayerPuuid = response.data.info.participants[i].puuid
                    temp_mainPlayerChampionId = response.data.info.participants[i].championId
                    temp_mainPlayerTier = response.data.info.participants[i].tier
                    temp_mainPlayerRank = response.data.info.participants[i].rank
                    temp_mainPlayerLeaguePoints = response.data.info.participants[i].leaguePoints
                    temp_mainPlayerWins = response.data.info.participants[i].wins
                    temp_mainPlayerLosses = response.data.info.participants[i].losses
                    temp_mainPlayerKills = response.data.info.participants[i].kills
                    temp_mainPlayerDeaths = response.data.info.participants[i].deaths
                    temp_mainPlayerDeathsByEnemyChampions = response.data.info.participants[i].deathsByEnemyChamps
                    temp_mainPlayerAssists = response.data.info.participants[i].assists
                    temp_mainPlayerWin = response.data.info.participants[i].win
                  }
                }


                const extractedData = new MatchData(
                    {
                        mainPlayerSummonerId: Summoner_Id_IN_USE,
                        matchId: response.data.metadata.matchId,
                        isThisFullyUpdated: true,
                        gameStartTimestamp: response.data.info.gameStartTimestamp,
                        gameDuration: response.data.info.gameDuration,
                        mainPlayerParticipantId: temp_mainPlayerParticipantId,
                        mainPlayerTeamPosition: temp_mainPlayerTeamPosition,
                        mainPlayerPuuid: temp_mainPlayerPuuid,
                        mainPlayerChampionId: temp_mainPlayerChampionId,
                        mainPlayerTier: temp_mainPlayerTier,
                        mainPlayerRank: temp_mainPlayerRank,
                        mainPlayerLeaguePoints: temp_mainPlayerLeaguePoints,
                        mainPlayerWins: temp_mainPlayerWins,
                        mainPlayerLosses: temp_mainPlayerLosses,
                        mainPlayerKills: temp_mainPlayerKills,
                        mainPlayerDeaths: temp_mainPlayerDeaths,
                        mainPlayerDeathsByEnemyChampions: temp_mainPlayerDeathsByEnemyChampions,
                        mainPlayerAssists: temp_mainPlayerAssists,
                        mainPlayerWin: temp_mainPlayerWin,
                        participants: [
                            {
                                participantId: response.data.info.participants[0].participantId,
                                teamPosition: response.data.info.participants[0].teamPosition,
                                puuid: response.data.info.participants[0].puuid,
                                summonerName: response.data.info.participants[0].summonerName,
                                win: response.data.info.participants[0].win,
                                championId: response.data.info.participants[0].championId,
                                championName: response.data.info.participants[0].championName,
                                kills: response.data.info.participants[0].kills,
                                deaths: response.data.info.participants[0].deaths,
                                deathsByEnemyChamps: response.data.info.participants[0].challenges.deathsByEnemyChamps, //under challenges
                                assists: response.data.info.participants[0].assists,
                                totalMinionsKilled: response.data.info.participants[0].totalMinionsKilled,
                                totalDamageDealtToChampions: response.data.info.participants[0].totalDamageDealtToChampions,
                                goldEarned: response.data.info.participants[0].goldEarned,
                                pentaKills: response.data.info.participants[0].pentaKills,
                                eligibleForProgression: response.data.info.participants[0].eligibleForProgression,
                            },
                            {
                                participantId: response.data.info.participants[1].participantId,
                                teamPosition: response.data.info.participants[1].teamPosition,
                                puuid: response.data.info.participants[1].puuid,
                                summonerName: response.data.info.participants[1].summonerName,
                                win: response.data.info.participants[1].win,
                                championId: response.data.info.participants[1].championId,
                                championName: response.data.info.participants[1].championName,
                                kills: response.data.info.participants[1].kills,
                                deaths: response.data.info.participants[1].deaths,
                                deathsByEnemyChamps: response.data.info.participants[1].challenges.deathsByEnemyChamps, //under challenges
                                assists: response.data.info.participants[1].assists,
                                totalMinionsKilled: response.data.info.participants[1].totalMinionsKilled,
                                totalDamageDealtToChampions: response.data.info.participants[1].totalDamageDealtToChampions,
                                goldEarned: response.data.info.participants[1].goldEarned,
                                pentaKills: response.data.info.participants[1].pentaKills,
                                eligibleForProgression: response.data.info.participants[1].eligibleForProgression,
                            },
                            {
                                participantId: response.data.info.participants[2].participantId,
                                teamPosition: response.data.info.participants[2].teamPosition,
                                puuid: response.data.info.participants[2].puuid,
                                summonerName: response.data.info.participants[2].summonerName,
                                win: response.data.info.participants[2].win,
                                championId: response.data.info.participants[2].championId,
                                championName: response.data.info.participants[2].championName,
                                kills: response.data.info.participants[2].kills,
                                deaths: response.data.info.participants[2].deaths,
                                deathsByEnemyChamps: response.data.info.participants[2].challenges.deathsByEnemyChamps, //under challenges
                                assists: response.data.info.participants[2].assists,
                                totalMinionsKilled: response.data.info.participants[2].totalMinionsKilled,
                                totalDamageDealtToChampions: response.data.info.participants[2].totalDamageDealtToChampions,
                                goldEarned: response.data.info.participants[2].goldEarned,
                                pentaKills: response.data.info.participants[2].pentaKills,
                                eligibleForProgression: response.data.info.participants[2].eligibleForProgression,
                            },
                            {
                                participantId: response.data.info.participants[3].participantId,
                                teamPosition: response.data.info.participants[3].teamPosition,
                                puuid: response.data.info.participants[3].puuid,
                                summonerName: response.data.info.participants[3].summonerName,
                                win: response.data.info.participants[3].win,
                                championId: response.data.info.participants[3].championId,
                                championName: response.data.info.participants[3].championName,
                                kills: response.data.info.participants[3].kills,
                                deaths: response.data.info.participants[3].deaths,
                                deathsByEnemyChamps: response.data.info.participants[3].challenges.deathsByEnemyChamps, //under challenges
                                assists: response.data.info.participants[3].assists,
                                totalMinionsKilled: response.data.info.participants[3].totalMinionsKilled,
                                totalDamageDealtToChampions: response.data.info.participants[3].totalDamageDealtToChampions,
                                goldEarned: response.data.info.participants[3].goldEarned,
                                pentaKills: response.data.info.participants[3].pentaKills,
                                eligibleForProgression: response.data.info.participants[3].eligibleForProgression,
                            },
                            {
                                participantId: response.data.info.participants[4].participantId,
                                teamPosition: response.data.info.participants[4].teamPosition,
                                puuid: response.data.info.participants[4].puuid,
                                summonerName: response.data.info.participants[4].summonerName,
                                win: response.data.info.participants[4].win,
                                championId: response.data.info.participants[4].championId,
                                championName: response.data.info.participants[4].championName,
                                kills: response.data.info.participants[4].kills,
                                deaths: response.data.info.participants[4].deaths,
                                deathsByEnemyChamps: response.data.info.participants[4].challenges.deathsByEnemyChamps, //under challenges
                                assists: response.data.info.participants[4].assists,
                                totalMinionsKilled: response.data.info.participants[4].totalMinionsKilled,
                                totalDamageDealtToChampions: response.data.info.participants[4].totalDamageDealtToChampions,
                                goldEarned: response.data.info.participants[4].goldEarned,
                                pentaKills: response.data.info.participants[4].pentaKills,
                                eligibleForProgression: response.data.info.participants[4].eligibleForProgression,
                            },
                            {
                                participantId: response.data.info.participants[5].participantId,
                                teamPosition: response.data.info.participants[5].teamPosition,
                                puuid: response.data.info.participants[5].puuid,
                                summonerName: response.data.info.participants[5].summonerName,
                                win: response.data.info.participants[5].win,
                                championId: response.data.info.participants[5].championId,
                                championName: response.data.info.participants[5].championName,
                                kills: response.data.info.participants[5].kills,
                                deaths: response.data.info.participants[5].deaths,
                                deathsByEnemyChamps: response.data.info.participants[5].challenges.deathsByEnemyChamps, //under challenges
                                assists: response.data.info.participants[5].assists,
                                totalMinionsKilled: response.data.info.participants[5].totalMinionsKilled,
                                totalDamageDealtToChampions: response.data.info.participants[5].totalDamageDealtToChampions,
                                goldEarned: response.data.info.participants[5].goldEarned,
                                pentaKills: response.data.info.participants[5].pentaKills,
                                eligibleForProgression: response.data.info.participants[5].eligibleForProgression,
                            },
                            {
                                participantId: response.data.info.participants[6].participantId,
                                teamPosition: response.data.info.participants[6].teamPosition,
                                puuid: response.data.info.participants[6].puuid,
                                summonerName: response.data.info.participants[6].summonerName,
                                win: response.data.info.participants[6].win,
                                championId: response.data.info.participants[6].championId,
                                championName: response.data.info.participants[6].championName,
                                kills: response.data.info.participants[6].kills,
                                deaths: response.data.info.participants[6].deaths,
                                deathsByEnemyChamps: response.data.info.participants[6].challenges.deathsByEnemyChamps, //under challenges
                                assists: response.data.info.participants[6].assists,
                                totalMinionsKilled: response.data.info.participants[6].totalMinionsKilled,
                                totalDamageDealtToChampions: response.data.info.participants[6].totalDamageDealtToChampions,
                                goldEarned: response.data.info.participants[6].goldEarned,
                                pentaKills: response.data.info.participants[6].pentaKills,
                                eligibleForProgression: response.data.info.participants[6].eligibleForProgression,
                            },
                            {
                                participantId: response.data.info.participants[7].participantId,
                                teamPosition: response.data.info.participants[7].teamPosition,
                                puuid: response.data.info.participants[7].puuid,
                                summonerName: response.data.info.participants[7].summonerName,
                                win: response.data.info.participants[7].win,
                                championId: response.data.info.participants[7].championId,
                                championName: response.data.info.participants[7].championName,
                                kills: response.data.info.participants[7].kills,
                                deaths: response.data.info.participants[7].deaths,
                                deathsByEnemyChamps: response.data.info.participants[7].challenges.deathsByEnemyChamps, //under challenges
                                assists: response.data.info.participants[7].assists,
                                totalMinionsKilled: response.data.info.participants[7].totalMinionsKilled,
                                totalDamageDealtToChampions: response.data.info.participants[7].totalDamageDealtToChampions,
                                goldEarned: response.data.info.participants[7].goldEarned,
                                pentaKills: response.data.info.participants[7].pentaKills,
                                eligibleForProgression: response.data.info.participants[7].eligibleForProgression,
                            },
                            {
                                participantId: response.data.info.participants[8].participantId,
                                teamPosition: response.data.info.participants[8].teamPosition,
                                puuid: response.data.info.participants[8].puuid,
                                summonerName: response.data.info.participants[8].summonerName,
                                win: response.data.info.participants[8].win,
                                championId: response.data.info.participants[8].championId,
                                championName: response.data.info.participants[8].championName,
                                kills: response.data.info.participants[8].kills,
                                deaths: response.data.info.participants[8].deaths,
                                deathsByEnemyChamps: response.data.info.participants[8].challenges.deathsByEnemyChamps, //under challenges
                                assists: response.data.info.participants[8].assists,
                                totalMinionsKilled: response.data.info.participants[8].totalMinionsKilled,
                                totalDamageDealtToChampions: response.data.info.participants[8].totalDamageDealtToChampions,
                                goldEarned: response.data.info.participants[8].goldEarned,
                                pentaKills: response.data.info.participants[8].pentaKills,
                                eligibleForProgression: response.data.info.participants[8].eligibleForProgression,
                            },
                            {
                                participantId: response.data.info.participants[9].participantId,
                                teamPosition: response.data.info.participants[9].teamPosition,
                                puuid: response.data.info.participants[9].puuid,
                                summonerName: response.data.info.participants[9].summonerName,
                                win: response.data.info.participants[9].win,
                                championId: response.data.info.participants[9].championId,
                                championName: response.data.info.participants[9].championName,
                                kills: response.data.info.participants[9].kills,
                                deaths: response.data.info.participants[9].deaths,
                                deathsByEnemyChamps: response.data.info.participants[9].challenges.deathsByEnemyChamps, //under challenges
                                assists: response.data.info.participants[9].assists,
                                totalMinionsKilled: response.data.info.participants[9].totalMinionsKilled,
                                totalDamageDealtToChampions: response.data.info.participants[9].totalDamageDealtToChampions,
                                goldEarned: response.data.info.participants[9].goldEarned,
                                pentaKills: response.data.info.participants[9].pentaKills,
                                eligibleForProgression: response.data.info.participants[9].eligibleForProgression,
                            }
                        ]
                    }
                )
                //save matchinfo to database
                await extractedData.save();
            }).catch(err=>err)
    }
}


//loop through MatchIdArray which contains all the ranked matches ids of a player and run getSingleMatchInfo on loop 
function getAllMatchInfo(){
    //grab list of all matchIds from Riot API
    let matchIdArray = []
    matchIdArray = getAllMatchId(PUUID_IN_USE, Summoner_Id_IN_USE)
    
    //Loop thru the list and run getSingleMatchInfo
    //getSingletMatchinfo function will only update to database if data isn't fully updated on database
    for(let i=0; i<=matchIdArray.length; i++){
        console.log("1")
        getSingleMatchInfo(matchIdArray[i])
    }
}



//check if tyler is in a ranked game and get info from live game if in game 
async function getMatchInfoFromLiveGame(SummonerId){
    axios.get(PLATFORM_ROUTING_VALUE_KR+"/lol/spectator/v4/active-games/by-summoner/"+SummonerId+"?api_key="+API_KEY)
        .then(async (response)=>{
            //if match data already exists then do nothing
            let check1 = await MatchData.exists({matchId: response.data.platformId+"_"+response.data.gameId})

            if(check1){
                console.log("match data already in database")
            } else if(response.data.gameQueueConfigId === 420){
              let temp_mainPlayerTeamId = 0
              let temp_mainPlayerChampionId = 0
              for(let i = 0; i < 10; i++){
                if(response.data.participants[i].summonerId === Summoner_Id_IN_USE){
                  temp_mainPlayerTeamId = response.data.participants[i].teamId
                  temp_mainPlayerChampionId = response.data.participants[i].championId
                }
              }

                //add the new data in if the game is ranked (ie gameQueueConfigId = 420)
                const extractedData = new MatchData({
                    mainPlayerSummonerId: SummonerId,
                    mainPlayerTeamId: temp_mainPlayerTeamId,
                    mainPlayerChampionId: temp_mainPlayerChampionId,
                    matchId: response.data.platformId+"_"+response.data.gameId,
                    participants: [
                        {
                            summonerName: response.data.participants[0].summonerName,
                            summonerId: response.data.participants[0].summonerId,
                            teamId: response.data.participants[0].teamId,
                            championId: response.data.participants[0].championId
                        },
                        {
                            summonerName: response.data.participants[1].summonerName,
                            summonerId: response.data.participants[1].summonerId,
                            teamId: response.data.participants[1].teamId,
                            championId: response.data.participants[1].championId
                        },
                        {
                            summonerName: response.data.participants[2].summonerName,
                            summonerId: response.data.participants[2].summonerId,
                            teamId: response.data.participants[2].teamId,
                            championId: response.data.participants[2].championId
                        },
                        {
                            summonerName: response.data.participants[3].summonerName,
                            summonerId: response.data.participants[3].summonerId,
                            teamId: response.data.participants[3].teamId,
                            championId: response.data.participants[3].championId
                        },
                        {
                            summonerName: response.data.participants[4].summonerName,
                            summonerId: response.data.participants[4].summonerId,
                            teamId: response.data.participants[4].teamId,
                            championId: response.data.participants[4].championId
                        },
                        {
                            summonerName: response.data.participants[5].summonerName,
                            summonerId: response.data.participants[5].summonerId,
                            teamId: response.data.participants[5].teamId,
                            championId: response.data.participants[5].championId
                        },
                        {
                            summonerName: response.data.participants[6].summonerName,
                            summonerId: response.data.participants[6].summonerId,
                            teamId: response.data.participants[6].teamId,
                            championId: response.data.participants[6].championId
                        },
                        {
                            summonerName: response.data.participants[7].summonerName,
                            summonerId: response.data.participants[7].summonerId,
                            teamId: response.data.participants[7].teamId,
                            championId: response.data.participants[7].championId
                        },
                        {
                            summonerName: response.data.participants[8].summonerName,
                            summonerId: response.data.participants[8].summonerId,
                            teamId: response.data.participants[8].teamId,
                            championId: response.data.participants[8].championId
                        },
                        {
                            summonerName: response.data.participants[9].summonerName,
                            summonerId: response.data.participants[9].summonerId,
                            teamId: response.data.participants[9].teamId,
                            championId: response.data.participants[9].championId
                        }
                    ]
                })
                const temporary_matchId = response.data.platformId+"_"+response.data.gameId;
                await extractedData.save();
                
                //get all participants ranks and wins/losses count and add it on to extractedData
                for(let i = 0; i<10; i++){
                //sometimes this api request returns flex rank instead of solo rank
                axios.get(PLATFORM_ROUTING_VALUE_KR+"/lol/league/v4/entries/by-summoner/"+extractedData.participants[i].summonerId+"?api_key="+API_KEY)
                    .then(async(response)=>{
                        let temporary_extracted_data = response.data;
                        let dataObject = await MatchData.findOne({matchId: temporary_matchId})
                        
                            //if player is unranked .find() should return undefined
                            if(temporary_extracted_data.find(x=>x.queueType==='RANKED_SOLO_5x5') === undefined){
                                dataObject.participants[i].tier = "Unranked"
                                dataObject.participants[i].rank = "Unranked"
                                dataObject.participants[i].leaguePoints = 0
                                if(dataObject.participants[i].summonerId === Summoner_Id_IN_USE){
                                  dataObject.mainPlayerTier = "Unranked"
                                  dataObject.mainPlayerRank = "Unranked"
                                  dataObject.mainPlayerLeaguePoints = 0
                                  await dataObject.save();
                                }
                                await dataObject.save();
                            } else{
                                dataObject.participants[i].tier = temporary_extracted_data.find(x=>x.queueType==='RANKED_SOLO_5x5').tier
                                dataObject.participants[i].rank = temporary_extracted_data.find(x=>x.queueType==='RANKED_SOLO_5x5').rank;
                                dataObject.participants[i].leaguePoints = temporary_extracted_data.find(x=>x.queueType==='RANKED_SOLO_5x5').leaguePoints;
                                dataObject.participants[i].wins = temporary_extracted_data.find(x=>x.queueType==='RANKED_SOLO_5x5').wins;
                                dataObject.participants[i].losses = temporary_extracted_data.find(x=>x.queueType==='RANKED_SOLO_5x5').losses;
                                await dataObject.save();
                                if(dataObject.participants[i].summonerId === Summoner_Id_IN_USE){
                                  dataObject.mainPlayerTier = temporary_extracted_data.find(x=>queueType === "RANKED_SOLO_5x5").tier
                                  dataObject.mainPlayerRank = temporary_extracted_data.find(x=>queueType === "RANKED_SOLO_5x5").rank
                                  dataObject.mainPlayerLeaguePoints = temporary_extracted_data.find(x=>queueType === "RANKED_SOLO_5x5").leaguePoints
                                  dataObject.mainPlayerWins = temporary_extracted_data.find(x=>queueType === "RANKED_SOLO_5x5").wins
                                  dataObject.mainPlayerLosses = temporary_extracted_data.find(x=>queueType === "RANKED_SOLO_5x5").losses
                                  await dataObject.save();
                                }
                            }                           
                    }).catch(err=>err)
                }
            }
        
            //calculateAverageRank("KR_"+response.data.gameId);
        }).catch(err=>err)
}



//get lpRequirement every 2hrs 
getLpRequirement();
const interval_getLpRequirement = setInterval(function(){
    getLpRequirement();
}, 7200000)

//get liveGameInfo every 1min
getMatchInfoFromLiveGame(Summoner_Id_IN_USE)
const interval = setInterval(function(){
    getMatchInfoFromLiveGame(Summoner_Id_IN_USE);
    console.log("running")
}, 60000)










async function data_collect_profile(){
  let PlayerTier = ""
  let PlayerRank = ""
  let PlayerLP = 0
  let PlayerWins = 0
  let PlayerLosses = 0

  //grab the latest document created 
  let databaseDocument1 = await MatchData.find({mainPlayerSummonerId: Summoner_Id_IN_USE}).sort({createdAt: -1}).limit(1)

  for(let i = 0; i<10; i++){
    if(databaseDocument1.participants[i].summonerId = Summoner_Id_IN_USE){
      PlayerTier = databaseDocument1.participants[i].tier
      PlayerRank = databaseDocument1.participants[i].rank
      PlayerLP = databaseDocument1.participants[i].leaguePoints
      PlayerWins = databaseDocument1.participants[i].wins
      PlayerLosses = databaseDocument1.participants[i].losses
    }
  }

  //grab the latest document created 
  let databaseDocument2 = await LpRequirement.find().sort({createdAt: -1}).limit(1)
  let challengerLpRequirement = databaseDocument2.challengerLpRequirement
  //let grandmasterLpRequirement = databaseDocument2.grandmasterLpRequirement
}



async function data_collect_stats(){
    //Games Played
    let Games_Played = await MatchData.count({mainPlayerSummonerId: Summoner_Id_IN_USE})
    //Time Spent in Games
    let Time_Spent_in_Games = await MatchData.aggregate([{
        $match:{mainPlayerSummonerId: Summoner_Id_IN_USE},
        $group:{
            _id: null,
            total:{
                $sum: $gameDuration
            }
        }
    }])
    //KDA
    let kill_count = await MatchData.aggregate([{
        $match:{participants: {$elemMatch: {summonerId:Summoner_Id_IN_USE}}},
        $group: {
            _id: null,
            total:{
                $sum: $kills
            }
        }
    }])
      //death_count excludes executions
    let death_count = await MatchData.aggregate([{
      $match:{participants: {$elemMatch: {summonerId:Summoner_Id_IN_USE}}},
      $group: {
          _id: null,
          total:{
              $sum: $deathsByEnemyChamps
          }
      }
  }])
  let assist_count = await MatchData.aggregate([{
    $match:{participants: {$elemMatch: {summonerId:Summoner_Id_IN_USE}}},
    $group: {
        _id: null,
        total:{
            $sum: $assists
        }
    }
}])
    //Unique Champions Played
    const champions = [
        {
          version: "12.8.1",
          name: "Aatrox",
          key: 266,
        },
        {
          version: "12.8.1",
          name: "Ahri",
          key: 103,
        },
        {
          version: "12.8.1",
          name: "Akali",
          key: 84,
        },
        {
          version: "12.8.1",
          name: "Akshan",
          key: 166,
        },
        {
          version: "12.8.1",
          name: "Alistar",
          key: 12,
        },
        {
          version: "12.8.1",
          name: "Amumu",
          key: 32,
        },
        {
          version: "12.8.1",
          name: "Anivia",
          key: 34,
        },
        {
          version: "12.8.1",
          name: "Annie",
          key: 1,
        },
        {
          version: "12.8.1",
          name: "Aphelios",
          key: 523,
        },
        {
          version: "12.8.1",
          name: "Ashe",
          key: 22,
        },
        {
          version: "12.8.1",
          name: "AurelionSol",
          key: 136,
        },
        {
          version: "12.8.1",
          name: "Azir",
          key: 268,
        },
        {
          version: "12.8.1",
          name: "Bard",
          key: 432,
        },
        {
          version: "12.8.1",
          name: "Blitzcrank",
          key: 53,
        },
        {
          version: "12.8.1",
          name: "Brand",
          key: 63,
        },
        {
          version: "12.8.1",
          name: "Braum",
          key: 201,
        },
        {
          version: "12.8.1",
          name: "Caitlyn",
          key: 51,
        },
        {
          version: "12.8.1",
          name: "Camille",
          key: 164,
        },
        {
          version: "12.8.1",
          name: "Cassiopeia",
          key: 69,
        },
        {
          version: "12.8.1",
          name: "Chogath",
          key: 31,
        },
        {
          version: "12.8.1",
          name: "Corki",
          key: 42,
        },
        {
          version: "12.8.1",
          name: "Darius",
          key: 122,
        },
        {
          version: "12.8.1",
          name: "Diana",
          key: 131,
        },
        {
          version: "12.8.1",
          name: "Draven",
          key: 119,
        },
        {
          version: "12.8.1",
          name: "DrMundo",
          key: 36,
        },
        {
          version: "12.8.1",
          name: "Ekko",
          key: 245,
        },
        {
          version: "12.8.1",
          name: "Elise",
          key: 60,
        },
        {
          version: "12.8.1",
          name: "Evelynn",
          key: 28,
        },
        {
          version: "12.8.1",
          name: "Ezreal",
          key: 81,
        },
        {
          version: "12.8.1",
          name: "Fiddlesticks",
          key: 9,
        },
        {
          version: "12.8.1",
          name: "Fiora",
          key: 114,
        },
        {
          version: "12.8.1",
          name: "Fizz",
          key: 105,
        },
        {
          version: "12.8.1",
          name: "Galio",
          key: 3,
        },
        {
          version: "12.8.1",
          name: "Gangplank",
          key: 41,
        },
        {
          version: "12.8.1",
          name: "Garen",
          key: 86,
        },
        {
          version: "12.8.1",
          name: "Gnar",
          key: 150,
        },
        {
          version: "12.8.1",
          name: "Gragas",
          key: 79,
        },
        {
          version: "12.8.1",
          name: "Graves",
          key: 104,
        },
        {
          version: "12.8.1",
          name: "Gwen",
          key: 887,
        },
        {
          version: "12.8.1",
          name: "Hecarim",
          key: 120,
        },
        {
          version: "12.8.1",
          name: "Heimerdinger",
          key: 74,
        },
        {
          version: "12.8.1",
          name: "Illaoi",
          key: 420,
        },
        {
          version: "12.8.1",
          name: "Irelia",
          key: 39,
        },
        {
          version: "12.8.1",
          name: "Ivern",
          key: 427,
        },
        {
          version: "12.8.1",
          name: "Janna",
          key: 40,
        },
        {
          version: "12.8.1",
          name: "JarvanIV",
          key: 59,
        },
        {
          version: "12.8.1",
          name: "Jax",
          key: 24,
        },
        {
          version: "12.8.1",
          name: "Jayce",
          key: 126,
        },
        {
          version: "12.8.1",
          name: "Jhin",
          key: 202,
        },
        {
          version: "12.8.1",
          name: "Jinx",
          key: 222,
        },
        {
          version: "12.8.1",
          name: "Kaisa",
          key: 145,
        },
        {
          version: "12.8.1",
          name: "Kalista",
          key: 429,
        },
        {
          version: "12.8.1",
          name: "Karma",
          key: 43,
        },
        {
          version: "12.8.1",
          name: "Karthus",
          key: 30,
        },
        {
          version: "12.8.1",
          name: "Kassadin",
          key: 38,
        },
        {
          version: "12.8.1",
          name: "Katarina",
          key: 55,
        },
        {
          version: "12.8.1",
          name: "Kayle",
          key: 10,
        },
        {
          version: "12.8.1",
          name: "Kayn",
          key: 141,
        },
        {
          version: "12.8.1",
          name: "Kennen",
          key: 85,
        },
        {
          version: "12.8.1",
          name: "Kha'Zix",
          key: 121,
        },
        {
          version: "12.8.1",
          name: "Kindred",
          key: 203,
        },
        {
          version: "12.8.1",
          name: "Kled",
          key: 240,
        },
        {
          version: "12.8.1",
          name: "Kog'Maw",
          key: 96,
        },
        {
          version: "12.8.1",
          name: "Leblanc",
          key: 7,
        },
        {
          version: "12.8.1",
          name: "LeeSin",
          key: 64,
        },
        {
          version: "12.8.1",
          name: "Leona",
          key: 89,
        },
        {
          version: "12.8.1",
          name: Lillia,
        },
        {
          version: "12.8.1",
          name: "Lissandra",
          key: 127,
        },
        {
          version: "12.8.1",
          name: "Lucian",
          key: 236,
        },
        {
          version: "12.8.1",
          name: "Lulu",
          key: 117,
        },
        {
          version: "12.8.1",
          name: "Lux",
          key: 99,
        },
        {
          version: "12.8.1",
          name: "Malphite",
          key: 54,
        },
        {
          version: "12.8.1",
          name: "Malzahar",
          key: 90,
        },
        {
          version: "12.8.1",
          name: "Maokai",
          key: 57,
        },
        {
          version: "12.8.1",
          name: "MasterYi",
          key: 11,
        },
        {
          version: "12.8.1",
          name: "MissFortune",
          key: 21,
        },
        {
          version: "12.8.1",
          name: "Wukong",
          key: 62,
        },
        {
          version: "12.8.1",
          name: "Mordekaiser",
          key: 82,
        },
        {
          version: "12.8.1",
          name: "Morgana",
          key: 25,
        },
        {
          version: "12.8.1",
          name: "Nami",
          key: 267,
        },
        {
          version: "12.8.1",
          name: "Nasus",
          key: 75,
        },
        {
          version: "12.8.1",
          name: "Nautilus",
          key: 111,
        },
        {
          version: "12.8.1",
          name: "Neeko",
          key: 518,
        },
        {
          version: "12.8.1",
          name: "Nidalee",
          key: 76,
        },
        {
          version: "12.8.1",
          name: "Nocturne",
          key: 56,
        },
        {
          version: "12.8.1",
          name: "Nunu",
          key: 20,
        },
        {
          version: "12.8.1",
          name: "Olaf",
          key: 2,
          name: "Olaf",
        },
        {
          version: "12.8.1",
          name: "Orianna",
          key: 61,
        },
        {
          version: "12.8.1",
          name: "Ornn",
          key: 516,
        },
        {
          version: "12.8.1",
          name: "Pantheon",
          key: 80,
        },
        {
          version: "12.8.1",
          name: "Poppy",
          key: 78,
        },
        {
          version: "12.8.1",
          name: "Pyke",
          key: 555,
        },
        {
          version: "12.8.1",
          name: "Qiyana",
          key: 246,
        },
        {
          version: "12.8.1",
          name: "Quinn",
          key: 133,
        },
        {
          version: "12.8.1",
          name: "Rakan",
          key: 497,
        },
        {
          version: "12.8.1",
          name: "Rammus",
          key: 33,
        },
        {
          version: "12.8.1",
          name: "RekSai",
          key: 421,
        },
        {
          version: "12.8.1",
          name: "Rell",
          key: 526,
        },
        {
          version: "12.8.1",
          name: "Renata",
          key: 888,
        },
        {
          version: "12.8.1",
          name: "Renekton",
          key: 58,
        },
        {
          version: "12.8.1",
          name: "Rengar",
          key: 107,
        },
        {
          version: "12.8.1",
          name: "Riven",
          key: 92,
        },
        {
          version: "12.8.1",
          name: "Rumble",
          key: 68,
        },
        {
          version: "12.8.1",
          name: "Ryze",
          key: 13,
        },
        {
          version: "12.8.1",
          name: "Samira",
          key: 360,
        },
        {
          version: "12.8.1",
          name: "Sejuani",
          key: 113,
        },
        {
          version: "12.8.1",
          name: "Senna",
          key: 235,
        },
        {
          version: "12.8.1",
          name: "Seraphine",
          key: 147,
        },
        {
          version: "12.8.1",
          name: "Sett",
          key: 875,
        },
        {
          version: "12.8.1",
          name: "Shaco",
          key: 35,
        },
        {
          version: "12.8.1",
          name: "Shen",
          key: 98,
        },
        {
          version: "12.8.1",
          name: "Shyvana",
          key: 102,
        },
        {
          version: "12.8.1",
          name: "Singed",
          key: 27,
        },
        {
          version: "12.8.1",
          name: "Sion",
          key: 14,
        },
        {
          version: "12.8.1",
          name: "Sivir",
          key: 15,
        },
        {
          version: "12.8.1",
          name: "Skarner",
          key: 72,
        },
        {
          version: "12.8.1",
          name: "Sona",
          key: 37,
        },
        {
          version: "12.8.1",
          name: "Soraka",
          key: 16,
        },
        {
          version: "12.8.1",
          name: "Swain",
          key: 50,
        },
        {
          version: "12.8.1",
          name: "Sylas",
          key: 517,
        },
        {
          version: "12.8.1",
          name: "Syndra",
          key: 134,
        },
        {
          version: "12.8.1",
          name: "TahmKench",
          key: 223,
        },
        {
          version: "12.8.1",
          name: "Taliyah",
          key: 163,
        },
        {
          version: "12.8.1",
          name: "Talon",
          key: 91,
        },
        {
          version: "12.8.1",
          name: "Taric",
          key: 44,
        },
        {
          version: "12.8.1",
          name: "Teemo",
          key: 17,
        },
        {
          version: "12.8.1",
          name: "Thresh",
          key: 412,
        },
        {
          version: "12.8.1",
          name: "Tristana",
          key: 18,
        },
        {
          version: "12.8.1",
          name: "Trundle",
          key: 48,
        },
        {
          version: "12.8.1",
          name: "Tryndamere",
          key: 23,
        },
        {
          version: "12.8.1",
          name: "TwistedFate",
          key: 4,
        },
        {
          version: "12.8.1",
          name: "Twitch",
          key: 29,
        },
        {
          version: "12.8.1",
          name: "Udyr",
          key: 77,
        },
        {
          version: "12.8.1",
          name: "Urgot",
          key: 6,
        },
        {
          version: "12.8.1",
          name: "Varus",
          key: 110,
        },
        {
          version: "12.8.1",
          name: "Vayne",
          key: 67,
        },
        {
          version: "12.8.1",
          name: "Veigar",
          key: 45,
        },
        {
          version: "12.8.1",
          name: "Velkoz",
          key: 161,
        },
        {
          version: "12.8.1",
          name: "Vex",
          key: 711,
        },
        {
          version: "12.8.1",
          name: "Vi",
          key: 254,
        },
        {
          version: "12.8.1",
          name: "Viego",
          key: 234,
        },
        {
          version: "12.8.1",
          name: "Viktor",
          key: 112,
        },
        {
          version: "12.8.1",
          name: "Vladimir",
          key: 8,
        },
        {
          version: "12.8.1",
          name: "Volibear",
          key: 106,
        },
        {
          version: "12.8.1",
          name: "Warwick",
          key: 19,
        },
        {
          version: "12.8.1",
          name: "Xayah",
          key: 498,
        },
        {
          version: "12.8.1",
          name: "Xerath",
          key: 101,
        },
        {
          version: "12.8.1",
          name: "XinZhao",
          key: 5,
        },
        {
          version: "12.8.1",
          name: "Yasuo",
          key: 157,
        },
        {
          version: "12.8.1",
          name: "Yone",
          key: 777,
        },
        {
          version: "12.8.1",
          name: "Yorick",
          key: 83,
        },
        {
          version: "12.8.1",
          name: "Yuumi",
          key: 350,
        },
        {
          version: "12.8.1",
          name: "Zac",
          key: 154,
        },
        {
          version: "12.8.1",
          name: "Zed",
          key: 238,
        },
        {
          version: "12.8.1",
          name: "Zeri",
          key: 221,
        },
        {
          version: "12.8.1",
          name: "Ziggs",
          key: 115,
        },
        {
          version: "12.8.1",
          name: "Zilean",
          key: 26,
        },
        {
          version: "12.8.1",
          name: "Zoe",
          key: 142,
        },
        {
          version: "12.8.1",
          name: "Zyra",
          key: 143,
        },
      ];
    let temp_counter = 0
    for(let i=0; i<159; i++){
        //159 champions in league

        let champplayeddata = await MatchData.find({participants:{$elemMatch:{summonerId:Summoner_Id_IN_USE, championId:champions[i].key}}})
        //only count champ as unique champion played if it has 10+ games 
        if(champplayeddata.length>=10){
            temp_counter = temp_counter+1
        }
    }
    console.log(temp_counter)
    //Penta kill
    let penta_kill_count = await MatchData.aggregate([{
        $match:{participants: {$elemMatch: {summonerId:Summoner_Id_IN_USE}}},
        $group: {
            _id: null,
            total:{
                $sum: $pentaKills
            }
        }
    }])



    console.log("games played: "+ Games_Played)
    console.log("time spent in games: "+ Time_Spent_in_Games)
    console.log("Kills: "+kill_count)
    console.log("Unique Champs"+temp_counter)

}




//update data values
async function data_collect_charts(){
  let data_TOP = await MatchData.find({participants: {$elemMatch: {summonerId:Summoner_Id_IN_USE, $or: [{participantId: 1}, {participantId: 6}]}}})
  let data_JG =  await MatchData.find({participants: {$elemMatch: {summonerId:Summoner_Id_IN_USE, $or: [{participantId: 2}, {participantId: 7}]}}})
  let data_MID = await MatchData.find({participants: {$elemMatch: {summonerId:Summoner_Id_IN_USE, $or: [{participantId: 3}, {participantId: 8}]}}})
  let data_BOT = await MatchData.find({participants: {$elemMatch: {summonerId:Summoner_Id_IN_USE, $or: [{participantId: 4}, {participantId: 9}]}}})
  let data_SUP = await MatchData.find({participants: {$elemMatch: {summonerId:Summoner_Id_IN_USE, $or: [{participantId: 5}, {participantId: 10}]}}})
  
  let TotalNumberOfGames = await MatchData.count({mainPlayerSummonerId: Summoner_Id_IN_USE})
      
  let NumberOfGames_TOP =  data_TOP.length
  let NumberOfGames_JG =  data_JG.length
  let NumberOfGames_MID = data_MID.length
  let NumberOfGames_BOT = data_BOT.length
  let NumberOfGames_SUP = data_SUP.length
  
  let NumberOfWins_TOP = await MatchData.find({participants: {$elemMatch: {summonerId:Summoner_Id_IN_USE, $or: [{participantId: 1}, {participantId: 6}], win:true}}})
  let NumberOfWins_JG =  await MatchData.find({participants: {$elemMatch: {summonerId:Summoner_Id_IN_USE, $or: [{participantId: 2}, {participantId: 7}], win:true}}})
  let NumberOfWins_MID = await MatchData.find({participants: {$elemMatch: {summonerId:Summoner_Id_IN_USE, $or: [{participantId: 3}, {participantId: 8}], win:true}}})
  let NumberOfWins_BOT = await MatchData.find({participants: {$elemMatch: {summonerId:Summoner_Id_IN_USE, $or: [{participantId: 4}, {participantId: 9}], win:true}}})
  let NumberOfWins_SUP = await MatchData.find({participants: {$elemMatch: {summonerId:Summoner_Id_IN_USE, $or: [{participantId: 5}, {participantId: 10}], win:true}}})

  //Role Assignment
  let Role_Assignment_TOP = Math.round(NumberOfGames_TOP*1000/TotalNumberofGames)/10
  let Role_Assignment_JG =  Math.round(NumberOfGames_JG*1000/TotalNumberofGames)/10
  let Role_Assignment_MID = Math.round(NumberOfGames_MID*1000/TotalNumberofGames)/10
  let Role_Assignment_BOT = Math.round(NumberOfGames_BOT*1000/TotalNumberofGames)/10
  let Role_Assignment_SUP = Math.round(NumberOfGames_SUP*1000/TotalNumberofGames)/10

  //Win Rate per Role
  let Win_Rate_TOP = Math.round(NumberOfWins_TOP*1000/NumberOfGames_TOP)/10
  let Win_Rate_JG = Math.round(NumberOfWins_JG*1000/NumberOfGames_TOP)/10
  let Win_Rate_MID = Math.round(NumberOfWins_MID*1000/NumberOfGames_TOP)/10
  let Win_Rate_BOT = Math.round(NumberOfWins_BOT*1000/NumberOfGames_TOP)/10
  let Win_Rate_SUP = Math.round(NumberOfWins_SUP*1000/NumberOfGames_TOP)/10
}


async function getDataForLpClimbGraph(Summoner_ID){
    let allGameData = await MatchData.find({mainPlayerSummonerId: Summoner_ID})
}

