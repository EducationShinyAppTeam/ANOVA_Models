library(shiny)
library(shinydashboard)
library(shinyjs)
library(shinyDND)
library(shinyWidgets)

shinyServer(function(input, output, session) {

  #move from Overview to Crossed ANOVA tab
  observeEvent(input$go, {
    updateTabItems(session, "tabs", "crossed")
  })
  observeEvent(input$info1,{
    sendSweetAlert(
      session = session,
      title = "Instructions:",
      text = "•	Click on a term to view its interpretation.\n
      •	Identify the model components requested to build the model.",
      type = "info"
    )
  })
  observeEvent(input$info2,{
    sendSweetAlert(
      session = session,
      title = "Instructions:",
      text = "•	Click on a term to view its interpretation.\n
      •	Identify the model components requested to build the model.",
      type = "info"
    )
  })
  
})


