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




//Riot API Key
const API_KEY = "RGAPI-4e11ade0-700e-493e-b6e1-0145423b3111";

const PLATFORM_ROUTING_VALUE_NA = "https://na1.api.riotgames.com";
const PLATFORM_ROUTING_VALUE_KR = "https://kr.api.riotgames.com";
const REGIONAL_ROUTING_VALUE_AMERICAS = "https://americas.api.riotgames.com";
const REGIONAL_ROUTING_VALUE_ASIA = "https://asia.api.riotgames.com";

const PUUID_Tyler1 ="";
const PUUID_Monster_Rat = "LTA_R2kMkE2_ID1kHk548Skn3ghahPjnZjbNuscpxXsOgcnc4Zx9__KYzDoqEwrf4OkCRbTQBr0vvQ";
const PUUID_TF_Blade = "ti_ymO1OhlkhIVTbUac9S9OKDKzjTWtEfuS-dRFJFpJphS8sP9xtvOWbnbUQYQj01pmUeSCzK9ICXQ"
const PUUID_CvMax = "UDatzjFxuWmdtEWaJZfaYpObALvEJjZi02yw3Es6_4tU6YMGJGd7EIyFdo5mL1IX-SBrr8VMZg1qhA"
const PUUID_OdinH = "emc59JHj1cEGSjhamAw-VHxq2xrdJP91bW6dmZUI5si7yzVj1SVb20HIFnQuKaOGHXRNrlbxjnnpFA";

const summoner_Id_Tyler1 ="";
const Summoner_Id_Monster_Rat = "SH7_n-u4xYyYP8eBvwJ2b2VYCyGwAJJX1Li8nFGlF4v7Ag"
const Summoner_Id_TF_Blade = "0GCVVBy6TJyedu8OR_cl6q-9eKpI8pMHRc7ZmqmgTyzEkN0jGn7dlPr1pw"
const Summoner_Id_CvMAx = "bfG-EWc6Zw807WXYxfdmFozS1Mi0gM5BSjgHTBlhObi5mw"
const Summoner_Id_OdinH = "ONoisfMZ7kCfgy7u0ZwLji6ZNBDRJshn-4OEPKhz-p8RqX665LAs2QblSg"

const Summoner_Id_IN_USE = summoner_Id_Tyler1;
const PUUID_IN_USE = PUUID_Tyler1;


const global_match_data = [];


    


