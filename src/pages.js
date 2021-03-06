const Database = require('./database/db')
const { subjects, weekdays, getSubject, conterHoursToMinutes } = require('./utils/format')
const { compile } = require('nunjucks')


function pageLanding(req, res) {
    return res.render("index.html")
}
async function pageStudy(req, res) {
    const filters = req.query

    if (!filters.subject || !filters.weekday || !filters.time) {
        return res.render("aluno/aulas.html", { filters, subjects, weekdays })
    }
    //horas em minutos


    const timeToMinutes = conterHoursToMinutes(filters.time)

    const query = `
    SELECT classes.*,proffys.*
    FROM proffys
    JOIN classes ON (classes.proffy_id = proffys.id)
    WHERE EXISTS(
        SELECT  class_schedule.*
        FROM class_schedule
        WHERE class_schedule.class_id = classes.id
        AND class_schedule.weekday = ${filters.weekday}
        AND class_schedule.time_from <= ${timeToMinutes}
        AND class_schedule.time_to > ${timeToMinutes}

    )
    AND classes.subject = '${filters.subject}'
`
    //caso haja erro na hora da consulta do banco
    try {
        const db = await Database
        const proffys = await db.all(query)

        proffys.map((proffy) => {

            proffy.subject = subjects[proffy.subject - 1]
        })

        return res.render('aluno/aulas.html', { proffys, filters, subjects, weekdays })

    } catch (error) {
        console.log(error)
    }
}

async function pageGiveclasses(req, res) {
    return res.render("professor/aulas.html", { subjects, weekdays })
}

async function saveClasses(req, res) {
    const createProffy = require('./database/createProffys')
    const proffyValue = {
        name: req.body.name,
        avatar: req.body.avatar,
        whatsapp: req.body.whatsapp,
        bio: req.body.bio

    }
    const classValue = {
        subject: req.body.subject,
        cost: req.body.cost

    }
    console.log(req.body.time_to)
    const classScheduleValues = req.body.weekday.map((weekday, index) => {
        return {
            weekday,
            time_from: conterHoursToMinutes(req.body.time_from[index]),
            time_to: conterHoursToMinutes(req.body.time_to[index]),
        }
    })
    try {
        const db = await Database
        await createProffy(db, { proffyValue, classValue, classScheduleValues })

        let queryString = "?subject=" + req.body.subject
        queryString += "&weekday=" + req.body.weekday[0]
        queryString += "&time=" + req.body.time_from[0]

        return res.redirect("/aluno/aulas" + queryString)
    } catch (error) {
        console.log(error)
    }
}

async function paginaLoginEstudante(req, res) {
    const titulo = 'Área do Estudante';
    const logar = '/aluno/aulas';
    const cadastrar = '/aluno/cadastro';
    return res.render('login/login.html', { titulo, logar, cadastrar })
}

async function paginaCadastrarEstudante(req, res) {
    return res.render('aluno/cadastro.html', { subjects, weekdays })
}

async function logarEstudante(req, res) {
    return res.redirect("/aluno/aulas")
}

async function paginaLoginProfessor(req, res) {
    const titulo = 'Área do Professor';
    const logar = '/professor/aulas';
    const cadastrar = '/professor/cadastrar';
    return res.render('login/login.html', { titulo, logar, cadastrar })
}

async function logarProfessor(req, res) {
    return res.redirect("/professor/aulas")
}

async function paginaCadastrarProfessor(req, res) {
    return res.render('professor/cadastro.html', {})
}

async function paginaEsqueciMinhaSenha(req, res) {
    return res.render('login/esqueci-minha-senha.html', {})
}


module.exports = {
    pageLanding,
    pageStudy,
    pageGiveclasses,
    saveClasses,

    paginaLoginEstudante,
    paginaCadastrarEstudante,
    logarEstudante,

    paginaLoginProfessor,
    logarProfessor,
    paginaCadastrarProfessor,

    paginaEsqueciMinhaSenha
}