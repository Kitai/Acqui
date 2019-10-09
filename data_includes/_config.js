PennController.ResetPrefix(null);

// Canvas' dimensions
let WIDTH = 500,
    HEIGHT = 500;

// The delay (in ms) between each frame when moving the wheel in demo
let DELAYWHEEL = 15;

// The table comes from a distant Google spreadsheet
PennController.AddTable( "wheels" , "https://docs.google.com/spreadsheets/d/e/2PACX-1vTQLkPKbpz3TWlpZZsiBrhPojTsxTbvpotEDzYpCar24TEMLg3Co_dNYLzOVYpAEN7IUcphTusRj2FL/pub?gid=0&single=true&output=csv" )

// Where the resources are stored (temporary)
PennController.AddHost("https://raw.githubusercontent.com/Kitai/Acqui/master/")

// The guide is common to all trials
PennController.Header(
    newTooltip("guide", "", "Press Space")
        .settings.key(" ", "no click")
        .settings.size( WIDTH/2.5 , "auto" )
        .settings.position("middle center")
);

PennController.Sequence( 
    "instructions"
    ,   
    "intro"
    , 
    "demo-Bathtub" , randomize("practice-Bathtub") , randomize("practice-Bathtub") , randomize("input-Bathtub") 
    , 
    "demo-Lamp" , randomize("practice-Lamp") , randomize("practice-Lamp") , randomize("input-Lamp") 
    ,
    "demo-Clock" , randomize("practice-Clock") , randomize("practice-Clock") , randomize("input-Clock")
    ,
    "demo-Bed" , randomize("practice-Bed") , randomize("practice-Bed") , randomize("input-Bed")
    ,
    "feedback"
    ,
    "send"
    ,
    "confirmation"
)

// This will contain the list of animal names and kinds
let animals = [];
// This will contain the list of adjectives for the items
let adjectives = {}; // Nonce adjectives will be randomly shuffled

PennController.Template( 
  PennController.GetTable("wheels").filter( row=>{      // Using filter to probe the table
    if (animals.length<4)
        animals.push( {kind:row.Animal,name:row.Name} );// Fill animals using 4 first rows (there are 4 animals, one per row)
    if (!adjectives.hasOwnProperty(row.Item)){         // Creating an entry for the current adjectives only if not there yet
        let arrayAdj = ['MinAdj', 'MidAdj', 'MaxAdj'];
        if (row.Nonce=="Yes")
            fisherYates(arrayAdj);                      // Shuffle the array if nonce adjectives
        adjectives[row.Item] = {
            MinAdj: arrayAdj[0],
            MidAdj: arrayAdj[1],
            MaxAdj: arrayAdj[2]
        }
    }
    return true;
  })
  ,
  null                                                  // We are not really creating trials here, just probing the table
)