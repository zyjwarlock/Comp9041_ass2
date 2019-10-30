import API from './api.js';

const api  = new API();


/* returns an empty array of size max */
export const range = (max) => Array(max).fill(null);

/* returns a randomInteger */
export const randomInteger = (max = 1) => Math.floor(Math.random()*max);

/* returns a randomHexString */
const randomHex = () => randomInteger(256).toString(16);

/* returns a randomColor */
export const randomColor = () => '#'+range(3).map(randomHex).join('');

/**
 * You don't have to use this but it may or may not simplify element creation
 * 
 * @param {string}  tag     The HTML element desired
 * @param {any}     data    Any textContent, data associated with the element
 * @param {object}  options Any further HTML attributes specified
 */
export function createElement(tag, data, options = {}) {
    const el = document.createElement(tag);
    el.textContent = data;
   
    // Sets the attributes in the options object to the element
    return Object.entries(options).reduce(
        (element, [field, value]) => {
            element.setAttribute(field, value);
            return element;
        }, el);
}

/**
 * Given a post, return a tile with the relevant data
 * @param   {object}        post 
 * @returns {HTMLElement}
 */
export function createPostTile(post, isPoster) {

    const pic_src = "data:image/png;base64,"

    const section = createElement('section', null, { class: 'post ' });

    var token = window.sessionStorage.getItem("token")

    var p =createElement('p', post.meta.description_text, {class: ''})
    var input_text = createElement('textarea', p.textContent, {style: "width:100%; height:50px", maxlength: "250"})

    if(isPoster){

        var a = createElement('a', null , {href: "#", style: "float:right ; margin-top: 40px; margin-right:10px; text-align: right "})
        var span = createElement('span', null, {class: "glyphicon glyphicon-trash"})

        console.log(a)
        a.appendChild(span)
        a.addEventListener('click', function (e) {
            var options = {
                method: "DELETE",
                headers: {
                    "accept": "application/json",
                    "content-type": "application/json",
                    "Authorization":"Token: " + token
                }
            };

            api.makeAPIRequestByOprion("post/?id="+post.id, options)
                .then(msg => {
                    console.log(msg)
                    alert(msg.message)

                    showPersonalPage()

                });
        })


        var a_2 = createElement('a', null , {href: "#", style: "float:right ; margin-top: 40px; margin-right:10px; text-align: right "})
        var span_2 = createElement('span', null, {class: "glyphicon glyphicon-pencil"})
        console.log(a_2)
        a_2.appendChild(span_2)

        a_2.addEventListener('click', function (event) {

            if (bnt_post.style.display) {
                input_text.textContent = p.textContent
                section.replaceChild(input_text, p)
                bnt_post.style.display = ''
                bnt_img.style.display = ''
            }else{
                bnt_post.style.display = 'none'
                bnt_img.style.display = 'none'
                p.textContent = input_text.textContent
                section.replaceChild(p, input_text)
            }

        })

        section.appendChild(a);

        section.appendChild(a_2);
    }

    var h3 = createElement('h3', null, { class: 'post-title' })

    var a = createElement('a', post.meta.author)

    a.addEventListener('click', function (e) {

        var token = window.sessionStorage.getItem("token")

        var options = {

            method:"GET",
            headers:{
                "accept":"application/json",
                "content-type":"application/json",
                "Authorization":"Token: "+token
            }
        }

        api.makeAPIRequestByOprion("user/?username="+post.meta.author, options)
            .then(msg =>{
                showPage(msg)

            })
    })

    h3.appendChild(a)

    section.appendChild(h3);

    section.appendChild(p);

    var bnt_post = createElement('button', 'submit', { type: "button", class: "btn btn-primary pull-right", style : "display:none"})

    var bnt_img = createElement('input', 'upload', {type: "file", class: "btn btn-primary pull-left", style : "display:none; width:80px"})

    img_post.addEventListener('change', uploadImage);


    bnt_post.addEventListener('click', function (event) {

        var src = null

        if (window.sessionStorage.getItem("AUTH_KEY")){
            src = window.sessionStorage.getItem("AUTH_KEY").split(',')[1]
        }

        var format = {
            description_text: input_text.value,
            src: src
        }

        console.log(format)

        if (input_text.value == '' || format.src == "undefined"){
            alert("content cannot be empty.")
        }else {

            var options = {
                method: "PUT",
                headers: {
                    "accept": "application/json",
                    "content-type": "application/json",
                    "Authorization": "Token: " + token
                },
                body: JSON.stringify(format)
            };

            api.makeAPIRequestByOprion('post/?id=' + post.id, options)
                .then(msg => {
                    console.log(msg)
                    img_post.value = ''
                    alert('post success')
                    showPersonalPage()
                });
        }
    })

    section.appendChild(bnt_img)

    section.appendChild(bnt_post)

    section.appendChild(createElement('img', null, 
        { src: pic_src+post.src, alt: post.meta.description_text, class: 'post-image' }));

    return section;
}

