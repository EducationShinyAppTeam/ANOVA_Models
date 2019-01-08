/*************************************************************** TABS **********************************************************/
// Add event listeners to all tabs
// You can either do it this way, or delete the following code before the openTab function, and use the commented out buttons code in the html file
// I actually think the way done below is probably more confusing, but I'll keep it for now
let tabs = document.querySelector(".tab")
tabs.firstElementChild.addEventListener("click", function(e) {
    openTab(e, "nested1");
});
tabs.firstElementChild.nextElementSibling.addEventListener("click", function(e) {
    openTab(e, "nested2");
});

// This function opens the proper tab on a click
function openTab(evt, tabName){
    // Declare all variables
    let tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++){
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++){
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    // We only concatenate the "active" class because we want to change the color of the opened tab, otherwise it's not necessary
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Open "nested1" by default
// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();
/*******************************************************************************************************************************/


/************************************************* TAB 1: NESTED ANOVA MODEL ***************************************************/

// Add "hide" class to "Build a Nested Model" button so it will be hidden by default
let next1 = document.querySelector("#next1");
next1.classList.add("hide");

// Add "hide" class to all "desc" so the descriptions will be hidden by default
let descriptions = document.getElementsByClassName("desc");
for (let i = 1; i <= descriptions.length; i++){
    descriptions[i-1].classList.add("hide");
    // Add event listeners for all buttons (if I had made each button id nb0,...nb5 then I wouldn't need to do this weird i-1 indexing)
    // Also, the anonymous function isn't necessary, but in case I need to access the event later, I'll just keep it here
    document.querySelector("#nb"+i.toString()).addEventListener("click", function(e) {
        showDescBtn(e, descriptions[i-1].id);
    });
}

// Function to call when each button is clicked
// Checks TWO THINGS: whether to hide/show the descs & whether to hide/show the "Build a Nested Model" button
// I made it so that each desc will either have the "hide" or "show" class always, but I could have just used one and made the code less binary
function showDescBtn(evt, descNum){
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
    for (let i = 0; i < descriptions.length; i++){
        if (descriptions[i].classList.contains("show")){
            sum = sum + 1
        }
    }
    // All descriptions have class "show"
    // The "else" is necessary if I want the button to hide once again even if all nbs have been pressed once
    if (sum === 6){
        next1.classList.remove("hide");
        next1.classList.add("show");
    } else{
        next1.classList.remove("show");
        next1.classList.add("hide");
    }
}


// Move from first tab to second
next1 = document.querySelector("#next1");
next1.addEventListener("click", toNested2);
function toNested2() {
    document.getElementById("nested1").style.display = "none";
    document.querySelector(".tab").firstElementChild.classList.remove("active");
    document.getElementById("nested2").style.display = "block";
    document.querySelector(".tab").firstElementChild.nextElementSibling.classList.add("active");
}
/*******************************************************************************************************************************/


/************************************************ TAB 2: BUILD A NESTED MODEL **************************************************/

async function setLayout(){

    // Get the json file and turn it into a form js can output
    let results = await fetch("nested_anova_bank.json");
    let questions = await results.json();

    // Select a random question from questions
    let randNum = await Math.floor(Math.random() * questions.length);
    let question = await questions[randNum];
    // Output that random question's scenario
    document.getElementById("scenario").innerHTML = await question.scenario;

    // Select a random ordering of the effects
    // Use a shuffle function to randomly decide radio button order
    let effOrder = await shuffle([question.mainEffect, question.nestedEffect, question.replicate]);
    //console.log(effOrder);

    //Visibility:hidden diagram feedback
    document.querySelector("#diagramFeedback").visibility = "hidden";

    /// Output the 3 Choices: async/await not necessary; I don't care which order they are outputted in ///
    // Output Step 1 choices
    // First set changing values/divs to empty html strings
    document.getElementById("checkx1").innerHTML = '';
    document.getElementById("feedback1").innerHTML = '';

    choiceBlock1Output = '';
    effOrder.forEach(function(eff){
        // I changed the value of each button to a no-space, all lowercase string of the answer
        choiceBlock1Output += `
            <input type="radio" name="step1" value=${eff.replace(/\s+/g, '').toLowerCase()}>${eff}<br>
        `
    })
    document.getElementById("choiceBlock1").innerHTML = choiceBlock1Output;

    // Output Step 2 choices (same effOrder)
    // First set changing values/divs to empty html strings
    document.getElementById("checkx2").innerHTML = '';
    document.getElementById("feedback2").innerHTML = '';

    choiceBlock2Output = '';
    effOrder.forEach(function(eff){
        choiceBlock2Output += `
            <input type="radio" name="step2" value=${eff.replace(/\s+/g, '').toLowerCase()}>${eff}<br>
        `
    })
    document.getElementById("choiceBlock2").innerHTML = choiceBlock2Output;

    // Output Step 3 (same effOrder)
    // First set changing values/divs to empty html strings
    document.getElementById("checkx3").innerHTML = '';
    document.getElementById("feedback3").innerHTML = '';
    document.getElementById("checkx4").innerHTML = '';
    document.getElementById("feedbackRep3").innerHTML = '';
    document.getElementById("repNumInput").value = '';

    choiceBlock3Output = '';
    effOrder.forEach(function(eff){
        choiceBlock3Output += `
            <input type="radio" name="step3" value=${eff.replace(/\s+/g, '').toLowerCase()}>${eff}<br>
        `
    })
    document.getElementById("choiceBlock3").innerHTML = choiceBlock3Output;

    ///// Output the Dragable Elements Block /////
    // Create an array of containing all main, nested, and replicate levels (by concatenation)
    let allElems = question.mainLevels.concat(question.nestedLevels, question.repNums);
    let dragElements = shuffle(allElems);
    // Put each element in dragElements into a draggable div
    let dragBlockOutput = ''; //This will end up containing the draggable elements
    for (let i = 0; i < dragElements.length; i++){
        dragBlockOutput += `
            <div class="dragEl" draggable="true" id=${"drag"+i.toString()}>${dragElements[i]}</div>
        `
    }
    document.getElementById("dragBlock").innerHTML = dragBlockOutput;

    // Add dragstart & dragend event listeners to all drag objects
    document.querySelectorAll(".dragEl").forEach(function(el){el.addEventListener("dragstart", dragStart)});
    document.querySelectorAll(".dragEl").forEach(function(el){el.addEventListener("dragend", dragEnd)});


    //// Output the Nested ANOVA Diagram /////
    // First set changing values/divs to empty html strings
    document.getElementById("nestedDiagram").innerHTML = '';
    document.getElementById("diagramFeedback").innerHTML = '';

    let nestedDiagramOutput = `
        <div id="ijtLabel">
            <div>𝒊:</div>
            <div>𝒋:</div>
            <div>𝒕:</div>
        </div>
    `;

    // number of diagram parts in the diagram is equal to number of main effect levels
    for(let i = 0; i < question.mainLevels.length; i++){
        nestedDiagramOutput += `
            <div class="diagramPart">
                <div class="mainLevel">
                    <div></div>
                </div>
                <div class="lines1">
                    <div>&#x3c;</div>
                </div>
                <div class="nestedLevel">
                    <div></div>
                    <div></div>
                </div>
                <div class="lines2">
                    <div>&#x3c;</div>
                    <div>&#x3c;</div>
                </div>
                <div class="repLevel">
                    <div></div>
                    <div></div>
                </div>
            </div>
        `
    }

    // I'm going to append a space div the same width as the ijt labels just so everything is symmetrical (title isn't off center)
    nestedDiagramOutput += `
        <div id="spaceDiv"><div>
    `

    document.getElementById("nestedDiagram").innerHTML += nestedDiagramOutput;

    // Add 4 event listeners to all drop objects: dragover, dragenter, dragleave, drop
    //let mainDrops = document.querySelectorAll(".mainLevel>*");
    //let nestedDrops = document.querySelectorAll(".nestedLevel>*");
    //let repDrops = document.querySelectorAll(".repLevel>*");

    // Get a node list of all drop elements in the diagram
    let dropElements = document.querySelectorAll(".mainLevel>*, .nestedLevel>*, .repLevel>*")
    // Add 4 event listeners to all drop objects: dragover, dragenter,
    dropElements.forEach(function(dropEl){
        dropEl.addEventListener("dragover", dragOver);
        dropEl.addEventListener("dragenter", dragEnter);
        dropEl.addEventListener("dragleave", dragLeave);
        dropEl.addEventListener("drop", dragDrop);
    })
    // Also add these 4 event listeners to the original drag elements box
    let dragBlock = document.querySelector("#dragBlock");
    dragBlock.addEventListener("dragover", dragOver);
    dragBlock.addEventListener("dragenter", dragEnter);
    dragBlock.addEventListener("dragleave", dragLeave);
    dragBlock.addEventListener("drop", dragDrop);

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
        if(this.id != "dragBlock" && !this.hasChildNodes()){
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
        if (evt.target.id != "dragBlock" && !evt.target.hasChildNodes()) {
            // only add the fill class if the event target is not dragBlock, and if the target has a child node (if drop is empty, we still want the drag to fill it)
            // the case after || is for when you drag the same element out of its drop box and just put it back in without letting go
            document.getElementById(data).classList.add("fill");
        } else if (evt.target.id == "dragBlock"){
            // remove the fill class if dropping back into dragBlock
            document.getElementById(data).classList.remove("fill");
        }

        // If the element is being dragged onto a child element of the proper drop box, then the drag will fail
        if(evt.target !== this){
            return;
        }
        // If the drag box is a little bigger, then the first if won't catch this
        if (evt.target.hasChildNodes() && evt.target.id != "dragBlock"){
            return;
        }
        evt.target.appendChild(document.getElementById(data));
        // Remove the hover shadow when element is dropped
        this.classList.remove("hovered")

        console.log("drag drop");
    }

    // Then hide the actual step blocks themselves
    let stepBlocks_nested = document.querySelectorAll("#step1, #step2, #step3");
    for (block of stepBlocks_nested){
        block.style.display = "none";
    }

    hideElements = document.querySelectorAll("#nestedInstr, #dragBlock, #nestedTitle, #nestedDiagram, #submitDiv, #finalBtnDiv, #finalModel, #playAgainDiv");
    hideElements.forEach(function(hideElement){
        hideElement.style.display = "none";
        //hideElement.classList.add("none"); // For some reason this doesn't work :(
    })
    //console.log(hideElements);


    // "Build Model" Button Event Listener
    document.getElementById("build1").addEventListener("click", showStep1);
    function showStep1(){
        document.getElementById("step1").style.display = "inline-block";
    }


    /// Step 1: Check Radio Buttons ///  
    // Add event listener to submit1 button
    document.getElementById("submit1").addEventListener("click", checkStep1);
    function checkStep1(){
        // setting these to empty strings makes the feedback/checkx disappear very quickly every time this function is called
        document.getElementById("feedback1").innerHTML = '';
        document.getElementById("checkx1").innerHTML = '';

        let rbList1 = document.getElementsByName("step1");
        // Get the selected value (index)
        let index1 = '';
        for (let i = 0; i < rbList1.length; i++){
            if (rbList1[i].checked){
                index1 = i;
            }
        }
        // CASE 1: NO ANSWER SELECTED
        // Remember to use === and not == (0=='' is true, but 0==='' is false); if we don't use ===, then if the answer choice with index 0 is selected, the "no choice selected" feedback will still be output
        if (index1 === ''){
            // Output feedback (no check/x)
            document.getElementById("feedback1").innerHTML = `
            <div>Please select one of the above choices.</div>
            `
            // For setTimeout
            document.getElementById("feedback1").style.visibility = "hidden";
            setTimeout(function(){document.getElementById("feedback1").style.visibility = "visible"}, 200); //do setTimeout like this instead to avoid excess space changing

            // Hide Step 2 (and 3) if Step 1 is answered correctly and then changed to no answer/only one answer
            document.getElementById("step2").style.display = "none";
            document.getElementById("step3").style.display = "none";
        }
        // CASE 2: CORRECT ANSWER SELECTED
        // Remember to change the value of comparison to a no-space, all lowercase string
        else if (rbList1[index1].value == question.mainEffect.replace(/\s+/g, '').toLowerCase()){
            // Output if correct
            document.getElementById("feedback1").innerHTML = `
            <div>Correct!</div>
            `
            // Output Check
            document.getElementById("checkx1").innerHTML = `
            <div>✔</div>
            `
            document.getElementById("checkx1").style.color = "green";

            // For setTimeout
            document.getElementById("feedback1").style.visibility = "hidden";
            document.getElementById("checkx1").style.visibility = "hidden";
            setTimeout(function(){
                document.getElementById("feedback1").style.visibility = "visible";
                document.getElementById("checkx1").style.visibility = "visible";
            }, 200);

            // Show Step 2 if Step 1 is correct
            document.getElementById("step2").style.display = "inline-block";
            
            // Just in case Step 1 was answered correctly and then changed back to an incorrect answer (and Step 2 and 3 were already answered correctly), then you need to reset Step 2 and reset Step 3 in the function that checks Step 2 (very optional part)
            let step2 = document.getElementsByName("step2");
            for (step of step2){
                step.checked = false;
            }
            document.getElementById("feedback2").style.visibility = "hidden";
            document.getElementById("checkx2").style.visibility = "hidden";
        }
        // CASE 3: INCORRECT ANSWER SELECTED
        else{
            // Output if incorrect
            document.getElementById("feedback1").innerHTML = `
            <div>Incorrect.</div>
            <div>Please correct your selection.</div>
            `
            // Output X
            document.getElementById("checkx1").innerHTML = `
            <div>✖</div>
            `
            document.getElementById("checkx1").style.color = "red";

            // For setTimeout
            document.getElementById("feedback1").style.visibility = "hidden";
            document.getElementById("checkx1").style.visibility = "hidden";
            setTimeout(function(){
                document.getElementById("feedback1").style.visibility = "visible";
                document.getElementById("checkx1").style.visibility = "visible";
            }, 200);
            
            // Hide Step 2 (and 3) if Step 1 is answered correctly and then changed to incorrect
            document.getElementById("step2").style.display = "none";
            document.getElementById("step3").style.display = "none";
        }

    }

    /// Step 2: Check Radio Buttons ///  
    // Add event listener to submit2 button
    document.getElementById("submit2").addEventListener("click", checkStep2);
    function checkStep2(){
        // setting these to empty strings makes the feedback/checkx disappear very quickly every time this function is called
        document.getElementById("feedback2").innerHTML = '';
        document.getElementById("checkx2").innerHTML = '';

        let rbList2 = document.getElementsByName("step2");
        // Get the selected value (index)
        let index2 = '';
        for (let i = 0; i < rbList2.length; i++){
            if (rbList2[i].checked){
                index2 = i;
            }
        }
        // CASE 1: NO ANSWER SELECTED
        if (index2 === ''){
            // Output feedback (no check/x)
            document.getElementById("feedback2").innerHTML = `
            <div>Please select one of the above choices.</div>
            `
            // For setTimeout
            document.getElementById("feedback2").style.visibility = "hidden";
            setTimeout(function(){
                document.getElementById("feedback2").style.visibility = "visible";
            }, 200);
        }
        // CASE 2: CORRECT ANSWER SELECTED
        // Remember to change the value of comparison to a no-space, all lowercase string
        else if (rbList2[index2].value == question.nestedEffect.replace(/\s+/g, '').toLowerCase()){
            // Output if correct
            document.getElementById("feedback2").innerHTML = `
            <div>Correct!</div>
            `
            // Output Check
            document.getElementById("checkx2").innerHTML = `
            <div>✔</div>
            `
            document.getElementById("checkx2").style.color = "green";

            // For setTimeout
            document.getElementById("feedback2").style.visibility = "hidden";
            document.getElementById("checkx2").style.visibility = "hidden";
            setTimeout(function(){
                document.getElementById("feedback2").style.visibility = "visible";
                document.getElementById("checkx2").style.visibility = "visible";
                // Show Step 3
                document.getElementById("step3").style.display = "inline-block";
            }, 200);

            // Just in case Step 1 was answered correctly and then changed back to an incorrect answer (and Step 2 and 3 were already answered correctly), then you need to reset Step 3 (very optional part)
            let step3 = document.getElementsByName("step3");
            for (step of step3){
                step.checked = false;
            }
            document.getElementById("feedback3").style.visibility = "hidden";
            document.getElementById("checkx3").style.visibility = "hidden";
            document.getElementById("repNumInput").value = '';
            s3hiddens.forEach(function(hidden){
                hidden.style.visibility = "hidden";
            })
        }
        // CASE 3: INCORRECT ANSWER SELECTED
        else{
            // Output if incorrect
            document.getElementById("feedback2").innerHTML = `
            <div>Incorrect.</div>
            <div>Please correct your selection.</div>
            `
            // Output X
            document.getElementById("checkx2").innerHTML = `
            <div>✖</div>
            `
            document.getElementById("checkx2").style.color = "red";

            // For setTimeout
            document.getElementById("feedback2").style.visibility = "hidden";
            document.getElementById("checkx2").style.visibility = "hidden";
            setTimeout(function(){
                document.getElementById("feedback2").style.visibility = "visible";
                document.getElementById("checkx2").style.visibility = "visible"
                // If the answer is changed from correct to incorrect, hide Step 3
                document.getElementById("step3").style.display = "none";
            }, 200);
        }

    }


    /// Step 3: Check Radio Buttons ///  
    // Add event listener to submit3 button
    document.getElementById("submit3").addEventListener("click", checkStep3);
    // Hide the end of Step 3 (the part numeric input part)
    let s3hiddens = document.querySelectorAll("#s3subTitle, #repNumInput, #checkreps, #checkx4, #feedbackRep3");
    s3hiddens.forEach(function(hidden){
        hidden.style.visibility = "hidden";
    })

    function checkStep3(){
        // setting these to empty strings makes the feedback/checkx disappear very quickly every time this function is called
        document.getElementById("feedback3").innerHTML = '';
        document.getElementById("checkx3").innerHTML = '';

        let rbList3 = document.getElementsByName("step3");
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
            document.getElementById("feedback3").innerHTML = `
            <div>Please select one of the above choices.</div>
            `
            // For setTimeout
            document.getElementById("feedback3").style.visibility = "hidden";
            setTimeout(function(){
                document.getElementById("feedback3").style.visibility = "visible";
            }, 200);
        }
        // CASE 2: CORRECT ANSWER SELECTED
        // Remember to change the value of comparison to a no-space, all lowercase string
        else if (rbList3[index3].value == question.replicate.replace(/\s+/g, '').toLowerCase()){
            // Output if correct
            document.getElementById("feedback3").innerHTML = `
            <div>Correct!</div>
            `
            // Output Check
            document.getElementById("checkx3").innerHTML = `
            <div>✔</div>
            `
            document.getElementById("checkx3").style.color = "green";

            // For setTimeout
            document.getElementById("feedback3").style.visibility = "hidden";
            document.getElementById("checkx3").style.visibility = "hidden";
            setTimeout(function(){
                document.getElementById("feedback3").style.visibility = "visible";
                document.getElementById("checkx3").style.visibility = "visible";
                // Show the remaining parts of Step 3 hidden at beginning
                s3hiddens.forEach(function(hidden){
                    hidden.style.visibility = "visible";
                })
            }, 200);

        }
        // CASE 3: INCORRECT ANSWER SELECTED
        else{
            // Output if incorrect
            document.getElementById("feedback3").innerHTML = `
            <div>Incorrect.</div>
            <div>Please correct your selection.</div>
            `
            // Output X
            document.getElementById("checkx3").innerHTML = `
            <div>✖</div>
            `
            document.getElementById("checkx3").style.color = "red";

            // For setTimeout
            document.getElementById("feedback3").style.visibility = "hidden";
            document.getElementById("checkx3").style.visibility = "hidden";
            setTimeout(function(){
                document.getElementById("feedback3").style.visibility = "visible";
                document.getElementById("checkx3").style.visibility = "visible";
                // Hide the extra parts of Step 3 if radio buttons answered correctly and then changed to incorrect
                s3hiddens.forEach(function(hidden){
                    hidden.style.visibility = "hidden";
                })
            }, 200)
        }

    }

    /// Step 3: Check Numeric Input ///
    let repNumInput =  document.getElementById("checkreps");
    repNumInput.addEventListener("click", checkInput3)

    function checkInput3(){
        document.getElementById("checkx4").innerHTML = '';
        document.getElementById("feedbackRep3").innerHTML = '';

        // Output if correct
        // Remember rempNumInput.value is a string of the numeric input, so we don't need a conversion
        // The replicate number will always be the first character of the first element of the array

        // CASE 1: INVALID INPUT: NUMBER LESS THAN 1, NO NUMBER ENTERED, NUMBER ENTERED IS NOT AN INTEGER
        if (Number(document.getElementById("repNumInput").value) < 1 || document.getElementById("repNumInput").value === '' || !Number.isInteger(Number(document.getElementById("repNumInput").value))){
            // Output feedback (no check/x)
            document.getElementById("feedbackRep3").innerHTML = `
            <div>Please enter a valid replicate number.</div>
            `
            // For setTimeout
            document.getElementById("feedbackRep3").style.visibility = "hidden";
            setTimeout(function(){
                document.getElementById("feedbackRep3").style.visibility = "visible";
                // If the answer is changed from correct to something invalid, hide #nestedInstr, #dragBlock, #nestedTitle, #nestedDiagram, #submitDiv again
                document.getElementById("nestedInstr").style.display = "none";
                document.getElementById("dragBlock").style.display = "none";
                document.getElementById("nestedTitle").style.display = "none";
                document.getElementById("nestedDiagram").style.display = "none";
                document.getElementById("submitDiv").style.display = "none";
            }, 200);
        }
        // CASE 2: CORRECT INPUT
        else if (document.getElementById("repNumInput").value == question.repNums[0][0]){
            document.getElementById("feedbackRep3").innerHTML = `
            <div>Correct!</div>
            `
            // Output Check
            document.getElementById("checkx4").innerHTML = `
            <div>✔</div>
            `
            document.getElementById("checkx4").style.color = "green";

            // For setTimeout
            document.getElementById("feedbackRep3").style.visibility = "hidden";
            document.getElementById("checkx4").style.visibility = "hidden";
            setTimeout(function(){
                document.getElementById("feedbackRep3").style.visibility = "visible";
                document.getElementById("checkx4").style.visibility = "visible";
                // Show #nestedInstr, #dragBlock, #nestedTitle, #nestedDiagram, #submitDiv, #diagramFeedback
                // Remember the default display is "block"
                document.getElementById("nestedInstr").style.display = "block";
                document.getElementById("dragBlock").style.display = "block";
                document.getElementById("nestedTitle").style.display = "block";
                document.getElementById("nestedDiagram").style.display = "flex";
                document.getElementById("submitDiv").style.display = "flex";
                document.getElementById("diagramFeedback").style.display = "block";
            }, 200);

        }
        // CASE 3: INCORRECT INPUT
        else{
            document.getElementById("feedbackRep3").innerHTML = `
            <div>Incorrect.</div>
            <div>Please correct your selection.</div>
            `
            // Output X
            document.getElementById("checkx4").innerHTML = `
            <div>✖</div>
            `
            document.getElementById("checkx4").style.color = "red";

            // For setTimeout
            document.getElementById("feedbackRep3").style.visibility = "hidden";
            document.getElementById("checkx4").style.visibility = "hidden";
            setTimeout(function(){
                document.getElementById("feedbackRep3").style.visibility = "visible";
                document.getElementById("checkx4").style.visibility = "visible";
                // If the answer is changed from correct to incorrect, hide #nestedInstr, #dragBlock, #nestedTitle, #nestedDiagram, #submitDiv again
                document.getElementById("nestedInstr").style.display = "none";
                document.getElementById("dragBlock").style.display = "none";
                document.getElementById("nestedTitle").style.display = "none";
                document.getElementById("nestedDiagram").style.display = "none";
                document.getElementById("submitDiv").style.display = "none";
            }, 200);
        }

    }


    //// CHECK THE NESTED ANOVA DIAGRAM /////
    let mainLevelsList = document.querySelectorAll(".mainLevel>*");
    let nestedLevelsList = document.querySelectorAll(".nestedLevel>*");
    let repLevelsList = document.querySelectorAll(".repLevel>*");

    // Event Listener for the Submit button
    document.getElementById("submitDiagram").addEventListener("click", checkDiagram);

    
    function checkDiagram(){
        // Set diagramFeedback to empty string each time function is called
        document.getElementById("diagramFeedback").innerHTML = '';

        // Set diagramFeedbackOutput to empty string each time function is called
        //let diagramFeedbackOutput = '';    
        // Initialize a count for null values, incorrect values, and correct values (reset all three back to 0 every time the function is called)
        let nullvals = 0;
        let incorrectVals = 0;
        let correctVals = 0;

        // Remove all "incorrect" classes at the beginning of each call just to make life easier when dealing with null values
        listAll = document.querySelectorAll(".mainLevel>*, .nestedLevel>*, .repLevel>*");
        for (elem of listAll){
            elem.classList.remove("incorrect");
        }

        //// We want two setTimeouts here: 
        //       The first is for calculating the number of null/correct/incorrect values and adding/removing the "incorrect" class (we need this one so the red borders will be animated each time the submit button is pressed, not just the first time)
        //       The second is for calculating what feedback should be displayed (this must be done AFTER the first setTimeout to ensure that nullvals, incorrectVals, and correctVals have been calculated/updated accordingly). There is a sub setTimeout within here: we want the feedback to be hidden then shown so it doesn't look static if you get the same feedback in a row. Although the time is 200 for the sub setTimeout, the entire second setTimeout is still calculated at 2ms.

        // FIRST SET TIMEOUT
        setTimeout(function(){
        // Check Main Effects Level
        for (mainLevel of mainLevelsList){
            // CASE 1: Drop box does not have any drag element in it
            if (mainLevel.textContent === ""){
                nullvals += 1;
                console.log("main null");
            }
            // CASE 2: Drop box has a correct drag element
            else if (question.mainLevels.includes(mainLevel.textContent)){
                correctVals += 1;
                mainLevel.classList.remove("incorrect");
                console.log("main correct");
            }
            // CASE 3: Drop box has an incorrect drag element
            else{
                incorrectVals += 1;
                mainLevel.classList.add("incorrect");
                console.log("main incorrect");
            }
        }

        // Check Nested Effects Level (gets complicated if not all nested levels are the same for each main level)
        for (let i = 0; i < nestedLevelsList.length; i++){
            // CASE 1a: CORRECT WITH ORDER (drag element is placed in a drop box correctly in response to the main effect)
            // CASE 1b: CORRECT WITHOUT ORDER (disregard the order of the nestedLevels list, answers are not with repsect to main effect level order)
            // NOTE: THE NESTED LEVELS WILL ALWAYS BE CHECKED IN RELATION TO THE MAIN LEVELS (the main levels are not checked in response to the nested levels)
            
            // This variable just relates the index of the loop to a main effect in the user's answers
            // Take a structure with two main levels and four nested levels for example
            // Ex: nestedElement[0] -> mainElement[0](ie floor 0/2); nestedElement[1] -> mainElement[0](ie floor 1/2); 
            //     nestedElement[2] -> mainElement[1](ie floor 2/2); nestedElement[3] -> mainElement[1](ie floor 3/2)
            let mainLevelChoiceIndex = Math.floor(i/2);
            // Get the index of each main effect (in the order the user chose) in the json file mainLevels array
            // Continuing with our example above, this variable will always either be 0 or 1
            let mainLevelAnsIndex = question.mainLevels.indexOf(mainLevelsList[mainLevelChoiceIndex].textContent);
            // Since we would have 4 nested levels, we want to slice by getting the [0],[1] & [2],[3] (two subsets of nestedLevels array)
            // slicing: question.nestedLevels.slice(0, 2) & question.nestedLevels.slice(2, 4)
            // We want to get the first subset if mainLevelAnsIndex=0 and the second subset if mainLevelAns=1
            // If the nestedLevelsList[i] is in this subset, then it is correct
            let condition;
            if (question.nestedOrdered === true){
                // ORDER DEPENDENT
                condition = question.nestedLevels.slice(mainLevelAnsIndex*2, (mainLevelAnsIndex*2) + 2).includes(nestedLevelsList[i].textContent);
            }
            else{
                // NOT ORDER DEPENDENT (like all the others)
                condition = question.nestedLevels.includes(nestedLevelsList[i].textContent);
            }

            if (condition === true){
                correctVals += 1;
                nestedLevelsList[i].classList.remove("incorrect");
                console.log("nested correct");
            }
            // CASE 2: NO VALUE IN BOX WHEN SUBMITTED
            else if (nestedLevelsList[i].textContent === ""){
                nullvals += 1;
                console.log("nested null");
            }
            // CASE 3: INCORRECT VALUE IN BOX (this will be where the condition falls when the main effect is not correct; in this case the main level and the two corresponding nested levels will all be marked incorrect)
            else{
                incorrectVals += 1;
                nestedLevelsList[i].classList.add("incorrect");
                console.log("nested incorrect");
            }
        }

        // Check Replicates
        for (rep of repLevelsList){
            // CASE 1: Drop box does not have any drag element in it
            if (rep.textContent === ""){
                nullvals += 1;
                console.log("rep null");
            }
            // CASE 2: Drop box has a correct drag element
            else if (question.repNums.includes(rep.textContent)){
                correctVals += 1;
                rep.classList.remove("incorrect");
                console.log("rep correct");
            }
            // CASE 3: Drop box has an incorrect drag element
            else{
                incorrectVals += 1;
                rep.classList.add("incorrect");
                console.log("rep incorrect");
            }
        }

        }, 1); //end of setTimeout(1)


        // SECOND SET TIMEOUT
        setTimeout(function(){
        // Reset all disabled properties of the Submit button
        // This code MUST be here AND in the general setLayout function (having the code here ensures that the button will be re-enabled between submits of the same scenario)   
        document.getElementById("submitDiagram").disabled = false;
        document.getElementById("submitDiagram").classList.remove("disabledbtn");
        document.getElementById("submitDiagram").classList.add("regbtn");
        document.getElementById("submitDiagram").classList.add("grow");

        // Remove the "incorrect" class from all elements if there is at least one null value
        // If there is at least one null value, output the feedback without coloring the border of those incorrect
        if (nullvals !== 0){
            for (elem of listAll){
                elem.classList.remove("incorrect");
            }
        }
       
        // Output the Final Feedback
        // Set diagramFeedbackOutput to empty string each time function is called
        document.getElementById("finalBtnDiv").style.visibility = "hidden";
        let diagramFeedbackOutput = '';
        // CASE 1: THERE IS AT LEAST ONE NULL VALUE
        if (nullvals !== 0){
            diagramFeedbackOutput += `
            <div>Please ensure you have dragged all elements into the diagram.</div>
            `
        }
        // CASE 2: ALL ANSWERS ARE CORRECT
        else if (correctVals === listAll.length){
            diagramFeedbackOutput += `
            <div>Correct!</div>
            `
            // Also disable the submit button if the entire diagram is correct
            document.getElementById("submitDiagram").disabled = true;
            document.getElementById("submitDiagram").classList.add("disabledbtn");
            document.getElementById("submitDiagram").classList.remove("regbtn");
            document.getElementById("submitDiagram").classList.remove("grow");

            // Make "Show Final Model" Button visible
            document.getElementById("finalBtnDiv").style.display = "flex";
            document.getElementById("finalBtnDiv").style.visibility = "visible";
        }
        // CASE 3: THERE IS AT LEAST ONE INCORRECT ANSWER
        else if (incorrectVals !== 0) {
            diagramFeedbackOutput += `
            <div>Incorrect.</div>
            <div>Please correct the diagram and try submitting again.</div>
            <div>Incorrect answers are marked with red borders.</div>
            `
        }
        
        // Once again, do a setTimeout on this function so the feedback disappears and then reappears quickly
        // This setTimeout is nested within setTimeout(2); we want the diagramFeedback to be calculated at 2ms, but actually displayed at 200ms   
        setTimeout(function(){
            document.getElementById("diagramFeedback").innerHTML = diagramFeedbackOutput;
        }, 200);

        }, 2); // end of setTimeout(2)

    }


    /// SHOW FINAL MODEL (once button clicked) ///
    // Add the correct ijt labels to the model
    document.getElementById("finalBtn").addEventListener("click", showModel);

    function showModel(){
        // Extract replicate number and put them into a range array (ex: reps=3, repsArr = [1, 2, 3])
        let reps = Number(question.repNums[0][0]);
        let repsArr = [...Array(reps+1).keys()];
        repsArr.shift();

        document.getElementById("indexLabels").innerHTML = `
            <div>𝑖 = ${question.mainLevels.join(", ")}</div>
            <div>𝑗 = ${question.nestedLevels.join(", ")}</div>
            <div>𝑡 = ${repsArr.join(", ")}</div>
        `

        // Make Final Model Box Visible
        document.getElementById("finalModel").style.display = "block";

        // Make "Play Again" Button Visible
        document.getElementById("playAgainDiv").style.display = "flex";

    }

    // Make the function for recalling setLayout asynchronous (on the click of Play Again, it must wait for the following nodes to be removed)
    document.getElementById("playAgainBtn").addEventListener("click", setLayout);

    // Always ensure that the Submit button is enabled, does indeed contain the "grow" class, and has a shadow each time the diagram is submitted
    // Because we want these button style attributes to be re-applied every time you play again, and setLayout is the event listener function for playAgainbtn, we just put the following code outside of all other functions (I could have put this at the top of setLayout() as well)
    // This code MUST be here AND in the checkDiagram function (having the code here ensures that the button will be re-enabled between submits of different scenarios)
    document.getElementById("submitDiagram").disabled = false;
    document.getElementById("submitDiagram").classList.remove("disabledbtn");
    document.getElementById("submitDiagram").classList.add("regbtn");
    document.getElementById("submitDiagram").classList.add("grow");

} // end of async function

