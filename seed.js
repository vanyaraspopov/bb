const bb = require('./binance-bot');

const AggTrade = bb.models['AggTrade'];
const Currency = bb.models['Currency'];
const Symb = bb.models['Symb'];
const Module = bb.models['Module'];
const ModuleParameters = bb.models['ModuleParameters'];

let symbols = [
    {
        "id": 1,
        "quot": "DASH",
        "base": "BTC"
    },
    {
        "id": 2,
        "quot": "WAVES",
        "base": "BTC"
    },
    {
        "id": 3,
        "quot": "ZIL",
        "base": "BTC"
    },
    {
        "id": 4,
        "quot": "EOS",
        "base": "BTC"
    },
    {
        "id": 5,
        "quot": "XMR",
        "base": "BTC"
    },
    {
        "id": 6,
        "quot": "MTL",
        "base": "BTC"
    },
    {
        "id": 7,
        "quot": "VEN",
        "base": "BTC"
    },
    {
        "id": 8,
        "quot": "LSK",
        "base": "BTC"
    },
    {
        "id": 9,
        "quot": "SUB",
        "base": "BTC"
    },
    {
        "id": 10,
        "quot": "ADA",
        "base": "BTC"
    },
    {
        "id": 11,
        "quot": "XVG",
        "base": "BTC"
    },
    {
        "id": 12,
        "quot": "ZEC",
        "base": "BTC"
    },
    {
        "id": 13,
        "quot": "STRAT",
        "base": "BTC"
    },
    {
        "id": 15,
        "quot": "GAS",
        "base": "BTC"
    },
    {
        "id": 16,
        "quot": "XRP",
        "base": "BTC"
    },
    {
        "id": 20,
        "quot": "TRX",
        "base": "BTC"
    },
    {
        "id": 21,
        "quot": "ONT",
        "base": "BTC"
    },
    {
        "id": 22,
        "quot": "ETH",
        "base": "BTC"
    },
    {
        "id": 23,
        "quot": "NEO",
        "base": "BTC"
    },
    {
        "id": 24,
        "quot": "BNB",
        "base": "BTC"
    },
    {
        "id": 25,
        "quot": "ICX",
        "base": "BTC"
    },
    {
        "id": 26,
        "quot": "IOST",
        "base": "BTC"
    },
    {
        "id": 27,
        "quot": "ELF",
        "base": "BTC"
    },
    {
        "id": 28,
        "quot": "WAN",
        "base": "BTC"
    },
    {
        "id": 29,
        "quot": "BCC",
        "base": "BTC"
    },
    {
        "id": 30,
        "quot": "XLM",
        "base": "BTC"
    },
    {
        "id": 31,
        "quot": "IOTA",
        "base": "BTC"
    },
    {
        "id": 32,
        "quot": "QSP",
        "base": "BTC"
    },
    {
        "id": 33,
        "quot": "NCASH",
        "base": "BTC"
    },
    {
        "id": 34,
        "quot": "NEBL",
        "base": "BTC"
    },
    {
        "id": 35,
        "quot": "AION",
        "base": "BTC"
    },
    {
        "id": 36,
        "quot": "GVT",
        "base": "BTC"
    },
    {
        "id": 37,
        "quot": "QTUM",
        "base": "BTC"
    },
    {
        "id": 38,
        "quot": "DNT",
        "base": "BTC"
    },
    {
        "id": 39,
        "quot": "DGD",
        "base": "BTC"
    },
    {
        "id": 40,
        "quot": "NANO",
        "base": "BTC"
    },
    {
        "id": 41,
        "quot": "ENJ",
        "base": "BTC"
    },
    {
        "id": 42,
        "quot": "LINK",
        "base": "BTC"
    },
    {
        "id": 43,
        "quot": "POA",
        "base": "BTC"
    },
    {
        "id": 44,
        "quot": "STORM",
        "base": "BTC"
    },
    {
        "id": 45,
        "quot": "EDO",
        "base": "BTC"
    },
    {
        "id": 46,
        "quot": "LTC",
        "base": "BTC"
    },
    {
        "id": 47,
        "quot": "OMG",
        "base": "BTC"
    },
    {
        "id": 48,
        "quot": "SNT",
        "base": "BTC"
    },
    {
        "id": 49,
        "quot": "ETC",
        "base": "BTC"
    },
    {
        "id": 50,
        "quot": "NULS",
        "base": "BTC"
    },
    {
        "id": 51,
        "quot": "SALT",
        "base": "BTC"
    },
    {
        "id": 52,
        "quot": "RCN",
        "base": "BTC"
    },
    {
        "id": 53,
        "quot": "QLC",
        "base": "BTC"
    },
    {
        "id": 54,
        "quot": "BQX",
        "base": "BTC"
    },
    {
        "id": 55,
        "quot": "TRIG",
        "base": "BTC"
    },
    {
        "id": 56,
        "quot": "POWR",
        "base": "BTC"
    },
    {
        "id": 57,
        "quot": "MCO",
        "base": "BTC"
    },
    {
        "id": 58,
        "quot": "BCPT",
        "base": "BTC"
    },
    {
        "id": 59,
        "quot": "CMT",
        "base": "BTC"
    },
    {
        "id": 60,
        "quot": "ENG",
        "base": "BTC"
    },
    {
        "id": 61,
        "quot": "WTC",
        "base": "BTC"
    },
    {
        "id": 62,
        "quot": "BTG",
        "base": "BTC"
    },
    {
        "id": 63,
        "quot": "MANA",
        "base": "BTC"
    },
    {
        "id": 64,
        "quot": "VIB",
        "base": "BTC"
    },
    {
        "id": 65,
        "quot": "LRC",
        "base": "BTC"
    },
    {
        "id": 66,
        "quot": "POE",
        "base": "BTC"
    },
    {
        "id": 67,
        "quot": "NAV",
        "base": "BTC"
    },
    {
        "id": 68,
        "quot": "ADX",
        "base": "BTC"
    },
    {
        "id": 69,
        "quot": "ICN",
        "base": "BTC"
    },
    {
        "id": 70,
        "quot": "RLC",
        "base": "BTC"
    },
    {
        "id": 71,
        "quot": "OST",
        "base": "BTC"
    },
    {
        "id": 72,
        "quot": "MOD",
        "base": "BTC"
    },
    {
        "id": 73,
        "quot": "AST",
        "base": "BTC"
    },
    {
        "id": 74,
        "quot": "ZRX",
        "base": "BTC"
    },
    {
        "id": 75,
        "quot": "XEM",
        "base": "BTC"
    },
    {
        "id": 76,
        "quot": "PIVX",
        "base": "BTC"
    },
    {
        "id": 77,
        "quot": "BLZ",
        "base": "BTC"
    },
    {
        "id": 78,
        "quot": "REQ",
        "base": "BTC"
    },
    {
        "id": 79,
        "quot": "STEEM",
        "base": "BTC"
    },
    {
        "id": 80,
        "quot": "HSR",
        "base": "BTC"
    },
    {
        "id": 81,
        "quot": "PPT",
        "base": "BTC"
    },
    {
        "id": 82,
        "quot": "CHAT",
        "base": "BTC"
    },
    {
        "id": 83,
        "quot": "AE",
        "base": "BTC"
    },
    {
        "id": 84,
        "quot": "YOYO",
        "base": "BTC"
    },
    {
        "id": 85,
        "quot": "GRS",
        "base": "BTC"
    },
    {
        "id": 86,
        "quot": "WPR",
        "base": "BTC"
    },
    {
        "id": 87,
        "quot": "BTS",
        "base": "BTC"
    },
    {
        "id": 88,
        "quot": "RPX",
        "base": "BTC"
    },
    {
        "id": 89,
        "quot": "SNGLS",
        "base": "BTC"
    },
    {
        "id": 90,
        "quot": "CND",
        "base": "BTC"
    },
    {
        "id": 91,
        "quot": "MTH",
        "base": "BTC"
    },
    {
        "id": 92,
        "quot": "TNB",
        "base": "BTC"
    },
    {
        "id": 93,
        "quot": "APPC",
        "base": "BTC"
    },
    {
        "id": 94,
        "quot": "OAX",
        "base": "BTC"
    },
    {
        "id": 95,
        "quot": "MDA",
        "base": "BTC"
    },
    {
        "id": 96,
        "quot": "WINGS",
        "base": "BTC"
    },
    {
        "id": 97,
        "quot": "ARN",
        "base": "BTC"
    },
    {
        "id": 98,
        "quot": "KNC",
        "base": "BTC"
    },
    {
        "id": 99,
        "quot": "DLT",
        "base": "BTC"
    },
    {
        "id": 100,
        "quot": "SYS",
        "base": "BTC"
    },
    {
        "id": 101,
        "quot": "LEND",
        "base": "BTC"
    },
    {
        "id": 102,
        "quot": "GTO",
        "base": "BTC"
    },
    {
        "id": 103,
        "quot": "EVX",
        "base": "BTC"
    },
    {
        "id": 104,
        "quot": "BCD",
        "base": "BTC"
    },
    {
        "id": 105,
        "quot": "BAT",
        "base": "BTC"
    },
    {
        "id": 106,
        "quot": "WABI",
        "base": "BTC"
    },
    {
        "id": 107,
        "quot": "SNM",
        "base": "BTC"
    },
    {
        "id": 108,
        "quot": "KMD",
        "base": "BTC"
    },
    {
        "id": 109,
        "quot": "INS",
        "base": "BTC"
    },
    {
        "id": 110,
        "quot": "CDT",
        "base": "BTC"
    },
    {
        "id": 111,
        "quot": "BNT",
        "base": "BTC"
    },
    {
        "id": 112,
        "quot": "FUN",
        "base": "BTC"
    },
    {
        "id": 113,
        "quot": "STORJ",
        "base": "BTC"
    },
    {
        "id": 114,
        "quot": "VIBE",
        "base": "BTC"
    },
    {
        "id": 115,
        "quot": "LUN",
        "base": "BTC"
    },
    {
        "id": 116,
        "quot": "ARK",
        "base": "BTC"
    },
    {
        "id": 117,
        "quot": "XZC",
        "base": "BTC"
    },
    {
        "id": 118,
        "quot": "AMB",
        "base": "BTC"
    },
    {
        "id": 119,
        "quot": "RDN",
        "base": "BTC"
    },
    {
        "id": 120,
        "quot": "FUEL",
        "base": "BTC"
    },
    {
        "id": 121,
        "quot": "GXS",
        "base": "BTC"
    },
    {
        "id": 122,
        "quot": "VIA",
        "base": "BTC"
    },
    {
        "id": 123,
        "quot": "TNT",
        "base": "BTC"
    },
    {
        "id": 124,
        "quot": "BRD",
        "base": "BTC"
    }
];
for (let symb of symbols) {
    Symb.create(symb);
}

let modules = [
    {
        "id": 1,
        "title": "Сбор данных",
        "pm2_name": "bb.data-collector"
    },
    {
        "id": 2,
        "title": "Торговля",
        "pm2_name": "bb.trader"
    },
    {
        "id": 3,
        "title": "Скальпер",
        "pm2_name": "bb.scalper"
    }
];
for (let module of modules) {
    Module.create(module);
}