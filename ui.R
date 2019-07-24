library(shiny)
library(shinydashboard)
library(shinyjs)
library(shinyDND)
library(shinyWidgets)

shinyUI(fluidPage(
  
  dashboardPage(skin = "black",
  
                      dashboardHeader(title = "ANOVA",
                                      tags$li(class = "dropdown", tags$a(href='https://shinyapps.science.psu.edu/',icon("home"))),
                                      tags$li(class = "dropdown", actionLink("info",icon("info",class="myClass")))
                                      ),

                      dashboardSidebar(sidebarMenu(id = "tabs",
                                                   menuItem("Overview", tabName = "overview", icon = icon("dashboard")),
                                                   menuItem("Crossed ANOVA", tabName = "crossed", icon = icon("gamepad")),
                                                   menuItem("Nested ANOVA", tabName = "nested", icon = icon("gamepad"))
                                       )),

                      dashboardBody(
                        
                        #change navbar to purple
                        #set background color of all pages to white
                        #white font with purple background
                        #logo hover to grayish purple when hovered
                        #collapse icon to grayish purple when hovered
                        tags$style(HTML('.main-header .logo { font-family: "Times New Roman", Times, serif; 
                                        font-weight: bold;
                                        font-size: 30px;
                                        color: white;}')),
                        tags$style(".fa-home {color:#FFFFFF}"),
                        tags$style(".fa-info {color:#FFFFFF}"),
                        #tags$style(type = "text/css", ".content-wrapper,.right-side {background-color: white;}"),
                        tags$head(
                          tags$link(rel = "stylesheet", type = "text/css", href = "Feature.css"),
                          tags$style(HTML('#go{color:white;background-color: #BB8FCE}')),
                          
                          tags$style(HTML('
                                                  .skin-black .main-header>.navbar {
                                                  background-color: #BB8FCE  ;
                                                  }
                                                  
                                                  .content-wrapper,.right-side {
                                                  background-color: white;
                                                  }
                                                  
                                                  .skin-black .main-header .logo {
                                                  background-color: #BB8FCE  ;
                                                  color: white;
                                                  }
                                                  .skin-black .main-header .logo:hover {
                                                  background-color: #A27EB0;
                                                  }
                                                  .skin-black .main-header .navbar .sidebar-toggle:hover{
                                                  background-color: #A27EB0;
                                                  }
  
                                                  .skin-black .main-header .navbar>.sidebar-toggle{
                                                  color: white;
                                                  }
                                                  .skin-black .main-header .navbar>.sidebar-toggle:hover{
                                                  color: white;
                                                  }
                                                  
                                                  # aside.main-sidebar {
                                                  # 	background-color: #CACACA !important;
                                                  #   color: white;
                                                  # }
                                                  '))),
                        tags$script(HTML(
                          '
                          // DEFAULT SETTINGS SHOULD BE IN THE JAVASCRIPT FILES THEMSELVES
                          
                          document.querySelector(".skin-black .main-header .navbar>.sidebar-toggle").addEventListener("click", collapse);
                          function collapse(){
                            if (!document.getElementsByTagName("body")[0].classList.contains("sidebar-collapse")){
                              // Crossed
                              document.getElementById("diagramFeedback_c").style.marginLeft = "13vw";
                              document.getElementById("submitDiv_c").style.marginLeft = "13vw";
                              document.getElementById("finalBtnDiv_c").style.marginLeft = "13vw";
                              document.getElementById("finalModel_c").style.marginLeft = "22vw";
                              document.getElementById("playAgainDiv_c").style.marginLeft = "13vw";
                              
                              // Nested
                              document.getElementById("diagramFeedback").style.marginLeft = "6.5vw";
                              document.getElementById("submitDiv").style.marginLeft = "0vw";
                              document.getElementById("finalBtnDiv").style.marginLeft = "0vw";
                              document.getElementById("finalModel").style.marginLeft = "15vw";
                              document.getElementById("playAgainDiv").style.marginLeft = "0vw";
                              
                              //console.log("no sidebar")
                            }
                            else{
                              // Crossed
                              document.getElementById("diagramFeedback_c").style.marginLeft = "1vw";
                              document.getElementById("submitDiv_c").style.marginLeft = "8vw";
                              document.getElementById("finalBtnDiv_c").style.marginLeft = "8vw";
                              document.getElementById("finalModel_c").style.marginLeft = "11vw";
                              document.getElementById("playAgainDiv_c").style.marginLeft = "8vw";
                              
                              // Nested
                              document.getElementById("diagramFeedback").style.marginLeft = "-2.5vw";
                              document.getElementById("submitDiv").style.marginLeft = "0vw";
                              document.getElementById("finalBtnDiv").style.marginLeft = "0vw";
                              document.getElementById("finalModel").style.marginLeft = "6vw";
                              document.getElementById("playAgainDiv").style.marginLeft = "0vw";
                              
                              //console.log("sidebar")
                            }
                          }'
                        )),
                        
                        
                        
                        tabItems(
                          
                          #Overview Page
                          tabItem(tabName = "overview",
                                  
                                  fluidRow(column(width = 12,
                                                  tags$a(href='http://stat.psu.edu/',tags$img(src='PS-HOR-RGB-2C.png', align = "left", width = 180)),
                                                  br(),br(),br(),
                                                  h3(strong("About:")),
                                                  h4("When designing ANOVA models, a crossed design is used when every possible combination of the levels of different factors are applied to experimental units.
                                                  A nested design is used when each level of one factor can only be combined with one level of another factor.
                                                  This app demonstrates the differences between creating model designs for crossed and nested ANOVAs."
                                                  ),
                                                  br(),
                                                  h3(strong("Instructions:")),
                                                  h4("For both crossed and nested ANOVA model designs, observe the model equations, follow the steps given, and then use them to complete their respective diagrams."),
                                                  br(),
                                                  div(style = "text-align: center",
                                                      actionButton("go", "G O !", icon = icon("bolt"), class = "circle grow")),
                                                  h3(strong("Acknowledgements:")),
                                                  h4("This application was developed and programmed by Angela Ting."),
                                                  h4("This application was modified by Zhiruo Wang.")
                                  ))
                          ),

                          #Nested ANOVA Page
                          tabItem(tabName = "crossed",
                                  # div(style="display: inline-block;vertical-align:top;",
                                  #     tags$a(href='https://shinyapps.science.psu.edu/',tags$img(src='homebut.PNG', width = 19))
                                  # ),
                                  # div(style="display: inline-block;vertical-align:top;",
                                  #     circleButton("info1",icon = icon("info"), status = "myClass",size = "xs")
                                  # ),
                                  includeHTML("www/crossed_anova.html")

                          ),

                          tabItem(tabName = "nested",
                                  # div(style="display: inline-block;vertical-align:top;",
                                  #     tags$a(href='https://shinyapps.science.psu.edu/',tags$img(src='homebut.PNG', width = 19))
                                  # ),
                                  # div(style="display: inline-block;vertical-align:top;",
                                  #     circleButton("info2",icon = icon("info"), status = "myClass",size = "xs")
                                  # ),
                                  includeHTML("www/nested_anova.html")
                          )


                        ) #end of TabItems()

                      ) #end of DashboardBody()
)))
