// We will need this to check whether the wheel was actually set to a new value (see below)
let previousLevel = -1;

// This funciton returns the appropriate adjective form for the current trial
let getAdjectiveForm = row => {
    if (row.Form=="comparative")    // This is a little convulated because of shuffled nonce adjectives
        return row[adjectives[row.Item][row.Force+'Adj'].replace('Adj','Comp')].toUpperCase();
    else
        return "TOO "+row[adjectives[row.Item][row.Force+'Adj']].toUpperCase();
}

PennController.Template( 
  "wheels"      // Unfiltered table: we generate as many input trials as there are rows (i.e. conditions)
  ,
  row => PennController(    "input-" + row.Item ,
    newTimer(250)
        .start()
        .wait()
    ,
    newImage( "animal" , row.Animal + ".png" )
        .settings.size( "200px" , "auto" )
        .print( "center at 50%" , "center at 50%" )
    ,
    getTooltip("guide")
        .settings.position("top center")
        .settings.text( row.Name+" is here!")
        .print( getImage("animal") )
        .wait()
    ,
    ...createWheel(row)
    ,
    getCanvas("container")
        .settings.visible()
        .settings.add( "center at 50%" , "center at -2.5%" , getImage("animal").settings.size("100px","auto").settings.cssContainer("z-index",-1) )
    ,
    getImage("wheel")
        .setWheel( Number(row.Level) )
    ,
    getTooltip("guide")
        .settings.position("bottom center")
        .settings.text( row.SentenceArrival )
        .print( getCanvas("anchorWheel") )
        .wait()
        .settings.text( row.SentenceDislike+" "+getAdjectiveForm(row) )
        .print( getCanvas("anchorWheel") )
        .wait()
        .settings.text( row.SentenceInstructions.replace("ADJ",getAdjectiveForm(row)) )
        .settings.label("Move the dial")
        .settings.disable()
        .print( getCanvas("anchorWheel") )
    ,
    newTimer("moveKnob", 250)
    ,
    getImage("wheel")
        .settings.enableWheel()
        .settings.callbackWheel( l=>{ 
            if (previousLevel != l) {
                previousLevel = l; 
                getScale("levels").select(l,"log")._runPromises();
                getTimer("moveKnob").start()._runPromises();
            } 
        })
    ,
    getTimer("moveKnob")
        .wait()
    ,
    getTooltip("guide")
        .settings.label("")
        .settings.text("Click the button below when you are done moving the dial")
        .print( getCanvas("anchorWheel") )
    ,
    newButton("done", "I set the dial")
        .settings.cssContainer("margin-top","1em")
        .settings.center()
        .print()
        .wait()
        .remove()
    ,
    getImage("wheel")
        .settings.disableWheel()
    ,
    getTooltip("guide")
        .settings.enable()
        .settings.label("Press Space")
        .settings.text( row.SentenceCompletion )
        .print( getCanvas("anchorWheel") )
        .wait()
    ,
    newTimer(250)
        .start()
        .wait()
  )
  .log("id", PennController.GetURLParameter("id"))
  .log("MinAdj", row[adjectives[row.Item].MinAdj])
  .log("MinLevel", row.MinLevel )
  .log("MidAdj", row[adjectives[row.Item].MidAdj])
  .log("MidLevel", row.MidLevel )
  .log("MaxAdj", row[adjectives[row.Item].MaxAdj])
  .log("MaxLevel", row.MaxLevel )
  .log("Form", row.Form)
  .log("Force", row.Force)
  .log("Level", row.Level)
  .log("Tested", getAdjectiveForm(row))
  .setOption("hideProgressBar",true)
);