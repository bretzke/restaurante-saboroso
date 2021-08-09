var conn = require('./../inc/db');
var express = require('express');
var router = express.Router();
var users = require('./../inc/users');
var admin = require('./../inc/admin');
var menus = require('./../inc/menus');
var contacts = require('./../inc/contacts');
var emails = require('./../inc/emails');
var reservations = require('./../inc/reservations');

module.exports = function(io) {

    var moment = require('moment');
    moment.locale('pt-br');

    // cria um middleware para verificar se o usuário está autenticado
    router.use(function(req, res, next) {
        if(['/login'].indexOf(req.url) == -1 && !req.session.user) {
            res.redirect("/admin/login");
        } else {
            next();
        }
    });

    // Cria um middleware para incluir os menus dinâmicos em todas as rotas
    router.use(function(req, res, next) {
        req.menus = admin.getMenus(req);
        next();
    });

    router.get("/logout", function(req, res, next) {
        delete req.session.user;
        res.redirect("/admin/login")
    })

    router.get("/", function(req, res, next) {
        admin.dashboard().then(data => {
            res.render("admin/index", admin.getParams(req, {
                data
            }));
        }).catch(err => {
            console.error(err);
        });
    });

    router.get("/dashboard", function(req, res, next) {
        admin.dashboard().then(data => {
            res.send(data);
        }).catch(err => {
            res.send(err);
        });
    });

    router.get("/login", function(req, res, next) {
        users.render(req, res);
    });

    router.post("/login", function(req, res, next) {
        if(!req.body.email) {
            users.render(req, res, "Preencha o campo e-mail.");
        } else if(!req.body.password) {
            users.render(req, res, "Preencha o campo senha.");
        } else {
            users.login(req.body.email, req.body.password).then(user => {
                // cria a session guardando o user
                req.session.user = user;
                res.redirect("/admin");
            }).catch(err => {
                users.render(req, res, err.message || err); // se não for o objeto error será uma string
            });
        }
    });

    router.get("/contacts", function(req, res, next) {
        contacts.getContacts().then(data => {
            res.render("admin/contacts", admin.getParams(req, {
                data
            }));
        });
    });

    router.delete("/contacts/:id", function(req, res, next) {
        contacts.delete(req.params.id).then(results => {
            io.emit('dashboard update');
            res.send(results);
        }).catch(err => {
            res.send(err);
        });
    });

    router.get("/emails", function(req, res, next) {
        emails.getEmails().then(data => {
            res.render("admin/emails", admin.getParams(req, {
                data
            }));
        });
    });

    router.delete("/emails/:id", function(req, res, next) {
        emails.delete(req.params.id).then(results => {
            io.emit('dashboard update');
            res.send(results);
        }).catch(err => {
            res.send(err);
        });
    });

    router.get("/menus", function(req, res, next) {
        // pega o menu de cardápio
        menus.getMenus().then(data => {
            res.render("admin/menus", admin.getParams(req, {
                data
            }));
        });
    });

    router.post("/menus", function(req, res, next) {
        menus.save(req.fields, req.files).then(results => {
            io.emit('dashboard update');
            res.send(results);
        }).catch(err => {
            res.send(err);
        })
    });

    router.delete("/menus/:id", function(req, res, next) {
        //req.params.id = :id
        menus.delete(req.params.id).then(results => {
            io.emit('dashboard update');
            res.send(results);
        }).catch(err => {
            res.send(err);
        })
    });

    router.get("/reservations", function(req, res, next) {
        let start = (req.query.start) ? req.query.start : moment().subtract(1, "year").format("YYYY-MM-DD");
        let end = (req.query.end) ? req.query.end : moment().subtract().format("YYYY-MM-DD");

        reservations.getReservations(req).then(pag => {
            res.render("admin/reservations", admin.getParams(req, {
                date: {
                    start,
                    end
                },
                data: pag.data,
                moment,
                links: pag.links
            }));
        });
    });

    router.get("/reservations/chart", function(req, res, next) {
        req.query.start = (req.query.start) ? req.query.start : moment().subtract(1, "year").format("YYYY-MM-DD");
        req.query.end = (req.query.end) ? req.query.end : moment().subtract().format("YYYY-MM-DD");

        reservations.chart(req).then(chartData => {
            res.send(chartData);
        });
    })

    router.post("/reservations", function(req, res, next) {
        reservations.save(req.fields, req.files).then(results => {
            io.emit('dashboard update');
            res.send(results);
        }).catch(err => {
            res.send(err);
        })
    });

    router.delete("/reservations/:id", function(req, res, next) {
        //req.params.id = :id
        reservations.delete(req.params.id).then(results => {
            io.emit('dashboard update');
            res.send(results);
        }).catch(err => {
            res.send(err);
        })
    });

    router.get("/users", function(req, res, next) {
        users.getUsers().then(data => {
            res.render("admin/users", admin.getParams(req, {
                data
            }));
        });
    });

    router.post("/users", function(req, res, next) {
        users.save(req.fields).then(results => {
            io.emit('dashboard update');
            res.send(results);
        }).catch(err => {
            res.send(err);
        });
    });

    router.post("/users/password-change", function(req, res, next) {
        users.changePassword(req).then(results => {
            res.send(results);
        }).catch(err => {
            res.send({
                error: err
            });
        });
    });

    router.delete("/users/:id", function(req, res, next) {
        users.delete(req.params.id).then(results => {
            io.emit('dashboard update');
            res.send(results);
        }).catch(err => {
            res.send(err);
        });
    });

    return router;
}