// Consent form
PennController(
    "instructions"
    ,
    newHtml("IbexConsentProlific2019.html")
        .settings.css("max-width", "60em")
        .print()
    ,
    newButton("I consent")
        .settings.center()
        .print()
        .wait()
)
.setOption("hideProgressBar",true)

// Practice dial
PennController(
    "instructions"
    ,
    getTooltip("guide")
        .settings.text("Welcome")
        .print( "center at 50%" , "center at 50%" )
        .wait()
    ,
    ...createWheel({
        BackgroundPic: "background.png" , ForegroundPic: "void.png"  , DialPic: "dial.png" ,
        DialX: 500, DialY: 510, DialWidth: 528, DialHeight: 528, AnchorX: 475, AnchorY: 700, Width: 955, Height: 955
    })
    ,
    //getCanvas("wheel")
    getImage("wheel")
        .setWheel(0)
    ,
    getTooltip("guide")
        .settings.text("In this experiment, you will be invited to use a dial, like the one displayed here")
        .print( getCanvas("anchorWheel") )
        .wait()
        .settings.text("To move the dial, click and drag it, as you would if you were moving a file around")
        .print( getCanvas("anchorWheel") )
        .wait()
    ,
    newTimer("moveWheel", 250)
    ,
    //getCanvas("wheel")
    getImage("wheel")
        .settings.callbackWheel( ()=>getTimer("moveWheel").start()._runPromises() )
        .settings.enableWheel()
    ,
    getTimer("moveWheel")
        .wait()
    ,
    getTooltip("guide")
        .settings.text("Some touchscreens also allow you to directly move it manually")
        .print( getCanvas("anchorWheel") )
        .wait()
    , 
    newButton("done", "I moved the dial")
        .settings.cssContainer("margin-top","1em")
        .settings.center()
        .print()
    ,
    getTooltip("guide")
        .settings.label("")
        .settings.text("Click the button below when you are done practicing moving the dial")
        .print( getCanvas("anchorWheel") )
    ,
    getButton("done")
        .wait()
)
.log("id", PennController.GetURLParameter("id"))



// Caveat / notes
PennController(
    "instructions"
    ,
    newText(
        `<p>A few caveats before we start the experiment: <ul>
        
        <li>This experiment was designed for children, so you will be spoken to as such, but we ask you to give your own responses:
        please refrain from trying to imagine what children would do.</li>
        
        <li>This is NOT an evaluation: there is no right answer to guess. We are interested in your intuitions,
        regardless of how other people might approach this task.</li>
        
        <li>You might see words that you are not familiar with in this experiment. If so, just complete the task in the way that makes the most sense to you.</li>
        
        <li>Some parts of this experiment use sound effects. Although you can still complete the experiment with your sound turned off, 
        please consider turning it on to ensure optimal experimental conditions.</li>
        
        </ul>
        
        When you are ready to start the experiment, click the button below.</p>
    `)
        .settings.css("max-width", "50em")
        .print()
    ,
    newButton("Start the experiment")
        .settings.center()
        .print()
        .wait()
)
.log("id", PennController.GetURLParameter("id"))



// Post-experiment feedback page
PennController(
    "feedback"
    ,
    defaultText
        .settings.css("max-width", "50em")
    ,
    newText("<p>You are almost done: a confirmation link will appear on the next screen.</p>")
        .settings.bold()
        .print()
    ,
    newText("<p>Please, let us know if you turned the sound on during this experiment. Use the box below if you have any additional comments.</p>")
        .print()
    ,
    newText("warning", "Please select an option")
        .settings.color("red")
        .print()
        .settings.cssContainer("display","none")
    ,
    newScale("sound", "on", "off")
        .settings.log()
        .settings.labelsPosition("right")
        .settings.before( newText("My sound was") )
        .settings.callback( getText("warning").settings.cssContainer("display","none") )
        .print()
    ,
    newText("<p>Comments:</p>")
        .settings.bold()
        .print()
    ,
    newTextInput("feedback", "")
        .settings.cssContainer("margin","1em")
        .settings.lines(0)
        .settings.log()
        .print()
    ,
    newButton("Send my submission and show my confirmation link")
        .settings.center()
        .print()
        .wait(
            getScale("sound").test.selected()
                .failure( getText("warning").settings.cssContainer("display","block") )
        )
)
.log("id", PennController.GetURLParameter("id"))



// Send results
PennController.SendResults("send")



// Confirmation page
PennController(
    "confirmation"
    ,
    defaultText
        .settings.css("max-width", "50em")
        .settings.center()
    ,
    newText("Your submission has been sent successfully!")
        .settings.color("green")
        .print()
    ,
    newText("<p><a href='https://app.prolific.co/submissions/complete?cc=41AF9E9E' target='_blank'>Click here to validate your participation and receive your credit</a></p>")
        .settings.bold()
        .settings.css("font-size", "2em")
        .print()
    ,
    newText("<p>Once you have clicked the link above, you can safely close this window. If a message warns you that data were not saved, you can ignore it.</p>")
        .print()
    ,
    newTimer(1).wait()
)
.setOption("countsForProgressBar",false)