library(shiny)
library(shinydashboard)
library(shinyWidgets)

shinyServer(function(input, output, session) {

  # move from Overview to Crossed ANOVA tab
  observeEvent(input$go, {
    updateTabItems(session, "tabs", "crossed")
  })
  
  # Information button
  observeEvent(input$info,{
    sendSweetAlert(
      session = session,
      title = "Instructions:",
      text = "First, click on a term to view its interpretation. Then, identify 
      the model components requested to build the model."
    )
  })
})


