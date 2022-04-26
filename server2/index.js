var express = require('express');
var cors = require('cors');
const axios = require('axios');
const { response } = require('express');
const res = require('express/lib/response');
const mongoose = require('mongoose');
const MatchData = require('./models/match')

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
const API_KEY = "RGAPI-dfbd0838-3211-410f-9348-c7c610785cdb";

const PLATFORM_ROUTING_VALUE_NA = "https://na1.api.riotgames.com";
const PLATFORM_ROUTING_VALUE_KR = "https://kr.api.riotgames.com";
const REGIONAL_ROUTING_VALUE_AMERICAS = "https://americas.api.riotgames.com";
const REGIONAL_ROUTING_VALUE_ASIA = "https://asia.api.riotgames.com";

const PUUID_Tyler_1 ="";
const PUUID_Monster_Rat = "LTA_R2kMkE2_ID1kHk548Skn3ghahPjnZjbNuscpxXsOgcnc4Zx9__KYzDoqEwrf4OkCRbTQBr0vvQ";
const PUUID_Faker = "AOv1KD2L4-kAQJcN0Lq-1DCGEh4XqBrQ5ve7lxh6RPCdUPzhslxc8qrdGlpMr-kRcHJygyZBvFG99A";
const PUUID_Ruler = "hf_rTJQ-rVmQVgYjy2K6OvDVwDl0KaptmsOZ64Rn8acpTDgrKFT6kCT5q1IUWYO9LUb2abqJVK_rAw"
const PUUID_TF_Blade = "ti_ymO1OhlkhIVTbUac9S9OKDKzjTWtEfuS-dRFJFpJphS8sP9xtvOWbnbUQYQj01pmUeSCzK9ICXQ"
const PUUID_Viet_ANh = "6O2_UJNwD6dlj6ZEbHGVXCExkCLvVdL9Fn7itOaMd0eTpt9-bpZ7RKWnTg3hUZKZdCxIbMiewl9Oew"
const PUUID_danjuan_rose = "74VcbSFoPTjiCIYNNdh7tTFeVm_aqjSBR4U-hU_JbOIgb7HoJmAq9I15JgfLVnU5TjYetbri71XZSQ"
const PUUID_Rascal = "5xzVlMs2h5cFQupbbUa3iVJBsW0izZM_fYSKBzwn1YSGvBqtNK9x6w3wzSrZVKzwmNNJP2TRApN6fQ"
const PUUID_CvMax = "UDatzjFxuWmdtEWaJZfaYpObALvEJjZi02yw3Es6_4tU6YMGJGd7EIyFdo5mL1IX-SBrr8VMZg1qhA"
const PUUID_OdinH = "emc59JHj1cEGSjhamAw-VHxq2xrdJP91bW6dmZUI5si7yzVj1SVb20HIFnQuKaOGHXRNrlbxjnnpFA";

const Summoner_Id_Monster_Rat = "SH7_n-u4xYyYP8eBvwJ2b2VYCyGwAJJX1Li8nFGlF4v7Ag"
const Summoner_Id_TF_Blade = "0GCVVBy6TJyedu8OR_cl6q-9eKpI8pMHRc7ZmqmgTyzEkN0jGn7dlPr1pw"
const Summoner_Id_Viet_Anh = "uiijRASQ-deXz4Ql2oX_xJC6Xzg3_ra23Z0QC9cT15Woc-M"
const Summoner_Id_danjuan_rose = "lMB4QPna0exoTr1rgMdkTuHxZQ3cJ1Rb5EukZHWSXuoK9_g7cbod9MNwbQ"
const Summoner_Id_Rascal = "cVQAZ7zN3q6x5-CBTUkcbeSFRkhs0CFJjEqhrOtQZIJGMC0"
const Summoner_Id_CvMAx = "bfG-EWc6Zw807WXYxfdmFozS1Mi0gM5BSjgHTBlhObi5mw"
const Summoner_Id_OdinH = "ONoisfMZ7kCfgy7u0ZwLji6ZNBDRJshn-4OEPKhz-p8RqX665LAs2QblSg"