export  function createPersonalPanel(personal, token) {

    div_post.getElementsByTagName('a')[0].innerHTML += personal.name

    var input_text = div_post.getElementsByTagName('textarea')[0]

    img_post.addEventListener('change', uploadImage);

    text_post.addEventListener('click', function (e) {

        var value = window.sessionStorage.getItem("AUTH_KEY").split(',')

        var src =  ''

        if(value.length) src = value[1]

        var format = {
            description_text: input_text.value,
            src: src
        }

        console.log(format)

        if (input_text.value == '' || format.src == "undefined"){
            alert("content cannot be empty.")
        }else{

            var options = {
                method: "POST",
                headers: {
                    "accept": "application/json",
                    "content-type": "application/json",
                    "Authorization":"Token: " + token
                },
                body: JSON.stringify(format)
            };

            api.makeAPIRequestByOprion('post/', options)
                .then(msg => {
                    console.log(msg)
                    input_text.value = ''
                    img_post.value = ''
                    alert('post success')
                });
        }

    });

    //div_post.appendChild(ul)*/

}

// Given an input element of type=file, grab the data uploaded for use
export function uploadImage(event) {

    console.log('event')

    const [ file ] = event.target.files;


    const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
    const valid = validFileTypes.find(type => type === file.type);

    // bad data, let's walk away
    if (!valid)
        return false;
    
    // if we get here we have a valid image
    const reader = new FileReader();
    
    reader.onload = (e) => {
        // do something with the data result
        const dataURL = e.target.result;
        const image = createElement('img', null, { src: dataURL });
        document.body.appendChild(image);
    };

    // this returns a base64 image
    reader.readAsDataURL(file);

    reader.onload = (e) => {
        const dataURL = e.target.result;
        window.sessionStorage.setItem('AUTH_KEY', dataURL);
    }

}

/* 
    Reminder about sessionStorage
    window.sessionStorage.setItem('AUTH_KEY', someKey);
    window.sessionStorage.getItem('AUTH_KEY');
    sessionStorage.clear()
*/
export function checkStore(key) {
    if (window.sessionStorage)
        return window.sessionStorage.getItem(key)
    else
        return null

}

export function showHomePage(e) {

    //e.style.display = "None"

    console.log(e)

    div_feed.innerHtml = ''


    //var res = window.sessionStorage.getItem("person_detail")

    var inf = JSON.parse(window.sessionStorage.getItem("person_detail"))

    var token = window.sessionStorage.getItem("token")

    var options = {
        method:"GET",
        headers:{
            "accept":"application/json",
            "content-type":"application/json",
            "Authorization":"Token: "+token
        }
    }

    console.log(token)

    div_post.style.display = ''


    var p = 0

    var n = 10

    api.makeAPIRequestByOprion("user/feed?p="+p+"&n="+n, options)
        .then(msg => {
            msg.posts.map( e =>{

                var flag_like = e.meta.likes.indexOf(inf.id)+1

                console.log(flag_like)

                createPanel(e, div_feed, flag_like)
            })
        })


}

export function showPersonalPage(e) {

    console.log(e)

    div_feed.textContent = ''

    var inf = JSON.parse(window.sessionStorage.getItem("person_detail"))
    var token = window.sessionStorage.getItem("token")

    var options = {
        method:"GET",
        headers:{
            "accept":"application/json",
            "content-type":"application/json",
            "Authorization":"Token: "+token
        }
    }


    inf.posts.map(postid => {
        api.makeAPIRequestByOprion("post/?id="+postid, options)
            .then(msg => {
                createPanel(msg, div_feed);
            })
    })
}

export function showPage(e) {

    div_feed.textContent = ''

    div_post.style.display = 'none'

    createPersonalTile(e)

    div_person.style.display = ""

    var token = window.sessionStorage.getItem("token")

    var options = {
        method:"GET",
        headers:{
            "accept":"application/json",
            "content-type":"application/json",
            "Authorization":"Token: "+token
        }
    }


    e.posts.map(postid => {
        api.makeAPIRequestByOprion("post/?id="+postid, options)
            .then(msg => createPanel(msg, div_feed))
    })
}

