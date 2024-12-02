// Set-up Global variables:
var chathist;
var gptresp;
var functionality="";


//Config User info
var uid;
var ucamp;
var uname;
var ugender;
var uage;
var ulocat;
var mbal;

// Miles Needed
var miles_map = {
  "Aracaju (SE)": 16000,
  "Brasilia (DF)": 10000,
  "Campo Grande (MS)": 13000,
  "Florianopolis (SC)": 15000,
  "Natal (RN)": 18000,
  "Recife (PE)": 17000,
  "Rio de Janeiro (RJ)": 18000,
  "Salvador (BH)": 14000,
  "Sao Paulo (SP)": 15000
};

window.onload = function() {
  //Randomly Assign Location For Prediction
  var uloc = document.getElementById("uloc");
  var randloc = ['Aracaju (SE)', 'Brasilia (DF)', 
              'Campo Grande (MS)', 'Florianopolis (SC)',
              'Natal (RN)', 'Recife (PE)', 
              'Rio de Janeiro (RJ)', 'Salvador (BH)',
              'Sao Paulo (SP)'];

  var randomIndex = Math.floor(Math.random() * randloc.length);
  uloc.textContent = randloc[randomIndex];
  ulocat = randloc[randomIndex];
  //Randomly Select One User From The Database
  fetch('/api/get_user_info', {
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
      document.getElementById("uid").textContent =  uid;
      document.getElementById("ucomp").textContent = ucamp;
      document.getElementById("uname").textContent = 'Welcome! ' +uname;
      document.getElementById("mbal").innerHTML = '<img src="../static/mileslg.png" width=10px>'+ mbal;
    })
    .catch(error => {
      // Handle any errors that occur during the request
      console.error(error);
      scrollToBottom();
    });
};


//Auto scroll to bottom in chat box
function scrollToBottom() {
  var scrollableDiv = document.getElementById("blockofchat");
  scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
}

//Remove the chats after user selecting a feature to test
function removechat(){
  // Find all elements with the class "chats"
  const elementsWithChatsClass = document.querySelectorAll('.chats');

  // Loop through the found elements and remove each one
  elementsWithChatsClass.forEach(function(element) {
    element.remove();
  });
}


//Create HTML elements: User input
function addusercontent(query){
  // Create a container element for the user's message
  const container = document.createElement('div');
  //container.id = 'chats';
  container.classList.add('chats');

  // Create elements for the user's message
  const identifyElement = document.createElement('div');
  identifyElement.id = 'user_identify';
  identifyElement.innerHTML = '<img src="../static/user.png" width= 40px>';

  const chatContentElement = document.createElement('div');
  chatContentElement.id = 'user_chatcontent';
  chatContentElement.textContent = query;

  // Append the user's message elements to the container
  container.appendChild(identifyElement);
  container.appendChild(chatContentElement);
  return container;
}

//Create HTML elements: GPT output
function addGPTcontent(gptresp){
  // Create a container element for the GPT's response
  const container = document.createElement('div');
  container.classList.add('chats');

  // Create elements for the GPT's response
  const identifyElement = document.createElement('div');
  identifyElement.id = 'gpt_identify';
  identifyElement.innerHTML = '<img src="../static/paxi.jpg" width= 40px>';

  const chatContentElement = document.createElement('div');
  chatContentElement.id = 'gpt_chatcontent';
  chatContentElement.innerHTML = gptresp;

  // Append the GPT's response elements to the container
  container.appendChild(identifyElement);
  container.appendChild(chatContentElement);
  return container;
}

