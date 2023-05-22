//Debug
var debug = true;
var LOG = debug ? console.log.bind(console) : function () {}; // will turn off all console.log statements.

//Global  Variables
var parsedTable;

//initializes Stagging selection
$(function () {


    
  document.querySelector("#date").value = process_date(new Date());

  var copyBtn = document.querySelector('#copy_btn');
  copyBtn.addEventListener('click', function () {

    
    var urlField = document.querySelector('table');
    
    // create a Range object
    var range = document.createRange();  
    // set the Node to select the "range"
    range.selectNode(urlField);
    // add the Range to the set of window selections
    window.getSelection().addRange(range);
    
    // execute 'copy', can't 'cut' in this case
    document.execCommand('copy');
  });

});

 function toggle1(me)
{

    span_class = me.className;
    var text = $('a.'+span_class).text();
    $('br.'+span_class).toggle();
    $('span.'+span_class).toggle();
    //LOG($('a.'+span_class+' i').hasClass('bi bi-arrow-up-short'));
   /*  if($('a.'+span_class+' i').hasClass('bi bi-eye'))
    { 
      $('a.'+span_class+' i').attr('class','bi bi-eye-slash');
    }
    else if($('a.'+span_class+' i').hasClass('bi bi-eye-slash'))
    {
      $('a.'+span_class+' i').attr('class','bi bi-eye');
    } */
  if (text=="Show")
    {
      $('a.'+span_class).text('Hide');
      //$('span.'+span_class).accordian()
    }
    else if(text=="Hide")
    {
      $('a.'+span_class).text('Show')
      
    } 
    
   
} 

//converts selected date into format we can edit
function process_date(date) {
  var day = date.getDate();

  var month = date.getMonth() + 1;

  var year = date.getFullYear();
  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }

  var date_corrected = year + "-" + month + "-" + day;

  return date_corrected;
}

function filter(stage, date, input_month) {
    document.getElementById("results").textContent = " ";
    input_month_value= -Math.abs(document.querySelector(input_month).value);
    console.log("input_month_value",input_month_value);
    document.querySelector(date).stepUp(1); //must do this to get correct date
   
    var date_value = document.querySelector(date).value;
    document.querySelector(date).stepDown(1);
    stage_value = document.querySelector(stage).value;
    var stage_header = document.querySelector(stage);
    output = stage_header.options[stage_header.selectedIndex].textContent;
    document.getElementById("stage_header").innerHTML = output;
    generateTable(); //initialize table.

 
    if(stage_value==0)
    {

        generate(stage1_as=[
            "H&P/Labs",12,12,12,12,12,
            "CT AP",input_month_value,12,12,12,
            "CXR",12,12,12,12,12],date_value);
    }
    else if(stage_value==1)
        generate(stage1_cryo = [
            "H&P/Labs",12,12,12,12,12,
            "CT AP",input_month_value,12,12,12,12,
            "CXR",12,12,12,12,12],date_value);
    
    else if (stage_value==2)
    {
        generate(stage1_partial = [
            "H&P/Labs",12,12,12,12,12,
            "CT AP",input_month_value,12,12,12,12,
            "CXR",12,12,12,12,12] ,date_value);
    }
    else if(stage_value==3)
    {
      generate(stage2 = [
        "H&P/Labs",12,12,12,12,12,
        "CT AP",input_month_value,6,12,12,12,
        "CXR",12,12,12,12,12] ,date_value);
    }
    else{
        generate(stage3 = [
            "H&P/Labs",[3,6],[3,6],[3,6],6,12,12,
            "CT AP",[3,6],[3,6],[3,6],12,12,
            "CXR",[3,6],[3,6],[3,6],12,12] ,date_value);
    }
   
  

} 

