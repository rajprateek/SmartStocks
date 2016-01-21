   var list = [];
    $( document ).ready(function(){
        var socket = io.connect('http://localhost:5000');
        socket.on("connect", function () {  
            console.log("Connected!");
        });




        socket.on("answer", function(answer) {  
            console.log(answer);
        });

        window.setInterval(updateAllSymbols, 2000);
        // document.getElementById("search").addEventListener("click", function(){

        //     // var textBox = document.getElementById('stock_name').value;
        //     // console.log(textBox)
        //     // socket.emit("get_stock", textBox);
        // });


    });

 function updateAllSymbols(){
 	if(list.size>0){
 	socket.emit("get_stockPriceAndPredicts", list);
 	}
 }

function queryBack(){
            var symbol = document.getElementById('stock_symbol').value;
            console.log(symbol);
            if(list.indexOf(symbol)==-1){
                list.push(symbol);
            	addToResultTable(symbol, "", "CHECKING...");
            }
            console.log(list);

    };
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
        row2.style.opacity = "0.75";
        if(prediction=="BUY"){
        	row2.style.background="green";
        }
        else if (prediction=="SELL"){
        	row2.style.background="red";

        }
        else if (prediction=="HOLD"){
        	row2.style.background="yellow";
        }
        else{
        	row2.style.background = "grey";
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
        if(prediction=="BUY"){
        	row2.style.background="green";
        }
        else if (prediction=="SELL"){
        	row2.style.background="red";

        }
        else if (prediction=="HOLD"){
        	row2.style.background="yellow";
        }
        else{
        	row2.style.background = "grey";
        }
 }