export function showProfilePage(e) {

    div_post.style.display = "none"
    div_feed.style.display = "none"
    div_usr.style.display = "none"
    div_profile.style.display = "block"

    var inf = window.sessionStorage.getItem('person_detail')

    var token = window.sessionStorage.getItem('token')

    var inf = JSON.parse(window.sessionStorage.getItem("person_detail"))
    profile_user.value = inf.name
    profile_email.value = inf.email

    btn_update_profile.addEventListener('click', function (e) {

        var format = {
            email: profile_email.value == null ? inf.email : profile_email.value,
            name: profile_user.value == null ? inf.name : profile_user.value,
            password: profile_pass.value == null ? inf.password : profile_pass.value

        }

        var options = {

            method:"PUT",
            headers:{
                "accept":"application/json",
                "content-type":"application/json",
                "Authorization":"Token: "+token
            },
            body: JSON.stringify(format)
        }

        api.makeAPIRequestByOprion("user/", options)
            .then(res => {
                alert(res.msg)
            })

    })
}

function createPanel(e, panel, flag) {

    //msg.posts.map(e => {

    console.log(e)
    var inf = JSON.parse(window.sessionStorage.getItem("person_detail"))

    var div = createElement('div', '', {
        //id: "div_"+ e.id,
        style: "width: 80%; border:0; margin-bottom:0; padding-bottom:10px",
        class: "post"
    })

    var section = createPostTile(e, e.meta.author==inf.username)

    section.style.margin = "0"
    section.style.border = "0"

    div.appendChild(section)




    //follow=======================================================================

    var div_follow = createElement('div','',{
        "style": "margin-left: 2px",
        "class": "btn-group"

    })


    var btn_follow = createElement('button', "Unfollow",{
        "id" : "follow" + e.id,
        "type" :"button",
        "class" : "btn btn-default"
    })


    btn_follow.addEventListener('click', function (event) {

        var opts = {
            method:"PUT",
            headers:{
                "accept":"application/json",
                "content-type":"application/json",
                "Authorization":"Token: "+ window.sessionStorage.getItem('token')
            }
        }

        api.makeAPIRequestByOprion("user/unfollow?username="+e.meta.author, opts)
            .then(msg => {
                console.log(msg)
                alert("unfollow " + msg.message)
                div_feed.textContent = ''
                console.log(showHomePage())
            })

    })

    div_follow.appendChild(btn_follow)


    //like button==================================================================





    var div_like = createElement('div','',{
        "style": "float: right; margin-right: 2px",
        "class": "btn-group"

    })

    var islike = "Like "

    if(flag){
        islike = "Unlike "
    }

    var btn_like = createElement('button', islike + e.meta.likes.length,{
        "id" : "like_" + e.id,
        "type" :"button",
        "class" : "btn btn-default"
    })

    var btn_like_detail = createElement('button', '', {
        "id" : "likeDetail_" + e.id,
        "type": "button",
        "class": "btn btn-default dropdown-toggle",
        "data-toggle": "dropdown"
    })

    var span_1 = createElement('span', '', {"class": "caret"})

    var span_2 = createElement('span', '', {"class": "sr-only"})

    btn_like_detail.appendChild(span_1)

    btn_like_detail.appendChild(span_2)


    // var ul_like = createElement('ul', '', {
    //     "class": "dropdown-menu nav",
    //     "role" : "menu"
    // })
    //
    // makeLikeList(e, ul_like)

    div_like.appendChild(btn_like)

    div_like.appendChild(btn_like_detail)

    // div_like.appendChild(ul_like)




    //Comments===============================================================


    var div_comm = createElement('div', '', {
        "style": "float: right; margin-left: 2px",
        "class": "btn-group"
    })

    var btn_comm = createElement('button', 'Comment ' + e.comments.length, {
        "id" : "combnt_" + e.id,
        "type" :"button",
        "class" : "btn btn-default"
    })

    var btn_comm_detail = createElement('button', '', {
        "id" : "detailbnt_" + e.id,
        "type": "button",
        "class": "btn btn-default dropdown-toggle",
        "data-toggle": "dropdown"
    })

    var span_3 = createElement('span', '', {"class": "caret"})

    var span_4 = createElement('span', '', {"class": "sr-only"})

    btn_comm_detail.appendChild(span_3)

    btn_comm_detail.appendChild(span_4)

    var div_comment = createElement('div', '', {
        "id": "comm_" + e.id,
        "style": "display: none",
        "class": "panel panel-info"
    })





    /*
    var ul_comm = createElement('ul', '', {
        "class": "dropdown-menu",
        "role" : "menu"
    })

    e.comments.map(el => {

        console.log(el)
        var div_com = createElement('div')

        var div_poster = createElement('div')
        var p_poster = createElement('p', el.author)

        console.log(el.author)
        div_poster.appendChild(p_poster)
        div_com.appendChild(div_poster)


        var _clear =  createElement('div', '', {
            "style": "clear:both; float:none; height:0; overflow:hidden"
        })

        div_com.appendChild(_clear)

        var div_content = createElement('div')

        var p_content = createElement('p', el.comment)
        div_content.appendChild(p_content)
        div_com.appendChild(div_content)


        var li = createElement('li')

        li.appendChild(div_com)

        ul_comm.appendChild(li)
    })*/



    div_comm.appendChild(btn_comm)

    div_comm.appendChild(btn_comm_detail)




    //======================================================================


    var div_opt = createElement('div', '', {"style": "margin-top: 5px"})

    if(e.meta.author!=inf.username){
        div_opt.appendChild(div_follow)
    }

    div_opt.appendChild(div_comm)

    div_opt.appendChild(div_like)

    //======================================================================

    var lab_pub = createElement('div', e.meta.published, {
        "style": "display:none",
        "id": "pub_"+e.id
    })

    div.appendChild(lab_pub)


    div.appendChild(div_opt)

    div.appendChild(createElement('div', '', {
        "style": "clear:both; float:none; height:20px; overflow:hidden"
    }))

    //======================================================================


    var div_type = createElement('div','',{
        "id": "divtype_" + e.id,
        "style": "display:none"
    })

    var text_box = createElement('textarea', '',{
        "id": "text_"+e.id,
        "style": "maxlength: 250; width: 90%"
    })

    var bnt_text = createElement('button', 'submit', {
        "id": "sub_"+e.id,
        "class": "btn btn-success pull-right"
    })

    bnt_text.addEventListener("click", comm_submit)

    div_type.appendChild(text_box)
    div_type.appendChild(bnt_text)


    div.appendChild(createElement('div', '', {
        "style": "clear:both; float:none; height:0; overflow:hidden"
    }))

    div.appendChild(createElement('div','',{
        "id": "divlike_" + e.id,
    }))

    div.appendChild(div_type)

    div.appendChild(div_comment)

    panel.appendChild(div)

    btn_like.addEventListener('click', like_click)

    btn_like_detail.addEventListener('click', like_list)

    btn_comm.addEventListener('click', comm_click)

    btn_comm_detail.addEventListener('click', comm_list)



}

