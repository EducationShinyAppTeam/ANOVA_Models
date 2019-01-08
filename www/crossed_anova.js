/*************************************************************** TABS **********************************************************/
// Add event listeners to all tabs
// You can either do it this way, or delete the following code before the openTab function, and use the commented out buttons code in the html file
// I actually think the way done below is probably more confusing, but I'll keep it for now
let tabs_c = document.querySelector(".tab_c")
tabs_c.firstElementChild.addEventListener("click", function(e) {
    openTab_c(e, "crossed1");
});
tabs_c.firstElementChild.nextElementSibling.addEventListener("click", function(e) {
    openTab_c(e, "crossed2");
});

// This function opens the proper tab on a click
function openTab_c(evt, tabName){
    // Declare all variables
    let tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent_c");
    for (let i = 0; i < tabcontent.length; i++){
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks_c");
    for (i = 0; i < tablinks.length; i++){
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    // We only concatenate the "active" class because we want to change the color of the opened tab, otherwise it's not necessary
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Open "crossed1" by default
// Get the element with id="defaultOpen_c" and click on it
document.getElementById("defaultOpen_c").click();
/*******************************************************************************************************************************/


/************************************************* TAB 1: CROSSED ANOVA MODEL **************************************************/

// Add "hide" class to "Build a Nested Model" button so it will be hidden by default
let next1_c = document.querySelector("#next1_c");
next1_c.classList.add("hide");

// Add "hide" class to all "desc" so the descriptions will be hidden by default
let descriptions_c = document.getElementsByClassName("desc_c");
for (let i = 1; i <= descriptions_c.length; i++){
    descriptions_c[i-1].classList.add("hide");
    // Add event listeners for all buttons (if I had made each button id nb0,...nb5 then I wouldn't need to do this weird i-1 indexing)
    // Also, the anonymous function isn't necessary, but in case I need to access the event later, I'll just keep it here
    document.querySelector("#cb"+i.toString()).addEventListener("click", function(e) {
        showDescBtn_c(e, descriptions_c[i-1].id);
    });
}

// Function to call when each button is clicked
// Checks TWO THINGS: whether to hide/show the descs & whether to hide/show the "Build a Nested Model" button
// I made it so that each desc will either have the "hide" or "show" class always, but I could have just used one and made the code less binary
function showDescBtn_c(evt, descNum){
    //Check to hide/show descriptions
    description = document.getElementById(descNum);
    if (description.classList.contains("hide")){
        description.classList.remove("hide");
        description.classList.add("show");
    } else if (description.classList.contains("show")){
        description.classList.remove("show");
        description.classList.add("hide");
    }

    // Check to hide/show "Build a Nested Model" button
    let sum = 0;
    for (let i = 0; i < descriptions_c.length; i++){
        if (descriptions_c[i].classList.contains("show")){
            sum = sum + 1
        }
    }
    // All descriptions have class "show"
    // The "else" is necessary if I want the button to hide once again even if all nbs have been pressed once
    if (sum === 7){
        next1_c.classList.remove("hide");
        next1_c.classList.add("show");
    } else{
        next1_c.classList.remove("show");
        next1_c.classList.add("hide");
    }
}


// Move from first tab to second
next1_c = document.querySelector("#next1_c");
next1_c.addEventListener("click", toCrossed2);
function toCrossed2() {
    document.getElementById("crossed1").style.display = "none";
    document.querySelector(".tab_c").firstElementChild.classList.remove("active");
    document.getElementById("crossed2").style.display = "block";
    document.querySelector(".tab_c").firstElementChild.nextElementSibling.classList.add("active");
}
/*******************************************************************************************************************************/


/************************************************ TAB 2: BUILD A CROSSED MODEL *************************************************/

async function setLayout_c(){

    // Get the json file and turn it into a form js can output
    let results = await fetch("crossed_anova_bank.json");
    let questions = await results.json();

    // Select a random question from questions
    let randNum = await Math.floor(Math.random() * questions.length);
    let question = await questions[randNum];
    // Output that random question's scenario
    document.getElementById("scenario_c").innerHTML = await question.scenario;

    // Select a random ordering of the effects
    // Use a shuffle function to randomly decide radio button order
    let effOrder = await shuffle([question.mainEffect1, question.mainEffect2, question.replicate]);

    //Visibility:hidden diagram feedback
    document.querySelector("#diagramFeedback_c").visibility = "hidden";

    /// Output the 3 Choices: async/await not necessary; I don't care which order they are outputted in ///
    // Output Step 1 choices
    // First set changing values/divs to empty html strings
    document.getElementById("checkx1_c").innerHTML = '';
    document.getElementById("feedback1_c").innerHTML = '';

    choiceBlock1Output = '';
    effOrder.forEach(function(eff){
        // I changed the value of each button to a no-space, all lowercase string of the answer
        choiceBlock1Output += `
            <input type="checkbox" name="step1Choices" value=${eff.replace(/\s+/g, '').toLowerCase()}>${eff}<br>
        `
    })
    document.getElementById("choiceBlock1_c").innerHTML = choiceBlock1Output;

    // Output Step 2 choices
    // First set changing values/divs to empty html strings
    document.getElementById("checkx2_c").innerHTML = '';
    document.getElementById("feedback2_c").innerHTML = '';
    document.getElementById("interNumInput_c").value = '';

    // Output Step 3 (same effOrder)
    // First set changing values/divs to empty html strings
    document.getElementById("checkx3_c").innerHTML = '';
    document.getElementById("feedback3_c").innerHTML = '';
    document.getElementById("checkx4_c").innerHTML = '';
    document.getElementById("feedbackRep3_c").innerHTML = '';
    document.getElementById("repNumInput_c").value = '';

    choiceBlock3Output = '';
    effOrder.forEach(function(eff){
        choiceBlock3Output += `
            <input type="radio" name="step3Choices" value=${eff.replace(/\s+/g, '').toLowerCase()}>${eff}<br>
        `
    })
    document.getElementById("choiceBlock3_c").innerHTML = choiceBlock3Output;


    ///// Output the Dragable Elements Block /////
    // Create an array of containing all main1, main2, and replicate levels (by concatenation)
    let allElems_c = question.main1Levels.concat(question.main2Levels, question.repNums);
    let dragElements_c = shuffle(allElems_c);
    // Put each element in dragElements into a draggable div
    let dragBlockOutput_c = ''; //This will end up containing the draggable elements
    for (let i = 0; i < dragElements_c.length; i++){
        dragBlockOutput_c += `
            <div class="dragEl_c" draggable="true" id=${"drag"+i.toString()+"_c"}>${dragElements_c[i]}</div>
        `
    }
    document.getElementById("dragBlock_c").innerHTML = dragBlockOutput_c;

    // Add dragstart & dragend event listeners to all drag objects
    document.querySelectorAll(".dragEl_c").forEach(function(el){el.addEventListener("dragstart", dragStart)});
    document.querySelectorAll(".dragEl_c").forEach(function(el){el.addEventListener("dragend", dragEnd)});

    ///// Output the Crossed ANOVA Diagram /////
    // First set changing values/divs of Crossed ANOVA Diagram to empty html strings
    document.getElementById("crossedDiagram").innerHTML = '';
    document.getElementById("diagramFeedback_c").innerHTML = '';

    crossedDiagramOutput = `
        <div id="ijtLabel_c">
            <div>𝒊:</div>
            <div>𝒋:</div>
            <div>𝒕:</div>
        </div>
                
        <div class="diagramPart_c">
            <div class="main1Level_c">
                <div></div>
                <div></div>
            </div>
            <div class="crossedLines_c">
                <svg id="crossedLines_svg"
                    xmlns:dc="http://purl.org/dc/elements/1.1/"
                    xmlns:cc="http://creativecommons.org/ns#"
                    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                    xmlns:svg="http://www.w3.org/2000/svg"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                    xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
                    width="297mm"
                    height="210mm"
                    viewBox="0 0 297 210"
                    version="1.1"
                    id="svg8"
                    inkscape:version="0.92.3 (2405546, 2018-03-11)"
                    sodipodi:docname="crossedLines.svg">
                    <defs
                        id="defs2" />
                    <sodipodi:namedview
                        id="base"
                        pagecolor="#ffffff"
                        bordercolor="#666666"
                        borderopacity="1.0"
                        inkscape:pageopacity="0.0"
                        inkscape:pageshadow="2"
                        inkscape:zoom="0.47749719"
                        inkscape:cx="396.85039"
                        inkscape:cy="561.25984"
                        inkscape:document-units="mm"
                        inkscape:current-layer="g922"
                        showgrid="false"
                        showborder="true"
                        inkscape:window-width="1366"
                        inkscape:window-height="705"
                        inkscape:window-x="-8"
                        inkscape:window-y="-8"
                        inkscape:window-maximized="1"
                        inkscape:snap-nodes="false"
                        inkscape:snap-global="false" />
                    <metadata
                        id="metadata5">
                        <rdf:RDF>
                        <cc:Work
                            rdf:about="">
                            <dc:format>image/svg+xml</dc:format>
                            <dc:type
                            rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                            <dc:title></dc:title>
                        </cc:Work>
                        </rdf:RDF>
                    </metadata>
                    <g
                        inkscape:label="Layer 1"
                        inkscape:groupmode="layer"
                        id="layer1"
                        transform="translate(0,-87)">
                        <g
                        id="g922"
                        transform="matrix(1.2766295,0,0,1,612.01259,-939.6138)">
                        <g
                            transform="matrix(1.4268077,0,0,0.43952733,-168.62827,598.08191)"
                            id="g873"
                            style="stroke-width:1.77009904;stroke-miterlimit:4;stroke-dasharray:none" />
                        <g
                            transform="matrix(-1.4268077,0,0,0.43952733,-555.86802,598.0885)"
                            id="g873-2" />
                        <path
                            sodipodi:nodetypes="cc"
                            inkscape:connector-curvature="0"
                            id="left2"
                            d="m -437.29561,1027.7164 9.54882,51.5318"
                            style="fill:none;stroke:#000000;stroke-width:0.61953467;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
                        <path
                            sodipodi:nodetypes="cc"
                            inkscape:connector-curvature="0"
                            id="left1"
                            d="m -437.72964,1027.7164 -35.15698,52.0859"
                            style="fill:none;stroke:#000000;stroke-width:0.70803958;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
                        <path
                            sodipodi:nodetypes="cc"
                            inkscape:connector-curvature="0"
                            id="left5"
                            d="m -437.29561,1028.2705 141.06205,53.1941"
                            style="fill:none;stroke:#000000;stroke-width:1.0620594;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
                        <path
                            sodipodi:nodetypes="cc"
                            inkscape:connector-curvature="0"
                            id="left3"
                            d="m -437.72964,1027.7164 54.25463,53.194"
                            style="fill:none;stroke:#000000;stroke-width:0.70803958;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
                        <path
                            style="fill:none;stroke:#000000;stroke-width:0.88504952;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
                            d="m -437.72964,1027.1623 93.31798,52.6398"
                            id="left4"
                            inkscape:connector-curvature="0"
                            sodipodi:nodetypes="cc" />
                        <path
                            style="fill:none;stroke:#000000;stroke-width:0.88504952;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
                            d="m -287.11879,1027.1623 -185.3338,52.6399"
                            id="right1"
                            inkscape:connector-curvature="0"
                            sodipodi:nodetypes="cc" />
                        <path
                            style="fill:none;stroke:#000000;stroke-width:0.88504952;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
                            d="m -287.55283,1027.1623 c -2.17018,1.6623 -140.62799,52.6399 -140.62799,52.6399"
                            id="right2"
                            inkscape:connector-curvature="0"
                            sodipodi:nodetypes="cc" />
                        <path
                            style="fill:none;stroke:#000000;stroke-width:0.88504952;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
                            d="m -287.55283,1027.1623 -96.79025,53.7481"
                            id="right3"
                            inkscape:connector-curvature="0"
                            sodipodi:nodetypes="cc" />
                        <path
                            style="fill:none;stroke:#000000;stroke-width:0.88504952;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
                            d="m -287.98686,1027.1623 -8.24671,53.7481"
                            id="right5"
                            inkscape:connector-curvature="0"
                            sodipodi:nodetypes="cc" />
                        <path
                            style="fill:none;stroke:#000000;stroke-width:0.88504952;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
                            d="m -287.98686,1027.1623 31.68471,53.194"
                            id="right6"
                            inkscape:connector-curvature="0"
                            sodipodi:nodetypes="cc" />
                        <path
                            style="fill:none;stroke:#000000;stroke-width:0.88504952;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
                            d="m -288.4209,1028.2705 c -3.03826,2.7705 -56.85884,51.5317 -56.85884,51.5317"
                            id="right4"
                            inkscape:connector-curvature="0"
                            sodipodi:nodetypes="cc" />
                        <path
                            style="fill:none;stroke:#000000;stroke-width:0.88504952;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
                            d="m -437.72964,1027.1623 181.42747,53.194"
                            id="left6"
                            inkscape:connector-curvature="0"
                            sodipodi:nodetypes="cc" />
                        </g>
                    </g>
                </svg>
            </div>
            <div class="main2Level_c">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div class="repLines_c">
                <div>☓</div>
                <div>☓</div>
                <div>☓</div>
                <div>☓</div>
                <div>☓</div>
                <div>☓</div>
            </div>
            <div class="repLevel_c">
                <div class="repBox_c">
                    <div></div>
                    <div></div>
                </div>
                <div class="repBox_c">
                    <div></div>
                    <div></div>
                </div>
                <div class="repBox_c">
                    <div></div>
                    <div></div>
                </div>
                <div class="repBox_c">
                    <div></div>
                    <div></div>
                </div>
                <div class="repBox_c">
                    <div></div>
                    <div></div>
                </div>
                <div class="repBox_c">
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
    `
    document.getElementById("crossedDiagram").innerHTML = crossedDiagramOutput;

    // Add 4 event listeners to all drop objects: dragover, dragenter, dragleave, drop

    // Get a node list of all drop elements in the diagram
    let dropElements = document.querySelectorAll(".main1Level_c>*, .main2Level_c>*, .repBox_c>*")
    // Add 4 event listeners to all drop objects: dragover, dragenter,
    dropElements.forEach(function(dropEl_c){
        dropEl_c.addEventListener("dragover", dragOver);
        dropEl_c.addEventListener("dragenter", dragEnter);
        dropEl_c.addEventListener("dragleave", dragLeave);
        dropEl_c.addEventListener("drop", dragDrop);
    })
    // Also add these 4 event listeners to the original drag elements box
    let dragBlock_c = document.querySelector("#dragBlock_c");
    dragBlock_c.addEventListener("dragover", dragOver);
    dragBlock_c.addEventListener("dragenter", dragEnter);
    dragBlock_c.addEventListener("dragleave", dragLeave);
    dragBlock_c.addEventListener("drop", dragDrop);

    ///// Event Listeners for drop objects /////
    // Remember to add the if(evt.target !=== this)... to make sure that the event listener ONLY applies to #dragBlock, and NOT its children
    // We don't want drag elements to be able to be dragged into other drag elements for example
    // The "return" cancels the drag
    function dragOver(evt){
        evt.preventDefault();
        if (evt.target !== this){
            return;
        }
        evt.dataTransfer.dropEffect = "move";
        console.log("drag over");
    }
    function dragEnter(evt){
        evt.preventDefault();
        if (evt.target !== this){
            return;
        }
        // Add a hovered shadow (but ONLY if the target is not the drag block & the target is not a drop box with a child in it already)
        if(this.id != "dragBlock_c" && !this.hasChildNodes()){
            this.classList.add("hovered");
        }
        console.log("drag enter");
    }
    function dragLeave(evt){
        if (evt.target !== this){
            return;
        }
        this.classList.remove("hovered");
        console.log("drag leave");
    }
    function dragDrop(evt){
        evt.preventDefault();
        let data = evt.dataTransfer.getData("text");
        // Fill the drop box (exclude dragBlock)
        //if ((evt.target.id != "dragBlock" && !evt.target.hasChildNodes()) || document.getElementById(data).textContent == evt.target.textContent)
        if (evt.target.id != "dragBlock_c" && !evt.target.hasChildNodes()) {
            // only add the fill class if the event target is not dragBlock, and if the target has a child node (if drop is empty, we still want the drag to fill it)
            // the case after || is for when you drag the same element out of its drop box and just put it back in without letting go
            document.getElementById(data).classList.add("fill");
        } else if (evt.target.id == "dragBlock_c"){
            // remove the fill class if dropping back into dragBlock
            document.getElementById(data).classList.remove("fill");
        }

        // If the element is being dragged onto a child element of the proper drop box, then the drag will fail
        if(evt.target !== this){
            return;
        }
        // If the drag box is a little bigger, then the first if won't catch this
        if (evt.target.hasChildNodes() && evt.target.id != "dragBlock_c"){
            return;
        }
        evt.target.appendChild(document.getElementById(data));
        // Remove the hover shadow when element is dropped
        this.classList.remove("hovered");

        console.log("drag drop");
    }

    // Hide the elements we want to be hidden at beginning of game
    // Hide contents inside each step block first (so the size won't change)
    // // stepChilds = document.querySelectorAll("#step1_c>*, #step2_c>*, #step3_c>*");
    // // for(child of stepChilds){
    // //     child.style.visibility = "hidden";
    // // }
    // Then hide the actual step blocks themselves
    let stepBlocks = document.querySelectorAll("#step1_c, #step2_c, #step3_c");
    for (block of stepBlocks){
        block.style.display = "none";
    }

    // Display:none some other elements
    noneEls = document.querySelectorAll("#crossedInstr, #dragBlock_c, #crossedTitle, #crossedDiagram, #submitDiv_c, #finalBtnDiv_c, #finalModel_c, #playAgainDiv_c");
    for (none of noneEls){
        none.style.display = "none";
    }
    //Visibility:hidden diagram feedback
    //document.querySelector("#diagramFeedback_c").visibility = "hidden";

    // "Build Model" Button Event Listener
    document.getElementById("build_c").addEventListener("click", showStep1);
    function showStep1(){
        document.getElementById("step1_c").style.display = "inline-block";
        
        // // let step1Children = document.querySelectorAll("#step1_c>*");
        // // for (child of step1Children){
        // //     child.style.visibility = "visible";
        // // }
    }

    /// CHECK STEP 1 ///

    // Limit the number of checks to 2
    // Add event listeners to every checkbox
    let checks = document.getElementsByName("step1Choices");
    for (check of checks){
        check.addEventListener("click", limitChecks);
    }

    function limitChecks(){
        let checkNum = 0;
        for (check of checks){
            if (check.checked === true){
                checkNum = checkNum + 1;
            }
            if (checkNum > 2){
                this.checked = false;
            }
        }
    }

    // Add event listener to submit1_c
    document.getElementById("submit1_c").addEventListener("click", checkStep1_c);
    function checkStep1_c(){
        document.getElementById("feedback1_c").innerHTML = '';
        document.getElementById("checkx1_c").innerHTML = '';
        // setting these to empty strings makes the feedback/checkx disappear very quickly every time this function is called
        document.getElementById("feedback1_c").innerHTML = '';
        document.getElementById("checkx1_c").innerHTML = '';
        // CALLBACK: to separate the output of possibly two Xs

        let checkList1 = document.getElementsByName("step1Choices");
        // Get the selected value (index)
        let indexes = [];
        for (let i = 0; i < checkList1.length; i++){
            if (checkList1[i].checked){
                indexes.push(i);
            }
        }
        // CASE 1: NO ANSWER OR ONLY ONE ANSWER SELECTED
        // Remember to use === and not == (0=='' is true, but 0==='' is false); if we don't use ===, then if the answer choice with index 0 is selected, the "no choice selected" feedback will still be output
        if (indexes.length !== 2){
            // Output feedback (no check/x)
            document.getElementById("feedback1_c").innerHTML = `
            <div>Please select the two main effects from the above choices.</div>
            `
            // For setTimeout
            document.getElementById("feedback1_c").style.visibility = "hidden";
            setTimeout(function(){document.getElementById("feedback1_c").style.visibility = "visible"}, 200); //do setTimeout like this instead to avoid excess space changing

            // Hide Step 2 (and 3) if Step 1 is answered correctly and then changed to no answer/only one answer
            document.getElementById("step2_c").style.display = "none";
            document.getElementById("step3_c").style.display = "none";
        }
        // CASE 2: CORRECT ANSWERS SELECTED
        // Remember to change the value of comparison to a no-space, all lowercase string
        else if ((checkList1[indexes[0]].value == question.mainEffect1.replace(/\s+/g, '').toLowerCase() & checkList1[indexes[1]].value == question.mainEffect2.replace(/\s+/g, '').toLowerCase()) | (checkList1[indexes[0]].value == question.mainEffect2.replace(/\s+/g, '').toLowerCase() & checkList1[indexes[1]].value == question.mainEffect1.replace(/\s+/g, '').toLowerCase())){
            // Output if correct
            document.getElementById("feedback1_c").innerHTML = `
            <div>Correct!</div>
            `
            // Output Check
            document.getElementById("checkx1_c").innerHTML = `
            <div>✔</div>
            `
            document.getElementById("checkx1_c").style.color = "green";

            // For setTimeout
            document.getElementById("feedback1_c").style.visibility = "hidden";
            document.getElementById("checkx1_c").style.visibility = "hidden";
            setTimeout(function(){
                document.getElementById("feedback1_c").style.visibility = "visible";
                document.getElementById("checkx1_c").style.visibility = "visible";
            }, 200);

            // Show Step 2 if Step 1 is correct
            document.getElementById("step2_c").style.display = "inline-block";

            // Just in case Step 1 was answered correctly and then changed back to an incorrect answer (and Step 2 and 3 were already answered correctly), then you need to reset Step 2 and reset Step 3 in the function that checks Step 2 (very optional part)
            document.getElementById("interNumInput_c").value = '';
            document.getElementById("feedback2_c").style.visibility = "hidden";
            document.getElementById("checkx2_c").style.visibility = "hidden";
        }
        // CASE 3: INCORRECT ANSWER SELECTED
        else{
            // Output if incorrect
            document.getElementById("feedback1_c").innerHTML = `
            <div>Incorrect.</div>
            <div>Please correct your selections.</div>
            `
            // Output X
            document.getElementById("checkx1_c").innerHTML = `
            <div>✖</div>
            `
            document.getElementById("checkx1_c").style.color = "red";

            // For setTimeout
            document.getElementById("feedback1_c").style.visibility = "hidden";
            document.getElementById("checkx1_c").style.visibility = "hidden";
            setTimeout(function(){
                document.getElementById("feedback1_c").style.visibility = "visible";
                document.getElementById("checkx1_c").style.visibility = "visible";
            }, 200);
            
            // Hide Step 2 (and 3) if Step 1 is answered correctly and then changed to incorrect
            document.getElementById("step2_c").style.display = "none";
            document.getElementById("step3_c").style.display = "none";
        }
    }


    /// CHECK STEP 2 ///
    document.getElementById("submit2_c").addEventListener("click", checkStep2_c);

    function checkStep2_c(){
        document.getElementById("feedback2_c").innerHTML = '';
        document.getElementById("checkx2_c").innerHTML = '';       
        // CASE 1: INVALID INPUT: NUMBER LESS THAN 0, NO NUMBER ENTERED, NUMBER ENTERED IS NOT AN INTEGER
        if (Number(document.getElementById("interNumInput_c").value) < 0 || document.getElementById("interNumInput_c").value === '' || !Number.isInteger(Number(document.getElementById("interNumInput_c").value))){
            // Output feedback (no check/x)
                document.getElementById("feedback2_c").innerHTML = `
                <div>Please enter a valid number of interactions.</div>
                `
                // For setTimeout
                document.getElementById("feedback2_c").style.visibility = "hidden";
                setTimeout(function(){
                    document.getElementById("feedback2_c").style.visibility = "visible";
                }, 200);
        }
        // CASE 2: CORRECT INPUT
        else if (document.getElementById("interNumInput_c").value == question.main1Levels.length * question.main2Levels.length){
                document.getElementById("feedback2_c").innerHTML = `
                <div>Correct!</div>
                `
                // Output Check
                document.getElementById("checkx2_c").innerHTML = `
                <div>✔</div>
                `
                document.getElementById("checkx2_c").style.color = "green";

                // For setTimeout
                document.getElementById("feedback2_c").style.visibility = "hidden";
                document.getElementById("checkx2_c").style.visibility = "hidden";
                setTimeout(function(){
                    document.getElementById("feedback2_c").style.visibility = "visible";
                    document.getElementById("checkx2_c").style.visibility = "visible";
                    // Show Step 3
                    document.getElementById("step3_c").style.display = "inline-block";
                }, 200);

                // Just in case Step 1 was answered correctly and then changed back to an incorrect answer (and Step 2 and 3 were already answered correctly), then you need to reset Step 3 (very optional part)
                let step3Choices = document.getElementsByName("step3Choices");
                for (step of step3Choices){
                    step.checked = false;
                }
                document.getElementById("feedback3_c").style.visibility = "hidden";
                document.getElementById("checkx3_c").style.visibility = "hidden";
                document.getElementById("repNumInput_c").value = '';
                s3hiddens_c.forEach(function(hidden){
                    hidden.style.visibility = "hidden";
                })

        }
        // CASE 3: INCORRECT INPUT
        else{
            document.getElementById("feedback2_c").innerHTML = `
            <div>Incorrect.</div>
            <div>Please enter the correct number of interactions.</div>
            `
            // Output X
            document.getElementById("checkx2_c").innerHTML = `
            <div>✖</div>
            `
            document.getElementById("checkx2_c").style.color = "red";

            // For setTimeout
            document.getElementById("feedback2_c").style.visibility = "hidden";
            document.getElementById("checkx2_c").style.visibility = "hidden";
            setTimeout(function(){
                document.getElementById("feedback2_c").style.visibility = "visible";
                document.getElementById("checkx2_c").style.visibility = "visible"
                // If the answer is changed from correct to incorrect, hide Step 3
                document.getElementById("step3_c").style.display = "none";
            }, 200);
        }
    }


    /// CHECK STEP 3 ///
    // Add event listener to submit3 button
    document.getElementById("submit3_c").addEventListener("click", checkStep3_c);
    // Hide the end of Step 3 (the numeric input part)
    let s3hiddens_c = document.querySelectorAll("#s3subTitle_c, #repNumInput_c, #checkreps_c, #checkx4_c, #feedbackRep3_c");
    s3hiddens_c.forEach(function(hidden){
        hidden.style.visibility = "hidden";
    })

    function checkStep3_c(){
        document.getElementById("feedback3_c").innerHTML = '';
        document.getElementById("checkx3_c").innerHTML = '';
        let rbList3 = document.getElementsByName("step3Choices");
        // Get the selected value (index)
        let index3 = '';
        for (let i = 0; i < rbList3.length; i++){
            if (rbList3[i].checked){
                index3 = i;
            }
        }
        // CASE 1: NO ANSWER SELECTED
        if (index3 === ''){
            // Output feedback (no check/x)
            document.getElementById("feedback3_c").innerHTML = `
            <div>Please select one of the above choices.</div>
            `
            // For setTimeout
            document.getElementById("feedback3_c").style.visibility = "hidden";
            setTimeout(function(){
                document.getElementById("feedback3_c").style.visibility = "visible";
            }, 200);
        }
        // CASE 2: CORRECT ANSWER SELECTED
        // Remember to change the value of comparison to a no-space, all lowercase string
        else if (rbList3[index3].value == question.replicate.replace(/\s+/g, '').toLowerCase()){
            // Output if correct
            document.getElementById("feedback3_c").innerHTML = `
            <div>Correct!</div>
            `
            // Output Check
            document.getElementById("checkx3_c").innerHTML = `
            <div>✔</div>
            `
            document.getElementById("checkx3_c").style.color = "green";

            // For setTimeout
            document.getElementById("feedback3_c").style.visibility = "hidden";
            document.getElementById("checkx3_c").style.visibility = "hidden";
            setTimeout(function(){
                document.getElementById("feedback3_c").style.visibility = "visible";
                document.getElementById("checkx3_c").style.visibility = "visible";
                // Show the remaining parts of Step 3 hidden at beginning
                s3hiddens_c.forEach(function(hidden){
                    hidden.style.visibility = "visible";
                })
            }, 200);
        }
        // CASE 3: INCORRECT ANSWER SELECTED
        else{
            // Output if incorrect
            document.getElementById("feedback3_c").innerHTML = `
            <div>Incorrect.</div>
            <div>Please correct your selection.</div>
            `
            // Output X
            document.getElementById("checkx3_c").innerHTML = `
            <div>✖</div>
            `
            document.getElementById("checkx3_c").style.color = "red";

            // For setTimeout
            document.getElementById("feedback3_c").style.visibility = "hidden";
            document.getElementById("checkx3_c").style.visibility = "hidden";
            setTimeout(function(){
                document.getElementById("feedback3_c").style.visibility = "visible";
                document.getElementById("checkx3_c").style.visibility = "visible";
                // Hide the extra parts of Step 3 if radio buttons answered correctly and then changed to incorrect
                s3hiddens_c.forEach(function(hidden){
                    hidden.style.visibility = "hidden";
                })
            }, 200)
        }
    }


    /// CHECK STEP 3: REPLICATE INPUT ///
    repNumInput_c =  document.getElementById("checkreps_c");
    repNumInput_c.addEventListener("click", checkInput3_c)

    function checkInput3_c(){
        document.getElementById("feedbackRep3_c").innerHTML = '';
        document.getElementById("checkx4_c").innerHTML = '';
        // CASE 1: INVALID INPUT: NUMBER LESS THAN 1, NO NUMBER ENTERED, NUMBER ENTERED IS NOT AN INTEGER
        if (Number(document.getElementById("repNumInput_c").value) < 1 || document.getElementById("repNumInput_c").value === '' || !Number.isInteger(Number(document.getElementById("repNumInput_c").value))){
            // Output feedback (no check/x)
            document.getElementById("feedbackRep3_c").innerHTML = `
            <div>Please enter a valid replicate number.</div>
            `
            // For setTimeout
            document.getElementById("feedbackRep3_c").style.visibility = "hidden";
            setTimeout(function(){
                document.getElementById("feedbackRep3_c").style.visibility = "visible";
                // If the answer is changed from correct to something invalid, hide #crossedInstr, #dragBlock_c, #crossedTitle, #crossedDiagram, #submitDiv_c again
                document.getElementById("crossedInstr").style.display = "none";
                document.getElementById("dragBlock_c").style.display = "none";
                document.getElementById("crossedTitle").style.display = "none";
                document.getElementById("crossedDiagram").style.display = "none";
                document.getElementById("submitDiv_c").style.display = "none";
            }, 200);
        }
        // CASE 2: CORRECT INPUT
        else if (document.getElementById("repNumInput_c").value == question.repNums[0][0]){
            document.getElementById("feedbackRep3_c").innerHTML = `
            <div>Correct!</div>
            `
            // Output Check
            document.getElementById("checkx4_c").innerHTML = `
            <div>✔</div>
            `
            document.getElementById("checkx4_c").style.color = "green";

            // For setTimeout
            document.getElementById("feedbackRep3_c").style.visibility = "hidden";
            document.getElementById("checkx4_c").style.visibility = "hidden";
            setTimeout(function(){
                document.getElementById("feedbackRep3_c").style.visibility = "visible";
                document.getElementById("checkx4_c").style.visibility = "visible";
                // Show #crossedInstr, #dragBlock_c, #crossedTitle, #crossedDiagram, #submitDiv_c, #diagramFeedback_c
                // Remember the default display is "block"
                document.getElementById("crossedInstr").style.display = "block";
                document.getElementById("dragBlock_c").style.display = "block";
                document.getElementById("crossedTitle").style.display = "block";
                document.getElementById("crossedDiagram").style.display = "flex";
                document.getElementById("submitDiv_c").style.display = "flex";
                document.getElementById("diagramFeedback_c").style.visibility = "visible";
            }, 200);

        }
        // CASE 3: INCORRECT INPUT
        else{
            document.getElementById("feedbackRep3_c").innerHTML = `
            <div>Incorrect.</div>
            <div>Please enter the correct number of replicates.</div>
            `
            // Output X
            document.getElementById("checkx4_c").innerHTML = `
            <div>✖</div>
            `
            document.getElementById("checkx4_c").style.color = "red";

            // For setTimeout
            document.getElementById("feedbackRep3_c").style.visibility = "hidden";
            document.getElementById("checkx4_c").style.visibility = "hidden";
            setTimeout(function(){
                document.getElementById("feedbackRep3_c").style.visibility = "visible";
                document.getElementById("checkx4_c").style.visibility = "visible";
                // If the answer is changed from correct to incorrect, hide #crossedInstr, #dragBlock_c, #crossedTitle, #crossedDiagram, #submitDiv_c again
                document.getElementById("crossedInstr").style.display = "none";
                document.getElementById("dragBlock_c").style.display = "none";
                document.getElementById("crossedTitle").style.display = "none";
                document.getElementById("crossedDiagram").style.display = "none";
                document.getElementById("submitDiv_c").style.display = "none";
            }, 200);
        }  
    }

    //// HIDE LINES/BOXES OF CROSSED ANOVA DIAGRAM /////
    let maxLines = Math.max(question.main1Levels.length, question.main2Levels.length);
    let hideParts = '';
    // If maxLines is 6, don't remove anything
    if (maxLines === 4){
        hideParts = document.querySelectorAll("#left1, #right1, #left6, #right6, .main2Level_c>:first-child, .main2Level_c>:nth-child(6), .repLines_c>:first-child, .repLines_c>:nth-child(6), .repLevel_c>:first-child, .repLevel_c>:nth-child(6)");
    }
    else if (maxLines === 2){
        //hideParts = document.querySelectorAll("#left1, #right1, #left6, #right6, #left3, #right3, #left4, #right4, .main2Level_c>:first-child, .main2Level_c>:nth-child(6), .main2Level_c>:nth-child(3), .main2Level_c>:nth-child(4), .repLines_c>:first-child, .repLines_c>:nth-child(6), .repLines_c>:nth-child(3), .repLines_c>:nth-child(4), .repLevel_c>:first-child, .repLevel_c>:nth-child(6), .repLevel_c>:nth-child(3), .repLevel_c>:nth-child(4)"); // HTML version
        hideParts = document.querySelectorAll("#left1, #right1, #left6, #right6, #left2, #right2, #left5, #right5, .main2Level_c>:first-child, .main2Level_c>:nth-child(6), .main2Level_c>:nth-child(2), .main2Level_c>:nth-child(5), .repLines_c>:first-child, .repLines_c>:nth-child(6), .repLines_c>:nth-child(2), .repLines_c>:nth-child(5), .repLevel_c>:first-child, .repLevel_c>:nth-child(6), .repLevel_c>:nth-child(2), .repLevel_c>:nth-child(5)"); // R version
    }
    for(part of hideParts){
        part.classList.add("hide");
    }

    /// CHECK CROSSED DIAGRAM ///

    let main1Selections = document.querySelectorAll(".main1Level_c>*");
    let main2Selections = document.querySelectorAll(".main2Level_c>*:not(.hide)");
    let repSelections = document.querySelectorAll(".repLevel_c>*:not(.hide)>*");

    // Add event listener for diagram submit button
    document.getElementById("submitDiagram_c").addEventListener("click", checkCrossedDiagram);

    function checkCrossedDiagram(){
        // Set diagramFeedback to empty string each time function is called
        document.getElementById("diagramFeedback_c").innerHTML = '';
        let nullvals_c = 0;
        let incorrectVals_c = 0;
        let correctVals_c = 0;

        // Remove incorrect class from all elements (for the case where there are null values)
        let listAll_c = document.querySelectorAll(".main1Level_c>*, .main2Level_c>*:not(.hide), .repLevel_c>*:not(.hide)>*");
        for (element of listAll_c){
            element.classList.remove("incorrect");
        }

        //// We want two setTimeouts here: 
        //       The first is for calculating the number of null/correct/incorrect values and adding/removing the "incorrect" class (we need this one so the red borders will be animated each time the submit button is pressed, not just the first time)
        //       The second is for calculating what feedback should be displayed (this must be done AFTER the first setTimeout to ensure that nullvals, incorrectVals, and correctVals have been calculated/updated accordingly). There is a sub setTimeout within here: we want the feedback to be hidden then shown so it doesn't look static if you get the same feedback in a row. Although the time is 150 for the sub setTimeout, the entire second setTimeout is still calculated at 2ms.

        // FIRST SET TIMEOUT
        setTimeout(function(){    

        // SPECIAL CASE: 2 BY 2 CROSSED
        if (question.main1Levels.length === 2 & question.main2Levels.length === 2){

            // CHECK BOTH MAIN LEVELS

            // Create a checking algorithm for determining null values
            let totalMainSelections = document.querySelectorAll(".main1Level_c>*, .main2Level_c>*:not(.hide)");
            let nullsCheck = 0;
            totalMainSelections.forEach(function(selection){
                if(selection.textContent === ""){
                    nullsCheck += 1;
                }
            })

            // Create a checking algorithm for determining incorrect selections
            let mainsCheck = 0;
            totalMainSelections.forEach(function(selection){
                if(question.main1Levels.includes(selection.textContent) | question.main2Levels.includes(selection.textContent)){
                    mainsCheck += 1;
                }
            })

            // Actually assign classes here
            // Check for null values
            if(nullsCheck !== 0){
                // may be more than 1, but the actual value is not important
                nullvals_c += 1;
                console.log("nullval");
            }
            // Correct Selections
            else if((question.main1Levels.includes(main1Selections[0].textContent) & question.main1Levels.includes(main1Selections[1].textContent) & question.main2Levels.includes(main2Selections[0].textContent) & question.main2Levels.includes(main2Selections[1].textContent)) | (question.main2Levels.includes(main1Selections[0].textContent) & question.main2Levels.includes(main1Selections[1].textContent) & question.main1Levels.includes(main2Selections[0].textContent) & question.main1Levels.includes(main2Selections[1].textContent))){
                // Remove the incorrect class from all elements in the main levels since we are not using a loop to check correct answers
                for(selection of totalMainSelections){
                    selection.classList.remove("incorrect");
                }
                correctVals_c += 4;
                console.log("correct");
            }
            // Half Incorrect Main Selections (all main level selections are in the totalMainSelections vector, but not matched correspondingly)
            else if(mainsCheck === 4){
                // There are 4 possible combinations: 12/12, 21/21, 12/21, 21/12

                // Case 1: 12/12
                if(question.main1Levels.includes(main1Selections[0].textContent) & question.main2Levels.includes(main1Selections[1].textContent) & question.main1Levels.includes(main2Selections[0].textContent) & question.main2Levels.includes(main2Selections[1].textContent)){
                    main1Selections[1].classList.add("incorrect");
                    main2Selections[0].classList.add("incorrect");
                }

                // Case 2: 21/21
                if(question.main2Levels.includes(main1Selections[0].textContent) & question.main1Levels.includes(main1Selections[1].textContent) & question.main2Levels.includes(main2Selections[0].textContent) & question.main1Levels.includes(main2Selections[1].textContent)){
                    main1Selections[0].classList.add("incorrect");
                    main2Selections[1].classList.add("incorrect");
                }

                // Case 3: 12/21
                if(question.main1Levels.includes(main1Selections[0].textContent) & question.main2Levels.includes(main1Selections[1].textContent) & question.main2Levels.includes(main2Selections[0].textContent) & question.main1Levels.includes(main2Selections[1].textContent)){
                    main1Selections[1].classList.add("incorrect");
                    main2Selections[1].classList.add("incorrect");
                }

                // Case 4: 21/12
                if(question.main2Levels.includes(main1Selections[0].textContent) & question.main1Levels.includes(main1Selections[1].textContent) & question.main1Levels.includes(main2Selections[0].textContent) & question.main2Levels.includes(main2Selections[1].textContent)){
                    main1Selections[0].classList.add("incorrect");
                    main2Selections[0].classList.add("incorrect");
                }

                // once again, the actual incorrect number may be more than 1
                incorrectVals_c += 1;
            }
            // Incorrect Selections (there is a selection that is not a main level in totalMainSelections)
            else{
                for(selection of totalMainSelections){
                    if(!question.main1Levels.includes(selection.textContent) & !question.main2Levels.includes(selection.textContent)){
                        selection.classList.add("incorrect");
                        incorrectVals_c += 1;
                        console.log("incorrect")
                    }
                }
            }

            // CHECK REPLICATES
            for (selection of repSelections){
                // Check for null values
                if (selection.textContent === ""){
                    nullvals_c += 1;
                    console.log("nullval");
                }
    
                // Incorrect Selection
                else if (!question.repNums.includes(selection.textContent)){
                    selection.classList.add("incorrect");
                    incorrectVals_c += 1;
                    console.log("incorrect");
                }
                // Correct Selection
                else{
                    selection.classList.remove("incorrect");
                    correctVals_c += 1;
                    console.log("correct");
                }
            }
        }

        // NOT SPECIAL 2 BY 2 CASE
        else{
            // Check Main Level 1
            for (selection of main1Selections){
                // Check for null values
                if (selection.textContent === ""){
                    nullvals_c += 1;
                    console.log("nullval");
                }
                // Incorrect Selection
                else if (!question.main1Levels.includes(selection.textContent)){
                    selection.classList.add("incorrect");
                    incorrectVals_c += 1;
                    console.log("incorrect");
                }
                // Correct Selection
                else{
                    selection.classList.remove("incorrect");
                    correctVals_c += 1;
                    console.log("correct");
                }
            }

            // Check Main Level 2
            for (selection of main2Selections){
                // Check for null values
                if (selection.textContent === ""){
                    nullvals_c += 1;
                    console.log("nullval");
                }
                // Incorrect Selection
                else if (!question.main2Levels.includes(selection.textContent)){
                    selection.classList.add("incorrect");
                    incorrectVals_c += 1;
                    console.log("incorrect");
                }
                // Correct Selection
                else{
                    selection.classList.remove("incorrect");
                    correctVals_c += 1;
                    console.log("correct");
                }
            }

            // Check Replicates
            for (selection of repSelections){
                // Check for null values
                if (selection.textContent === ""){
                    nullvals_c += 1;
                    console.log("nullval");
                }

                // Incorrect Selection
                else if (!question.repNums.includes(selection.textContent)){
                    selection.classList.add("incorrect");
                    incorrectVals_c += 1;
                    console.log("incorrect");
                }
                // Correct Selection
                else{
                    selection.classList.remove("incorrect");
                    correctVals_c += 1;
                    console.log("correct");
                }
            }
        }

        }, 1) //end of setTimeout(1)


        // SECOND SET TIMEOUT
        setTimeout(function(){
        // Reset all disabled properties of the Submit button
        // This code MUST be here AND in the general setLayout function (having the code here ensures that the button will be re-enabled between submits of the same scenario)  
        document.getElementById("submitDiagram_c").disabled = false;
        document.getElementById("submitDiagram_c").classList.remove("disabledbtn");
        document.getElementById("submitDiagram_c").classList.add("regbtn");
        document.getElementById("submitDiagram_c").classList.add("grow");

        // Remove the "incorrect" class from all elements if there is at least one null value
        // If there is at least one null value, output the feedback without coloring the border of those incorrect
        if (nullvals_c !== 0){
            for (element of listAll_c){
                element.classList.remove("incorrect");
            }
        }

        // Output the Final Feedback
        // Set diagramFeedbackOutput_c to empty string each time function is called
        document.getElementById("finalBtnDiv_c").style.visibility = "hidden";
        let diagramFeedbackOutput_c = '';
        // CASE 1: THERE IS AT LEAST ONE NULL VALUE
        if (nullvals_c !== 0){
            diagramFeedbackOutput_c += `
            <div>Please ensure you have dragged all elements into the diagram.</div>
            `
        }
        // CASE 2: ALL ANSWERS ARE CORRECT
        else if (correctVals_c === (question.main1Levels.length + question.main2Levels.length + question.repNums.length)){
            diagramFeedbackOutput_c += `
            <div>Correct!</div>
            `
            // Also disable the submit button if the entire diagram is correct
            document.getElementById("submitDiagram_c").disabled = true;
            document.getElementById("submitDiagram_c").classList.add("disabledbtn");
            document.getElementById("submitDiagram_c").classList.remove("regbtn");
            document.getElementById("submitDiagram_c").classList.remove("grow");

            // Make "Show Final Model" Button visible
            document.getElementById("finalBtnDiv_c").style.display = "flex";
            document.getElementById("finalBtnDiv_c").style.visibility = "visible";
        }
        // CASE 3: THERE IS AT LEAST ONE INCORRECT ANSWER
        else if (incorrectVals_c !== 0) {
            diagramFeedbackOutput_c += `
            <div>Incorrect.</div>
            <div>Please correct the diagram and try submitting again.</div>
            <div>Incorrect answers are marked with red borders.</div>
            `
        }

        // Once again, do a setTimeout on this function so the feedback disappears and then reappears quickly
        // This setTimeout is nested within setTimeout(2); we want the diagramFeedback to be calculated at 2ms, but actually displayed at 200ms   
        setTimeout(function(){
            document.getElementById("diagramFeedback_c").innerHTML = diagramFeedbackOutput_c;
        }, 200);

        }, 2); //end of setTimeout(2)
    }


    /// SHOW FINAL MODEL (once button clicked) ///
    // Add the correct ijt labels to the model
    document.getElementById("finalBtn_c").addEventListener("click", showModel_c);

    function showModel_c(){
        // Extract replicate number and put them into a range array (ex: reps=3, repsArr = [1, 2, 3])
        let reps = Number(question.repNums[0][0]);
        let repsArr = [...Array(reps+1).keys()];
        repsArr.shift();

        document.getElementById("indexLabels_c").innerHTML = `
            <div>𝑖 = ${question.main1Levels.join(", ")}</div>
            <div>𝑗 = ${question.main2Levels.join(", ")}</div>
            <div>𝑡 = ${repsArr.join(", ")}</div>
        `

        // Make Final Model Box Visible
        document.getElementById("finalModel_c").style.display = "block";

        // Make "Play Again" Button Visible
        document.getElementById("playAgainDiv_c").style.display = "flex";

    }

    // Make the function for recalling setLayout asynchronous (on the click of Play Again, it must wait for the following nodes to be removed)
    document.getElementById("playAgainBtn_c").addEventListener("click", setLayout_c);

    // Always ensure that the Submit button is enabled, does indeed contain the "grow" class, and has a shadow each time the diagram is submitted
    // Because we want these button style attributes to be re-applied every time you play again, and setLayout is the event listener function for playAgainbtn, we just put the following code outside of all other functions (I could have put this at the top of setLayout() as well)
    // This code MUST be here AND in the checkDiagram function (having the code here ensures that the button will be re-enabled between submits of different scenarios)
    document.getElementById("submitDiagram_c").disabled = false;
    document.getElementById("submitDiagram_c").classList.remove("disabledbtn");
    document.getElementById("submitDiagram_c").classList.add("regbtn");
    document.getElementById("submitDiagram_c").classList.add("grow");

} // end of async function

setLayout_c();


///// Event Listeners for drag objects /////
function dragStart(evt){
    console.log("drag started");
    evt.dataTransfer.setData("text/plain", evt.target.id);
    evt.dropEffect = "move";
    // VERY IMPORTANT: in order to pick up the drag element; it won't disappear once drag starts
    setTimeout(() => (this.classList.add("hide")), 0);
}
function dragEnd(){
    console.log("drag ended");
    this.classList.remove("hide");
}



// Shuffle function to shuffle values of an array
function shuffle(array) {
    var tmp, current, top = array.length;
    if(top) while(--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
    }
    return array;
}


/* RANDOM CHUNK OF CODE JUST FOR R VERSION SIDEBAR */

// Default settings for Crossed ANOVA
document.getElementById("diagramFeedback_c").style.marginLeft = "1vw";
document.getElementById("submitDiv_c").style.marginLeft = "8vw";
document.getElementById("finalBtnDiv_c").style.marginLeft = "8vw";
document.getElementById("finalModel_c").style.marginLeft = "11vw";
document.getElementById("playAgainDiv_c").style.marginLeft = "8vw";

// // Default settings for Nested ANOVA
// document.getElementById("diagramFeedback").style.marginLeft = "-2.5vw";
// document.getElementById("submitDiv").style.marginLeft = "12.5vw";
// document.getElementById("finalBtnDiv").style.marginLeft = "12.5vw";
// document.getElementById("finalModel").style.marginLeft = "12vw";
// document.getElementById("playAgainDiv").style.marginLeft = "12.5vw";

// document.querySelector(".skin-black .main-header .navbar>.sidebar-toggle").addEventListener("click", collapse);
// function collapse(){
//     if (!document.getElementsByTagName("body")[0].classList.contains("sidebar-collapse")){
//         // Crossed
//         document.getElementById("diagramFeedback_c").style.marginLeft = "13vw";
//         document.getElementById("submitDiv_c").style.marginLeft = "13vw";
//         document.getElementById("finalBtnDiv_c").style.marginLeft = "13vw";
//         document.getElementById("finalModel_c").style.marginLeft = "22vw";
//         document.getElementById("playAgainDiv_c").style.marginLeft = "13vw";

//         // Nested
//         // document.getElementById("diagramFeedback").style.marginLeft = "0vw";
//         // document.getElementById("submitDiv").style.marginLeft = "0vw";
//         // document.getElementById("finalBtnDiv").style.marginLeft = "0vw";
//         // document.getElementById("finalModel").style.marginLeft = "15vw";
//         // document.getElementById("playAgainDiv").style.marginLeft = "0vw";

//         //console.log("no sidebar")
//     }
//     else{
//         // Crossed
//         document.getElementById("diagramFeedback_c").style.marginLeft = "1vw";
//         document.getElementById("submitDiv_c").style.marginLeft = "8vw";
//         document.getElementById("finalBtnDiv_c").style.marginLeft = "8vw";
//         document.getElementById("finalModel_c").style.marginLeft = "11vw";
//         document.getElementById("playAgainDiv_c").style.marginLeft = "8vw";

//         // Nested
//         // document.getElementById("diagramFeedback").style.marginLeft = "-2.5vw";
//         // document.getElementById("submitDiv").style.marginLeft = "12.5vw";
//         // document.getElementById("finalBtnDiv").style.marginLeft = "12.5vw";
//         // document.getElementById("finalModel").style.marginLeft = "12vw";
//         // document.getElementById("playAgainDiv").style.marginLeft = "12.5vw";

//         //console.log("sidebar")
//     }
// }
