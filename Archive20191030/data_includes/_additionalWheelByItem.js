function _itemSpecific(row){

    // sigmoid function
    function erf(x) {
        var z;
        const ERF_A = 0.147; 
        var the_sign_of_x;
        if(0==x) {
            the_sign_of_x = 0;
            return 0;
        } else if(x>0){
            the_sign_of_x = 1;
        } else {
            the_sign_of_x = -1;
        }

        var one_plus_axsqrd = 1 + ERF_A * x * x;
        var four_ovr_pi_etc = 4/Math.PI + ERF_A * x * x;
        var ratio = four_ovr_pi_etc / one_plus_axsqrd;
        ratio *= x * -x;
        var expofun = Math.exp(ratio);
        var radical = Math.sqrt(1-expofun);
        z = radical * the_sign_of_x;
        return z;
    }

    switch(row.Item){
        case "Bathtub":
            return [
                newAudio( "backgroundSound" , row.ForegroundPic.replace(".png",".mp3") )
                    .play("loop")
                ,
                newFunction(()=>{
                    let audio = getAudio("backgroundSound")._element;
                    let oldEnd = audio.end;
                    audio.end = function(){ audio.audio.pause(); oldEnd.apply(this); };
                    this.clone = getImage("foreground")._element.jQueryElement.clone();
                    this.clone.css({
                        filter: "hue-rotate(195deg) brightness(1.75) saturate(0.75) opacity(0)",
                        position: "absolute",
                        left: 0
                    });
                    this.clone.appendTo(getImage("foreground")._element.jQueryContainer);
                }).call()
                ,
                getImage("wheel")
                    .settings.callbackWheel( l=>
                        this.clone.css("filter", "hue-rotate(195deg) brightness(1.75) saturate(0.75) opacity("+(erf(4*(l/100-0.4))+1)/2+")") 
                    )
            ];
        case "Lamp":
            getImage("foreground").settings.css("filter","brightness(1.5)")._runPromises();
            return [
                getImage("wheel")
                    .settings.callbackWheel( l=>
                        getImage("background").settings.css("filter", "brightness("+1.5*erf(l/100)+")")._runPromises()        
                    )
            ];
        case "Clock":
            let dot1 = document.createElement("DIV");
            dot1.style.position = "absolute";
            dot1.style.top = "30%";
            dot1.style.left = "50%";
            let dot2 = document.createElement("DIV");
            dot2.style.position = "absolute";
            dot2.style.top = "29%";
            dot2.style.left = "49%";
            let dot3 = document.createElement("DIV");
            dot3.style.position = "absolute";
            dot3.style.top = "29.5%";
            dot3.style.left = "51%";
            let tmt;

            let container = getCanvas("container")._element;

            // Reach maturity in m=DURATION*(1-1/l)
            // Dissipate in d=DURATION-m
            // Size at maturity s=1+(100-l)/10
            // Opacity at maturity o=1
            function noteAnimation(e,l){
                $(e).detach();
                container.jQueryElement.append( e );
                let end = Date.now()+DURATION;
                let m = (110-l)/110;
                let s = 1 + (100-l)/10;
                e.style.width = "10px";
                e.style.height = "10px";
                e.style.background = "black";
                e.style['border-radius'] = "5px"
                e.style.opacity =  0;
                let next = ()=>{
                    let now = Date.now();
                    if (now>=end)
                        return e.style.opacity = 0;
                    let isBody = container.jQueryElement;
                    while (isBody.length && isBody[0].nodeName != "BODY")
                        isBody = isBody.parent();
                    if (!isBody.length || isBody[0].nodeName != "BODY")
                        return stopSound();
                    let r = (end-now)/DURATION;
                    let p = 1-r;
                    let o = Math.min(p/m, r/m);
                    let z = Math.min(m,p)/m*s;
                    e.style.opacity = o;
                    e.style.transform = "scale("+z+")";
                    window.requestAnimationFrame(next);
                }
                next();
            }

            let startTimes = [50,350,650];
            let notes = [350,300,400];
            let DURATION = 300;

            let context, osc;
            function stopSound() {
                if (osc && osc instanceof OscillatorNode)
                    osc.stop();
            }

            function play(l){
                if (tmt)
                    clearTimeout(tmt);
                stopSound();
                let isBody = container.jQueryElement;
                while (isBody.length && isBody[0].nodeName != "BODY")
                    isBody = isBody.parent();
                if (!isBody.length || isBody[0].nodeName != "BODY")
                    return;
                osc = context.createOscillator();
                osc.frequency.value = notes[0] + 200*l/100;
                osc.frequency.setValueAtTime( notes[1]+200*l/100 , context.currentTime + startTimes[1]/1000 );
                osc.frequency.setValueAtTime( notes[2]+200*l/100 , context.currentTime + startTimes[2]/1000 );
                osc.connect(context.destination);
                osc.start(context.currentTime + startTimes[0]/1000);
                osc.stop(context.currentTime + (startTimes[2]+DURATION)/1000);
                tmt = setTimeout( ()=>play(l) , startTimes[2]+DURATION*4 );
                setTimeout( ()=>noteAnimation(dot1,l) , startTimes[0] );
                setTimeout( ()=>noteAnimation(dot2,l) , startTimes[1] );
                setTimeout( ()=>noteAnimation(dot3,l) , startTimes[2] );
            }

            return [
                // Can't create AudioContext above as user hasn't interacted with page yet
                newFunction( ()=>context = new (window.AudioContext || window.webkitAudioContext)() ).call()
                ,
                getImage("wheel")
                    .settings.callbackWheel( l=>play(l) )
            ];
        case "Bed":
            let bed = `<svg width="`+WIDTH+`" height="`+HEIGHT+`" viewBox="0 0 1000 500" style="background-image: url('bedBackground.png'); background-size: cover;" >
                    <g id="layer1" transform="translate(20,-340)">
                        <path style="fill:none;stroke:darkslategray;stroke-width:10px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" 
                            d="M480 480 L910 480 L910 430 L881 354 L480 354 M480 430 L910 430"
                            id="nonfoldableContour" 
                            sodipodi:nodetypes="ccccccccc" />
                        <path style="fill:none;stroke:darkslategray;stroke-width:10px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
                            d="M133 50 L1 50 L1 40 L30 30 L133 30 L133 40 L1 40"
                        id="bedContour"
                        inkscape:connector-curvature="0"
                        sodipodi:nodetypes="ccccccccc" />
                        <path style="fill:none;stroke:darkslategray;stroke-width:10px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" 
                        d="M480 480 L880 480 L880 400 L780 290 L480 290 M480 400 L880 400" 
                        id="edgeContour" 
                        sodipodi:nodetypes="ccccccccc" />
                        <path style="fill:white;stroke:none;stroke-width:2px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
                            d="M133 50 L1 50 L1 40 L30 30 L133 30 L133 40 L1 40"
                        id="bed"
                        inkscape:connector-curvature="0"
                        sodipodi:nodetypes="ccccccccc" />
                        <path style="fill:white;stroke:none;stroke-width:2px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" 
                            d="M480 480 L880 480 L880 400 L780 290 L480 290 M480 400 L880 400" 
                            id="edge" 
                            sodipodi:nodetypes="ccccccccc" />
                        <path style="fill:white;stroke:none;stroke-width:2px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" 
                            d="M480 480 L910 480 L910 430 L881 354 L480 354 M480 430 L910 430"
                            id="nonfoldable" 
                            sodipodi:nodetypes="ccccccccc" />       
                    </g>
                </svg>`;
            let angle = Math.PI;
            let A = [480,480];
            let length = 430;
            let height = 50;
            let a = [480,400];
            let ratioPerspective = 13/14;
            
            function updateBDC(){
                let B = [A[0]+length*Math.cos(angle), A[1]-length*Math.sin(angle)].map(v=>Math.round(v));
                let F = [A[0]+height*Math.cos(angle-Math.PI/2),A[1]-height*Math.sin(angle-Math.PI/2)].map(v=>Math.round(v));
                let C = [F[0]+length*Math.cos(angle), F[1]-length*Math.sin(angle)].map(v=>Math.round(v));
                let E = [a[0]+ratioPerspective*height*Math.cos(angle-Math.PI/2),a[1]-ratioPerspective*height*Math.sin(angle-Math.PI/2)].map(v=>Math.round(v));
                let D = [E[0]+ratioPerspective*length*Math.cos(angle), E[1]-ratioPerspective*length*Math.sin(angle)].map(v=>Math.round(v));
                let G = [a[0]+ratioPerspective*length*Math.cos(angle), a[1]-ratioPerspective*length*Math.sin(angle)].map(v=>Math.round(v));
                document.getElementById("bed").setAttribute("d", "M"+A.join(' ')+" L"+B.join(' ')+" L"+C.join(' ')+" L"+D.join(' ')+" L"+E.join(' ')+" M"+C.join(' ')+" L"+F.join(' '));
                document.getElementById("edge").setAttribute("d", "M"+B.join(' ')+" L"+G.join(' ')+" L"+D.join(' ')+" L"+E.join(' ')+" L"+A.join(' ')+" Z");
                document.getElementById("bedContour").setAttribute("d", "M"+A.join(' ')+" L"+B.join(' ')+" L"+C.join(' ')+" L"+D.join(' ')+" L"+E.join(' ')+" M"+C.join(' ')+" L"+F.join(' '));
                document.getElementById("edgeContour").setAttribute("d", "M"+B.join(' ')+" L"+G.join(' ')+" L"+D.join(' ')+" L"+E.join(' ')+" L"+A.join(' ')+" Z");
            }
            //           D_______________________E 
            //          /|                       a
            //     C  /__G_______________________F
            //       | /                          
            //     B|/___________________________A

            //updateBDC();

            return [
                getCanvas("container")
                    .settings.add( 0 , 0 , newText("bed", bed).settings.size( WIDTH , HEIGHT ).settings.cssContainer("pointer-events", "none") )
                ,
                getImage("wheel")
                    .settings.callbackWheel( l=> { angle = Math.PI - 0.25*Math.PI*l/100; updateBDC(); } )
                    .setWheel(10)
            ];

        default:
            return [];
    }
}