function askAnyElse() {
  var overlay = document.getElementById("overlay");
  overlay.style.display = "block";

  // Create a container for the popup
  var popupContainer = document.createElement("div");
  popupContainer.classList.add("popup-container");

  // Create the message element
  var message = document.createElement("p");
  message.textContent = "Did Paxi's answer your questions?";

  // Create "Yes" button
  var yesButton = document.createElement("button");
  yesButton.textContent = "Yes";
  yesButton.addEventListener("click", function() {
    // Handle "Yes" button click
    alert("Great! If you have any more questions, continue to ask!");
    closePopup();
  });

  // Create "No" button
  var noButton = document.createElement("button");
  noButton.textContent = "No";
  noButton.addEventListener("click", function() {
    // Handle "No" button click
    alert("It's unfortune to hear that, perhaps you may try with other functionalities.");
    closePopup();
    location.reload();
  });

  // Add elements to the container
  popupContainer.appendChild(message);
  popupContainer.appendChild(yesButton);
  popupContainer.appendChild(noButton);

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

document.addEventListener('DOMContentLoaded', function() {

  const chatBlockElement = document.getElementById('blockofchat');

  var tcButton = document.getElementById("tcButton");
  var deffunc = document.getElementById("defaultfuc");
  var emcal = document.getElementById("e_milesCal");

  const inputElement = document.getElementById('userquery');
  inputElement.disabled = true;

  tcButton.addEventListener("click", function() {
    functionality = "TC";
    alert("You are now trying the T&C querying function.")
    removechat();
    inputElement.disabled = false;
    tcButton.disabled = true;
    deffunc.disabled = true;
    emcal.disabled = true;
  });

  deffunc.addEventListener("click", function() {
    functionality = "Default";
    alert("You are now trying the normal chat function.")
    removechat();
    inputElement.disabled = false;
    tcButton.disabled = true;
    deffunc.disabled = true;
    emcal.disabled = true;
  });

  emcal.addEventListener("click", function() {
    functionality = "emilecal";
    alert("You are now trying the Calculate Earned Miles function.")
    removechat();
    inputElement.disabled = true;
    tcButton.disabled = true;
    deffunc.disabled = true;
    emcal.disabled = true;
    
    //Q1 pending notification
    var container = q1_pending();
    chatBlockElement.appendChild(container);

    //Q1 go prediction
    q1_flight_pred(chatBlockElement);

  });

  const formElement = document.getElementById('gptform');

  if (formElement && inputElement) {
    formElement.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent form submission
      var numberofchat = Array.from(document.querySelectorAll('#blockofchat > .chats')).length;
      console.log(numberofchat);

      // Get the value of the input field
      const query = inputElement.value.trim();
      if (query === '') {
        return; // Do nothing if the input box is empty or contains only whitespace
      }

      //Create user content elements
      container = addusercontent(query);
      scrollToBottom();

      // Append the container to the chat block
      chatBlockElement.appendChild(container);
      scrollToBottom();

      // Clear the input field
      inputElement.value = '';

      if (functionality == "Default") {
        if (numberofchat == 0) {
          fetch('/api/defaultchatgpt', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: query })
          })
            .then(response => response.json())
            .then(data => {
              // Handle the response data from the Flask API
              chathist = data.ChatHist;
              gptresp = data.GPTresp;
              gptresp = gptresp.replace(/\n/g, '<br>');

              //Create GPT content elements
              container = addGPTcontent(gptresp);

              // Append the container to the chat block
              chatBlockElement.appendChild(container);
              scrollToBottom();
            })
            .catch(error => {
              // Handle any errors that occur during the request
              console.error(error);
              scrollToBottom();
            });
        } else {
          fetch('/api/defaultcontinchatgpt', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: query, chatHist: chathist })
          })
            .then(response => response.json())
            .then(data => {
              // Handle the response data from the Flask API
              chathist = data.ChatHist;
              gptresp = data.GPTresp;
              gptresp = gptresp.replace(/\n/g, '<br>');

              //Create GPT content elements
              container = addGPTcontent(gptresp);
              
              // Append the container to the chat block
              chatBlockElement.appendChild(container);
              scrollToBottom();
            })
            .catch(error => {
              // Handle any errors that occur during the request
              console.error(error);
              scrollToBottom();
            });
        }
      } 
      
      else if (functionality == "TC") {

        if (numberofchat == 0) {
          fetch('/api/TCinitchatgpt', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: query })
          })
            .then(response => response.json())
            .then(data => {
              // Handle the response data from the Flask API
              chathist = data.ChatHist;
              gptresp = data.GPTresp;
              gptresp = gptresp.replace(/\n/g, '<br>');
  
              //Create GPT content elements
              container = addGPTcontent(gptresp);
              
              // Append the container to the chat block
              chatBlockElement.appendChild(container);
              scrollToBottom();
            })
            .catch(error => {
              // Handle any errors that occur during the request
              console.error(error);
              scrollToBottom();
            });
        }
        else{
          fetch('/api/defaultcontinchatgpt', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: query, chatHist: chathist })
          })
            .then(response => response.json())
            .then(data => {
              // Handle the response data from the Flask API
              chathist = data.ChatHist;
              gptresp = data.GPTresp;
              gptresp = gptresp.replace(/\n/g, '<br>');

              //Create GPT content elements
              container = addGPTcontent(gptresp);
              
              // Append the container to the chat block
              chatBlockElement.appendChild(container);
              scrollToBottom();
            })
            .catch(error => {
              // Handle any errors that occur during the request
              console.error(error);
              scrollToBottom();
            });
        }

      }
      else if (functionality == "emilecal"){
        console.log("success");
        fetch('/api/defaultcontinchatgpt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query: query, chatHist: chathist })
        })
          .then(response => response.json())
          .then(data => {
            // Handle the response data from the Flask API
            chathist = data.ChatHist;
            gptresp = data.GPTresp;
            gptresp = gptresp.replace(/\n/g, '<br>');

            //Create GPT content elements
            container = addGPTcontent(gptresp);
            
            // Append the container to the chat block
            chatBlockElement.appendChild(container);
            scrollToBottom();
          })
          .catch(error => {
            // Handle any errors that occur during the request
            console.error(error);
            scrollToBottom();
          });
      }
      console.log(numberofchat);
      // Pop up window
      if (( numberofchat!=0 && (numberofchat)%6 ==0)){
        setTimeout(() => {
          askAnyElse();
      }, 3000); // 10000 milliseconds = 10 seconds
      }
    });
  }
});

