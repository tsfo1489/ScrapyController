window.onload = function () {
  //const IP = "localhost";
  const IP = "115.145.212.145";
  const port = "8082";
  const promise = fetch(`http://${IP}:${port}/sample`)
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((json) => {
        console.log(json);
        let metaCrawlers = json;
        console.log(metaCrawlers);

        // handle input dropdown
        let crawlerName = "Crawler";
        let crawlerIdx = "0";
        let crawlerNameList = Object.getOwnPropertyNames(metaCrawlers);

        let spiderName = "Spider";
        let spiderIdx = "0";
        let spiderNameList =[];
        let paramName = "Param";
        let paramIdx = "0";
        let paramNameList = [];
        
        
        const crawlerDropdownMenu = document.getElementById("crawlerDropdownMenu");
        const crawlerDropdown = document.getElementById("crawlerDropdown");
        const spiderDropdownMenu = document.getElementById("spiderDropdownMenu");
        const spiderDropdown = document.getElementById("spiderDropdown");
        const inputParamsArea = document.getElementById("inputParamsArea")
        let metaSpiders = crawlerNameList.map((name)=>{
            return metaCrawlers[name]["spiders"]
        });
        crawlerNameList.map((name,idx)=>{
            let listComponent = document.createElement("li");
            listComponent.setAttribute("idx",`${idx}`)
            listComponent.innerHTML = `<button class="dropdown-item">${name}</button>`;
            listComponent.addEventListener("click",function(){
                crawlerDropdown.innerText = this.innerText;
                spiderDropdown.removeAttribute("disabled");
                spiderDropdownMenu.innerHTML="";
                crawlerName = this.innerText;
                crawlerIdx = this.getAttribute("idx");
                console.log(crawlerName);
                setSpider(crawlerIdx);
            })
            crawlerDropdownMenu.appendChild(listComponent);
            return metaCrawlers[name]["spiders"]
        })
        console.log(metaSpiders);
        
        function setSpider(crawlerIdx){
            console.log("setSpider",metaSpiders[crawlerIdx]);
            spiderNameList = Object.getOwnPropertyNames(metaSpiders[crawlerIdx])

            console.log("spiderNameList",spiderNameList)

            paramNameList=spiderNameList.map((name)=>{
                console.log("paramlist---", metaSpiders[crawlerIdx][name]["parameters"]);
                return metaSpiders[crawlerIdx][name]["parameters"];
            })
            spiderNameList.map((name,idx)=>{
                let listComponent = document.createElement("li");
                listComponent.setAttribute("idx",idx);
                listComponent.innerHTML = `<button class="dropdown-item">${name}</button>`;
                listComponent.addEventListener("click",function(){
                    spiderDropdown.innerText = this.innerText;
                    spiderName = this.innerText;
                    spiderIdx = this.getAttribute("idx");
                    console.log(spiderName);
                    setParams();
                })
                spiderDropdownMenu.appendChild(listComponent);
                console.log("metaspidername",metaSpiders[crawlerIdx]);
            })
        }
        function setParams(){
            $("#inputParamsArea").find(":not(.logfile)").remove();
            console.log("Setparams");
            paramNameList[spiderIdx].map((name,idx)=>{
                let input_params = document.createElement("div");
                input_params.className="input-params"
                let checkbox = document.createElement("input");
                checkbox.className = "check-pram";
                checkbox.setAttribute("type","checkbox");
                checkbox.setAttribute("idx",idx);
                checkbox.id = name;
                let label = document.createElement("label");
                label.setAttribute("htmlFor",name)
                label.innerText = name;
                let textbox = document.createElement("input");
                textbox.setAttribute("type","text");
                textbox.setAttribute("idx",idx);
                textbox.className = "input-param"
                textbox.setAttribute("disabled","true");
                let submitBtn = document.createElement("button");
                submitBtn.className="btn btn-primary nowrap";
                submitBtn.setAttribute("type","button");
                submitBtn.setAttribute("idx",idx);
                submitBtn.setAttribute("disabled","true");
                submitBtn.innerHTML = "<i class='bi bi-plus'></i>";
                input_params.appendChild(checkbox);
                input_params.appendChild(label);
                input_params.appendChild(textbox);
                input_params.appendChild(submitBtn);
                checkbox.addEventListener("click",function(){
                    console.log(this.id);
                    textbox.toggleAttribute("disabled");
                    submitBtn.toggleAttribute("disabled");
                    paramName = this.innerText;
                    paramIdx = this.getAttribute("idx");
                });
                submitBtn.addEventListener("click",function(){
                    let keyword = "";
                    let inputtextList = document.getElementsByClassName("input-param");
                    let inputParam = document.getElementsByClassName("input-params");
                    for(let i =0; i<inputtextList.length; i++){
                        if(i===Number(this.getAttribute("idx"))) keyword = inputtextList.item(i)
                        inputtextList.item(i).value = "";
                    }
                    const btnParam = document.createElement("button");
                    btnParam.setAttribute("class", "btn btn-para ms-1 me-1 mt-1 mb-1");
                    btnParam.textContent = keyword;
                    inputParam.item(Number(this.getAttribute("idx"))).appendChild(btnParam);
                });
                inputParamsArea.appendChild(input_params);
            }) 
        }

    })

};


