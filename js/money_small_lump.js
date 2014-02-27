/**
 * 零存整取
 */
$( function(){//仅执行一次，每次都需初始化工作则不能有


    var $saveAmt = $("#saveAmt"),
        $rate = $("#rate"),
        $saveDate = $("#saveDate"),
        $depositPeriod = $("#depositPeriod");
    //年利率
    $("#rate").val(CALC_CONST.smallRate360);

    //利率随存储类型而改变
    $depositPeriod.change(function () {
        eval("var tmp=CALC_CONST.smallRate" + this.value);
        $("#rate").val(tmp);
        if (checkInput()) {
            moneySmallLump();
        }
    });

    $('.js_info input').change(function () {
        if (checkInput()) {
            moneySmallLump();
        } else {
            $("#fullAmt").html("0.00");
            $("#totalAmt").html("0.00");
        }

    });

    function checkInput() {
        if ($saveAmt.val() && $saveAmt.val() >= 5 && $saveDate.val() && $rate.val())
            return true;
        else
            return false;
    }

    function moneySmallLump(){
        var M = parseFloat( $saveAmt.val() ), A = M,
            R = parseFloat($rate.val()) / 100,
            D = Date.get( $saveDate.val() ),
            N = parseInt( $depositPeriod.val() ),
            specialDay = Date.get("1999-11-01"),
            diff = Date.diff(D, specialDay),
            B =0, Y=0 ,
            IR = parseFloat( CALC_CONST.interestRate );
        var T = N / 360;
        //累计存入金额
        A = A * ( N / 30 );

        //1999-11-01前存入的
        if ( diff < 0 ){
            //D +N < 1999-11-1
            R = R / 360;
            if ( Math.abs( diff ) > N ){
                B = A * R * N + A;
                Y = 0;
            }else{
                // D + N >= 1999-11-1
                Y = IR * A * ( N - Math.abs( diff ) ) * R;
                B = A + A*N*R - Y;
            }
        }else{
            // D > 1999-11-1
            //Y = A * R * N * IR;
            var SumR = M * R * ( ( T + 1/12 ) * 12 * T / 2 );
            Y = SumR * IR;
            B = A + SumR - Y;
        }

        $("#totalAmt").html( A.toFixed(2) );
        $("#fullAmt").html( B.toFixed(2) );
        //$("#edTaxSum").html( Y.toFixed(2) );

    }

} );