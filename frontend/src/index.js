// importing named exports we use brackets
import * as lib from './helpers.js';

// when importing 'default' exports, use below syntax
import API from './api.js';

const api  = new API();


(function() {
    'use strict';

    const local_host = "http://127.0.0.1:5000/"

    const pic_src = "data:image/png;base64,"



    //console.log(local_host)

    //console.log(btn_usr)

    btn_usr.addEventListener('click', toggle)

    a_lg_reg.addEventListener('click', switch_ctl)

    bnt_personal.addEventListener('click', lib.showPersonalPage)

    sidebar_profile.addEventListener('click', lib.showProfilePage)

    sidebar_Home.addEventListener('click', function (event) {
        location.reload()
    })

    sidebar_Personal.addEventListener('click', lib.showPersonalPage)

    bnt_lgout.addEventListener('click', function (e) {
        clearStatu()
        location.reload()
        bnt_lgout.style.display = "none"
    })

    logo.addEventListener('click', function (e) {
        location.reload()
    })


    var loStatu = loginStatu()

    console.log(loStatu)

    if(loStatu != null){

        var inf = JSON.parse(loStatu)
        user.value = inf.username
        pass.value = inf.password

        login()
    }





    function switch_ctl(e) {

        user.value = ''

        pass.value = ''


        if(e.target.innerText.toLocaleLowerCase() === "login"){

            na.style.display = ""
            email.style.display = ""

            btn_usr.value = "Register"
            e.target.innerText = "Register"



            var p =e.target.parentElement
            p.innerText = "Don't have an account? "
            p.appendChild(e.target)
        }else {
            na.value = ""
            email.value = ""
            na.style.display = "none"
            email.style.display = "none"

            btn_usr.value = "Login"
            e.target.innerText = "Login"
            var p =e.target.parentElement
            p.innerText = "Have an account? "
            p.appendChild(e.target)
        }


    }

    function toggle(e) {

        if(e.target.value.toLowerCase() === 'login') {

            login()
        }else {

            register()
        }
    }

    function login() {

        console.log('login')

        var format = {"username": user.value, "password": pass.value}

        var options = {
            method: "POST",
            headers: {
                "accept": "application/json",
                "content-type": "application/json"
            },
            body: JSON.stringify(format)
        }

        api.makeAPIRequestByOprion("auth/login", options)
            .then( msg => {

                if(msg.token) {

                    console.info(msg)

                    window.sessionStorage.setItem("token", msg.token)

                    var opts = {
                        method: "GET",
                        headers: {
                            "accept": "application/json",
                            "content-type": "application/json",
                            "Authorization":"Token: "+msg.token
                        }
                    }


                    api.makeAPIRequestByOprion("user/", opts)
                        .then(res => {
                            lib.createPersonalPanel(res, msg.token)
                            window.sessionStorage.setItem("person_detail", JSON.stringify(res))
                            div_usr.style.display = 'none'
                            sidebar.style.display = ''
                            bnt_lgout.style.display = ''
                            document.body.style.background = "url('')"
                            lib.showHomePage()
                            saveStatu()

                        })
                }else{
                    alert(msg.message)
                }

            })
    }

    function register() {

        var format = {"username": user.value, "password": pass.value, "email": email.value, "name": na.value}

        var options = {
            method: "POST",
            headers: {
                "accept": "application/json",
                "content-type": "application/json"
            },
            body: JSON.stringify(format)
        }

        api.makeAPIRequestByOprion("auth/signup", options)
            .then( msg => {
            location.reload()
        })
    }



    function saveStatu() {

        //var inf = JSON.parse(window.sessionStorage.getItem("person_detail"))

        var format = {
            username: user.value,
            password: pass.value
        }

        user.value = ''
        pass.value = ''

        document.cookie = JSON.stringify(format)

        console.log(document.cookie)

    }

    function clearStatu() {

        document.cookie = null

    }

    function loginStatu() {

        return document.cookie==null ? null : document.cookie

    }

}());