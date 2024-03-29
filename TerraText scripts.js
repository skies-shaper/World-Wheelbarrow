    //init()
    function init()
    {
        document.getElementById("onstart").innerHTML  = `
        <h1 class="intro">Welcome to World-Wheelbarrow!<br>
        Let's get started.</h1>
        `
        document.getElementById("toolbar").style.visibility = "hidden"
        document.getElementById("projectname").style.visibility = "hidden"
        setTimeout(()=>{
            
            document.getElementById("projectname").style.visibility = "visible"
            document.getElementById("projectname").focus()
            window.addEventListener("mousedown",focusPName)
            document.getElementById("projectname").addEventListener("keyup",(e)=>{
                if(e.key == "Enter")
                {
                    if(document.getElementById("projectname").value != "")
                    {
                        document.getElementById("projectname").blur()
                        setMode(1)
                        document.getElementById("toolbar").style.visibility = "visible"
                        document.getElementById("onstart").innerHTML + ""
                        window.removeEventListener("mousedown",focusPName)
                    }
                }
            })
        },4000)
        
    }
    function focusPName()
    {
        setTimeout(()=>{document.getElementById("projectname").focus()})
    }
    let DATA = ["",[],"",[],[],""]
    function reset()
    {
        DATA = ["",[],"",[],[],""]
    }
    let MODE = 1
    window.onerror = function(message, source, lineno, colno, error) {
        log(`${message} at line ${lineno}:${colno}`);
    }
    var instructions = [
    "<em>This page will contain background information on your location</em>",
    "<em>Here describe some people who live in your location</em>",
    "<em>Here describe where this location is relative to the rest of your world</em>",
    "<em>Here, add a few adventure hooks!</em>",
    "<em>Here, add places within your location (buildings, monuments, other points of interest to the unwary traveler)</em>",
    "<em>This is a short description of you</em>"]
    function setMode(mode)
    {
        for(let i = 1; i<7; i++)
        {
            if(i==mode)
            {
                document.getElementById(`tb${i}`).style.background = "burlywood"
            }
            else
            {
                document.getElementById(`tb${i}`).style.background = "bisque"
            }
        }
        MODE = mode
        let page = document.getElementById("wrt")
        if(Array.isArray(DATA[mode-1]))
        {
            page.innerHTML = instructions[mode-1]+"<input id='inpt'placeholder='Name'></input><br><textarea id='txtarea'></textarea><button id='add' onclick='add()'>Add to list</button><br>"
            setTimeout(()=>{document.getElementById("inpt").focus()},30)
        }
        else
        {
            page.innerHTML = instructions[mode-1]+"<textarea id='txtarea'></textarea>"
            setTimeout(()=>{
                document.getElementById("txtarea").focus()
                
                document.getElementById("txtarea").addEventListener("keyup",()=>{
                    DATA[mode-1] = document.getElementById("txtarea").value
                    //log(DATA[mode-1])
                })
                //body
                
            },30)
        }
        let data_input = DATA[mode-1]
        //log("data: "+data_input)
        //log(JSON.stringify(data_input))
        if(!Array.isArray(data_input))
        {
            document.getElementById("txtarea").value = data_input
            return
        }
        if(data_input.length == 0)
        {
            page.innerHTML += "<em>You have not yet added any content :(</em>"
            return
        }
        for(let i = 0; i<data_input.length; i++)
        {
            page.innerHTML += `<div style="width: 100%; border-top: 1px solid black;"></div><button onclick = "moveup(${i})">Move up</button><button onclick="movedown(${i})">Move down</button><button onclick="remove(${i})">Remove</button><button onclick = "edit(${i})">Edit</button>`
            const newHeader = document.createElement("h2")
            let content = document.createTextNode(data_input[i]["head"])
            newHeader.appendChild(content)
            page.appendChild(newHeader)
            const newText = document.createElement("p")
            content = document.createTextNode(data_input[i]["body"])
            newText.appendChild(content)
            page.appendChild(newText)
            page.innerHTML += "</div>"
            //log(data_input[i]["body"])
        }

    }
    function edit(item)
    {
        add()
        let tempBody, tempInpt
        tempBody = DATA[MODE-1][item]["body"] 
        tempInpt = DATA[MODE-1][item]["head"] 
        remove(item)
        document.getElementById("txtarea").value = tempBody
        document.getElementById("inpt").value = tempInpt
    }
    function log(str)
    {
       document.getElementById("log").innerHTML += str+"<br>"
    }
    function add()
    {
        if(document.getElementById("inpt").value ==""&& document.getElementById("txtarea").value =="")
        {
            return
        }
        document.getElementById("alert").innerHTML = ""
        if(document.getElementById("inpt").value=="")
        {
            document.getElementById("inpt").value = "Untitled"

        }
        if(document.getElementById("txtarea").value=="")
        {
            document.getElementById("txtarea").value = "No content given"
        }
        setTimeout(()=>{
            document.getElementById("alert").style.visibility = "hidden"
        }, 1500)
        if(document.getElementById("inpt").value=="" ||document.getElementById("txtarea").value=="")
        {
            return
        }
        //log("hi")
        DATA[MODE-1].push({"head": document.getElementById("inpt").value, "body": document.getElementById("txtarea").value})
        setMode(MODE)   
    }
    function moveup(item){
        if(item<1)
        {
            return
        }
        let temp = DATA[MODE-1][item]
        let temp2 = DATA[MODE-1][item-1]
        DATA[MODE-1][item] = temp2
        DATA[MODE-1][item-1] = temp
        setMode(MODE)
    }
    function movedown(item)
    {
        if(item>DATA[MODE-1].length-2)
        {
            return
        }
        let temp = DATA[MODE-1][item]
        let temp2 = DATA[MODE-1][item+1]
        DATA[MODE-1][item] = temp2
        DATA[MODE-1][item+1] = temp
        setMode(MODE)
    }
    function remove(item)
    {
        DATA[MODE-1].splice(item,1)
        setMode(MODE)
    }
    function save() {
        // exports file based on file name and type given and text given
        var element = document.createElement('a');
        element.setAttribute('href','data:text/plain;charset=utf-8, '+ encodeURIComponent(JSON.stringify(DATA)));
        element.setAttribute('download', document.getElementById("projectname").value+".ttext");
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
    
    function load() {
        var fileToLoad = document.getElementById("import").files[0];
        var fileReader = new FileReader();
        fileReader.onload = function(fileLoadedEvent){
            var textFromFileLoaded = fileLoadedEvent.target.result;
            document.getElementById("projectname").value = document.getElementById("import").value.substring(12,document.getElementById("import").value.lastIndexOf('.'))
            document.getElementById("name").blur()
            DATA = JSON.parse(textFromFileLoaded)
            setMode(1)
        };
        fileReader.readAsText(fileToLoad, "UTF-8");
    }