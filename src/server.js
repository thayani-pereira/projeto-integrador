//Dados
const proffys = [
    {
        name: "Diego Fernandes",
        avatar: "https://avatars2.githubusercontent.com/u/2254731?s=460&amp;u=0ba16a79456c2f250e7579cb388fa18c5c2d7d65&amp;v=4",
        whatssap: "999999999",
        bio: "Entusiasta das melhores tecnologias de química avançada.Apaixonado por explodir coisas em laboratório e por mudar a vida das pessoas através de experiências. Mais de 200.000 pessoas já passaram por uma das minhas explosões.",
        subject: "Química",
        cost: "20",
        weekday: [0],
        time_from: [720],
        time_to: [1220]
    },
    {
        name: "Thayani Pereira",
        avatar: "https://avatars2.githubusercontent.com/u/2254731?s=460&amp;u=0ba16a79456c2f250e7579cb388fa18c5c2d7d65&amp;v=4",
        whatssap: "999999999",
        bio: "Entusiasta das melhores tecnologias de química avançada.Apaixonado por explodir coisas em laboratório e por mudar a vida das pessoas através de experiências. Mais de 200.000 pessoas já passaram por uma das minhas explosões.",
        subject: "Geografia",
        cost: "20",
        weekday: [1],
        time_from: [720],
        time_to: [1220]
    }    
]
const subjects = [
        "Artes",      
        "Biologia",
        "Educação física",
        "Física",
        "Geografia",
        "História",
        "Matemática",
        "Português",
        "Química",    
]
const weekdays = [
    "Domingo",      
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
       
]
//Funcionalidades
function getSubject(subjectNumber){
    const arrayPosition = +subjectNumber -1
    return subjects[arrayPosition]
}


function pageLanding(req, res) {
    return res.render("index.html")
}
function pageStudy(req, res) {
    const filters = req.query
    return res.render("study.html",{proffys,filters,subjects,weekdays})
}
function pageGiveclasses(req, res) {
    const data = req.query
    //se tiver dados(data)
    const isNotEmpty = Object.keys(data).length > 0
      //Tem dados?
    if (isNotEmpty) {
        data.subject = getSubject(data.subject)
        //adicionar dados a lista de profs
        proffys.push(data)
        return res.redirect("/study")
    }

    //adicionar dados a lista de profs
   
    return res.render("give-classes.html" ,{proffys,subjects,weekdays})
}
//Servidor
const express = require('express')
const server = express()

//conf nunjucks (template engine)
const nunjucks = require('nunjucks')
nunjucks.configure('src/views',{
    express:server,
    noCache: true,
})
//Inicio e configuração do servidor
server
//conf arquivos staticos
    .use(express.static("public"))
    //rotas
    .get("/", (pageLanding))
    .get("/study", (pageStudy))
    .get("/give-classes", (pageGiveclasses))
    //start do servidor
    .listen(5500)
