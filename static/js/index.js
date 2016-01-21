   var list = [];
     var socket ;
     var prices=[];
     var symbol1;
     var price;
    $( document ).ready(function(){
        console.log("doc ready");
         socket = io.connect('http://localhost:5000');
        socket.on("connect", function () {  
            console.log("Connected!");
        });




        socket.on("prices", function(pricesIn) { 
            console.log(pricesIn);
            prices = pricesIn;
            // for (var i=0;i<list.size;i++){
            //     updateSymbolVals(list[i],prices[i],predictions[i]);
            // }
        });

            socket.on("predictions", function(predictions) { 
            console.log(predictions);
            if (predictions.length>1){
            for (var i=0;i<list.length;i++){
                 updateSymbolVals(list[i],prices[i],predictions[i]);
            }
        } else{
            
                 updateSymbolVals(symbol1,prices[0],predictions[0]);
            
        }
        });

        window.setInterval(updateAllSymbols, 15000);

        document.getElementById("search").addEventListener("click", function(){

       var symbol = document.getElementById('stock_symbol').value;
            console.log(symbol);
            if(list.indexOf(symbol)==-1){
                list.push(symbol);
                updateOnlyOneSymbol(symbol);
                addToResultTable(symbol, "", "CHECKING...");
            }
            console.log(list);
        });



    });

function updateOnlyOneSymbol(symbol){
    console.log("calling");
    symbol1 = symbol;
    console.log("Refresh..");
    var symbolList = [];
    symbolList.push(symbol1);
    socket.emit("get_stock", symbolList);
    }

 function updateAllSymbols(){
    console.log("Refresh..");
 	if(list.length>0){
    console.log("inside");
 	socket.emit("get_stock", list);
 	}
 }

// function queryBack(){
//             var symbol = document.getElementById('stock_symbol').value;
//             console.log(symbol);
//             if(list.indexOf(symbol)==-1){
//                 list.push(symbol);
//             	addToResultTable(symbol, "", "CHECKING...");
//             }
//             console.log(list);

//     };
function addToResultTable( symbol, price, prediction){

      //console.log("adding to table");
        var table2 = document.getElementById("stockTable");
        var row2 = table2.insertRow(1);
        row2.id = symbol;
        var cellz1 = row2.insertCell(0);
        var cellz2 = row2.insertCell(1);
        var cellz3 = row2.insertCell(2);
        cellz1.innerHTML = symbol;
        cellz2.innerHTML = price;
        cellz3.innerHTML = prediction;
        cellz1.style.textAlign="left";
        cellz2.style.textAlign="left";
        cellz3.style.textAlign="left";
        row2.style.color="black";
        if(prediction=="BUY"){
        	row2.style.backgroundColor="#99ff66";
        }
        else if (prediction=="SELL"){
        	row2.style.backgroundColor="#ff6666";

        }
        else if (prediction=="HOLD"){
        	row2.style.backgroundColor="#ffff99";
        }
        else{
        	row2.style.backgroundColor = "grey";
        }

}



        function updateSymbolVals(symbol,price,prediction){

      	var row2 = document.getElementById(symbol);
        var cellz1 = row2.cells[0];
        var cellz2 = row2.cells[1];
        var cellz3 = row2.cells[2];
        cellz1.innerHTML = symbol;
        cellz2.innerHTML = price;
        cellz3.innerHTML = prediction;
        row2.style.color="black";
        if(prediction=="BUY"){
        	row2.style.backgroundColor="#99ff66";
        }
        else if (prediction=="SELL"){
        	row2.style.backgroundColor="#ff6666";

        }
        else if (prediction=="HOLD"){
        	row2.style.backgroundColor="#ffff99";
        }
        else{
        	row2.style.backgroundColor = "grey";
        }
 }

