let PLAY = 4;

PennController.Template(    // We filter the table because we only want one demo trial per item
  PennController.GetTable("wheels").filter( row=>row.Form=="comparative" ) 
  ,
  row => PennController(    "practice-"+row.Item ,
    ...createWheel(row)
    ,
    getScale("levels")
        .settings.log("last")   // Overwriting "all" to "last" (not so interested in hesitations)
    ,
    getImage("wheel").setWheel( Number(row.MinLevel) )
    ,
    newTimer("eraseGuide", 1500).settings.callback( getTooltip("guide").remove() )      // Creation of timer, but not called yet
    ,
    newTimer(500).start().wait()
    ,    
    getTooltip("guide")
        .settings.position("bottom center")
        .settings.text("This is where I put the dial when I said "+row[adjectives[row.Item].MinAdj].toUpperCase()+".")
        .print( getCanvas("anchorWheel") )
        .wait()
        .settings.text(
            "Do you remember where I put the dial when I said "+row[adjectives[row.Item][row.Force+'Adj']].toUpperCase()+"? "+
            "Can you show me where I put it when I said "+row[adjectives[row.Item][row.Force+'Adj']].toUpperCase()+"?"
        )
        .settings.label("Move the dial")
        .settings.disable()
        .print( getCanvas("anchorWheel") )
    ,
    newTimer("movedDial", 150)
        .settings.callback( getTooltip("guide").remove() )
    ,
    getImage("wheel")
        .settings.callbackWheel( l=>{
            if (l!=previousLevel){
                previousLevel = l;
                getScale("levels").select(l,"log")._runPromises();
                getTimer("movedDial").start()._runPromises();
            }
        } )
        .settings.enableWheel()
    ,
    getTimer("movedDial").wait()
    ,
    getTooltip("guide")
        .settings.text("Are you sure? Let's see... try moving it to where it was when I said "+row[adjectives[row.Item][row.Force+'Adj']].toUpperCase())    // Not printed (yet)
    ,
    newVar("errors", 0)
        .settings.log()
    ,
    newButton("I moved the dial")
        .settings.center()
        .print()
        .wait(
            newFunction( ()=>Math.abs(row[row.Force+'Level']-getScale("levels").value)<=PLAY ).test.is( true )
                .failure( getVar("errors").set(v=>v+1) , getTooltip("guide").print(getCanvas("anchorWheel")) )     // Print guide if failure
        )
        .remove()   // Remove when wait validated (i.e. level within +/-1)
    ,
    getImage("wheel")
        .settings.disableWheel()
        .setWheel( Number(row[row.Force+'Level'])+1 )     // Make sure the dial is exactly where we put it before
    ,
    newTimer(200).start().wait()    // Wait 200ms in case the 150ms 'movedDial' timer is running (its callback would remove the tooltip we're about to print)
    ,
    newFunction( ()=>Math.abs(row[row.Force+'Level']-getScale("levels").value)<=PLAY/2 ).test.is( true )
        .success( getTooltip("guide").settings.text("Yes! This is where I put the dial when I said "+row[adjectives[row.Item][row.Force+'Adj']].toUpperCase()+"!") )
        .failure( getTooltip("guide").settings.text("Close enough! This is where I put the dial when I said "+row[adjectives[row.Item][row.Force+'Adj']].toUpperCase()+"!") )
    ,
    getTooltip("guide")
        .settings.label( "Press Space" )
        .settings.enable()
        .print( getCanvas("anchorWheel") )
        .wait()
    ,
    newTimer(250).start().wait()
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
);