//Miles Calculator Functions:
//Q1. Provide Reward Options In List:
function q1_pending(){
  // Create a container element for the GPT's response
  const container = document.createElement('div');
  container.classList.add('chats');

  // Create elements for the GPT's response
  const identifyElement = document.createElement('div');
  identifyElement.id = 'gpt_identify';
  identifyElement.innerHTML = '<img src="../static/paxi.jpg" width= 40px>';

  const chatContentElement = document.createElement('div');
  chatContentElement.id = 'gpt_chatcontent';
  chatContentElement.innerHTML = "Predicting the flight award you may interested in .....";

  // Append the GPT's response elements to the container
  container.appendChild(identifyElement);
  container.appendChild(chatContentElement);
  return container;
}

//Q2. Loading
function q2_pending(){
  // Create a container element for the GPT's response
  const container = document.createElement('div');
  container.classList.add('chats');

  // Create elements for the GPT's response
  const identifyElement = document.createElement('div');
  identifyElement.id = 'gpt_identify';
  identifyElement.innerHTML = '<img src="../static/paxi.jpg" width= 40px>';

  const chatContentElement = document.createElement('div');
  chatContentElement.id = 'gpt_chatcontent';
  chatContentElement.innerHTML = "Analyzing.....";

  // Append the GPT's response elements to the container
  container.appendChild(identifyElement);
  container.appendChild(chatContentElement);
  return container;
}

