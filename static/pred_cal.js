var per = document.getElementById("per");
var bar= document.querySelector(".progress-bar");
var testbtn= document.getElementById("start-button");


//Control table row color
var chgcolor = 0;
var alertcount = 0;


//Config User info
var uid;
var ucamp;
var uname;
var ugender;
var uage;
var ulocat;
var mbal;

//Product List
var over4000;
var choose_over4000 = [];

var daily_travel;
var choose_travel = [];

var daily_dining;
var choose_dining = [];

var daily_wellness;
var choose_wellness = [];

var daily_shopping;
var choose_shopping = [];

var daily_payment;
var choose_paymment = [];

//Calculated Percentage
var curr_percentage;
var add_on_mile = 0;

window.onload = function(){

    var opt_over4000 = document.getElementById("opt_over4000");
    opt_over4000.style.display = "block";
    var opt_daily = document.getElementById("opt_daily");
    opt_daily.style.display = "none";

    //Get user info first
    //Randomly Select One User From The Database
    fetch('/api/cal_get_user_info', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response data from the Flask API
        uid = data.uid;
        ucamp = data.ucamp;
        uname = data.uname;
        ugender = data.ugender;
        uage = data.uage;
        mbal = data.mbal;
        mtar = data.mtar;
        uloc = data.uloc;

        document.getElementById("uid").textContent =  uid;
        document.getElementById("ucomp").textContent = ucamp;
        document.getElementById("uloc").textContent = uloc;
        document.getElementById("uname").textContent = 'Welcome! ' +uname;
        document.getElementById("mbal").innerHTML = '<img src="../static/mileslg.png" width=10px>'+ mbal;

        document.getElementById("cside").textContent=mbal;
        document.getElementById("tside").textContent=mtar;
        var bar= document.querySelector(".progress-bar");

        curr_percentage = mbal/mtar*100;
        if (curr_percentage>100){
            bar.style.width = 100 + '%';
            var per = document.getElementById("per");
            per.textContent=100+ '%';  
            congrat_func('Congrats! You already met the target!');
            alertcount = alertcount +1;
        }
        else{
            bar.style.width = curr_percentage.toFixed(2) + '%';
            var per = document.getElementById("per");
            per.textContent=curr_percentage.toFixed(2) + '%';            
        }


    })
    .catch(error => {
    // Handle any errors that occur during the request
    console.error(error);
    });

    //Generate Div Options
    fetch('/api/get_reward_info', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response data from the Flask API
        var over4000 = data['over4000']
        var daily_travel = data['daily_travel']
        var daily_dining = data['daily_dining']
        var daily_wellness = data['daily_wellness']
        var daily_shopping = data['daily_shopping']
        var daily_payment = data['daily_payment']

        // var over4000;
        // var choose_over4000 = [];

        // var daily_travel;
        // var choose_travel = [];

        // var daily_dining;
        // var choose_dining = [];

        // var daily_wellness;
        // var choose_wellness = [];

        // var daily_shopping;
        // var choose_shopping = [];

        // var daily_payment;
        // var choose_paymment = [];
        var o4000_parentDiv = document.getElementById("opt_over4000");
        show_in_web(o4000_parentDiv, over4000, choose_over4000);

        var dt_parentDiv = document.getElementById("d_daily_travel");
        show_in_web(dt_parentDiv, daily_travel, choose_travel);

        var dd_parentDiv = document.getElementById("d_daily_dining");
        show_in_web(dd_parentDiv, daily_dining, choose_dining);

        var dw_parentDiv = document.getElementById("d_daily_wellness");
        show_in_web(dw_parentDiv, daily_wellness, choose_wellness);

        var ds_parentDiv = document.getElementById("d_daily_shopping");
        show_in_web(ds_parentDiv, daily_shopping, choose_shopping);

        var dp_parentDiv = document.getElementById("d_daily_payment");
        show_in_web(dp_parentDiv, daily_payment, choose_paymment);


        // Get the parent div element
        // var parentDiv = document.getElementById("opt_over4000");

        // // Loop through the over4000 list and create div elements
        // for (var i = 0; i < over4000.length; i++) {
        //     var product = over4000[i].product;
        //     var miles = over4000[i].miles;

        //     // Create a new div element
        //     var div = document.createElement("div");
        //     div.className = 'but';
        //     div.id= product;
        //     choose_dining.push(0);

        //     div.onclick = function() {
        //     //Get the id of the click div
        //         var targetstr = this.id;

        //         // Variable to store the index of the matched dictionary
        //         var targetIndex = -1;

        //         // Iterate over the product: list of dictionaries
        //         for (var i = 0; i < over4000.length; i++) {
        //         // Check if the current dictionary's product property matches the target string
        //         if (over4000[i].product === targetstr) {
        //             targetIndex = i; // Store the index of the matched dictionary
        //             break; // Exit the loop since we found a match
        //         }
        //         }

        //         // Check whether the user select it before
        //         var selected = choose_over4000[targetIndex] 

        //         //If haven't selected
        //         if(selected == 0){
        //             // Change box shadow, background color, and text color
        //             this.style.webkitBoxShadow = "0px 5px 13px 7px rgba(0,0,0,0.86)";
        //             this.style.boxShadow = "0px 5px 13px 7px rgba(0,0,0,0.86)";
        //             this.style.backgroundColor = "rgb(24, 137, 145)";
        //             this.style.color = "white";
        //             choose_over4000[targetIndex] = 1;
        //             console.log(choose_over4000);
        //             add_to_table(0, this.id, over4000[targetIndex].miles);
        //         }
        //         //If selected
        //         else{
        //             // Change box shadow, background color, and text color
        //             this.style.webkitBoxShadow = "0px 5px 12px 2px rgba(0,0,0,0.52)";
        //             this.style.boxShadow = "0px 5px 12px 2px rgba(0,0,0,0.52)";
        //             this.style.backgroundColor = "white";
        //             this.style.color = "black";
        //             choose_over4000[targetIndex] = 0;
        //             console.log(choose_over4000);
        //             add_to_table(1, this.id, over4000[targetIndex].miles);
        //         }
        //     };
        //     // Create two paragraph elements for product and miles info
        //     var productParagraph = document.createElement("p");
        //     productParagraph.textContent = product;
        //     var milesParagraph = document.createElement("p");
        //     milesParagraph.textContent = "Miles: " + miles;

        //     // Append the paragraphs to the div element
        //     div.appendChild(productParagraph);
        //     div.appendChild(milesParagraph);

        //     // Append the div element to the parent div
        //     parentDiv.appendChild(div);

        //     choose_over4000.push(0);
        // }
        
    })
    .catch(error => {
    // Handle any errors that occur during the request
    console.error(error);
    });
}

