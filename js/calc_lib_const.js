//全局变量，对所有页面均有效 
//注意：所有数额均不能带引号！！
(function(window) {
	"use strict";
	var CALC_CONST = CALC_CONST ? CALC_CONST : {};
	window.CALC_CONST = CALC_CONST;
	//通知存款年利率
	CALC_CONST.notifyYearDate1 = 0.8;  //提前一天通知
	CALC_CONST.notifyYearDate7 = 1.35;  //提前七天通知
	
	//利息税
	CALC_CONST.interestRate = 0; 
	
	//活期储蓄利率
	CALC_CONST.currentRate = 0.35;
	
	//整存整取利率
	CALC_CONST.lumpRate90 = 2.6;  //三个月
	CALC_CONST.lumpRate180 = 2.8;  //半年
	CALC_CONST.lumpRate360 = 3;  //一年
	CALC_CONST.lumpRate720 = 3.75;  //两年
	CALC_CONST.lumpRate1080 = 4.25;  //三年
	CALC_CONST.lumpRate1800 = 4.75;  //五年
	
	//整存零取
	CALC_CONST.smallRate360 = 2.85;  //一年
	CALC_CONST.smallRate1080 = 2.9;  //三年
	CALC_CONST.smallRate1800 = 3;  //五年
	
	//零存整取
	CALC_CONST.slRate360 = 2.85;  //一年
	CALC_CONST.slRate1080 = 2.9;  //三年
	CALC_CONST.slRate1800 = 3;  //五年
	
	//存本取息
	CALC_CONST.idRate360 = 2.85;  //一年
	CALC_CONST.idRate1080 = 2.9;  //三年
	CALC_CONST.idRate1800 = 3;  //五年
	
	//个人贷款利率
	CALC_CONST.loadRate = 6.55; 
	
	//基金买卖
	CALC_CONST.fundRate1 = 1.5;     //申购
	CALC_CONST.fundRate2 = 0.5;     //赎回
	CALC_CONST.fundRate3 = 1.2;     //认购
	
	//个人所得税
	CALC_CONST.personUnexpectedRate = 0.2; //意外所得税 
	CALC_CONST.personPaperRate = 0.3; //稿酬所得 
	CALC_CONST.personTaxBase = 3500; //个税起征额 
	
	//外汇储蓄利息税
	CALC_CONST.fxRateFee = 0;
	//外汇储蓄汇率
	CALC_CONST.fxRateArray = [
	//活期  七天通知  一个月  三个月  六个月  一年  二年 
	[0.1000,0.1000,0.2500,0.4000,0.7500,1.0000,1.2000] , //*美元 
	[0.1250,0.1750,0.2500,0.3500,0.6000,0.7500,0.7500], //英镑  
	[0.1000,0.3750,0.4500,0.6500,0.9550,1.1000,1.1500], //*欧元  
	[0.0001,0.0005,0.0100,0.0100,0.0100,0.0100,0.0100], //日元 
	[0.0200,0.0200,0.1000,0.2500,0.5000,0.7000,0.7500], //港币 
	[0.0100,0.0500,0.0500,0.0500,0.3000,0.4000,0.4000], //加拿大元 
	[0.0001,0.0005,0.0100,0.0100,0.0100,0.0100,0.0100], //瑞士法郎 
	[0.2375,0.2625,1.2400,1.3875,1.5075,1.5750,1.5750], //澳大利亚元 
	[0.0001,0.0005,0.0100,0.0100,0.0100,0.0100,0.0100] //新加坡元 
	];
	
	//房贷利率
	//1，2，3....为ID 再有利率变动增加时，需要递增
	//title用户下拉框显示
	//rate依次为 商贷 3-5年  商贷 5-30年  公积金 1-5年  公积金 5-30年
	// isdefault: true, 为下拉框中的默认显示项
	
	//商贷利率 3-5年  5-30年
	CALC_CONST.houseLoanBuzzRate = {
		1	: {
			title	: "08年11月27日利率下限",
			rate	: [ 0.0416, 0.0428]
		},
		2	: {
			title	: "08年11月27日利率上限",
			rate	: [ 0.0653, 0.0673]
		},
		3	: {
			title	: "08年11月27日基准利率",
			rate	: [ 0.0594, 0.0673]
		},	
		4	: {
			title	: "08年11月27日第二套房",
			rate	: [ 0.0653, 0.0673]
		},
		5	: {
			title	: "08年12月23日利率下限(7折)",
			rate	: [ 0.0403, 0.0416]
		},
		6	: {
	
			title	: "08年12月23日利率下限(8折)",
			rate	: [ 0.0461, 0.0475]
		},	
		7	: {
			title	: "08年12月23日利率下限(85折)",
			rate	: [ 0.0490, 0.0505]
		},
		8	: {
			title	: "08年12月23日利率上限(1.1倍)",
			rate	: [ 0.0634, 0.0653]
		},
		9	: {
			title	: "08年12月23日基准利率",
			rate	: [ 0.0576, 0.0594]
		},
		10	: {
			title	: "08年12月23日第二套房(1.1倍)",
			rate	: [ 0.0634, 0.0653]
	
	        },
		11	: {
	
	                title	: "10年10月20日基准利率",
			rate	: [ 0.0596, 0.0614]
	
	        },
		12	: {
	
	                title	: "10年12月26日基准利率",
			rate	: [ 0.0614, 0.0640]
	
	        },
		13	: {
	
	                title	: "11年02月09日基准利率",
			rate	: [ 0.0645, 0.066]
	
	        },
		14	: {
	
	                title	: "11年04月06日基准利率",
			rate	: [ 0.0665, 0.068]
	
	        },
		15	: {
	
	                title	: "11年07月07日基准利率",
			rate	: [ 0.0690, 0.0705]
	
	        },
		16	: {
	
	                title	: "12年06月08日基准利率",
			rate	: [ 0.0650, 0.0680]
	
	        },
		17	: {
			isdefault: true,
	                title	: "12年07月06日基准利率",
			rate	: [ 0.0640, 0.0655]
	
		}											
	};
	//公积金贷款利率 1-5年  5-30年
	CALC_CONST.houseLoanCounRate = {
		1	: {
			title	: "08年11月27日后",
			rate	: [ 0.0351, 0.0405]
		},
		2	: {
	
			title	: "08年12月23日后",
			rate	: [ 0.0333, 0.0387]
		},
	
		3	: {
	
			title	: "10年10月20日后",
			rate	: [ 0.0350, 0.0405]
		},
	
		4	: {
	
			title	: "10年12月26日后",
			rate	: [ 0.0375, 0.0430]
	
		},
	
		5	: {
	
			title	: "11年02月09日后",
			rate	: [ 0.04, 0.045]
	
		},
	
		6	: {
	
			title	: "11年04月06日后",
			rate	: [ 0.042, 0.047]
	
		},
	
		7	: {
	
			title	: "11年07月07日后",
			rate	: [ 0.0445, 0.049]
	
		},
	
		8	: {
	
			title	: "12年06月08日后",
			rate	: [ 0.042, 0.047]
	
		},
	
		9	: {
			isdefault: true,
			title	: "12年07月06日后",
			rate	: [ 0.040, 0.045]
		}										
	};
	//首页右侧房贷利率
	CALC_CONST.houseLoanRateRight = [ 
	
	["12.07.06后商贷基准", 6.40, 6.55],
	["12.07.06后公积金贷", 4.00, 4.50],
	["12.06.08后商贷基准", 6.65, 6.80],
	["12.06.08后公积金贷", 4.20, 4.70],
	["11.07.07后商贷基准", 6.90, 7.05],
	["11.07.07后公积金贷", 4.45, 4.90],
	["11.04.06后商贷基准", 6.65, 6.80],
	["11.04.06后公积金贷", 4.20, 4.70],
	["11.02.09后商贷基准", 6.45, 6.60],
	["11.02.09后公积金贷", 4.00, 4.50],
	["10.12.26后商贷基准", 6.22, 6.40],
	["10.12.26后公积金贷", 3.75, 4.30],
	["10.10.20后商贷基准", 5.96, 6.14],
	["10.10.20后公积金贷", 3.50, 4.05],
	["08.12.23后商贷基准", 5.76, 5.94],
	["08.12.23后商贷8折", 4.61, 4.75],
	["08.12.23后商贷7折", 4.03, 4.16],
	["08.12.23后公积金贷", 3.33, 3.87],
	["08.11.27后公积金贷", 3.51, 4.05]
	
	 ];
})(window);