function createPersonalTile(e) {

    var inf = JSON.parse(window.sessionStorage.getItem('person_detail'))

    person_header.getElementsByTagName('div')[0].appendChild(createElement('h2', e.name))
    person_header.getElementsByTagName('ul')[0].appendChild(createElement('li', e.username, {}))
    person_header.getElementsByTagName('ul')[0].appendChild(createElement('li', e.email, {}))



    if(inf.following.indexOf(e.id)+1){
        per_follows.innerHTML = "Unfollow "+ e.followed_num.toLocaleString()
    }else {
        per_follows.innerHTML = "Follow "+ e.followed_num.toLocaleString()
    }

    per_follows.addEventListener('click', function (el) {

        var value = per_follows.innerHTML.split(' ')

        var token = window.sessionStorage.getItem("token")

        var options = {
            method:"PUT",
            headers:{
                "accept":"application/json",
                "content-type":"application/json",
                "Authorization":"Token: "+token
            }
        }

        if(value[0].toLowerCase() == "unfollow"){
            api.makeAPIRequestByOprion("user/unfollow?username="+e.username, options)
                .then(msg => {
                    console.log(msg)
                    alert("unfollow " + msg.message)
                })
            per_follows.innerHTML = "Follow " + (parseInt(value[1])-1).toString()
        }else {
            api.makeAPIRequestByOprion("user/follow?username="+e.username, options)
                .then(msg => {
                    alert("follow " + msg.message)
                })
            per_follows.innerHTML = "Unfollow " + (parseInt(value[1])+1).toString()
        }
    })

    per_posts.innerHTML = "Posts " + e.posts.length
}