function generateTable() {
  //generates table
  var col_labels = ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"];
  parsedTable = document.createElement("TABLE");
  table_classes = "table table-bordered table-sm table-striped table-hover";
  parsedTable.setAttribute("class", table_classes);
  parsedTable.setAttribute("id", "TABLE");
  tabelHeader = parsedTable.createTHead();
  tableBody = parsedTable.createTBody();

  //Generate Header
  tabelHeader.className = "table-info";
  //header for the table 
  header = "<tr id='header'><td rowspan='2'></td><td colspan='5'><b>Year (at month intervals)</b></td></tr><tr id='header'>";
  for (
    i = 0;
    i < col_labels.length;
    i++ //run through columns year 1-5
  ) {
        header += '<th>' + col_labels[i] + "</th>";
    
  }
  header += "</tr>";
  $(tabelHeader).append(header);
  $(parsedTable).append(tabelHeader);
  return;
}

function generate(stage_data, date) {
  const dt=new Date(date);
  var dt_working = new Date(date);
  resultBody = $("#results");
  var count = 0;
  var c = 0;
  var cell;

    for (i = 0;i < stage_data.length;i++)
     {
        x=stage_data[i].length; //check if the data array contains more than 1 
        if (i == 0 || i==6 ||i==12) { //row headers
            var dt_working = new Date(date);
            row = tableBody.insertRow(-1);
            cell=row.insertCell(-1);
            cell.id = `input${i}`;
            
            cell.innerHTML="<b>"+stage_data[i]+"</b>";
            c++;
            continue;
        }
        
        if(stage_data[i]==1){
                cell=row.insertCell(-1);
                cell.id=`input${i}`;
                cell.innerHTML="As Clinically Indicated";
                c++;
                continue;
        }
        else if(x>1){ //trying to generate multiple dates
            LOG("Multiple Dates");
            for (j = 0; j < x; j++) 
            {
                y = 12 / stage_data[i][j];
                if(j==0){
                   cell = row.insertCell(-1);
                   cell.innerHTML="<span class="+`date${c}`+"><b>"+stage_data[i][j]+" month intervals </b></span><a href='#' onclick='toggle1(this)' class= " +`date${c}`+" id="+`interval_${i+j}`+">Hide</a><br>";
          
                }
                else if (j>=1){ 
                   cell.innerHTML+="<span class="+`date${c}`+"><b>"+stage_data[i][j]+" month intervals </b></span><a href='#' onclick='toggle1(this)' class= " +`date${c}`+" id="+`interval_${i+j}`+">Hide</a><br>";
                   //cell.innerHTML+="<label class="+`interval_${i+j}`+"><b>"+stage_data[i][j]+" month intervals:</b></span><br>";
                   if(i==1 || i==7 || i==13)
                   {
                        dt_working=new Date(date);
                   }
                   else
                   {
                      var reset_date = document.querySelector(`#input_${i-1}_1`).innerHTML;
                      dt_working = new Date(reset_date);
                   }
                   
                }
                   
                   for (m = 0; m < y; m++) {
              
                     dt_working.setMonth(dt_working.getMonth() + stage_data[i][j]);
                     LOG("dt_working_multi_element ",m," ",dt_working)
                     cell.innerHTML+="<span class="+`date${c}`+" id="+`input_${i}_${count}`+">"+dt_working.toLocaleDateString('en-US') + "</span><br class="+`date${c}`+">";
                     $(parsedTable).append(tableBody);
                     resultBody.append(parsedTable);
                     count++;
        
                   }
                   c++;
    
            }
            count=0;       
          }
        else{
            cell=row.insertCell(-1);
            //cell.innerHTML="<b>"+stage_data[i]+" month intervals:</b> <br>";
            if(stage_data[i]<1)
            {
              //cell.innerHTML="<b>First imaging study at "+Math.abs(stage_data[i])+" after treatment:</b> <br>";
              

              y=1;
            }
            else  
            {
              y = 12 / stage_data[i];
            }
            for (m = 0; m < y; m++) 
            {
               
                dt_working.setMonth(dt_working.getMonth() + Math.abs(stage_data[i]));
                LOG("dt_working_single_element ",dt_working)
                cell.innerHTML+="<span id="+`input_${i}_${count}`+">"+dt_working.toLocaleDateString('en-US') + "</span><br>";
                count++;
                c++;
           
            }
            
            count=0;
        }
        
     
    }

  $(parsedTable).append(tableBody);
  resultBody.append(parsedTable);
  document.querySelector('#copy_btn').setAttribute("style","display:block");
}