//Item Selected Table

//Auto scroll to bottom in table
function scrollToBottom() {
    var scrollableDiv = document.getElementById("table0");
    scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
}

//Add/Min Items
function add_to_table(types, prod_name, miles){
    //Get the table elements
    var tbody = document.getElementById("tablebody");

    //Add item
    if(types== 0){
        var newRow = tbody.insertRow();
        var DescCell = newRow.insertCell();
        var qtyCell = newRow.insertCell();
    
        DescCell.textContent = prod_name;
        DescCell.style.textAlign = "left";
        qtyCell.innerHTML = miles;
    
        if(chgcolor%2==0){
          DescCell.style.backgroundColor = "WhiteSmoke";
          qtyCell.style.backgroundColor = "WhiteSmoke";
        }
        chgcolor++;
        recal();
        scrollToBottom();
        add_on_mile = Number(Number(add_on_mile) + Number(miles));

        curr_percentage = Number(mbal+ add_on_mile)/mtar*100;

        var per = document.getElementById("per");
        var perint = parseInt(per.textContent);

        if (curr_percentage>100){
            bar.style.width = 100 + '%';
            per.textContent=100+ '%';  
            if (alertcount ==0){
                congrat_func('Congrats! You meet the target!')
                alertcount = alertcount +1;
            }
        }
        else{
            bar.style.width = curr_percentage.toFixed(2) + '%';
            var per = document.getElementById("per");
            per.textContent=curr_percentage.toFixed(2) + '%';            
        }

    }

    //Remove item
    else{
        var maint = document.getElementById("tablebody");
        var rows = maint.getElementsByTagName("tr");
        var n = rows.length;

        if (n ==0){
            return;
        }
        else {
            var n = rows.length -1;
            var lastestr = rows[n];

            var tableCells = lastestr.getElementsByTagName("td");
            var secondCell = tableCells[1];

            //Calculate the new total qty
            var total = document.getElementById("totalqty");
            total.innerHTML = (Number(total.innerHTML) - Number(secondCell.innerHTML)).toString();

            lastestr.remove();
        }
        scrollToBottom();
        
        add_on_mile = Number(Number(add_on_mile) - Number(miles));

        curr_percentage = (mbal+ add_on_mile)/mtar*100;
        
        var per = document.getElementById("per");
        var perint = parseInt(per.textContent);
        console.log((perint));

        if (curr_percentage>100){
            bar.style.width = 100 + '%';
            per.textContent=100+ '%';  
            if (alertcount ==0){
                congrats('Congrats! You meet the target!');
                alertcount = alertcount +1;
            }
        }
        else{
            bar.style.width = curr_percentage.toFixed(2) + '%';
            var per = document.getElementById("per");
            per.textContent=curr_percentage.toFixed(2) + '%';            
        }
    }
}
//recal function: total qty
function recal() {
    var total = document.getElementById("totalqty");
    var maint = document.getElementById("tablebody");
    var rows = maint.getElementsByTagName("tr");

    var subtotal = 0;

    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var tableCells = row.getElementsByTagName("td");
        var secondCell = tableCells[1];
        subtotal = Number(subtotal) + Number(secondCell.innerHTML);
    }

    total.innerHTML = subtotal.toString();
}