function like_click(e) {

    var post_id = e.target.id.split('_')[1]

    var btn_like = document.getElementById(e.target.id)

    var token = window.sessionStorage.getItem("token")

    var options = {
        method:"PUT",
        headers:{
            "accept":"application/json",
            "content-type":"application/json",
            "Authorization":"Token: "+token
        }
    }

    var value = btn_like.textContent.split(' ')

    console.log(value)

    if(value[0] == "Unlike"){

        console.log(btn_like.value)

        api.makeAPIRequestByOprion("post/unlike?id=" + post_id, options)
            .then( msg => {
                console.log(msg)
                var i = parseInt(value[1])-1
                btn_like.textContent = "Like "+ i.toString()

            })

    }else{
        api.makeAPIRequestByOprion("post/like?id=" + post_id, options)
            .then( msg => {
                console.log(msg)
                var i = parseInt(value[1])+1
                btn_like.textContent = "Unlike "+ i.toString()
            })

    }

}

function comm_click(e) {

    var post_id = e.target.id.split('_')[1]

    var div = document.getElementById("divtype_"+post_id)

    console.log(div.style.display)

    if(div.style.display.toLowerCase() == "none"){
        div.style.display = ""
    }else{
        div.style.display = "none"
    }



}

function comm_submit(e) {

    var obj_id = e.target.id.split('_')[1]
    console.log(obj_id)
    var text_box = document.getElementById("text_" + obj_id)
    console.log(text_box)
    var pub = document.getElementById("pub_" + obj_id)
    var inf = JSON.parse(window.sessionStorage.getItem("person_detail"))

    console.log(inf)


    if (text_box.value == ''){
        alert("Please type you comment.")
    }else{

        var token = window.sessionStorage.getItem("token")
        var format = {"author": inf.name, "published": pub.innerText, "comment": text_box.value}

        var options = {
            method:"PUT",
            headers:{
                "accept":"application/json",
                "content-type":"application/json",
                "Authorization":"Token: "+token
            },
            body: JSON.stringify(format)
        }

        api.makeAPIRequestByOprion("post/comment?id=" + obj_id, options)
            .then(res => {
                if(res.message === "success"){
                    text_box.value = ''
                    document.getElementById("divtype_"+obj_id).style.display = "none"
                    alert("Comment published.")
                    var btn = document.getElementById("combnt_" + obj_id)
                    var value = btn.textContent.split(' ')

                    btn.textContent = value[0] + " " + (parseInt(value[1])+1).toString()

                }
            })

    }



}

function like_list(e) {

    var post_id = e.target.id.split('_')[1]

    var div = document.getElementById("divlike_"+post_id)

    if( !div.textContent ){
        var p = createElement('p')

        var options = {
            method:"GET",
            headers:{
                "accept":"application/json",
                "content-type":"application/json",
                "Authorization":"Token: "+ window.sessionStorage.getItem("token")
            }
        }

        api.makeAPIRequestByOprion("post/?id="+post_id, options)
            .then( msg => {
                msg.meta.likes.map(res => {

                    var opts = {
                        method: "GET",
                        headers: {
                            "accept": "application/json",
                            "content-type": "application/json",
                            "Authorization":"Token: "+ window.sessionStorage.getItem("token")
                        }
                    }

                    api.makeAPIRequestByOprion("user/?id="+res, opts)
                        .then(el => {
                            p.textContent += el.name + " "
                        })

                })
            })

        div.appendChild(p)
    }else{
        div.textContent = ''
    }


}

function comm_list(e) {

    var post_id = e.target.id.split('_')[1]

    var div = document.getElementById("comm_"+post_id)

    if(div.style.display.toLowerCase() == "none"){

        var options = {
            method:"GET",
            headers:{
                "accept":"application/json",
                "content-type":"application/json",
                "Authorization":"Token: "+ window.sessionStorage.getItem("token")
            }
        }

        api.makeAPIRequestByOprion("post/?id="+post_id, options)
            .then( e => {

                e.comments.map(el => {

                    console.log(el)
                    var div_com = createElement('div', '', {"class": "panel-body"} )

                    var div_poster = createElement('div', '', {"class": "panel-heading"})
                    var a = createElement('a', el.author + ":", {herf: '#'})
                    var p_poster = createElement('p')
                    p_poster.append(a)

                    console.log(el.author)
                    div_poster.appendChild(p_poster)
                    div_com.appendChild(div_poster)


                    var _clear =  createElement('div', '', {
                        "style": "clear:both; float:none; height:0; overflow:hidden"
                    })

                    div_com.appendChild(_clear)

                    var div_content = createElement('div', '', {"class": "panel-body"})

                    var p_content = createElement('p', el.comment)
                    div_content.appendChild(p_content)
                    div_com.appendChild(div_content)


                    div.appendChild(div_com)
                    div.appendChild(createElement('hr'))

                })
            })


        div.style.display = ""
    }else{
        div.textContent = ''
        div.style.display = "none"
    }
}