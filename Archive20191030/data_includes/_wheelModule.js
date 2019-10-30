(function(){
    
    let steps = [];
    
    let wheel;
    let level = 0;
    let callbacks = [];
    let cursorRad;
    let offsetRad;
    let enabled = true;

    function pauseEvent(e){
        if(e.stopPropagation) e.stopPropagation();
        if(e.preventDefault) e.preventDefault();
        e.cancelBubble=true;
        e.returnValue=false;
        return false;
    }
    
    function setWheel(l) {
        l = Math.round(l);
        if (isNaN(l) || l < 0 || l >= steps.length)
            return;
        let a = steps[l];
        level = l;
        wheel.style.transform = "rotate("+Number((offsetRad/2-a)*180/Math.PI)+"deg)";
        callbacks.map(v=>{
            if (v instanceof Function)
                v.call(null,level);
            else if (v._runPromises && v._runPromises instanceof Function)
                v._runPromises();
        });
    }
    
    function newWheel(range,step,offset){
        if (isNaN(Number(range)) || Number(range) <= 0 || Number(range) >= 2*Math.PI)
            range = Math.PI;
        step = Math.round(Number(step));
        if (isNaN(step) || step <= 1)
            step = 100;
        steps = [...Array(step)].map((v,i)=>(step-1-i)*range/(step-1));
        offsetRad = Number(offset) || range % Math.PI;

        callbacks = [];
        let previousX = 0, previousY = 0;
        let previousRadDiff = 0;
        let clicking = false;
        level = 0;
        cursorRad = Math.PI;
        getClosest = function(ar, value){
            let va = Number(value);
            if (isNaN(va))
                return NaN;
            let a = ar.filter(v=>!isNaN(Number(v)));            
            if (a.length===0)
                return NaN;
            let diff = Math.max(...a.map(v=>Math.abs(va-Number(v)))), n = 0;
            for (let i = 0; i < a.length; i++){
                let d = Math.abs(va-Number(a[i]));
                if (d <= diff){
                    diff = d;
                    n = i;
                }
            }
            return {angle: a[n], index: n};
        };
        let complementRad = function(rad){
            if (rad > 0)
                return rad - 2*Math.PI;
            else if (rad < 0)
                return 2*Math.PI + rad;
            else
                return 0;
        };
        let update = function(e){
            let dims = wheel.getBoundingClientRect();
            //let cX = centerX + dims.left, cY = centerY + dims.top;
            let cX = dims.left + dims.width/2, cY = dims.top + dims.height/2;
            let xTo = e.clientX - cX,
                yTo = e.clientY - cY;
            let xFrom = previousX - cX,
                yFrom = previousY - cY;
            let radTo = Math.atan2(yTo,xTo);
            let radFrom = Math.atan2(yFrom,xFrom);
            let radDiff = radTo - radFrom;
            if ((radDiff > Math.PI && previousRadDiff <= 0) || (radDiff < -1*Math.PI && previousRadDiff >= 0))
                radDiff = complementRad(radTo) - radFrom;
            previousRadDiff = radDiff;
            cursorRad -= radDiff;
            if (cursorRad < 0)
                cursorRad = 0;
            else if (cursorRad > steps[0])
                cursorRad = steps[0];
            let visualRad = getClosest(steps, cursorRad);
            setWheel(visualRad.index);
            previousX = e.clientX;
            previousY = e.clientY;
            pauseEvent(e);
        };
        document.body.onmousemove = function(e){
            if (clicking)
                update(e);
        };
        document.onmouseup = function(){
            clicking = false;
            cursorRad = getClosest(steps, cursorRad).angle;
        };
        wheel.onmousedown = function(e){
            if (!enabled) return;
            clicking = true;
            previousX = e.clientX;
            previousY = e.clientY;
            pauseEvent(e);
        };
    }
    
    window.PennController._AddStandardCommands(function(PennEngine){
        this.actions = {
            asWheel: function(resolve, range, step, offset){
                wheel = this.jQueryContainer[0];
                this.jQueryElement.css("pointer-events","none")
                newWheel(range, step, offset);
                this.jQueryContainer.css("cursor","move");
                resolve();
            }
            ,
            setWheel: async function(resolve, l, delay){
                if (delay && Number(delay) > 0 && l != level && Number(l) >= 0 && Number(l) < steps.length){
                    let step = 1 - 2*(level > l);
                    setWheel(level+step);
                    for (let n = level+step; n != l+step; n += step)
                        await new Promise(r=>setTimeout(()=>{ setWheel(n); r(); },delay));
                    cursorRad = steps[level];
                    resolve();
                }
                else{
                    setWheel(l);
                    cursorRad = steps[level];
                    resolve();
                }
            }
        };
        this.settings = {
            callbackWheel: function(resolve, f){
                callbacks.push(f);
                resolve();
            }
            ,
            enableWheel: function(resolve){
                enabled = true;
                this.jQueryContainer.css("cursor","move");
                resolve();
            }
            ,
            disableWheel: function(resolve){
                enabled = false;
                this.jQueryContainer.css("cursor","initial");
                resolve();
            }
        };
    });
    
})();
