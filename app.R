# Load packages ----
library(shiny)
library(shinydashboard)
library(shinyBS)
library(boastUtils)
library(shinyWidgets)


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
          p("This app demonstrates the differences between creating model designs 
            for crossed and nested ANOVAs."),
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
            updated by Shravani Samala and Wanyi Su. Special thanks to Dennis, k Pearl."),
          br(),
          br(),
          "Cite this app as:",
          br(),
          citeApp(),
          br(),
          br(),
          div(class = "updated", "Last Update: 07/13/2022 by WS.")
        ),
        ### Prerequisite page ----
        tabItem(
          tabName = "prereq",
          h2("Introduction to ANOVA"),
          tags$ul(
            tags$li("ANOVA refers to a family of statistical techniques that 
                    assess potential differences in a quantitative response given 
                    the level(s) of one or more categorical factors. This is done 
                    by looking at how the total variability in the measurements 
                    is divided into the systematic variation caused by differences
                    between the groupings and the random variation within groups."),
            tags$li("A", strong("crossed design"), "is used when every possible 
                    combination of the levels of different factors are applied to 
                    the experimental units. For example, if a drug is to be tested 
                    in cells at three different temperatures (low, medium, or high) 
                    in two diff doses (low and high) with five replicates then 
                    all of the 3 x 2 = 6 treatment combinations would be replicated 
                    5 times giving you 30 observations to study."),
            tags$li("A", strong("nested design"), "is used when each level of one 
                    factor can only be combined with one level of another factor. 
                    For example, if a new teaching method is to be tested by three 
                    different teachers at each of five different schools when the 
                    students in their classrooms are randomly assigned to a treatment
                    and a control assignment.  Then the teachers are nested within
                    the school (since a particular teacher would only work at one 
                    specific school)."),
            tags$li("A", strong("main effect"), "is the average impact of a factor 
                    on the response across all conditions."),
            tags$li("An", strong("interaction"), "occurs when the impact of a factor 
                    depends on the level of another factor.")
          ),
          br(),
          div(
            style = "text-align: center;",
            bsButton(
              inputId = "go", 
              label = "Explore", 
              icon("bolt"), 
              size = "large"
            )
          )
        ),
        ### The explore pages are currently built using non-R methods including
        ### HTML, JS, and JSON. 
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
            "Bailey, E. (2022). shinyBS: Twitter bootstrap components for Shiny.
            (v. 0.61.1). [R package]. Available from
            https://CRAN.R-project.org/package=shinyBS"
          ),
          p(
            class = "hangingindent",
            "Carey, R. and Hatfield, N. (2022). boastUtils: BOAST utilities.
            (v. 0.1.12.4). [R package]. Available from
            https://github.com/EducationShinyAppTeam/boastUtils"
          ),
          p(
            class = "hangingindent",
            "Chang, W. and Borges Ribeio, B. (2021). shinydashboard: Create
            dashboards with 'Shiny'. (v. 0.7.2). [R package]. Available from
            https://CRAN.R-project.org/package=shinydashboard"
          ),
          p(
            class = "hangingindent",
            "Chang, W., Cheng, J., Allaire, J., Sievert, C., Schloerke, B.,
            Xie, Y., Allen, J., McPherson, J., Dipert, A., and Borges, B. (2021).
            shiny: Web application framework for R. (v. 1.7.1) [R package].
            Available from https://CRAN.R-project.org/package=shiny"
          ),
          p(
            class = "hangingindent",
            "Perrier, V., Meyer, F., Granjon, D. (2022). shinyWidgets:
            Custom inputs widgets for shiny. (v. 0.7.0). [R package]. Available
            from https://CRAN.R-project.org/package=shinyWidgets"
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
  observeEvent(
    eventExpr = input$go, 
    handlerExpr = {
      updateTabItems(
        session = session,
        inputId = "pages",
        selected = "crossed"
      )
    }
  )
  
  # move from Prereq to Crossed ANOVA
  observeEvent(
    eventExpr = input$start, 
    handlerExpr = {
      updateTabItems(
        session = session,
        inputId = "pages",
        selected = "prereq"
      )
    }
  )

  # Information button
  observeEvent(
    eventExpr = input$info, 
    handlerExpr = {
      sendSweetAlert(
        session = session,
        type = "info",
        title = "Instructions",
        text = "First, click on a term to view its interpretation. Then, identify
      the model components requested to build the model."
      )
    }
  )
}

# Boast app call ----
boastUtils::boastApp(ui = ui, server= server)