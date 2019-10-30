// NOTE:
// See _config.js for how 'animals' is fed using Template. Since Template is asynchronous,
// we need to generate the intro trial AFTER the Template from _config
// So a simple, global PennController() (synchronous) won't do
// We need to use a Template again, but we generate just one trial, hence the dummy one-row "intro" table
PennController.AddTable("intro", "dummyHeader1,dummyHeader2\ndummyCell1,dummyCell2")

// Introduction trial
PennController.Template(    // See note above for why we embed PennController() in Template()
  "intro"
  ,
  row => PennController( "intro" ,
    defaultImage
        .settings.size( WIDTH / 5 , "auto" )
    ,
    newTimer(500)
        .start()
        .wait()
    ,
    newCanvas("container", WIDTH, HEIGHT)
        .settings.add( "center at 12.5%" , "bottom at 100%" , newImage("animal1", animals[0].kind+".png") )
        .settings.add( "center at 37.5%" , "bottom at 100%" , newImage("animal2", animals[1].kind+".png") )
        .settings.add( "center at 62.5%" , "bottom at 100%" , newImage("animal3", animals[2].kind+".png") )
        .settings.add( "center at 87.5%" , "bottom at 100%" , newImage("animal4", animals[3].kind+".png") )
        .print()
    ,
    getTooltip("guide")
        .settings.text("These are my friends!")
        .print( getCanvas("container") )
        .wait()
        .settings.position("top center")
        .settings.text("This is "+animals[0].name+"...")
        .print( getImage("animal1") )
        .wait()
        .settings.text("This is "+animals[1].name+"...")
        .print( getImage("animal2") )
        .wait()
        .settings.text("This is "+animals[2].name+"...")
        .print( getImage("animal3") )
        .wait()
        .settings.text("And this is "+animals[3].name+"!")
        .print( getImage("animal4") )
        .wait()
        .settings.position("middle center")
        .settings.text("My friends are about to go to bed")
        .print( getCanvas("container") )
        .wait()
        .settings.text("But before that, they need to prepare for the night, so we'll help them get ready!")
        .print( getCanvas("container") )
        .wait()
    ,
    newTimer(250)
        .start()
        .wait()
  )
  .log("id", PennController.GetURLParameter("id"))
)