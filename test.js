"use strict";

var Mining = function () { };

Mining.prototype = {
  init: function () { },
  register: function (address, password) {
    var userInfo = {
      address: address,
      balance: 18,
      password: password,
      miner: [],
      bill: [{
        title: '注册赠送',
        coinCount: '+18',
        time: Blockchain.transaction.timestamp * 1000
      }]
    };

    LocalContractStorage.set(address, JSON.stringify(userInfo));
    this._setAll(address, 18)
  },
  _setAll: function (address, balance) {
    var defaultData = JSON.parse(LocalContractStorage.get('all'));
    var data = Object.prototype.toString.call(defaultData) == '[object Array]' ? defaultData : [];
    // isAddress用来判断这个地址 之前在所有资料里面是否储存过。循环完还是false则未存过
    var isAddress = false;
    for (var i = 0; i < data.length; i++) {
      if (data[i].address == address) {
        data[i].balance = balance;
        isAddress = true
      }
    }
    if (!isAddress) {
      data.push({
        address: address,
        balance: balance
      });
    }

    if (data.length > 1) {
      LocalContractStorage.del('all');
    };
    LocalContractStorage.set('all', JSON.stringify(data));
  },
  getAll: function () {
    // 这个函数的作用只是 以后挖到矿石空投兑换qic的时候用。
    return LocalContractStorage.get('all');
  },
  getUserInfo: function (address) {
    return LocalContractStorage.get(address);
  },
  buyMiner: function (address, type) {
    var userinfo = JSON.parse(LocalContractStorage.get(address));
    if (userinfo.miner.indexOf(type) != -1) {
      // 已经有这个矿工了，还在雇佣
      throw new Error("禁止恶意修改代码!!!")
      return false
    }

    var coinCount = parseInt(type) * 10;

    if (type != 1 && parseInt(userinfo.balance) < parseInt(coinCount)) {
      // 钱不够，还在雇佣
      throw new Error("禁止恶意修改代码!!!")
      return false
    }

    userinfo.balance = parseInt(userinfo.balance) - coinCount;
    userinfo.miner.push(type);
    userinfo.bill.push({
      title: "雇佣" + type + "矿工",
      coinCount: "-" + coinCount,
      time: Blockchain.transaction.timestamp * 1000
    });
    LocalContractStorage.del(address);
    // 雇佣矿工后，矿工立刻开始挖矿
    userinfo[[null, "one", "two", "three"][type]] = {
      hour: Math.floor(Math.random() * 10 + 1),
      reward: Math.floor(Math.random() * 10 + 1),
      time: Blockchain.transaction.timestamp * 1000
    }
    LocalContractStorage.set(address, JSON.stringify(userinfo));
    this._setAll(address, userinfo.balance)
  },
  give: function (to, from, num, password) {
    var toInfo = JSON.parse(LocalContractStorage.get(to));
    if (toInfo.password != password) {
      return "交易密码错误!"
    }

    if (parseInt(toInfo.balance) < parseInt(num)) {
      throw new Error("禁止恶意修改代码!!!")
      return false
    }

    var fromInfo = JSON.parse(LocalContractStorage.get(from));

    toInfo.balance = parseInt(toInfo.balance) - parseInt(num);
    toInfo.bill.push({
      title: "赠送好友",
      coinCount: "-" + num,
      time: Blockchain.transaction.timestamp * 1000
    });
    fromInfo.balance = parseInt(fromInfo.balance) + parseInt(num);
    fromInfo.bill.push({
      title: "好友赠送",
      coinCount: "+" + num,
      time: Blockchain.transaction.timestamp * 1000
    });

    LocalContractStorage.del(to);
    LocalContractStorage.set(to, JSON.stringify(toInfo));
    LocalContractStorage.del(from);
    LocalContractStorage.set(from, JSON.stringify(fromInfo));
    this._setAll(to, toInfo.balance);
    this._setAll(from, fromInfo.balance);
  },
  collect: function (address, type) {
    var userinfo = JSON.parse(LocalContractStorage.get(address));
    if (userinfo.miner.indexOf(type) == -1) {
      // 压根没有这个矿工，却在收矿石
      throw new Error("禁止恶意修改代码!!!")
      return false
    }
    var time = Blockchain.transaction.timestamp * 1000;
    var miner = userinfo[[null, "one", "two", "three"][type]];

    if (time - miner.time > miner.hour * 3600000) {
      userinfo.balance = parseInt(userinfo.balance) + parseInt(miner.reward);
      userinfo.bill.push({
        title: type + "号矿工挖矿所得" + miner.reward,
        coinCount: "+" + miner.reward,
        time: time
      });

      userinfo[[null, "one", "two", "three"][type]] = {
        hour: Math.floor(Math.random() * 10 + 1),
        reward: Math.floor(Math.random() * 10 + 1),
        time: Blockchain.transaction.timestamp * 1000
      }
      LocalContractStorage.del(address);
      LocalContractStorage.set(address, JSON.stringify(userinfo));
      this._setAll(address, userinfo.balance);
    } else {
      throw new Error("智能合约时间未匹配到,请刷新网页再次尝试！")
    }
  }
};

module.exports = Mining;