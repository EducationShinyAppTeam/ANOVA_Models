# Load packages ----
library(shiny)
library(shinydashboard)
library(shinyBS)
library(boastUtils)
library(shinyWidgets)

# App Meta Data----------------------------------------------------------------
APP_TITLE  <<- "ANOVA Models"
APP_DESCP  <<- paste(
  "This is the app contains some ANOVA models that you can test yourself.
  This app demonstrates the differences between creating model designs for
  crossed and nested ANOVAs."
)
# End App Meta Data------------------------------------------------------------

# Load data, define global constants and functions ----

# Define the UI ----
ui <- list(
  dashboardPage(
    skin = "black",
    ## Header ----
    dashboardHeader(
      title = "ANOVA Models",
      titleWidth = 250,
      tags$li(class = "dropdown", actionLink("info", icon("info"))),
      tags$li(
        class = "dropdown",
        boastUtils::surveyLink(name = "ANOVA_Models")
      ),
      tags$li(
        class = "dropdown",
        tags$a(href = 'https://shinyapps.science.psu.edu/',
               icon("home")
        )
      )
    ),
    ## Sidebar ----
    dashboardSidebar(
      width = 250,
      sidebarMenu(
        id = "pages",
        menuItem("Overview", tabName = "overview", icon = icon("tachometer-alt")),
        menuItem("Prerequisites", tabName = "prereq", icon = icon("book")),
        menuItem("Crossed ANOVA", tabName = "crossed", icon = icon("wpexplorer")),
        menuItem("Nested ANOVA", tabName = "nested", icon = icon("wpexplorer")),
        menuItem("References", tabName = "References", icon = icon("leanpub"))
      ),
      tags$div(
        class = "sidebar-logo",
        boastUtils::sidebarFooter()
      )
    ),
    ## Body ----
    dashboardBody(
      ### Overview Page ----
      tabItems(
        tabItem(
          tabName = "overview",
          h1("ANOVA Models"),
          p("When designing ANOVA models, a crossed design is used when every
            possible combination of the levels of different factors are applied to
            experimental units. A nested design is used when each level of one factor
            can only be combined with one level of another factor. This app
            demonstrates the differences between creating model designs for crossed
            and nested ANOVAs."),
          br(),
          h2("Instructions"),
          p("For both crossed and nested ANOVA model designs, observe the model
             equations, follow the steps given, and then use them to complete their
             respective diagrams."),
          div(
            style = "text-align: center;",
            bsButton(
              inputId = "start",
              label = "GO!",
              icon = icon("bolt"),
              size = "large"
            )
          ),
          br(),
          h2("Acknowledgements"),
          p("This application was developed and programmed by Angela Ting. This
            application was modified by Zhiruo Wang and Xuefei Wang. This app was
            updated by Shravani Samala and Wanyi Su."),
          br(),
          br(),
          br(),
          div(class = "updated", "Last Update: 06/07/2022 by WS.")
        ),
        ### Prerequisite page
        tabItem(
          tabName = "prereq",
          h1("Introduction to ANOVA"),
          tags$ul(tags$li("The analysis of variance (ANOVA) is a statistical 
                          method that divides a data set's observed aggregate 
                          variability into two parts: systematic components and 
                          random factors. Random factors have no statistical 
                          impact on the supplied data set, whereas systematic 
                          influences do. In a regression research, analysts 
                          employ the ANOVA test to examine the impact of 
                          independent factors on the dependent variable."),
            tags$li("Main effect: The effect of an independent variable
                          on a dependent variable."),
            tags$li("Replication: The number of random independent replicates 
                    used to generate the unmeasured variance that is used to 
                    calibrate the significance of effects in an ANOVA model."),
            tags$li("Nested effect: Two similar factors but not identical, and 
                    one nested in another.")),
          br(),
          h2("Crossed ANOVA"),
          tags$ul(tags$li("There are two main effects in crossed ANOVA model."),
                  tags$li("There are interactions betwen two main effects.")
                  ),
          br(),
          h2("Nested ANOVA"),
          tags$ul(tags$li("There are only one main effect in nested ANOVA model."),
                  tags$li("There are not interactions."),
                  tags$li("There are nested effects in nested ANOVA model.")),
          br(),
          br(),
          div(style = "text-align: center",bsButton(inputId = "go", 
                                                    label = "Explore", 
                                                    icon("bolt"), 
                                                    size = "large", class = "circle grow")
          )
        ),
        ### Crossed ANOVA Page ----
        tabItem(
          tabName = "crossed",
          h2("Crossed ANOVA Model"), 
          br(), 
          includeHTML("www/crossed_anova.html")
        ),
        ### Nested ANOVA Page ----
        tabItem(
          tabName = "nested",
          h2("Nested ANOVA Model"), 
          br(), 
          includeHTML("www/nested_anova.html")
        ),
        ### References Page ----
        tabItem(
          tabName = "References",
          withMathJax(),
          h2("References"),
          p(
            class = "hangingindent",
            "Carey, R. (2019). boastUtils: BOAST Utilities, R Package.
            Available from https://github.com/EducationShinyAppTeam/boastUtils"
          ),
          p(
            class = "hangingindent",
            "Chang, W. and Borges Ribeio, B. (2018). shinydashboard: Create
            dashboards with 'Shiny', R Package. Available from
            https://CRAN.R-project.org/package=shinydashboard"
          ),
          p(
            class = "hangingindent",
            "Chang, W., Cheng, J., Allaire, J., Xie, Y., and McPherson, J.
            (2019). shiny: Web application framework for R, R Package.
            Available from https://CRAN.R-project.org/package=shiny"
          ),
          p(
            class = "hangingindent",
            "Perrier, V., Meyer, F., Granjon, D. (2020). shinyWidgets:
            Custom Inputs Widgets for Shiny, R Package. Available from
            https://CRAN.R-project.org/package=shinyWidgets"
          ),
          p(
            class = "hangingindent",
            "Replication. (2022). Southampton UK. Available from
            https://www.southampton.ac.uk/~cpd/anovas/datasets/Replication.htm"
          ),
          p(
            class = "hangingindent",
            "What are factors, crossed factors, and nested factors? Minitab. (2022). 
            Available from https://support.minitab.com/en-us/minitab/18/help-and-
            how-to/modeling-statistics/anova/supporting-topics/anova-models/what
            -are-crossed-and-nested-factors/ "
          ),
          p(
            class = "hangingindent",
            "Will. K., Toby, W., and Timothy, L. (2022). Analysis of Variance 
            (ANOVA). Available from https://www.investopedia.com/terms/a/anova.asp"
          ),
          p(
            class = "hangingindent",
            "Wikimedia Foundation. (2022). Main effect. Wikipedia.
            Available from https://en.wikipedia.org/wiki/Main_effect"
          ),
          br(),
          br(),
          br(),
          boastUtils::copyrightInfo()
        )
      ) # end of TabItems()
    ) # end of DashboardBody()
  ) # end of DashboardPage()
)

# Define the server ----
server <- function(input, output, session) {

  # move from Overview to Prereq
  observeEvent(input$go, {
    updateTabItems(
      session = session,
      inputId = "pages",
      selected = "crossed"
    )
  })
  
  # move from Prereq to Crossed ANOVA
  observeEvent(input$start, {
    updateTabItems(
      session = session,
      inputId = "pages",
      selected = "prereq"
    )
  })

  # Information button
  observeEvent(input$info, {
    sendSweetAlert(
      session = session,
      title = "Instructions",
      text = "First, click on a term to view its interpretation. Then, identify
      the model components requested to build the model."
    )
  })
}

# Boast app call ----
boastUtils::boastApp(ui = ui, server= server)