function congrat_func(congrattext) {
    var overlay = document.getElementById("overlay");
    overlay.style.display = "block";
  
    // Create a container for the popup
    var popupContainer = document.createElement("div");
    popupContainer.classList.add("popup-container");
  
    // Create the message element
    var message = document.createElement("p");
    message.textContent = congrattext;
  
    // Create "Yes" button
    var yesButton = document.createElement("button");
    yesButton.textContent = "OK";
    yesButton.addEventListener("click", function() {
      closePopup();
    });
  
  
    // Add elements to the container
    popupContainer.appendChild(message);
    popupContainer.appendChild(yesButton);
  
    // Add the container to the document
    document.body.appendChild(popupContainer);
  }
  
function closePopup() {
    var overlay = document.getElementById("overlay");
    overlay.style.display = "none";
    var popupContainer = document.querySelector(".popup-container");
    if (popupContainer) {
        // Remove the popup container from the document
        popupContainer.remove();
    }
}


//Displaying Options
function show_in_web(parentDiv, prodlist, binarylist){

    // Loop through the over4000 list and create div elements
    for (var i = 0; i < prodlist.length; i++) {
        var product = prodlist[i].product;
        var miles = prodlist[i].miles;
        console.log(miles);

        // Create a new div element
        var div = document.createElement("div");
        div.className = 'but';
        div.id= product;
        choose_dining.push(0);

        div.onclick = function() {
        //Get the id of the click div
            var targetstr = this.id;

            // Variable to store the index of the matched dictionary
            var targetIndex = -1;

            // Iterate over the product: list of dictionaries
            for (var i = 0; i < prodlist.length; i++) {
            // Check if the current dictionary's product property matches the target string
            if (prodlist[i].product === targetstr) {
                targetIndex = i; // Store the index of the matched dictionary
                break; // Exit the loop since we found a match
            }
            }

            // Check whether the user select it before
            var selected = binarylist[targetIndex] 

            //If haven't selected
            if(selected == 0){
                // Change box shadow, background color, and text color
                this.style.webkitBoxShadow = "0px 5px 13px 7px rgba(0,0,0,0.86)";
                this.style.boxShadow = "0px 5px 13px 7px rgba(0,0,0,0.86)";
                this.style.backgroundColor = "rgb(24, 137, 145)";
                this.style.color = "white";
                binarylist[targetIndex] = 1;
                console.log(binarylist);
                add_to_table(0, this.id, prodlist[targetIndex].miles);
            }
            //If selected
            else{
                // Change box shadow, background color, and text color
                this.style.webkitBoxShadow = "0px 5px 12px 2px rgba(0,0,0,0.52)";
                this.style.boxShadow = "0px 5px 12px 2px rgba(0,0,0,0.52)";
                this.style.backgroundColor = "white";
                this.style.color = "black";
                binarylist[targetIndex] = 0;
                console.log(binarylist);
                add_to_table(1, this.id, prodlist[targetIndex].miles);
            }
        };
        // Create two paragraph elements for product and miles info
        var productParagraph = document.createElement("p");
        productParagraph.textContent = product;
        var milesParagraph = document.createElement("p");
        milesParagraph.textContent = "Miles: " + miles;

        // Append the paragraphs to the div element
        div.appendChild(productParagraph);
        div.appendChild(milesParagraph);

        // Append the div element to the parent div
        parentDiv.appendChild(div);

        binarylist.push(0);
    }
    }

