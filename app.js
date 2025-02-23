const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");
const session = require("express-session");
require("dotenv").config();//.env dosyası için


const app = express();

//Session için
app.use(session({
    secret: "gizlilik23",
    resave: false,
    saveUninitialized: true
}));
//session mesajlarını erişelebilir hale getirmek için
app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});


//Middlewareler
app.use(express.static(path.join(__dirname, 'public')));//CSS VE STATIC DOSYALAR İÇİN
app.use(bodyParser.urlencoded({ extended: true }));//FORM VERİLERİNİ ALMAK İÇİN

//ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//********************************************************
//ROTALAR

//Ana Sayfa
app.get("/", (req, res) => {
    res.render("index");
});

//Hakkımda
app.get("/about", (req, res) => {
    res.render("about");
});

//Projeler
app.get("/projects", (req, res) => {
    res.render("projects");

})

//Proje1 Detay
app.get("/project1-details", (req, res) => {
    res.render("project1-details");
})

//******************************************************
//İletişim
app.get("/contact", (req, res) => {
    res.render("contact");

});

app.post("/contact", async (req, res) => {
    const adSoyad = req.body.name;
    const email = req.body.email;
    const mesaj = req.body.message;

    //nodemailer
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        secureConnection: false,
        port: 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOption = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: "Batuhan Çolak-İletişim Formu",
        text: `Gelen Eposta Adresi:${email} \n ${adSoyad} Kişisinden Gelen Mesaj : ${mesaj}
        Kullanıcı Bilgileri \n
        Ad Soyad:${adSoyad}
        Email:${email}`
    }

    try {
        await transporter.sendMail(mailOption);
        req.session.message = { text: "Mesajınız Başarılı Bir Şekilde Gönderildi!", class: "success" }
        res.redirect("/contact");

    } catch (error) {
        req.session.message = { text: "Mesajınız Gönderilemedi Lütfen Daha Sonra Tekrar Deneyin...", class: "danger" }
        console.log(error);
    }


});

//********************************************************
//SUNUCU
const appPort = 3000;
app.listen(appPort, (err) => {
    console.log(`Sunucu ${appPort} Portunda Çalışıyor`);
});