//get PUUUID using SummonerName
function getPUUIDbySummonerName(summoner_name){
    return axios.get(PLATFORM_ROUTING_VALUE_KR+"/lol/summoner/v4/summoners/by-name/"+summoner_name+"?api_key="+API_KEY)
        .then(response=>{
            //console.log(response.data);
            return response.data.puuid
        }).catch(err=>err);
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

 
//get all games 
//this will only need to be run once when the server starts 
let matchIdArray = [];
function getAllMatchId(PUUID){
    //get SummonerId using PUUID for getting number of ranked games 
    // using this API: lol/summoner/v4/summoners/by-puuid/{encryptedPUUID}
    axios.get(PLATFORM_ROUTING_VALUE_KR+"/lol/summoner/v4/summoners/by-puuid/"+PUUID+"?api_key="+API_KEY)
        .then(response=>{
            let summonerId = response.data.id
            ////console.log("summonerId: "+summonerId);
            
            //then find total number of ranked games using summonerId retrieved
            axios.get(PLATFORM_ROUTING_VALUE_KR+"/lol/league/v4/entries/by-summoner/"+summonerId+"?api_key="+API_KEY)
                .then(response=>{
                    console.log(response.data)
                    //the reponse from riot API comes back as nameless array, so I need to make an array and shove the response so i can access the data inside it
                    let temporary_array_1 = response.data;

                    let totalNumberofGames = temporary_array_1[0].wins + temporary_array_1[0].losses;
                    //console.log(totalNumberofGames);


                    //then use totalNumberofGames to get all the past ranked games matchIds
                    //run loop by manipulating start value and count value to get all the past games' matchId
                
                    //loop through to get matchIds in increments of 100
                    
                    for(let i=0; totalNumberofGames-i>=100; i+=100){
                        axios.get(REGIONAL_ROUTING_VALUE_ASIA+"/lol/match/v5/matches/by-puuid/"+PUUID+"/ids?type=ranked&start="+i.toString()+"&count=100"+"&api_key="+API_KEY)
                            .then(response=>{
                                let temporary_array_2 = response.data;
                                matchIdArray.push(...temporary_array_2)
                            }).catch(err=>err)
                    }
                    //get left over matchIds that are less than 100
                    let matches_start_index = 100*Math.floor(totalNumberofGames/100)
                    let matches_remainder = totalNumberofGames%100;
                    axios.get(REGIONAL_ROUTING_VALUE_ASIA+"/lol/match/v5/matches/by-puuid/"+PUUID+"/ids?type=ranked&start="+matches_start_index.toString()+"&count="+matches_remainder.toString()+"&api_key="+API_KEY)
                        .then(response=>{
                            matchIdArray.push(...response.data);
                        }).catch(err=>err)
                }).catch(err=>err);
        }).catch(err=>err);

}
//getAllMatchId(PUUID_IN_USE);


//get info from a match and only extract and save relevant data, some of the data i need isn't requires other api requests
async function getSingleMatchInfo(MatchId){
    return axios.get(REGIONAL_ROUTING_VALUE_ASIA+"/lol/match/v5/matches/"+MatchId+"?api_key="+API_KEY)
        .then(async response=>{
            let hi = await MatchData.exists({matchId: response.data.matchId})
            if(hi){
                //if matchId already exists in database then update values
                let something = await MatchData.findOne({matchId: response.data.matchId})
                something.gameStartTimestamp = response.data.info.gameStartTimestamp
                something.gameDuration = response.data.info.gameDuration
                await something.save();
                //loop through participants and update data
                for(let i = 0; i < 10; i++){
                    something.participants[i].participantId = response.data.info.participants[i].participantId
                    something.participants[i].teamPosition = response.data.info.participants[i].teamPosition
                    something.participants[i].puuid = response.data.info.participants[i].puuid
                    something.participants[i].win = response.data.info.participants[i].win
                    something.participants[i].championName = response.data.info.participants[i].championName
                    something.participants[i].kills = response.data.info.participants[i].kills
                    something.participants[i].deaths = response.data.info.participants[i].deaths
                    something.participants[i].deathsByEnemyChamps = response.data.info.participants[i].challenges.deathsByEnemyChamps
                    something.participants[i].assists = response.data.info.participants[i].assists
                    something.participants[i].totalMinionsKilled = response.data.info.participants[i].totalMinionsKilled
                    something.participants[i].totalDamageDealtToChampions = response.data.info.participants[i].totalDamageDealtToChampions
                    something.participants[i].goldEarned = response.data.info.participants[i].goldEarned
                    something.participants[i].pentaKills = response.data.info.participants[i].pentaKills
                    something.participants[i].eligibleForProgression = response.data.info.participants[i].eligibleForProgression
                    await something.save();
                }
            } else{
                //if matchId don't exist in database then create a new data point
                //create data structure and extract relevant data
                const extractedData = new MatchData(
                    {
                        matchId: response.data.metadata.matchId,
                        gameStartTimestamp: response.data.info.gameStartTimestamp,
                        gameDuration: response.data.info.gameDuration,
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
            }
        }).catch(err=>err);
}
//getMatchInfo("KR_5876018566");

//loop through MatchIdArray which contains all the ranked matches ids of a player to create a big global variable
function getAllMatchInfo(match_id_array){
    for(let i=0; i<=match_id_array.length; i++){
        getSingleMatchInfo(match_id_array[i]);
    }
}



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

//get lpRequirement every 2hrs 
const interval_getLpRequirement = setInterval(function(){
    getLpRequirement();
}, 7200000)




//check if tyler is in a ranked game and get info from live game if in game
//loop this function every 30 seconds 
async function getMatchInfoFromLiveGame(SummonerId){
    axios.get(PLATFORM_ROUTING_VALUE_KR+"/lol/spectator/v4/active-games/by-summoner/"+SummonerId+"?api_key="+API_KEY)
        .then(async (response)=>{
            //if match data already exists then do nothing
            if(await MatchData.exists({matchId: response.data.matchId})){
                console.log("match data already in database")
            } else {
                //add the new data in if the match data dont exists yet
                const extractedData = new MatchData({
                    mainPlayerSummonerId: SummonerId,
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
                        let something = await MatchData.findOne({matchId: temporary_matchId})
                            //if player is unranked .find() should return undefined
                            if(temporary_extracted_data.find(x=>x.queueType==='RANKED_SOLO_5x5') == undefined){
                                something.participants[i].tier = "Unranked"
                                await something.save();
                            } else{
                                something.participants[i].tier = temporary_extracted_data.find(x=>x.queueType==='RANKED_SOLO_5x5').tier
                                something.participants[i].rank = temporary_extracted_data.find(x=>x.queueType==='RANKED_SOLO_5x5').rank;
                                something.participants[i].leaguePoints = temporary_extracted_data.find(x=>x.queueType==='RANKED_SOLO_5x5').leaguePoints;
                                something.participants[i].wins = temporary_extracted_data.find(x=>x.queueType==='RANKED_SOLO_5x5').wins;
                                something.participants[i].losses = temporary_extracted_data.find(x=>x.queueType==='RANKED_SOLO_5x5').losses;
                                await something.save();
                            }                           
                    }).catch(err=>err)
                }
            }
        }).catch(err=>err)
}

async function calculateAverageRank(matchId){
    let databaseObject = await MatchData.findOne({matchId: matchId})
    const unrankedPlayerCount = 0
    const summedPlayerConvertedRank = 0
    const convertedPlayerRank_array = [];

    for(let i = 0; i<10; i++){
        //if player is unranked
        if(databaseObject.participants[i]==="Unranked"){
            unrankedPlayerCount = unrankedPlayerCount+1;
        } else{
        //if player is ranked convert ranks in to a single number
            let playerTier = databaseObject.participants[i].tier
            let playerRank = databaseObject.participants[i].rank
            let playerLP = databaseObject.participants[i].leaguePoints
            let convertedPlayerTier = 0;
            let convertedPlayerRank = 0;
            let convertedPlayerLP = 0;

            //convert playerTier into number
            if(playerTier==="CHALLENGER"||playerTier==="GRANDMASTER"||playerTier==="MASTER"){convertedPlayerTier = 2400}
            else if(playerTier==="DIAMOND"){convertedPlayerTier=2000}
            else if(playerTier==="PLATINUM"){convertedPlayerTier=1600}
            else if(playerTier==="GOLD"){convertedPlayerTier=1200}
            else if(playerTier==="SILVER"){convertedPlayerTier=800}
            else if(playerTier==="BRONZE"){convertedPlayerTier=400}
            else if(playerTier==="IRON"){convertedPlayerTier=0}
            //convert playerRank into number
            if(playerRank==="IV"){convertedPlayerRank = 100}
            else if (playerRank==="III"){convertedPlayerRank = 200}
            else if (playerRank==="II"){convertedPlayerRank = 300}
            else if (playerRank==="I"){convertedPlayerRank = 400}
            //convert leaguePoints(if negative due to dodges make it 0)
            if(playerLP<0){convertedPlayerLP = 0}
            else {convertedPlayerLP = playerLP}}

            //push to convertedPlayerRank_array 
            convertedPlayerRank_array.push(convertedPlayerTier+convertedPlayerRank+convertedPlayerLP)
            //sum all converted variables and add it to summedPlayerConvertedRank
            summedPlayerConvertedRank = summedPlayerConvertedRank + convertedPlayerTier + convertedPlayerRank + convertedPlayerLP
        }
    let averageConvertedRank = summedPlayerConvertedRank/(10-unrankedPlayerCount)
    databaseObject.averageConvertedRank = averageConvertedRank

    //calculate average tier 
    //lp requirement should be calculated somewhere else using ladder rank 
    let averageTier = ""
    let averageRank = ""
    let averageLP = ""
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
}




//loop the function every 1min
const interval = setInterval(function(){
    getMatchInfoFromLiveGame(Summoner_Id_IN_USE);
    getMatchInfoFromLiveGame(Summoner_Id_OdinH);
}, 60000)

