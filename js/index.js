$(function () {
  

  // 规则显示
  $('.com-main .slots .rule').click(function() {

  })
});

var dappAddress = "n1yv7bSzTgHhNr5AuRZwvimkQEWjv78qyND";
var NebPay = require("nebpay");
var nebPay = new NebPay();
new Vue({
  el: '#commain',
  data: {
    isShow:true,
    loginModel:false,
    shumModel:false,
    venosaCgCoins:false,
    coinsChgVenosa:false,
    coins: 0,
    venosa:0,
    changeVenosaNum:1,
    changeCoins:10,
    hasChange:false,
    isCons:true,

    account:'',
    passworld:'',

    spinShow:false,
    loading:'Loading',

    data:{},
    billList:[],
    sign:false,
  },
  created(){

  },
  mounted(){
    if(localStorage.getItem('userInfo')){
      var userInfo =JSON.parse(localStorage.getItem('userInfo'));
        this.account = userInfo.account;
        this.passworld = userInfo.passworld;
        this.login();
    }
  },
  methods:{
    // 注册
    resigner(){
      var that = this;
      this.spinShow = true;
      this.loading = '正在注册用户信息,请耐心等待...'
      nebPay.call(dappAddress, "0", "register", JSON.stringify([this.account,this.passworld]), {
          listener: function(res) {
            if(res.txhash){
                localStorage.setItem('userInfo',JSON.stringify({
                    account:that.account,
                    passworld:that.passworld
                }));
                // 存储需要时间请耐心等待
                var st = setTimeout(function(params) {
                    that.spinShow = false;
                    that.getData(); 
                    clearTimeout(st);
                },17000)
            }else{
              that.spinShow = false;
            }
          }
      })
    },
    login(){
      var that = this;
      this.spinShow = true;
      this.loading = '数据加载中...';
      nebPay.simulateCall(dappAddress, "0", "getUserInfo", JSON.stringify([this.account]), {
          listener: function(res) {
              if(res.result=='null'){
                  that.resigner();
              }else{
                  localStorage.setItem('userInfo',JSON.stringify({
                      account:that.account,
                      passworld:that.passworld
                  }));
                  that.spinShow = false; 
                  // todo  数据处理
                  that.data = JSON.parse(JSON.parse(res.result));
                  var data = that.data;
                  that.coins = data.coins;
                  that.venosa = data.venosa;
                  that.billList = data.bill;
                  console.log(that.billList);
              }
              
          }
      })
    },
    getData(){
      var that = this;
      nebPay.simulateCall(dappAddress, "0", "getUserInfo", JSON.stringify([this.account]), {
          listener: function(res) {
            // todo  数据处理
            that.data = JSON.parse(JSON.parse(res.result));
            var data = that.data;
            that.coins = data.coins;
            that.venosa = data.venosa;
            that.billList = data.bill; 
            console.log(that.billList);       
          }
      })
    },
    start(){
      if(!localStorage.getItem('userInfo')){
        this.loginModel = true;
      }else{
        var userInfo =JSON.parse(localStorage.getItem('userInfo'));
        this.account = userInfo.account;
        this.passworld = userInfo.passworld;
        if(this.isCons){ //钢镚合成金豆
          if(this.coins>=50){
              this.coinsToVenosa();
          }else{
              this.sign = true;
          }
        }else{//金豆分解为钢镚
          if(this.venosa>=1){
            this.venosaToCoins();
          }else{
            this.sign = true;
          }
        }
      }  
    },
    // 钢镚合成金豆
    coinsToVenosa(){
      var that = this;
      this.spinShow = true;
      this.loading = '交易进行中...'
      nebPay.call(dappAddress, "0", "coinsToVenosa", JSON.stringify([this.account]), {
          listener: function(res) {
            if(res.txhash){
                // 存储需要时间请耐心等待
                that.coins = that.coins - 50; 
                var st = setTimeout(function(params) {
                    that.startcjiang();
                    that.spinShow = false;
                    that.getData(); 
                    clearTimeout(st);
                },17000)
            }else{
              that.spinShow = false;
            }
          }
      })
    },
    // 金豆分解为钢镚
    venosaToCoins(){
      var that = this;
      this.spinShow = true;
      this.loading = '交易进行中...'
      nebPay.call(dappAddress, "0", "venosaToCoins", JSON.stringify([this.account]), {
          listener: function(res) {
            if(res.txhash){
                // 存储需要时间请耐心等待
                that.venosa = that.venosa - 1;
                var st = setTimeout(function(params) {
                  that.startcjiang();
                    that.spinShow = false;
                    that.getData(); 
                    clearTimeout(st);
                },17000)
            }else{
              that.spinShow = false;
            }
          }
      })
    },
    // 钢镚合成金豆成功
    coinsToVenosaSuccess(num){
      var that = this;
      nebPay.simulateCall(dappAddress, "0", "coinsToVenosaSuccess", JSON.stringify([this.account,num]), {
          listener: function(res) {
              if(res.txhash){
                  // 存储需要时间请耐心等待
                  var st = setTimeout(function(params) {
                      that.getData(); 
                      clearTimeout(st);
                  },60000)
              }
              
          }
      })
    },
    // 金豆分解为钢镚成功
    venosaToCoinsSuccess(num){
      var that = this;
      nebPay.simulateCall(dappAddress, "0", "venosaToCoinsSuccess", JSON.stringify([this.account,num]), {
          listener: function(res) {
              if(res.txhash){
                  // 存储需要时间请耐心等待
                  var st = setTimeout(function(params) {
                      that.getData(); 
                      clearTimeout(st);
                  },60000)
              }
              
          }
      })
    },
    // 金豆换钢镚
    venosaChangeCoins(){
        var that = this;
      nebPay.simulateCall(dappAddress, "0", "venosaChangeCoins", JSON.stringify([this.account,this.changeVenosaNum]), {
          listener: function(res) {
              if(res.txhash){
                  // 存储需要时间请耐心等待
                  var st = setTimeout(function(params) {
                      that.getData(); 
                      clearTimeout(st);
                  },20000)
              }
              
          }
      })
    },
    // 钢镚换金豆
    coinsChangeVenosa(){
        var that = this;
      nebPay.simulateCall(dappAddress, "0", "coinsChangeVenosa", JSON.stringify([this.account,this.changeCoins]), {
          listener: function(res) {
              if(res.txhash){
                  // 存储需要时间请耐心等待
                  var st = setTimeout(function(params) {
                      that.getData(); 
                      clearTimeout(st);
                  },20000)
              }
              
          }
      })
    },
    signclick(){
        var that = this;
      this.spinShow = true;
      this.loading = '交易进行中...'
      nebPay.call(dappAddress, "0", "signIn", JSON.stringify([this.account]), {
          listener: function(res) {
            if(res.txhash){
                // 存储需要时间请耐心等待
                var st = setTimeout(function(params) {
                  that.startcjiang();
                    that.spinShow = false;
                    that.getData(); 
                    clearTimeout(st);
                },17000)
            }else{
              that.spinShow = false;
            }
          }
      })
    },
    // 开始抽奖
    startcjiang(){
      let that = this;
        var u = 160.4; //盒子的高度
        var randnum = ''; //中奖随机数, 分解金豆获取钢镚'000', '111', '222'，
        for (let i = 0; i < 3; i++) {
          randnum += parseInt(Math.random() * 3).toString();
        }
        if(!this.hasChange){
          this.hasChange = true;
          $(".com-main .slots dl dd").slots(u, randnum, function () {
            that.hasChange=false; //还有抽奖机会移除active
            if(that.isCons){// 钢镚合成金豆
              if(randnum=='000'){
                $.giftWarm("恭喜你", '合成了<span>4</span>个金豆');
                that.coinsToVenosaSuccess(4);
              }else 
              if(randnum=='111'){
                $.giftWarm("恭喜你", '合成了<span>5</span>个金豆');
                that.coinsToVenosaSuccess(5);
              }else 
              if(randnum=='222'){
                $.giftWarm("恭喜你", '合成了<span>6</span>个金豆');
                that.coinsToVenosaSuccess(6);
              }else{
                $.giftWarm("很遗憾", '差点就成功哦了，再来一次吧！');
              }
            }else{//金豆分解为钢镚
              if(randnum=='000'){
                $.giftWarm("恭喜你", '分解为<span>8</span>个钢镚');
                that.venosaToCoinsSuccess(8);
              }else 
              if(randnum=='111'){
                $.giftWarm("恭喜你", '分解为<span>10</span>个钢镚');
                that.venosaToCoinsSuccess(10);
              }else 
              if(randnum=='222'){
                $.giftWarm("恭喜你", '分解为<span>12</span>个钢镚');
                that.venosaToCoinsSuccess(12);
              }else{
                $.giftWarm("很遗憾", '差点就成功哦了，再来一次吧！');
              }
            }
          });
        }
    }


  
  }
})