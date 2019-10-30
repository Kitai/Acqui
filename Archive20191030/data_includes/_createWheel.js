createWheel = row => [
    newScale("levels", 100)
        .settings.log("all")
    ,
    newTimer(250)
        .start()
        .wait()
    ,
    newCanvas("container", WIDTH,HEIGHT)
        .settings.css("background","lightgray")
        .settings.add( 0 , 0 , newImage("background",row.BackgroundPic).settings.size(WIDTH,HEIGHT) )
        .settings.add( 0 , 0 , newImage("foreground",row.ForegroundPic).settings.size(WIDTH,HEIGHT) )
        .settings.add( WIDTH*row.AnchorX/row.Width,HEIGHT*row.AnchorY/row.Height , newCanvas("anchorWheel",1,1) )
        .print()
    ,
    newImage( "wheel" , row.DialPic )
        .settings.size( row.DialWidth*WIDTH/row.Width , row.DialHeight*HEIGHT/row.Height )
        .print("center at "+Number(row.DialX*WIDTH/row.Width)+"px" , "middle at "+Number(row.DialY*HEIGHT/row.Height)+"px", getCanvas("container"))
        .asWheel(1.5*Math.PI)
        .settings.disableWheel()
    ,
    ..._itemSpecific(row)
];