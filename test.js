
let a = [
    {env: '067'},
    {env: '38077'},
    {env: '93'},
    {env: '027'},
    {env: '017'},
];
$('#getSegment').on('click',function () {
   a.forEach(function (el, i, arr) {
       if (el.env[0] === '0' ){
        console.log('38'+el.env)

       }else if (el.env[0] === '3') {
           console.log(el.env,'nachinaetsya s trex');
       } else if (el.env[0] === 1||2||3||4||5||6||7||8||9) {
           console.log('380'+el.env);
       }
       console.log('xyi');
   });



    // console.log(asdasd)

});