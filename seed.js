const bb = require('./binance-bot');

const AggTrade = bb.models['AggTrade'];
const Currency = bb.models['Currency'];
const Symb = bb.models['Symb'];
const Module = bb.models['Module'];
const ModuleParameters = bb.models['ModuleParameters'];

let symbols = [
    {
        "id": 1,
        "quot": "BTC",
        "base": "DASH"
    },
    {
        "id": 2,
        "quot": "BTC",
        "base": "WAVES"
    },
    {
        "id": 3,
        "quot": "BTC",
        "base": "ZIL"
    },
    {
        "id": 4,
        "quot": "BTC",
        "base": "EOS"
    },
    {
        "id": 5,
        "quot": "BTC",
        "base": "XMR"
    },
    {
        "id": 6,
        "quot": "BTC",
        "base": "MTL"
    },
    {
        "id": 7,
        "quot": "BTC",
        "base": "VEN"
    },
    {
        "id": 8,
        "quot": "BTC",
        "base": "LSK"
    },
    {
        "id": 9,
        "quot": "BTC",
        "base": "SUB"
    },
    {
        "id": 10,
        "quot": "BTC",
        "base": "ADA"
    },
    {
        "id": 11,
        "quot": "BTC",
        "base": "XVG"
    },
    {
        "id": 12,
        "quot": "BTC",
        "base": "ZEC"
    },
    {
        "id": 13,
        "quot": "BTC",
        "base": "STRAT"
    },
    {
        "id": 15,
        "quot": "BTC",
        "base": "GAS"
    },
    {
        "id": 16,
        "quot": "BTC",
        "base": "XRP"
    },
    {
        "id": 20,
        "quot": "BTC",
        "base": "TRX"
    },
    {
        "id": 21,
        "quot": "BTC",
        "base": "ONT"
    },
    {
        "id": 22,
        "quot": "BTC",
        "base": "ETH"
    },
    {
        "id": 23,
        "quot": "BTC",
        "base": "NEO"
    },
    {
        "id": 24,
        "quot": "BTC",
        "base": "BNB"
    },
    {
        "id": 25,
        "quot": "BTC",
        "base": "ICX"
    },
    {
        "id": 26,
        "quot": "BTC",
        "base": "IOST"
    },
    {
        "id": 27,
        "quot": "BTC",
        "base": "ELF"
    },
    {
        "id": 28,
        "quot": "BTC",
        "base": "WAN"
    },
    {
        "id": 29,
        "quot": "BTC",
        "base": "BCC"
    },
    {
        "id": 30,
        "quot": "BTC",
        "base": "XLM"
    },
    {
        "id": 31,
        "quot": "BTC",
        "base": "IOTA"
    },
    {
        "id": 32,
        "quot": "BTC",
        "base": "QSP"
    },
    {
        "id": 33,
        "quot": "BTC",
        "base": "NCASH"
    },
    {
        "id": 34,
        "quot": "BTC",
        "base": "NEBL"
    },
    {
        "id": 35,
        "quot": "BTC",
        "base": "AION"
    },
    {
        "id": 36,
        "quot": "BTC",
        "base": "GVT"
    },
    {
        "id": 37,
        "quot": "BTC",
        "base": "QTUM"
    },
    {
        "id": 38,
        "quot": "BTC",
        "base": "DNT"
    },
    {
        "id": 39,
        "quot": "BTC",
        "base": "DGD"
    },
    {
        "id": 40,
        "quot": "BTC",
        "base": "NANO"
    },
    {
        "id": 41,
        "quot": "BTC",
        "base": "ENJ"
    },
    {
        "id": 42,
        "quot": "BTC",
        "base": "LINK"
    },
    {
        "id": 43,
        "quot": "BTC",
        "base": "POA"
    },
    {
        "id": 44,
        "quot": "BTC",
        "base": "STORM"
    },
    {
        "id": 45,
        "quot": "BTC",
        "base": "EDO"
    },
    {
        "id": 46,
        "quot": "BTC",
        "base": "LTC"
    },
    {
        "id": 47,
        "quot": "BTC",
        "base": "OMG"
    },
    {
        "id": 48,
        "quot": "BTC",
        "base": "SNT"
    },
    {
        "id": 49,
        "quot": "BTC",
        "base": "ETC"
    },
    {
        "id": 50,
        "quot": "BTC",
        "base": "NULS"
    },
    {
        "id": 51,
        "quot": "BTC",
        "base": "SALT"
    },
    {
        "id": 52,
        "quot": "BTC",
        "base": "RCN"
    },
    {
        "id": 53,
        "quot": "BTC",
        "base": "QLC"
    },
    {
        "id": 54,
        "quot": "BTC",
        "base": "BQX"
    },
    {
        "id": 55,
        "quot": "BTC",
        "base": "TRIG"
    },
    {
        "id": 56,
        "quot": "BTC",
        "base": "POWR"
    },
    {
        "id": 57,
        "quot": "BTC",
        "base": "MCO"
    },
    {
        "id": 58,
        "quot": "BTC",
        "base": "BCPT"
    },
    {
        "id": 59,
        "quot": "BTC",
        "base": "CMT"
    },
    {
        "id": 60,
        "quot": "BTC",
        "base": "ENG"
    },
    {
        "id": 61,
        "quot": "BTC",
        "base": "WTC"
    },
    {
        "id": 62,
        "quot": "BTC",
        "base": "BTG"
    },
    {
        "id": 63,
        "quot": "BTC",
        "base": "MANA"
    },
    {
        "id": 64,
        "quot": "BTC",
        "base": "VIB"
    },
    {
        "id": 65,
        "quot": "BTC",
        "base": "LRC"
    },
    {
        "id": 66,
        "quot": "BTC",
        "base": "POE"
    },
    {
        "id": 67,
        "quot": "BTC",
        "base": "NAV"
    },
    {
        "id": 68,
        "quot": "BTC",
        "base": "ADX"
    },
    {
        "id": 69,
        "quot": "BTC",
        "base": "ICN"
    },
    {
        "id": 70,
        "quot": "BTC",
        "base": "RLC"
    },
    {
        "id": 71,
        "quot": "BTC",
        "base": "OST"
    },
    {
        "id": 72,
        "quot": "BTC",
        "base": "MOD"
    },
    {
        "id": 73,
        "quot": "BTC",
        "base": "AST"
    },
    {
        "id": 74,
        "quot": "BTC",
        "base": "ZRX"
    },
    {
        "id": 75,
        "quot": "BTC",
        "base": "XEM"
    },
    {
        "id": 76,
        "quot": "BTC",
        "base": "PIVX"
    },
    {
        "id": 77,
        "quot": "BTC",
        "base": "BLZ"
    },
    {
        "id": 78,
        "quot": "BTC",
        "base": "REQ"
    },
    {
        "id": 79,
        "quot": "BTC",
        "base": "STEEM"
    },
    {
        "id": 80,
        "quot": "BTC",
        "base": "HSR"
    },
    {
        "id": 81,
        "quot": "BTC",
        "base": "PPT"
    },
    {
        "id": 82,
        "quot": "BTC",
        "base": "CHAT"
    },
    {
        "id": 83,
        "quot": "BTC",
        "base": "AE"
    },
    {
        "id": 84,
        "quot": "BTC",
        "base": "YOYO"
    },
    {
        "id": 85,
        "quot": "BTC",
        "base": "GRS"
    },
    {
        "id": 86,
        "quot": "BTC",
        "base": "WPR"
    },
    {
        "id": 87,
        "quot": "BTC",
        "base": "BTS"
    },
    {
        "id": 88,
        "quot": "BTC",
        "base": "RPX"
    },
    {
        "id": 89,
        "quot": "BTC",
        "base": "SNGLS"
    },
    {
        "id": 90,
        "quot": "BTC",
        "base": "CND"
    },
    {
        "id": 91,
        "quot": "BTC",
        "base": "MTH"
    },
    {
        "id": 92,
        "quot": "BTC",
        "base": "TNB"
    },
    {
        "id": 93,
        "quot": "BTC",
        "base": "APPC"
    },
    {
        "id": 94,
        "quot": "BTC",
        "base": "OAX"
    },
    {
        "id": 95,
        "quot": "BTC",
        "base": "MDA"
    },
    {
        "id": 96,
        "quot": "BTC",
        "base": "WINGS"
    },
    {
        "id": 97,
        "quot": "BTC",
        "base": "ARN"
    },
    {
        "id": 98,
        "quot": "BTC",
        "base": "KNC"
    },
    {
        "id": 99,
        "quot": "BTC",
        "base": "DLT"
    },
    {
        "id": 100,
        "quot": "BTC",
        "base": "SYS"
    },
    {
        "id": 101,
        "quot": "BTC",
        "base": "LEND"
    },
    {
        "id": 102,
        "quot": "BTC",
        "base": "GTO"
    },
    {
        "id": 103,
        "quot": "BTC",
        "base": "EVX"
    },
    {
        "id": 104,
        "quot": "BTC",
        "base": "BCD"
    },
    {
        "id": 105,
        "quot": "BTC",
        "base": "BAT"
    },
    {
        "id": 106,
        "quot": "BTC",
        "base": "WABI"
    },
    {
        "id": 107,
        "quot": "BTC",
        "base": "SNM"
    },
    {
        "id": 108,
        "quot": "BTC",
        "base": "KMD"
    },
    {
        "id": 109,
        "quot": "BTC",
        "base": "INS"
    },
    {
        "id": 110,
        "quot": "BTC",
        "base": "CDT"
    },
    {
        "id": 111,
        "quot": "BTC",
        "base": "BNT"
    },
    {
        "id": 112,
        "quot": "BTC",
        "base": "FUN"
    },
    {
        "id": 113,
        "quot": "BTC",
        "base": "STORJ"
    },
    {
        "id": 114,
        "quot": "BTC",
        "base": "VIBE"
    },
    {
        "id": 115,
        "quot": "BTC",
        "base": "LUN"
    },
    {
        "id": 116,
        "quot": "BTC",
        "base": "ARK"
    },
    {
        "id": 117,
        "quot": "BTC",
        "base": "XZC"
    },
    {
        "id": 118,
        "quot": "BTC",
        "base": "AMB"
    },
    {
        "id": 119,
        "quot": "BTC",
        "base": "RDN"
    },
    {
        "id": 120,
        "quot": "BTC",
        "base": "FUEL"
    },
    {
        "id": 121,
        "quot": "BTC",
        "base": "GXS"
    },
    {
        "id": 122,
        "quot": "BTC",
        "base": "VIA"
    },
    {
        "id": 123,
        "quot": "BTC",
        "base": "TNT"
    },
    {
        "id": 124,
        "quot": "BTC",
        "base": "BRD"
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
        "title": "Пампер",
        "pm2_name": "bb.pumper"
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