const Summoner_Id_IN_USE = Summoner_Id_OdinH;
const PUUID_IN_USE = PUUID_OdinH;


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
function getSingleMatchInfo(MatchId){
    return axios.get(REGIONAL_ROUTING_VALUE_ASIA+"/lol/match/v5/matches/"+MatchId+"?api_key="+API_KEY)
        .then(response=>{
            //create data structure and extract relevant data
            const extractedData = new MatchData(
                {
                    matchId: response.data.metadata.matchId,
                    gameStartTimestamp: response.data.info.gameStartTimestamp,
                    gameDuration: response.data.info.gameDuration,
                    participants: [
                        {
                            participantId: response.data.info.participants[0].participantId,
                            teamId: response.data.info.participants[0].teamId,
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
                            teamId: response.data.info.participants[1].teamId,
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
                            teamId: response.data.info.participants[2].teamId,
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
                            teamId: response.data.info.participants[3].teamId,
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
                            teamId: response.data.info.participants[4].teamId,
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
                            teamId: response.data.info.participants[5].teamId,
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
                            teamId: response.data.info.participants[6].teamId,
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
                            teamId: response.data.info.participants[7].teamId,
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
                            teamId: response.data.info.participants[8].teamId,
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
                            teamId: response.data.info.participants[9].teamId,
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
            extractedData.save();
        }).catch(err=>err);
}
//getMatchInfo("KR_5876018566");

//loop through MatchIdArray which contains all the ranked matches ids of a player to create a big global variable
function getAllMatchInfo(match_id_array){
    for(let i=0; i<=match_id_array.length; i++){
        getSingleMatchInfo(match_id_array[i]);
    }
}




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
                matchId: response.data.platformId+"_"+response.data.gameId,
                participants: [
                    {
                        summonerName: response.data.participants[0].summonerName,
                        summonerId: response.data.participants[0].summonerId,
                    },
                    {
                        summonerName: response.data.participants[1].summonerName,
                        summonerId: response.data.participants[1].summonerId,
                    },
                    {
                        summonerName: response.data.participants[2].summonerName,
                        summonerId: response.data.participants[2].summonerId,
                    },
                    {
                        summonerName: response.data.participants[3].summonerName,
                        summonerId: response.data.participants[3].summonerId,
                    },
                    {
                        summonerName: response.data.participants[4].summonerName,
                        summonerId: response.data.participants[4].summonerId,
                    },
                    {
                        summonerName: response.data.participants[5].summonerName,
                        summonerId: response.data.participants[5].summonerId,
                    },
                    {
                        summonerName: response.data.participants[6].summonerName,
                        summonerId: response.data.participants[6].summonerId,
                    },
                    {
                        summonerName: response.data.participants[7].summonerName,
                        summonerId: response.data.participants[7].summonerId,
                    },
                    {
                        summonerName: response.data.participants[8].summonerName,
                        summonerId: response.data.participants[8].summonerId,
                    },
                    {
                        summonerName: response.data.participants[9].summonerName,
                        summonerId: response.data.participants[9].summonerId,
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
                            console.log("player is unranked and saved data")
                            something.save();
                        } else{
                            something.participants[i].tier = temporary_extracted_data.find(x=>x.queueType==='RANKED_SOLO_5x5').tier
                            something.participants[i].rank = temporary_extracted_data.find(x=>x.queueType==='RANKED_SOLO_5x5').rank;
                            something.participants[i].leaguePoints = temporary_extracted_data.find(x=>x.queueType==='RANKED_SOLO_5x5').leaguePoints;
                            something.participants[i].wins = temporary_extracted_data.find(x=>x.queueType==='RANKED_SOLO_5x5').wins;
                            something.participants[i].losses = temporary_extracted_data.find(x=>x.queueType==='RANKED_SOLO_5x5').losses;
                            something.save();
                            console.log("player is ranked and saved data");
                        }                           
                }).catch(err=>err)
            }
        }
    }).catch(err=>err)
}
getMatchInfoFromLiveGame(Summoner_Id_IN_USE);

//get live game data