var head_over4000 = document.getElementById('opt_over4000')
head_over4000.style.display = "none";

function p_bigreward(){
    //Highlighed the selected heading
    var h_over4000 = document.getElementById("h_over4000");
    h_over4000.style.backgroundColor = "darkgrey";

    var h_daily = document.getElementById("h_daily"); 
    h_daily.style.backgroundColor = "lightgrey";

    //Showing elements
    var opt_over4000 = document.getElementById("opt_over4000");
    opt_over4000.style.display = "block";
    var opt_daily = document.getElementById("opt_daily");
    opt_daily.style.display = "none";
}

function p_dailymoment(){
    //Highlighed the selected heading
    var h_over4000 = document.getElementById("h_over4000");
    h_over4000.style.backgroundColor = "lightgrey";

    var h_daily = document.getElementById("h_daily"); 
    h_daily.style.backgroundColor = "darkgrey";

    //Showing elements
    var opt_over4000 = document.getElementById("opt_over4000");
    opt_over4000.style.display = "none";
    var opt_daily = document.getElementById("opt_daily");
    opt_daily.style.display = "block";
    p_daily_travel();
}

function p_daily_travel(){
    var dt = document.getElementById('d_daily_travel');
    dt.style.display = "block";
    var dd = document.getElementById('d_daily_dining');
    dd.style.display = "none";
    var dw = document.getElementById('d_daily_wellness');
    dw.style.display = "none";
    var ds = document.getElementById('d_daily_shopping');
    ds.style.display = "none";
    var dp = document.getElementById('d_daily_payment');
    dp.style.display = "none";

    var dt = document.getElementById('h_daily_travel');
    dt.style.backgroundColor = "darkgrey";
    var dd = document.getElementById('h_daily_dining');
    dd.style.backgroundColor = "lightgrey";
    var dw = document.getElementById('h_daily_wellness');
    dw.style.backgroundColor = "lightgrey";
    var ds = document.getElementById('h_daily_shopping');
    ds.style.backgroundColor = "lightgrey";
    var dp = document.getElementById('h_daily_payment');
    dp.style.backgroundColor = "lightgrey";
}
function p_daily_dining(){
    var dt = document.getElementById('d_daily_travel');
    dt.style.display = "none";
    var dd = document.getElementById('d_daily_dining');
    dd.style.display = "block";
    var dw = document.getElementById('d_daily_wellness');
    dw.style.display = "none";
    var ds = document.getElementById('d_daily_shopping');
    ds.style.display = "none";
    var dp = document.getElementById('d_daily_payment');
    dp.style.display = "none";

    var dt = document.getElementById('h_daily_travel');
    dt.style.backgroundColor = "lightgrey";
    var dd = document.getElementById('h_daily_dining');
    dd.style.backgroundColor = "darkgrey";
    var dw = document.getElementById('h_daily_wellness');
    dw.style.backgroundColor = "lightgrey";
    var ds = document.getElementById('h_daily_shopping');
    ds.style.backgroundColor = "lightgrey";
    var dp = document.getElementById('h_daily_payment');
    dp.style.backgroundColor = "lightgrey";
}
function p_daily_wellness(){
    var dt = document.getElementById('d_daily_travel');
    dt.style.display = "none";
    var dd = document.getElementById('d_daily_dining');
    dd.style.display = "none";
    var dw = document.getElementById('d_daily_wellness');
    dw.style.display = "block";
    var ds = document.getElementById('d_daily_shopping');
    ds.style.display = "none";
    var dp = document.getElementById('d_daily_payment');
    dp.style.display = "none";

    var dt = document.getElementById('h_daily_travel');
    dt.style.backgroundColor = "lightgrey";
    var dd = document.getElementById('h_daily_dining');
    dd.style.backgroundColor = "lightgrey";
    var dw = document.getElementById('h_daily_wellness');
    dw.style.backgroundColor = "darkgrey";
    var ds = document.getElementById('h_daily_shopping');
    ds.style.backgroundColor = "lightgrey";
    var dp = document.getElementById('h_daily_payment');
    dp.style.backgroundColor = "lightgrey";
}
function p_daily_shopping(){
    var dt = document.getElementById('d_daily_travel');
    dt.style.display = "none";
    var dd = document.getElementById('d_daily_dining');
    dd.style.display = "none";
    var dw = document.getElementById('d_daily_wellness');
    dw.style.display = "none";
    var ds = document.getElementById('d_daily_shopping');
    ds.style.display = "block";
    var dp = document.getElementById('d_daily_payment');
    dp.style.display = "none";

    var dt = document.getElementById('h_daily_travel');
    dt.style.backgroundColor = "lightgrey";
    var dd = document.getElementById('h_daily_dining');
    dd.style.backgroundColor = "lightgrey";
    var dw = document.getElementById('h_daily_wellness');
    dw.style.backgroundColor = "lightgrey";
    var ds = document.getElementById('h_daily_shopping');
    ds.style.backgroundColor = "darkgrey";
    var dp = document.getElementById('h_daily_payment');
    dp.style.backgroundColor = "lightgrey";
}
function p_daily_payment(){
    var dt = document.getElementById('d_daily_travel');
    dt.style.display = "none";
    var dd = document.getElementById('d_daily_dining');
    dd.style.display = "none";
    var dw = document.getElementById('d_daily_wellness');
    dw.style.display = "none";
    var ds = document.getElementById('d_daily_shopping');
    ds.style.display = "none";
    var dp = document.getElementById('d_daily_payment');
    dp.style.display = "block";

    var dt = document.getElementById('h_daily_travel');
    dt.style.backgroundColor = "lightgrey";
    var dd = document.getElementById('h_daily_dining');
    dd.style.backgroundColor = "lightgrey";
    var dw = document.getElementById('h_daily_wellness');
    dw.style.backgroundColor = "lightgrey";
    var ds = document.getElementById('h_daily_shopping');
    ds.style.backgroundColor = "lightgrey";
    var dp = document.getElementById('h_daily_payment');
    dp.style.backgroundColor = "darkgrey";
}