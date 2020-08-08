
//Servidor
const express = require('express')
const server = express()
const {pageLanding,pageStudy,pageGiveclasses,saveClasses} =require('./pages')

//conf nunjucks (template engine)
const nunjucks = require('nunjucks')
nunjucks.configure('src/views',{
    express:server,
    noCache: true,
})
//Inicio e configuração do servidor
server
//receber os dados do req.body
.use(express.urlencoded({extended: true}))
//conf arquivos staticos
    .use(express.static("public"))
    //rotas
    .get("/", (pageLanding))
    .get("/study", (pageStudy))
    .get("/give-classes", (pageGiveclasses))
    .post("/save-classes", saveClasses )
    //start do servidor
    .listen(5500)
