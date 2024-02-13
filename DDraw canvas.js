var featureList = ["door","stair"]
var Draw_Type = "draw"
window.onerror = function(message, source, lineno, colno, error) {
    log(`${message} at line ${lineno}:${colno}`);
}
var WaypointID = 1
const screen = document.getElementById("canvas");
init()
var timer, mouseDown, positionLogs, scrndata, sln, useGrid, LINE_PT_A, LINE_PT_B, linestart, snap, selectedFeature, userX, userY, rotation, control, EDIT_ITEM, startX, startY, modX, modY, buttons, hoverItem
userX = 0
userY = 0 
selectedFeature = "none"
linestart = true
LINE_PT_A = [0,0]
LINE_PT_B = [0,0]
sln = false
snap = false
positionLogs = []
scrndata = []
mouseDown = false
EDIT_ITEM = -1
function clearLog(){
    document.getElementById("log").innerHTML = ""
}
function check()
{
    useGrid  = document.getElementById("gridYN").checked
    updateScreen()
}
function init(){
    window.onload= ()=>
    {
        document.getElementById("DDraw-name").focus()
    }
    document.getElementById("DDraw-name").addEventListener("keydown",(event)=>{
        if(event.key=="Enter")
        {
            document.getElementById("DDraw-name").blur()        
        }
    })
    window.addEventListener("keydown",(event)=>{
        // log(event.key)
        if(event.key=="Control")
        {
            control = true
        }
        if(event.key=="Shift")
        {
            if(Draw_Type == "line")
            {
                document.getElementById("oogabooga").innerHTML = "Tool: line-snap to grid"
            }
            sln = true
        }
        if(event.key == "A" || event.key == 'a')
        {
    
            if(Draw_Type == "line"){
            document.getElementById("oogabooga").innerHTML = "Tool: line-snap"}
            snap = true
        }
        if(event.key == "Z" || event.key == 'z')
        {
            // log(control)

            if(control){
                scrndata.pop()
                updateScreen()
            }
        }

        if(event.key == "r" || event.key =='R')
        {
            if(Draw_Type == "dungeon feature"){
                rotate()
            }
            snap = true
        }
        if(event.key == "Escape")
        {
            linestart = true
            updateScreen()
        }
        
    })
    window.addEventListener("keyup",(event)=>{
        if(event.key=="Control")
        {
            control = false
        }
        if(event.key=="Shift")
        {
            if(Draw_Type == "line")
            {
                document.getElementById("oogabooga").innerHTML = "Tool: line"
            }
            sln = false
        }
        if(event.key == "Z" || event.key == 'z')
        {
            document.getElementById("oogabooga").innerHTML = "Tool: line"
            snap = false
        }
        if(event.key == "A" || event.key == 'a')
        {
            if(Draw_Type == "line"){
            document.getElementById("oogabooga").innerHTML = "Tool: line"}
            snap = false
        }
        if(event.key == "1")
        {
            setMode(1)
        }

        if(event.key == "2")
        {
            setMode(2)
        }
        if(event.key == "3")
        {
            setMode(3)
        }
        if(event.key == "4")
        {
            setMode(4)
        }
        if(event.key == "5")
        {
            setMode(5)
        }
    })
    window.addEventListener("mousedown",(event)=>{
        if(document.getElementById("DDraw-name").value == "")
        {
            document.getElementById("DDraw-name").placeholder = "Please enter a name"
            setTimeout(()=>{document.getElementById("DDraw-name").focus()},30)
            log("please enter a name")
            return
        }
    })
    screen.addEventListener("mousedown",(event)=>{
        
        mouseDown = true
        if(Draw_Type == "draw")
        {                    
            let timer = setInterval(updateScreen, 30)

            positionLogs.push([(event.offsetX),(event.offsetY)])
        }
        if(Draw_Type == "waypoint")
        {
            scrndata.push({type: "waypoint",position: [event.offsetX, event.offsetY], ID: WaypointID, offsetX: 0, offsetY: 0})
        
            getWaypointID(scrndata.length-1)
            WaypointID++

        }
        if(Draw_Type == "line")
        {
            if(linestart)
            {
                
                LINE_PT_A = [event.offsetX,event.offsetY]
                LINE_PT_B = [event.offsetX, event.offsetY]
                if(sln)
                {
                    LINE_PT_A = [event.offsetX-(event.offsetX%13),event.offsetY-(event.offsetY%13)]
                }
                linestart = false
                updateScreen()
            }
            else
            {
                
            }
        }
        if(Draw_Type == "dungeon feature")
        {
            if(sln)
            {
            
                userX = event.offsetX-event.offsetX%6.5
                userY = event.offsetY-event.offsetY%6.5
            }
            scrndata.push({type: "dungeon feature",coord:[userX, userY], ftype: "door", rotation: rotation, offsetX: 0, offsetY: 0})
            updateScreen()  
            editMenu()
        }
        if(Draw_Type == "edit")
        {
            //log(EDIT_ITEM)
            startX = 0
            startY = 0
            if(EDIT_ITEM<0 || EDIT_ITEM>scrndata.length || scrndata.length == 0)
            {
                return
            }
            
            if(scrndata[EDIT_ITEM].type == "draw")
            {
            
                startX = scrndata[EDIT_ITEM].data[0][0]
                startY = scrndata[EDIT_ITEM].data[0][1]                        
            }
            if(scrndata[EDIT_ITEM].type == "line")
            {
                startY = scrndata[EDIT_ITEM].coords[0][1]
                startX = scrndata[EDIT_ITEM].coords[0][0]
            }
            if(scrndata[EDIT_ITEM].type == "dungeon feature")
            {
                startY = scrndata[EDIT_ITEM].coord[1]
                startX = scrndata[EDIT_ITEM].coord[0]
            }
            if(scrndata[EDIT_ITEM].type == "waypoint")
            {
                startY = scrndata[EDIT_ITEM].position[1]
                startX = scrndata[EDIT_ITEM].position[0]
            }
            modX = event.offsetX - startX + scrndata[EDIT_ITEM].offsetX
            modY = event.offsetY - startY + scrndata[EDIT_ITEM].offsetY

        }
    })
    screen.addEventListener("mouseup",(event)=>{
        mouseDown=false
        if(Draw_Type == "draw"){
            scrndata.push({type: Draw_Type, data: positionLogs, offsetX: 0, offsetY: 0})
            positionLogs =[]
            timer = clearInterval()
            editMenu()
        }
        if(Draw_Type == "line")
        {
            scrndata.push({type: "line",coords: [LINE_PT_A,LINE_PT_B], offsetX: 0, offsetY: 0})
            //log(JSON.stringify(scrndata))
            linestart = true
            editMenu()
        }
        if(Draw_Type =="edit")
        {
            //log("up")
            EDIT_ITEM = -1
            updateScreen()
        }
        
    })
    screen.addEventListener("mousemove",(event)=>{
        if(Draw_Type =="draw"){
            if(mouseDown) {
                if(event.offsetX==positionLogs[positionLogs.length-1][0]||event.offsetY==positionLogs[positionLogs.length-1][1])
                {
                    return;
                }
                positionLogs.push([event.offsetX, event.offsetY])
            }
        }
        if(Draw_Type == "line"&& !linestart)
        {
        
            LINE_PT_B = [event.offsetX, event.offsetY]
            if(sln)
            {
                LINE_PT_B = [event.offsetX-(event.offsetX%13),event.offsetY-(event.offsetY%13)]
            }
            else if(snap)
            {
                if(Math.abs(event.offsetX-LINE_PT_A[0])<Math.abs(event.offsetY-LINE_PT_A[1])){
                LINE_PT_B = [LINE_PT_A[0],event.offsetY]
                }
                else
                {
                LINE_PT_B = [event.offsetX,LINE_PT_A[1]]
                }
            }
            updateScreen()
        }
        if(Draw_Type == "dungeon feature")
        {
            userX = event.offsetX
            userY = event.offsetY
            if(sln)
            {
                userX = userX-userX%6.5
                userY = userY-userY%6.5
            }
            updateScreen()
        }
        if(Draw_Type == "waypoint")
        {
            userX = event.offsetX
            userY = event.offsetY
            updateScreen()
        }
        if(Draw_Type == "edit")
        {
            if(!mouseDown)
            {
                return
            }
            if (typeof(EDIT_ITEM) == "undefined"||EDIT_ITEM>scrndata.length-1||EDIT_ITEM<0)
            {
                return;
            }
            
            scrndata[EDIT_ITEM].offsetX = modX - (event.offsetX-startX)
            scrndata[EDIT_ITEM].offsetY = modY - (event.offsetY-startY)
            updateScreen()
        }
    })
}
function updateScreen() {
    //log(EDIT_ITEM)
    if(!canvas.getContext)
    {
        return
    }
    const pen1 = canvas.getContext("2d");
    pen1.clearRect(0,0,400,400)
    ///log(useGrid)
    if(useGrid)
    {
        pen1.lineWidth = 1
        pen1.strokeStyle = "lightgrey"
        pen1.beginPath()
        for(let i = 0; i <31; i++)
        {
            pen1.moveTo(i*13,0)
            pen1.lineTo(i*13,400)
        }
        for(let i = 0; i <31; i++)
        {
            pen1.moveTo(0,i*13)
            pen1.lineTo(400,i*13)
        }
        pen1.stroke()
        pen1.closePath()
    }
    if(Draw_Type == "waypoint")
    {
        pen1.fillStyle = "pink"
        pen1.ellipse(userX, userY,3,3,1,0,6.3)
        pen1.fill()
    }
    pen1.fillStyle = "black"
    pen1.lineWidth = 2
    pen1.strokeStyle = "black"
    pen1.beginPath()
    
    if(Draw_Type == "dungeon feature")
    {
        if(selectedFeature == "door")
        {
            pen1.lineWidth = 1      
            pen1.moveTo(userX-4, userY-3)
            pen1.lineTo(userX+3, userY-3)
            pen1.lineTo(userX+3, userY+3)
            pen1.lineTo(userX-3, userY+3)
            pen1.lineTo(userX-3, userY-3)
            pen1.stroke()
            pen1.lineWidth =2
        }
    }
    if(Draw_Type == "draw"){
        if(positionLogs.length==1)
        {
            pen1.ellipse(positionLogs[0][0],positionLogs[0][1],1,1,1,0,6.3)
            pen1.fill()
        }
        for(let i = 0; i<positionLogs.length; i++)
        {
            pen1.lineTo(positionLogs[i][0],positionLogs[i][1])
        }
        pen1.stroke()
    }
    if(Draw_Type == "line")
    {
        pen1.moveTo(LINE_PT_A[0],LINE_PT_A[1])
        pen1.lineTo(LINE_PT_B[0],LINE_PT_B[1])
        pen1.stroke()
    }
    pen1.closePath()

    for(let i = 0; i<scrndata.length; i++)
    {
        var pen = canvas.getContext("2d");
        pen.beginPath()
        
        pen.fillStyle = "black"
        pen.strokeStyle = "black"
        if((EDIT_ITEM == i|| hoverItem == i )&& Draw_Type == "edit")
        {
            //log("switch1")
            pen.strokeStyle = "blue"
            pen.fillStyle = "blue"
        }
        if(scrndata[i].type == "draw")
        {
            
            pen.moveTo(scrndata[i].data[0][0]-scrndata[i].offsetX,scrndata[i].data[0][1]-scrndata[i].offsetY)
            for(let j = 0; j<scrndata[i].data.length; j++)
            {
                if(scrndata[i].data.length==1)
                {
                    pen.ellipse(scrndata[i].data[0][0]-scrndata[i].offsetX,scrndata[i].data[0][1]-scrndata[i].offsetY,1,1,1,0,6.3)
                    pen.fill()
                }
                else
                {
                    pen.lineTo(scrndata[i].data[j][0]-scrndata[i].offsetX,scrndata[i].data[j][1]-scrndata[i].offsetY)
                }
            }
            pen.stroke();
        }
        
        if(scrndata[i].type == "waypoint")
        {
            //log(scrndata[i].position[0]+", "+scrndata[i].position[1])
            if(!((EDIT_ITEM == i|| hoverItem==i )&& Draw_Type == "edit"))
            {
                pen.fillStyle = "red"
                pen.strokeStyle = "red"
            }
            pen.ellipse(scrndata[i].position[0]-scrndata[i].offsetX,scrndata[i].position[1]-scrndata[i].offsetY,3,3,1,0,6.3)
            pen.fill()
            pen.font = "8px serif";
            pen.fillText(scrndata[i].ID,scrndata[i].position[0]-scrndata[i].offsetX+5, scrndata[i].position[1]-scrndata[i].offsetY)
            
        }
        if(scrndata[i].type == "line")
        {
            //og(JSON.stringify(scrndata))
            pen.moveTo(scrndata[i].coords[0][0]-scrndata[i].offsetX,scrndata[i].coords[0][1]-scrndata[i].offsetY)
            pen.lineTo(scrndata[i].coords[1][0]-scrndata[i].offsetX,scrndata[i].coords[1][1]-scrndata[i].offsetY)
            pen.stroke()
        }
        
        pen.closePath()
        pen = 5
    }    
    var pen = canvas.getContext("2d");
    for(let i = 0; i<scrndata.length; i++)
    {
        if(!scrndata[i].type == "dungeon feature")
        {continue}
        pen.beginPath()
        if(scrndata[i].ftype == "door")
        {   
            pen.strokeStyle = "black"
        if((EDIT_ITEM == i|| hoverItem==i )&& Draw_Type == "edit")
            {
                pen.strokeStyle = "blue"
            }
            pen.fillStyle = "white"
            pen.moveTo(scrndata[i].coord[0]-3-scrndata[i].offsetX, scrndata[i].coord[1]-3-scrndata[i].offsetY)
            pen.lineTo(scrndata[i].coord[0]+3-scrndata[i].offsetX, scrndata[i].coord[1]-3-scrndata[i].offsetY)
            pen.lineTo(scrndata[i].coord[0]+3-scrndata[i].offsetX, scrndata[i].coord[1]+3-scrndata[i].offsetY)
            pen.lineTo(scrndata[i].coord[0]-3-scrndata[i].offsetX, scrndata[i].coord[1]+3-scrndata[i].offsetY)
            pen.lineTo(scrndata[i].coord[0]-3-scrndata[i].offsetX, scrndata[i].coord[1]-3-scrndata[i].offsetY)
            pen.stroke()
            pen.fill()
        }
        pen.closePath()
    
    }
    //editMenu()

}
function logcoords(a,b)
{
    log(a+", "+b)
}
function log(str)
{
    document.getElementById("log").innerHTML += str+"<br>"
}
function reset()
{
    clearLog()
    Draw_Type ="draw"
    scrndata = []
    waypointID = 1
    updateScreen()
    log("you have resetty")
    log("you will not get spaghetti")
    log("unless you go to MY SPONSOR, I don't actually have one but if you give me like 10 bucks I'll give you some spaghetti")
    document.getElementById("DDraw-editMenu").innerHTML = ""

}
function setMode(mode)
{
    document.getElementById("canvas").style.cursor = "default"
    document.getElementById("xtra").innerHTML = ""
    switch (mode) {
        case 1:
            Draw_Type = "draw"
            break
        case 2:
            Draw_Type = "line"
            LINE_PT_A = [0,0]
            LINE_PT_B = [0,0]

            lineStart = true
            break
        case 3:
            Draw_Type = "waypoint"
            break
        case 4:
            {
            Draw_Type = "dungeon feature";
            document.getElementById("xtra").innerHTML = "<h2>feature</h2>"+dungeonFeatureList()
            }
            break
        case 5:
            Draw_Type = "edit"
            document.getElementById("canvas").style.cursor = "grab"
            editMenu()
            break
            

    }
    document.getElementById("oogabooga").innerHTML = " Tool: "+Draw_Type
}
function getWaypointID(index)
{
    document.getElementById("DDraw-editMenu").innerHTML = ("This waypoint is currently going to have the ID "+WaypointID+". Enter nothing to keep that, or enter a new number to set it to something else.<br><input type='text' id='change'>")
    document.getElementById("change").addEventListener("keydown",(event) =>{
            if(event.code=="Enter")
            {
                log(document.getElementById("change").value)                   
                document.getElementById("change").blur()
                if(document.getElementById("change").value == "")
                {
                    document.getElementById("xtra").innerHTML = ""
                    return
                }
                if(!isNaN(parseInt(document.getElementById("change").value)))
                {
                    
                    scrndata[index].ID = parseInt(document.getElementById("change").value)
                    WaypointID--
                    updateScreen()
                    document.getElementById("xtra").innerHTML = ""
                    
                }
                else
                {
                    setTimeout(()=>{document.getElementById("change").focus()},30)
                }
                
            }
    })
    setTimeout(()=>{document.getElementById("change").focus()},30)

}
function dungeonFeatureList()
{
    let rstr = ""
    for(let i = 0; i<featureList.length; i++)
    {
        rstr+=`<button onclick="setFeature(${i})">${featureList[i]}</button>`
    }
    return rstr
}
function setFeature(num)
{
    selectedFeature = featureList[num]
    document.getElementById("oogabooga").innerHTML = " Tool: dungeon feature - "+selectedFeature
    rotation = 0
}
function editMenu()
{
    let editMenu = `
    <h3>Screen Objects:</h3>
    <br>
    <button onclick='remove()'>Remove object</button>
    <div id="objects">
    `    
    if(scrndata.length==0)
    {
        editMenu+="<em>No screen objects</em>"
    }
    for(let i = 0; i<scrndata.length; i++)
    {
        if(scrndata[i].type == "draw")
        {
            editMenu +=`<button class="scrnobj"  id = "EM${i}"onclick="editItem(${i})">drawing</button><br>`
        }
        else
        {
            editMenu +=`<button class="scrnobj"  id = "EM${i}" onclick="editItem(${i})">${scrndata[i].type}</button><br>`
        }
    }
    

    document.getElementById("DDraw-editMenu").innerHTML = editMenu+"</div>"
    buttons = document.getElementById("objects").querySelectorAll("Button")
    buttons.forEach((button)=>{
        button.addEventListener("mouseover", (event)=>{
            button.style.backgroundColor = "darkCyan"
            hoverItem = button.id.substring(2)
            
        })
        button.addEventListener("mouseout", (event)=>{
            button.style.backgroundColor = "darkGrey"
            hoverItem = -1
            
        })

    })
    
}
// function zchange(type)
// {
//   let temp
//   switch(type) {
//     case 0:
//       temp = scrndata[EDIT_ITEM]    
//       scrndata.splice(EDIT_ITEM,1)
//       scrndata.splice(0,0,temp)
//       break;
//     case 1:
//       scrndata.push(scrndata[EDIT_ITEM])
//       scrndata.splice(EDIT_ITEM,1)
//       break;
//     case 2:
//       temp = scrndata[EDIT_ITEM]    
//       scrndata.splice(EDIT_ITEM,1)
//       scrndata.splice(EDIT_ITEM-1,0,temp)
//       break;
//     case 3:
//       temp = scrndata[EDIT_ITEM]    
//       scrndata.splice(EDIT_ITEM,1)
//       scrndata.splice(EDIT_ITEM,0,temp)
//       break;
//   }
//   log(scrndata)
//   updateScreen()
//   editMenu()
// }
function editItem(idx)
{
    EDIT_ITEM = idx;
    //log(EDIT_ITEM)
    //log(JSON.stringify(scrndata[EDIT_ITEM]))
    updateScreen()
    
}
function remove()
{
    scrndata.splice(EDIT_ITEM,1)
    updateScreen()
    editMenu()
}
// function duplicate()
// {
//     scrndata.push(scrndata[EDIT_ITEM])
//     log(JSON.stringify(scrndata))
//     editMenu()
//     updateScreen()

// }
function exportfile() {
    // exports file based on file name and type given and text given
    var element = document.createElement('a');
    element.setAttribute('href','data:text/plain;charset=utf-8, '+ encodeURIComponent(JSON.stringify(scrndata)));
    element.setAttribute('download', document.getElementById("DDraw-name").value+".ddraw");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function importfile() {
    var fileToLoad = document.getElementById("import").files[0];
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent){
        var textFromFileLoaded = fileLoadedEvent.target.result;
        document.getElementById("DDraw-name").value = document.getElementById("import").value.substring(12,document.getElementById("import").value.lastIndexOf('.'))
        document.getElementById("DDraw-name").blur()
        scrndata = JSON.parse(textFromFileLoaded)
        updateScreen()
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
}
