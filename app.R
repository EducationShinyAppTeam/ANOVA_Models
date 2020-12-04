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
        tags$a(target = "_blank", icon("comments"),
               href = "https://pennstate.qualtrics.com/jfe/form/SV_7TLIkFtJEJ7fEPz?appName=ANOVA_Models"
        )
      ),
      tags$li(class = "dropdown",
              tags$a(href = "https://shinyapps.science.psu.edu/",
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
        menuItem("Crossed ANOVA", tabName = "crossed", icon = icon("wpexplorer")),
        menuItem("Nested ANOVA", tabName = "nested", icon = icon("wpexplorer")),
        menuItem("References", tabName = "References", icon = icon("leanpub"))
      ),
      tags$div(
        class = "sidebar-logo",
        boastUtils::psu_eberly_logo("reversed")
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
              inputId = "go",
              label = "GO!",
              icon = icon("bolt"),
              size = "large"
            )
          ),
          br(),
          h2("Acknowledgements"),
          p("This application was developed and programmed by Angela Ting. This
            application was modified by Zhiruo Wang and Xuefei Wang."),
          br(),
          br(),
          br(),
          div(class = "updated", "Last Update: 08/05/2020 by XW.")
        ),
        ### Crossed ANOVA Page ----
        tabItem(
          tabName = "crossed",
          includeHTML("www/crossed_anova.html")
        ),
        ### Nested ANOVA Page ----
        tabItem(
          tabName = "nested",
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
          )
        )
      ) # end of TabItems()
    ) # end of DashboardBody()
  ) # end of DashboardPage()
)

# Define the server ----
server <- function(input, output, session) {

  # move from Overview to Crossed ANOVA tab
  observeEvent(input$go, {
    updateTabItems(
      session = session,
      inputId = "pages",
      selected = "crossed"
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