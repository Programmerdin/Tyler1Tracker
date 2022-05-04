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