//Step 1: Select your dreamy awards
function q1_flight_pred(chatBlockElement){
  fetch('/api/flight_pred', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ucode: uid, ucomp: ucamp, ugender:ugender, uage: uage, uloc: ulocat})
  })
  .then(response => response.json())
  .then(data => {
    var loc_src_img_map = {
      "Aracaju (SE)": '../static/aracaju.jpg',
      "Brasilia (DF)": '../static/brasilia.jpg',
      "Campo Grande (MS)": '../static/campogrande.jpg',
      "Florianopolis (SC)": '../static/florianopolis.jpg',
      "Natal (RN)": '../static/natal.jpg',
      "Recife (PE)": '../static/recife.jpg',
      "Rio de Janeiro (RJ)": '../static/riodejaneiro.jpg',
      "Salvador (BH)": '../static/salvador.jpg',
      "Sao Paulo (SP)": '../static/sanpaulo.jpg'
    };
  var forq2use = chatBlockElement;
  
  // Handle the response data from the Flask API: The Locations 
  var pred = data.first;

  var img_pred = loc_src_img_map[pred]

  var sec = data.second;

  var img_sec = loc_src_img_map[sec]

  var third = data.third;

  var img_third = loc_src_img_map[third]

  const container = document.createElement('div');
  container.classList.add('chats');

  // Create elements for the GPT's response
  const identifyElement = document.createElement('div');
  identifyElement.id = 'gpt_identify';
  identifyElement.innerHTML = '<img src="../static/paxi.jpg" width= 40px>';

  const chatContentElement = document.createElement('div');
  chatContentElement.id = 'gpt_chatcontent';
  chatContentElement.innerHTML = "Based on your previous records with our NN model prediction <br> Here are The Top 3 flight award You May Want To Redeem. <br> <h4>Choose One To Continue:</h4>";

  //linebreak
  var d1 = document.createElement('div')
  d1.className = "img_container"

  var d2 = document.createElement('div')
  d2.className = "img_container"

  var d3 = document.createElement('div')
  d3.className = "img_container"

  //First Suggestion
  const fir_img = document.createElement('img');
  fir_img.src = img_pred;
  fir_img.className = 'q1_img';
  d1.appendChild(fir_img);

  var fir_but = document.createElement('button');  // Create a <button> element
  fir_but.textContent = pred;
  fir_but.className = 'q1_but';
  fir_but.onclick = function() {
    var container = q2_pending();
    chatBlockElement.appendChild(container);
    scrollToBottom();
    // Your code to handle the button click goes here
    q1_resp(fir_but.textContent, forq2use, miles_map[pred]);
  };
  d2.appendChild(fir_but);

  //Second Suggestion
  const sec_img = document.createElement('img');
  sec_img.src = img_sec;
  sec_img.className = 'q1_img';
  d1.appendChild(sec_img)

  var sec_but = document.createElement('button');  // Create a <button> element
  sec_but.textContent = sec;
  sec_but.className = 'q1_but';
  sec_but.onclick = function() {
    // Your code to handle the button click goes here
    var container = q2_pending();
    chatBlockElement.appendChild(container);
    scrollToBottom();
    q1_resp(sec_but.textContent, forq2use, miles_map[sec]);
  };
  d2.appendChild(sec_but);


  //Third Suggestion
  const thi_img = document.createElement('img');
  thi_img.src = img_third;
  thi_img.className = 'q1_img';
  d1.appendChild(thi_img);

  var thi_but = document.createElement('button');  // Create a <button> element
  thi_but.className = 'q1_but';
  thi_but.textContent = third;
  thi_but.onclick = function() {
    var container = q2_pending();
    chatBlockElement.appendChild(container);
    scrollToBottom();
    // Your code to handle the button click goes here
    q1_resp(thi_but.textContent,forq2use, miles_map[third]);
  };
  d2.appendChild(thi_but);

  var t1 = document.createElement('h4');
  t1.innerHTML= '<img src="../static/mileslg.png" width=10px>' + miles_map[pred]
  var t2 = document.createElement('h4');
  t2.innerHTML= '<img src="../static/mileslg.png" width=10px>' + miles_map[sec]
  var t3 = document.createElement('h4');
  t3.innerHTML= '<img src="../static/mileslg.png" width=10px>' + miles_map[third]

  d3.appendChild(t1);
  d3.appendChild(t2);
  d3.appendChild(t3);

  chatContentElement.appendChild(d3);
  chatContentElement.appendChild(d1);
  chatContentElement.appendChild(d2);
  // Append the GPT's response elements to the container
  container.appendChild(identifyElement);
  container.appendChild(chatContentElement);

  chatBlockElement.appendChild(container);
  scrollToBottom();
  })
  .catch(error => {
    // Handle any errors that occur during the request
    console.error(error);
    scrollToBottom();
  });
}

