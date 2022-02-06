class UserController{
    constructor(formId, formUpdateId, tableId){
        this._formEl = document.getElementById(formId)
        this._table = document.getElementById(tableId)
        this._formUpdateEl = document.getElementById(formUpdateId) 

        this.selectAll()
        this.onSubmit()
        this.onEdit()
        this.showPanelCreate()
    }

    onSubmit(){
        let btn = document.querySelector("[type=submit]")
        this._formEl.addEventListener("submit", e=>{
            document.querySelectorAll(".form-group").forEach(function(parentField){
                parentField.classList.remove("has-error")
            })

            e.preventDefault()
            let user = this.getValues(this._formEl)

            if(!user) return false
            btn.disabled = true

            this.getPhoto(this._formEl).then(content =>{
                user._photo = content
                user.save()
                this.addLine(user)
                this._formEl.reset()
            }, e => {
                console.log("e")
            })

            btn.disabled = false
        })
    }

    onEdit(){
        this._formUpdateEl.querySelector(".btn-cancel").addEventListener("click", e=>{
            e.preventDefault()
            this.showPanelCreate()
        })

        this._formUpdateEl.addEventListener("submit", (e)=>{
            e.preventDefault()
            let btn = this._formUpdateEl.querySelector("[type=submit]")
            btn.disabled = true

            let user = this.getValues(this._formUpdateEl)

            let index = this._formUpdateEl.dataset.trIndex

            let tr = this._table.rows[index]

            let userOld = JSON.parse(tr.dataset.user)

            let result = Object.assign({}, userOld, user)
        
            this.showPanelCreate()

            this.getPhoto(this._formUpdateEl).then(content =>{
                if(!user.photo) {
                    result._photo = userOld._photo
                } else{
                    result._photo = content
                }

                let userObj = new User()
                userObj.loadFromJSON(result)
                userObj.save()

                tr = this.getTr(userObj, tr)

                this._formUpdateEl.reset()

                this.updateCount()
            }, e => {
                console.log("e")
            })       
        })
    }

    getTr(dataUser, tr = null){
        if(tr === null) tr = document.createElement("tr")

        tr.dataset.user = JSON.stringify(dataUser)

        tr.innerHTML = `  
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? "Sim" : "Não"}</td>
            <td>${Utils.dateFormat(dataUser.date)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
            </td>
        `
        this.addEventsTr(tr)
        return tr
    }

    addEventsTr(tr){
        tr.querySelector(".btn-delete").addEventListener("click", ()=>{
            if(confirm("Você deseja mesmo excluir este usuário?")){ 
                let user = new User()
                user.loadFromJSON(JSON.parse(tr.dataset.user))
                user.remove()
                tr.remove()
                this.updateCount()
            }
        })


        tr.querySelector(".btn-edit").addEventListener("click", ()=>{
            this._formUpdateEl.querySelector("[type=submit]").disabled = false
                this.showPanelUpdate()
                let user = JSON.parse(tr.dataset.user)

                this._formUpdateEl.dataset.trIndex = tr.sectionRowIndex

                for(let fieldUser in user){
                    let field = this._formUpdateEl.querySelector("[name="+fieldUser.replace("_", "")+"]")
                    if(field){
                        switch(field.type){
                            case "file":
                                continue
                                break
                            case "checkbox":
                                field.checked = user[fieldUser]
                                break
                            case "radio":
                                field = this._formUpdateEl.querySelector("[name="+fieldUser.replace("_", "")+"][value="+user[fieldUser]+"]")
                                field.checked = true
                                break
                            default:
                                field.value = user[fieldUser]

                        }
                    }
                }

                this._formUpdateEl.querySelector(".photo").src = user._photo
                this.updateCount()
        })
    }

    getPhoto(formEl){
        return new Promise((resolve, reject)=>{
            let fileReader = new FileReader();

            let imagem = [...formEl.elements].filter(item=>{
                if (item.name === "photo"){
                    return item
                }
            })

            let file = imagem[0].files[0]
            console.log(file)
    
            fileReader.onload = ()=>{
                resolve(fileReader.result)
            }
    
            fileReader.onerror = (e)=>{
                reject(e)
            }
            
            if(file){
                fileReader.readAsDataURL(file)
            }else{
                resolve("dist/img/boxed-bg.jpg")
            }
        })
    }

    getValues(formEl){
        let user = {}
        let isValid = true;
        [...formEl.elements].forEach(function(field){

            if(["name", "password", "email"].indexOf(field.name) > -1 && !field.value){
                field.parentElement.classList.add("has-error")
                isValid = false
            }

            if(field.name == "gender"){
                if(field.checked) user[field.name] = field.value
            } else if(field.name == "admin"){
                user[field.name] = field.checked
            }else{
                user[field.name] = field.value
            }
        })

        if(!isValid){
            return false
        }

        return new User(user.name,
            user.gender, 
            user.birth, 
            user.country, 
            user.email, 
            user.password, 
            user.photo, 
            user.admin
        )
    }

    selectAll(){
        let users = User.getUsersStorage()

        users.forEach(dataUser=>{
            let user = new User()
            user.loadFromJSON(dataUser)
            this.addLine(user)
        })
    }

    addLine(dataUser){
        let tr = this.getTr(dataUser)
        this._table.appendChild(tr)
        this.updateCount()
    }

    showPanelCreate(){
        document.querySelector("#box-user-create").style.display = "block"
        document.querySelector("#box-user-update").style.display = "none"
    }

    showPanelUpdate(){
        document.querySelector("#box-user-create").style.display = "none"
        document.querySelector("#box-user-update").style.display = "block"
    }

    updateCount(){
        let numberUsers = 0
        let numberAdmin = 0;
        [...this._table.children].forEach(tr=>{
            numberUsers++
            let user = JSON.parse(tr.dataset.user)

            if(user._admin){
                numberAdmin++
            }
        })

        document.querySelector("#number-users").innerHTML = numberUsers
        document.querySelector("#number-admin").innerHTML = numberAdmin
    }
}