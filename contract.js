"use strict";
var LuckyDraw = function () {};

LuckyDraw.prototype = {
    init: function () {},
    // 注册 每个注册用户有666个空投钢镚 unshit数组前面添加
    register: function (address, password) {
        var time = this._timestampToTime(Blockchain.transaction.timestamp);
        var userInfo = {
            address: address,
            coins: 6666,//钢镚数量
            venosa:20,//金豆数量
            password: password,
            miner: [],
            bill: [{
                title: '注册赠送',
                coins: '+666',
                venosa: '+0',
                time: time
            }]
        };

        LocalContractStorage.set(address, JSON.stringify(userInfo));
        //  用户 钢镚数 金豆数
        this._setAll(address, 6666,20)
    },
    _timestampToTime(timestamp) {
        var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        return Y + M + D + h + m + s;
    },
    _setAll: function (address, coins, venosa) {
        var defaultData = JSON.parse(LocalContractStorage.get('all'));
        var data = Object.prototype.toString.call(defaultData) == '[object Array]' ? defaultData : [];
        // isAddress用来判断这个地址 之前在所有资料里面是否储存过。循环完还是false则未存过
        var isAddress = false;
        for (var i = 0; i < data.length; i++) {
            if (data[i].address == address) {
                data[i].coins = coins;
                data[i].venosa = venosa;
                isAddress = true
            }
        }
        if (!isAddress) {
            data.push({
                address: address,
                coins: coins,
                venosa: venosa
            });
        }

        if (data.length > 1) {
            LocalContractStorage.del('all');
        };
        LocalContractStorage.set('all', JSON.stringify(data));
    },
    // 获取所有的用户的信息
    getAll: function () {
        return LocalContractStorage.get('all');
    },
    getUserInfo: function (address) {
        return LocalContractStorage.get(address);
    },
    // 每天签到领取钢镚
    signIn: function (address) {
        var userInfo = JSON.parse(LocalContractStorage.get(address));
        var time = this._timestampToTime(Blockchain.transaction.timestamp);
        userInfo.coins = parseInt(userInfo.coins) + 66;
        var obj = {
            title: '签到领取',
            coins: '+66',
            venosa: '',
            time: time
        }
        userInfo.bill.unshift(obj);
        LocalContractStorage.set(address, JSON.stringify(userInfo));
    },
    // 钢镚合成金豆 每次消耗10个
    coinsToVenosa: function (address) {
        var userInfo = JSON.parse(LocalContractStorage.get(address));
        var time = this._timestampToTime(Blockchain.transaction.timestamp);
        userInfo.coins = parseInt(userInfo.coins) - 10;
        var obj = {
            title: '钢镚合成金豆',
            coins: '-10',
            venosa: '',
            time: time
        }
        userInfo.bill.unshift(obj);
        LocalContractStorage.set(address, JSON.stringify(userInfo));
    },
    // 钢镚合成金豆 成功的话 新增中奖的金豆
    coinsToVenosaSuccess: function (address,num) {
        var userInfo = JSON.parse(LocalContractStorage.get(address));
        var time = this._timestampToTime(Blockchain.transaction.timestamp);
        userinfo.venosa = parseInt(userInfo.venosa) + parseInt(num);
        var obj = {
            title: '钢镚合成金豆成功奖励',
            coins: '',
            venosa: '+' + parseInt(num),
            time: time
        }
        userInfo.bill.unshift(obj);
        LocalContractStorage.set(address, JSON.stringify(userInfo));
    },
    // 金豆分解为钢镚
    venosaToCoins: function (address) {
        var userInfo = JSON.parse(LocalContractStorage.get(address));
        var time = this._timestampToTime(Blockchain.transaction.timestamp);
        userinfo.venosa = parseInt(userinfo.venosa) - 1;
        var obj = {
            title: '金豆分解消耗',
            coins: '',
            venosa: '-1',
            time: time
        }
        userInfo.bill.unshift(obj);
        LocalContractStorage.set(address, JSON.stringify(userInfo));
    },
    // 金豆分解为钢镚成功
    venosaToCoinsSuccess: function (address, num) {
        var userInfo = JSON.parse(LocalContractStorage.get(address));
        var time = this._timestampToTime(Blockchain.transaction.timestamp);
        userinfo.coins = parseInt(userinfo.coins) + parseInt(num);
        var obj = {
            title: '金豆分解成功奖励',
            coins: '+' + num,
            venosa: '',
            time: time
        }
        userInfo.bill.unshift(obj);
        LocalContractStorage.set(address, JSON.stringify(userInfo));
    },
    // 金豆换为钢镚  比例1:10
    venosaChangeCoins: function (address, num) {
        var userInfo = JSON.parse(LocalContractStorage.get(address));
        var time = this._timestampToTime(Blockchain.transaction.timestamp);
        userinfo.venosa = parseInt(userinfo.venosa) - parseInt(num);
        userinfo.coins = parseInt(userinfo.coins) + parseInt(num) * 10;
        var obj = {
            title: '金豆换成钢镚',
            coins: '+' + parseInt(num) * 10,
            venosa: '-' + parseInt(num),
            time: time
        }
        userInfo.bill.unshift(obj);
        LocalContractStorage.set(address, JSON.stringify(userInfo));
    },
    // 钢镚换为金豆  比例10:1
    coinsChangeVenosa: function (address, num) {
        var userInfo = JSON.parse(LocalContractStorage.get(address));
        var time = this._timestampToTime(Blockchain.transaction.timestamp);
        userinfo.venosa = parseInt(userinfo.venosa) + parseInt(num);
        userinfo.coins = parseInt(userinfo.coins) - parseInt(num) * 10;
        var obj = {
            title: '钢镚换金豆',
            coins: '-' + parseInt(num) * 10,
            venosa: '+'+parseInt(num),
            time: time
        }
        userInfo.bill.unshift(obj);
        LocalContractStorage.set(address, JSON.stringify(userInfo));
    },
};
module.exports = LuckyDraw;