function q1_resp(chose_des, chatBlockElement, m_need){
  //Get q1_but
  var all_btn = document.getElementsByClassName("q1_but");

  // Disable all the choose of result
  for (var i = 0; i < all_btn.length; i++) {
    all_btn[i].disabled=true;
  }
  
  fetch('/api/miles_cal_gpt_init', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({user: uid, des: chose_des, miles: miles_map[chose_des], curloc:ulocat})
  })
    .then(response => response.json())
    .then(data => {
      var img_pur = {
        'Clothing': "../static/spending_Clothing.png",
        'Cosmetics': "../static/spending_Cosmetics.png",
        'Flight Ticket': "../static/spending_Flight Ticket.png",
        'Food & Beverage': "../static/spending_Food &   Beverage.png",
        'Hotel': "../static/spending_Hotel.png",
        'Technology': "../static/spending_Technology.png",
        'Transportation': "../static/spending_Transportation.png",
        'Luxury': "../static/spending_Luxury.png",
        'distri': "../static/spending_piechart.png"
    }

    //Create the Analysis Result Chatblock
    var container = document.createElement('div');
    container.classList.add('chats');
  
    // Create elements for the GPT's response
    var identifyElement = document.createElement('div');
    identifyElement.id = 'gpt_identify';
    identifyElement.innerHTML = '<img src="../static/paxi.jpg" width= 40px>';
  
    var chatContentElement = document.createElement('div');
    chatContentElement.id = 'gpt_chatcontent';
    chatContentElement.innerHTML = "Based on your previous records,<br> here are the analysis result of your consumption habits:";
  
    //linebreak
    var d1 = document.createElement('div')
    d1.className = "img_container2"

    var p0 = "Consumption Portions"
    const pie = document.createElement('img');
    pie.src = img_pur['distri'];
    pie.className = 'q2_img';
    d1.appendChild(pie);

    //First, display the analysis Result
    // Handle the response data from the Flask API: The Locations 
    var t3 = data.top3;
    

    //text of first
    var f1 = t3[0];
    //img path of first
    var f1_src = img_pur[f1]

    //First Suggestion
    const fir_img = document.createElement('img');
    fir_img.src = f1_src;
    fir_img.className = 'q2_img';
    d1.appendChild(fir_img);

    //text of second
    var s2 = t3[1];
    //img path of first
    var s2_src = img_pur[s2]

    //Second Suggestion
    const sec_img = document.createElement('img');
    sec_img.src = s2_src;
    sec_img.className = 'q2_img';
    d1.appendChild(sec_img);

    //text of third
    var t3 = t3[2];
    //img path of first
    var t3_src = img_pur[t3]

    //Third Suggestion
    const thi_img = document.createElement('img');
    thi_img.src = t3_src;
    thi_img.className = 'q2_img';
    d1.appendChild(thi_img);

    chatContentElement.appendChild(d1);

    // Append the GPT's response elements to the container
    container.appendChild(identifyElement);
    container.appendChild(chatContentElement);

    // Append the container to the chat block
    chatBlockElement.appendChild(container);
  
    // Create elements for the GPT's response
    var identifyElement1 = document.createElement('div');
    identifyElement1.id = 'gpt_identify';
    identifyElement1.innerHTML = '<img src="../static/paxi.jpg" width= 40px>';
  
    var chatContentElement1 = document.createElement('div');
    chatContentElement1.id = 'gpt_chatcontent';
  
    //Second, Display GPT Suggestions
    // Handle the response data from the Flask API
    chathist = data.ChatHist;
    gptresp = data.GPTresp;
    gptresp = gptresp.replace(/\n/g, '<br>');

    //Create GPT content elements
    if(parseInt(mbal, 10) > m_need){
      container2 = provide_cal_link(gptresp, 'enough');
    }
    else{
      container2 = provide_cal_link(gptresp, 'not enough');
    }
    // Append the container to the chat block
    chatBlockElement.appendChild(container2);

    scrollToBottom();

    var inputElement = document.getElementById('userquery');

    inputElement.disabled = false;

    })
    .catch(error => {
      // Handle any errors that occur during the request
      console.error(error);
      scrollToBottom();
    });
}

//Create HTML elements: GPT output
function provide_cal_link(gptresp,exceed){
  // Create a container element for the GPT's response
  const container = document.createElement('div');
  container.classList.add('chats');

  // Create elements for the GPT's response
  const identifyElement = document.createElement('div');
  identifyElement.id = 'gpt_identify';
  identifyElement.innerHTML = '<img src="../static/paxi.jpg" width= 40px>';

  var resp;
  if (exceed=='enough'){
    resp = ' By the way, congrats that you have enough <img src="../static/mileslg.png" width=10px> to redeem the award! ' +
    'Here is your personalized miles Planners link - <a href="http://127.0.0.1:5000/cal.html" target="_blank">Click HERE</a>'+
    '<h2>Happy redemption and feel free to ask my anything through here!</h2>'
  }
  else{
    resp = ' By the way, since you do not have enough <img src="../static/mileslg.png" width=10px> to redeem the award: '+
    'Here is your personalize miles Planners link - <a href="http://127.0.0.1:5000/cal.html" target="_blank">Click HERE</a>'+
    '<h2>Happy Planning and feel free to ask my anything through here!</h2>'
  }

  const chatContentElement = document.createElement('div');
  chatContentElement.id = 'gpt_chatcontent';
  chatContentElement.innerHTML = gptresp + resp;

  // Append the GPT's response elements to the container
  container.appendChild(identifyElement);
  container.appendChild(chatContentElement);
  return container;
}