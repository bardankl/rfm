document.getElementById('file-object').addEventListener("change", function(e) {
    let files = e.target.files,file;
    if (!files || files.length == 0) return;
    file = files[0];
    let fileReader = new FileReader();
    fileReader.onload = function (e) {
        let filename = file.name;
        // pre-process data
        let binary = "";
        let bytes = new Uint8Array(e.target.result);
        let length = bytes.byteLength;
        for (let i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        let oFile = XLSX.read(binary, {type: 'binary', cellDates:true, cellStyles:true});
        let sheet_name = oFile.SheetNames[0];
        let parsedUsersListArr = XLSX.utils.sheet_to_json(oFile.Sheets[sheet_name], {
            blankrows: true,
            defval: null
        }).splice(8, );
        console.log(parsedUsersListArr[0]);
        //TODO insert all functions
        let clearUserArray = [];
        let vipConditions = [112, 122, 132, 111, 211, 311, 121, 321, 331, 221, 131];
        let asConditions = [212, 222, 232, 231];
        let lowConditions = [312, 322, 113, 213, 123, 223, 133, 233];
        let zeroConditions = [333, 323, 332, 313];
        let vip = [];
        let as = [];
        let low = [];
        let zero = [];
        const User = function (name,phone,email, goods, money, orders, date, dateForCalc,days, recency = 0, frequency =0, monetary = 0) {
            this.userName = name;
            this.phone = phone;
            this.email = email;
            this.amountOfGoods = goods;
            this.money =money;
            this.ordersQuantity = orders;
            this.lastPurchaseDate = date;
            this.dateForCalc = dateForCalc;
            this.daysFromLastPurchase = days;
            this.recency = recency;
            this.frequency = frequency;
            this.monetary = monetary;
            this.averageCheck = money/orders+"$";
            this.RFM = recency+''+frequency+''+monetary;
        };


        // let nameClear = function(obj,i, arr) { ///remove int before name
        //     let x = arr[i].Name;
        //     arr[i].name = x;
        // };
        // parsedUsersListArr.forEach(nameClear);


        // let clearContacts = function (obj,i, arr) { //separate contacts
        //     let telephone = obj.Contacts.slice(2, 15);
        //
        //     if (telephone[0] === '0') {
        //
        //         arr[i].telephone = '38'+telephone;
        //
        //     }else if (telephone[0] === '3' || '+3' ){
        //
        //         arr[i].telephone = telephone;
        //
        //     }else if (telephone[0] === '8') {
        //
        //         arr[i].telephone = ('3'+telephone);
        //
        //     } else {
        //         arr[i].telephone = telephone;
        //     }
        //
        //
        //
        //     arr[i].telephone = telephone;
        //
        //
        //
        //     let email = obj.Contacts.slice(15,100);
        //
        //     if(email.length<=2){
        //         arr[i].email = 'There is no user email'
        //     }else{
        //
        //         arr[i].email = email;
        //     }
        //
        // };
        // parsedUsersListArr.forEach(clearContacts);
        // // console.log(parsedUsersListArr[1]);

        // let clearPurchGoods = function (obj,i,arr) {//clear quantity of purchased goods
        //
        //     obj.goods = obj.AmountOfGoods
        //
        // };
        // parsedUsersListArr.forEach(clearPurchGoods);

        let clearMoneyGETMonetary = function (obj,i,arr) {//clear user money
            console.log();
            let x;
            if(obj.__EMPTY_12){

                x = parseInt(obj.__EMPTY_12.replace(/[^0-9]+/g,''));
                obj.money = x;
            }

            if(x>=3000){
                obj.monetary = 1;
            }else if (x<3000 && x>600) {
                obj.monetary = 2;
            }else {
                obj.monetary = 3;
            }
        };
        parsedUsersListArr.forEach(clearMoneyGETMonetary);

        let clearOrdersQuantityGETFrequancy = function (obj,i,arr) {//clear user quantity orders
            let x;
            if(obj.__EMPTY_13) {
                x = obj.__EMPTY_13;
            }

            if(x>=4){
                obj.frequency = 1;
            }else if (x<4 && x>1) {
                obj.frequency = 2;
            }else {
                obj.frequency = 3;
            }

        };
        parsedUsersListArr.forEach(clearOrdersQuantityGETFrequancy);

        let clearLastPurchDate = function (obj,i,arr) {//clear last Purchase date

            if(obj.__EMPTY_15) {
                obj.date = obj.__EMPTY_15;


                let dateSplit = obj.date.split('.');
                let rightDate = dateSplit[1] + '/' + dateSplit[0] + "/20" + dateSplit[2];
                obj.dateForCalc = rightDate;
                let dateNow = new Date();
                let dateRight = new Date(rightDate);
                let timeDiff = Math.abs(dateRight.getTime() - dateNow.getTime());
                let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                obj.days = diffDays;
                if(diffDays<=90){
                    obj.recency =1;
                }else if (diffDays>90 && diffDays<=240) {
                    obj.recency =2;
                }else {
                    obj.recency =3;
                }
            }


        };
        parsedUsersListArr.forEach(clearLastPurchDate);

        let creatClearUserArray = function (obj,i,arr) {

            let user = new User(obj.__EMPTY_4, obj.__EMPTY_7, obj.__EMPTY_10, obj.__EMPTY_11, obj.money, obj.__EMPTY_13, obj.date, obj.dateForCalc,obj.days,obj.recency, obj.frequency, obj.monetary);
            clearUserArray.push(user)

        };
        parsedUsersListArr.forEach(creatClearUserArray);
        let separateClients = function (obj,i,arr) {
            let k = +obj.RFM;
            if(vipConditions.includes(k)){
                vip.push(obj);

            } else if (asConditions.includes(k)){
                as.push(obj)
            }else if (lowConditions.includes(k)) {
                low.push(obj)
            } else if (zeroConditions.includes(k)) {
                zero.push(obj)
            }

        };
        clearUserArray.forEach(separateClients);

        let rfm111 = [];
        let rfm112 = [];
        let rfm113 = [];
        let rfm121 = [];
        let rfm122 = [];
        let rfm123 = [];
        let rfm131 = [];
        let rfm132 = [];
        let rfm133 = [];
        let rfm211 = [];
        let rfm212 = [];
        let rfm213 = [];
        let rfm221 = [];
        let rfm222 = [];
        let rfm223 = [];
        let rfm231 = [];
        let rfm232 = [];
        let rfm233 = [];
        let rfm311 = [];
        let rfm312 = [];
        let rfm313 = [];
        let rfm321 = [];
        let rfm322 = [];
        let rfm323 = [];
        let rfm331 = [];
        let rfm332 = [];
        let rfm333 = [];
        const rfmSeparate = function (obj,i,arr) {
            let k = obj.RFM;
            if (k.includes(111)) {
                rfm111.push(obj);
            }else if (k.includes(112)) {
                rfm112.push(obj);
            }
            else if (k.includes(113)) {
                rfm113.push(obj);
            }
            else if (k.includes(121)) {
                rfm121.push(obj);
            }
            else if (k.includes(122)) {
                rfm122.push(obj);
            }
            else if (k.includes(123)) {
                rfm123.push(obj);
            }
            else if (k.includes(131)) {
                rfm131.push(obj);
            }
            else if (k.includes(132)) {
                rfm132.push(obj);
            }
            else if (k.includes(133)) {
                rfm133.push(obj);
            }
            else if (k.includes(211)) {
                rfm211.push(obj);
            }
            else if (k.includes(212)) {
                rfm212.push(obj);
            }
            else if (k.includes(213)) {
                rfm213.push(obj);
            }
            else if (k.includes(221)) {
                rfm221.push(obj);
            }
            else if (k.includes(222)) {
                rfm222.push(obj);
            }
            else if (k.includes(223)) {
                rfm223.push(obj);
            }
            else if (k.includes(231)) {
                rfm231.push(obj);
            }
            else if (k.includes(232)) {
                rfm232.push(obj);
            }
            else if (k.includes(233)) {
                rfm233.push(obj);
            }
            else if (k.includes(311)) {
                rfm311.push(obj);
            }
            else if (k.includes(312)) {
                rfm312.push(obj);
            }
            else if (k.includes(313)) {
                rfm313.push(obj);
            }
            else if (k.includes(321)) {
                rfm321.push(obj);
            }
            else if (k.includes(322)) {
                rfm322.push(obj);
            }
            else if (k.includes(323)) {
                rfm323.push(obj);
            }
            else if (k.includes(331)) {
                rfm331.push(obj);
            }
            else if (k.includes(332)) {
                rfm332.push(obj);
            }
            else if (k.includes(333)) {
                rfm333.push(obj);
            }

        };
        clearUserArray.forEach(rfmSeparate);



        //ADD QUANTITY TO SEGMENTS
        $('#getSegment').on('click', function () {
            $('#rfmTable').hide();
            $('.clientContainer, .teg').remove();

            let $vip = $('#vipQ');
            let $as = $('#avQ');
            let $low = $('#lowQ');
            let $zero = $('#zeroQ');
            $vip.text('');
            $as.text('');
            $low.text('');
            $zero.text('');
            $vip.append(vip.length);
            $as.append(as.length);
            $low.append(low.length);
            $zero.append(zero.length);

            vip.forEach(function (obj, i, arr) {
                let  $clientTr = $('<tr class="client"><th class="number"></th><th class="name"></th><th class="phone"></th><th class="email"></th><th class="money"></th><th class="avCheck"></th><th class="quantity"></th><th class="orders"></th><th class="date"></th><th class="rfm"></th></tr>');
                $('.number', $clientTr).text(i+1);
                $('.name', $clientTr).text(obj.userName);
                $('.phone', $clientTr).text(obj.phone);
                $('.email', $clientTr).text(obj.email);
                $('.money', $clientTr).text(obj.money);
                $('.avCheck', $clientTr).text(obj.averageCheck);
                $('.quantity', $clientTr).text(obj.amountOfGoods);
                $('.orders', $clientTr).text(obj.ordersQuantity);
                $('.date', $clientTr).text(obj.lastPurchaseDate);
                $('.rfm', $clientTr).text(obj.RFM);
                console.log(obj.phone);
                // return $clientTr;
                $('#clientsSegmentsVIP').append($clientTr)
            });
            as.forEach(function (obj, i, arr) {
                let  $clientTr = $('<tr class="client"><th class="number"></th><th class="name"></th></th><th class="phone"></th><th class="email"></th><th class="money"></th><th class="avCheck"></th><th class="quantity"></th><th class="orders"></th><th class="date"></th><th class="rfm"></th></tr>');
                $('.number', $clientTr).text(i+1);
                $('.name', $clientTr).text(obj.userName);
                $('.phone', $clientTr).text(obj.phone);
                $('.email', $clientTr).text(obj.email);
                $('.money', $clientTr).text(obj.money);
                $('.avCheck', $clientTr).text(obj.averageCheck);
                $('.quantity', $clientTr).text(obj.amountOfGoods);
                $('.orders', $clientTr).text(obj.ordersQuantity);
                $('.date', $clientTr).text(obj.lastPurchaseDate);
                $('.rfm', $clientTr).text(obj.RFM);

                // return $clientTr;
                $('#clientsSegmentsAs').append($clientTr)
            });
            low.forEach(function (obj, i, arr) {
                let  $clientTr = $('<tr class="client"><th class="number"></th><th class="name"></th></th><th class="phone"></th><th class="email"></th><th class="money"></th><th class="avCheck"></th><th class="quantity"></th><th class="orders"></th><th class="date"></th><th class="rfm"></th></tr>');
                $('.number', $clientTr).text(i+1);
                $('.name', $clientTr).text(obj.userName);
                $('.phone', $clientTr).text(obj.phone);
                $('.email', $clientTr).text(obj.email);
                $('.money', $clientTr).text(obj.money);
                $('.avCheck', $clientTr).text(obj.averageCheck);
                $('.quantity', $clientTr).text(obj.amountOfGoods);
                $('.orders', $clientTr).text(obj.ordersQuantity);
                $('.date', $clientTr).text(obj.lastPurchaseDate);
                $('.rfm', $clientTr).text(obj.RFM);

                // return $clientTr;
                $('#clientsSegmentsLow').append($clientTr)
            });
            zero.forEach(function (obj, i, arr) {
                let  $clientTr = $('<tr class="client"><th class="number"></th><th class="name"></th></th><th class="phone"></th><th class="email"></th><th class="money"></th><th class="avCheck"></th><th class="quantity"></th><th class="orders"></th><th class="date"></th><th class="rfm"></th></tr>');
                $('.number', $clientTr).text(i+1);
                $('.name', $clientTr).text(obj.userName);
                $('.phone', $clientTr).text(obj.phone);
                $('.email', $clientTr).text(obj.email);
                $('.money', $clientTr).text(obj.money);
                $('.avCheck', $clientTr).text(obj.averageCheck);
                $('.quantity', $clientTr).text(obj.amountOfGoods);
                $('.orders', $clientTr).text(obj.ordersQuantity);
                $('.date', $clientTr).text(obj.lastPurchaseDate);
                $('.rfm', $clientTr).text(obj.RFM);

                // return $clientTr;
                $('#clientsSegmentsZero').append($clientTr)
            })






        });
        $('#getVipPhones').on('click', function () {
            $('.clientContainer, .teg').remove();
            $('.buttons').append('<h1 class="teg">Телефоны Випов</h1>');
            vip.forEach(function (obj, i, arr) {
                if (obj.phone) {
                if(obj.phone.length >2) {
                    let  $clientPhone = $('<div class="clientContainer"><p class="clientPhone"></p></div>');
                    $('.clientPhone', $clientPhone).text(obj.phone);
                    $('.buttons').append($clientPhone);
                }}

            })
        });
        $('#getVipEmails').on('click', function () {
            $('.clientContainer, .teg').remove();
            $('.buttons').append('<h1 class="teg">Имэйлы  Випов</h1>');
            vip.forEach(function (obj, i, arr) {
                if (obj.email) {
                if(obj.email.includes('@')) {
                    let  $clientPhone = $('<div class="clientContainer"><p class="clientPhone"></p></div>');
                    $('.clientPhone', $clientPhone).text(obj.email);
                    $('.buttons').append($clientPhone);
                }}

            })
        });
        $('#getAsPhones').on('click', function () {
            $('.clientContainer, .teg').remove();
            $('.buttons').append('<h1 class="teg">Телефоны AS</h1>');
            as.forEach(function (obj, i, arr) {
                if (obj.phone) {
                if(obj.phone.length >2) {
                    let  $clientPhone = $('<div class="clientContainer"><p class="clientPhone"></p></div>');
                    $('.clientPhone', $clientPhone).text(obj.phone);
                    $('.buttons').append($clientPhone);
                }}

            })
        });
        $('#getAsEmails').on('click', function () {
            $('.clientContainer, .teg').remove();
            $('.buttons').append('<h1 class="teg">Имэйлы  AS</h1>');
            as.forEach(function (obj, i, arr) {
                if (obj.email) {
                if(obj.email.includes('@')) {
                    let  $clientPhone = $('<div class="clientContainer"><p class="clientPhone"></p></div>');
                    $('.clientPhone', $clientPhone).text(obj.email);
                    $('.buttons').append($clientPhone);
                }}

            })
        });
        $('#getLowPhones').on('click', function () {
            $('.clientContainer, .teg').remove();
            $('.buttons').append('<h1 class="teg">Телефоны LOW</h1>');
            low.forEach(function (obj, i, arr) {
                if (obj.phone) {
                if(obj.phone.length >2) {
                    let  $clientPhone = $('<div class="clientContainer"><p class="clientPhone"></p></div>');
                    $('.clientPhone', $clientPhone).text(obj.phone);
                    $('.buttons').append($clientPhone);
                }}

            })
        });
        $('#getLowEmails').on('click', function () {
            $('.clientContainer, .teg').remove();
            $('.buttons').append('<h1 class="teg">Имэйлы  LOW</h1>');
            low.forEach(function (obj, i, arr) {
                if (obj.email) {
                if(obj.email.includes('@')) {
                    let  $clientPhone = $('<div class="clientContainer"><p class="clientPhone"></p></div>');
                    $('.clientPhone', $clientPhone).text(obj.email);
                    $('.buttons').append($clientPhone);
                }}

            })
        });
        $('#getZeroPhones').on('click', function () {
            $('.clientContainer, .teg').remove();
            $('.buttons').append('<h1 class="teg">Телефоны ZERO</h1>');
            zero.forEach(function (obj, i, arr) {
                if (obj.phone) {
                if(obj.phone.length >2) {
                    let  $clientPhone = $('<div class="clientContainer"><p class="clientPhone"></p></div>');
                    $('.clientPhone', $clientPhone).text(obj.phone);
                    $('.buttons').append($clientPhone);
                }}

            })
        });
        $('#getZeroEmails').on('click', function () {
            $('.clientContainer, .teg').remove();
            $('.buttons').append('<h1 class="teg">Имэйлы  ZERO</h1>');
            zero.forEach(function (obj, i, arr) {
                if (obj.email) {
                if(obj.email.includes('@')) {
                    let  $clientPhone = $('<div class="clientContainer"><p class="clientPhone"></p></div>');
                    $('.clientPhone', $clientPhone).text(obj.email);
                    $('.buttons').append($clientPhone);
                }}

            })
        });


        $('#rfmGetSegmentation').on('click', function () {
            $('#rfmTable').toggle('.hide');
            console.log(rfm111.length);
            $('#111').text(rfm111.length);
            $('#112').text(rfm112.length);
            $('#113').text(rfm113.length);
            $('#121').text(rfm121.length);
            $('#122').text(rfm122.length);
            $('#123').text(rfm123.length);
            $('#131').text(rfm131.length);
            $('#132').text(rfm132.length);
            $('#133').text(rfm133.length);
            $('#211').text(rfm211.length);
            $('#212').text(rfm212.length);
            $('#213').text(rfm213.length);
            $('#221').text(rfm221.length);
            $('#222').text(rfm222.length);
            $('#223').text(rfm223.length);
            $('#231').text(rfm231.length);
            $('#232').text(rfm232.length);
            $('#233').text(rfm233.length);
            $('#311').text(rfm311.length);
            $('#312').text(rfm312.length);
            $('#313').text(rfm313.length);
            $('#321').text(rfm321.length);
            $('#322').text(rfm322.length);
            $('#323').text(rfm323.length);
            $('#331').text(rfm331.length);
            $('#332').text(rfm332.length);
            $('#333').text(rfm333.length);


        });




    };

    fileReader.readAsArrayBuffer(file);


});
