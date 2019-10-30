library(dplyr)

read.pcibex <- function(filepath, auto.colnames=TRUE, fun.col=function(col,cols){cols[cols==col]<-paste(col,"Ibex",sep=".");return(cols)}) {
  n.cols <- max(count.fields(filepath,sep=",",quote=NULL),na.rm=TRUE)
  if (auto.colnames){
    cols <- c()
    con <- file(filepath, "r")
    while ( TRUE ) {
      line <- readLines(con, n = 1, warn=FALSE)
      if ( length(line) == 0) {
        break
      }
      m <- regmatches(line,regexec("^# (\\d+)\\. (.+)\\.$",line))[[1]]
      if (length(m) == 3) {
        index <- as.numeric(m[2])
        value <- m[3]
        if (index < length(cols)){
          cols <- c()
        }
        if (is.function(fun.col)){
          cols <- fun.col(value,cols)
        }
        cols[index] <- value
        if (index == n.cols){
          break
        }
      }
    }
    close(con)
    return(read.csv(filepath, comment.char="#", header=FALSE, col.names=cols))
  }
  else{
    return(read.csv(filepath, comment.char="#", header=FALSE, col.names=seq(1:n.cols)))
  }
}

df.all <- read.pcibex("results.csv")

df.all$EventTime <- as.numeric(as.character(df.all$EventTime))

df.all %>% group_by(id) %>% summarise(duration = (max(EventTime, na.rm=TRUE) - min(EventTime, na.rm=TRUE))/60000)
# 1 5bf003ccaf38d100016bb945    17.4 
# 2 5c866503de8ae1001703d8d4     5.27
# 3 5cb5941ba7dfd50001759040    10.5 
# 4 5d3070c232a2aa0016cd8175    12.7 

df.trials <- subset(df.all, grepl("input|practice", Type) & PennElementType%in%c("Scale","Var"))

# Forgot to log Dimension, adding it based on Item number:
dim.temp <- data.frame(Item.number=c(4:7,27:28), Dimension="Temperature")
dim.light <- data.frame(Item.number=c(8:11,29:30), Dimension="Light")
dim.sound <- data.frame(Item.number=c(12:15,31:32), Dimension="Sound")
dim.angle <- data.frame(Item.number=c(16:19,33:34), Dimension="Angle")
df.dim <- rbind(dim.temp,dim.light,dim.sound,dim.angle)
df.trials <- merge(df.trials,df.dim)


df.input.byptpt.bycdtn.timecourse <- df.trials %>% 
  filter(grepl("input", Type) & PennElementType=="Scale") %>%
  group_by(id, Dimension, Form, Force) %>%
  select(id,EventTime,Value,Dimension,Form,Force,Tested,Level) %>%
  arrange(EventTime)

df.input.byptpt.bycdtn.max <- df.input.byptpt.bycdtn.timecourse %>% filter(EventTime == max(EventTime))

# Making Value a number
results.increase <- df.input.byptpt.bycdtn.max %>% 
  summarize(Increase = as.numeric(as.character(Value)) > Level, Tested=Tested) %>%
  group_by(Dimension, Form, Force) %>%
  summarise( NIncrease=sum(Increase) , N = length(Increase) )

View(results.increase)
