Date.get = function( str ){
	var arr = str.split("-"),
		d = new Date();
	
	d.setFullYear( arr[0], arr[1] - 1, arr[2] );
	d.setHours(0,0,0,0);
	return d;
};
Date.prototype.serialize = function(){
	var m = this.getMonth() + 1;
	return this.getFullYear() + "-" + (m > 9 ? m : "0"+m ) + "-" + this.getDate();
};
Date.diff = function( date1, date2  ){
	//算自然天数
	return Math.floor( (date1.getTime() - date2.getTime()) / (1000 * 3600 * 24) );
	//舍弃
	var year=date1.getFullYear() - date2.getFullYear();
	var month=date1.getMonth() - date2.getMonth();
	var day=date1.getDate() - date2.getDate();				
	return year*12*30+month*30+day;
};