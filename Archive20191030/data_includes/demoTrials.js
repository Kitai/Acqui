
PennController.Template(    // We filter the table because we only want one demo trial per item
  PennController.GetTable("wheels").filter( row=>row.Form=="comparative"&&row.Force=="Mid" ) 
  ,
  row => PennController(    "demo-"+row.Item ,
    ...createWheel(row)
    ,
    getImage("wheel").setWheel(10)      // Making sure the wheel is at 10
    ,
    newTimer(500).start().wait()
    ,    
    getTooltip("guide")
        .settings.position("bottom center")
        .settings.text("See the dial here? We can use it to control the "+row.Dimension+".")
        .print( getCanvas("anchorWheel") )
        .wait()
        .settings.disable().settings.label("")
        .settings.text("We can move it like this, and the "+row.Dimension+" goes up...")
        .print( getCanvas("anchorWheel") )
    ,
    getImage("wheel").setWheel( 90 , DELAYWHEEL )
    ,
    getTooltip("guide")
        .settings.label("Press Space").settings.enable()
        .wait()
        .settings.disable().settings.label("")
        .settings.text("We can move it like this, and the "+row.Dimension+" goes down...")
        .print( getCanvas("anchorWheel") )
    ,
    getImage("wheel").setWheel( 10 , DELAYWHEEL )
    ,
    getTooltip("guide")
        .settings.label("Press Space").settings.enable()
        .wait()
        .settings.disable().settings.label("")
        .settings.text("When it is here, the "+row.Dimension+" is "+row[adjectives[row.Item].MinAdj].toUpperCase())
        .print( getCanvas("anchorWheel") )
    ,
    getImage("wheel").setWheel( Number(row.MinLevel) , DELAYWHEEL )
    ,
    getTooltip("guide")
        .settings.label("Press Space").settings.enable()
        .wait()
        .settings.disable().settings.label("")
        .settings.text("When it is here, the "+row.Dimension+" is "+row[adjectives[row.Item].MaxAdj].toUpperCase())
        .print( getCanvas("anchorWheel") )
    ,
    getImage("wheel").setWheel( Number(row.MaxLevel) , DELAYWHEEL )
    ,
    getTooltip("guide")
        .settings.label("Press Space").settings.enable()
        .wait()
        .settings.disable().settings.label("")
        .settings.text("And when it is here, it is "+row[adjectives[row.Item].MidAdj].toUpperCase())
        .print( getCanvas("anchorWheel") )
    ,
    getImage("wheel").setWheel( Number(row.MidLevel) , DELAYWHEEL )
    ,
    getTooltip("guide")
        .settings.label("Press Space").settings.enable()
        .wait()
        .settings.text("Got it? Let's do it one more time")
        .print( getCanvas("anchorWheel") )
        .wait()
        .settings.disable().settings.label("")
        .settings.text("Here it is "+row[adjectives[row.Item].MinAdj].toUpperCase()+"...")
        .print( getCanvas("anchorWheel") )
    ,
    getImage("wheel").setWheel( Number(row.MinLevel) , DELAYWHEEL )
    ,
    getTooltip("guide")
        .settings.label("Press Space").settings.enable()
        .wait()
        .settings.disable().settings.label("")
        .settings.text("Here it is "+row[adjectives[row.Item].MaxAdj].toUpperCase()+"...")
        .print( getCanvas("anchorWheel") )
    ,
    getImage("wheel").setWheel( Number(row.MaxLevel) , DELAYWHEEL )
    ,
    getTooltip("guide")
        .settings.label("Press Space").settings.enable()
        .wait()
        .settings.disable().settings.label("")
        .settings.text("And here it is "+row[adjectives[row.Item].MidAdj].toUpperCase())
        .print( getCanvas("anchorWheel") )
    ,
    getImage("wheel").setWheel( Number(row.MidLevel) , DELAYWHEEL )
    ,
    getTooltip("guide")
        .settings.label("Press Space").settings.enable()
        .wait()
        .settings.text(
            "So, we can make the "+row.Dimension+" "+row[adjectives[row.Item].MinAdj].toUpperCase()+", "+
                                                    row[adjectives[row.Item].MidAdj].toUpperCase()+" or "+
                                                    row[adjectives[row.Item].MaxAdj].toUpperCase()
        )
        .print( getCanvas("anchorWheel") )
        .wait()
    ,
    newTimer(500).start().wait()
    ,
    getCanvas("container").remove()
    ,
    getTooltip("guide")
        .settings.text("Okay, now it will be your turn to use the dial...")
        .print(  )
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