setLayout();



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


// RANDOM CHUNK OF CODE JUST FOR R VERSION SIDEBAR //
document.getElementById("diagramFeedback").style.marginLeft = "-2.5vw";
document.getElementById("submitDiv").style.marginLeft = "0vw";
document.getElementById("finalBtnDiv").style.marginLeft = "0vw";
document.getElementById("finalModel").style.marginLeft = "6vw";
document.getElementById("playAgainDiv").style.marginLeft = "0vw";

// document.querySelector(".skin-black .main-header .navbar>.sidebar-toggle").addEventListener("click", collapse);
// function collapse(){
//     if (!document.getElementsByTagName("body")[0].classList.contains("sidebar-collapse")){
//         document.getElementById("diagramFeedback_c").style.marginLeft = "0vw";
//         document.getElementById("submitDiv_c").style.marginLeft = "0vw";
//         document.getElementById("finalBtnDiv_c").style.marginLeft = "0vw";
//         document.getElementById("finalModel_c").style.marginLeft = "15vw";
//         document.getElementById("playAgainDiv_c").style.marginLeft = "0vw";
//         //console.log("no sidebar")
//     }
//     else{
//         document.getElementById("diagramFeedback").style.marginLeft = "3vw";
//         document.getElementById("submitDiv").style.marginLeft = "12.5vw";
//         document.getElementById("finalBtnDiv").style.marginLeft = "12.5vw";
//         document.getElementById("finalModel").style.marginLeft = "12vw";
//         document.getElementById("playAgainDiv").style.marginLeft = "12.5vw";
//         //console.log("sidebar")
//     }
// }

