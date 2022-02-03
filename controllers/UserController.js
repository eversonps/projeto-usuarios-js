class UserController{
    constructor(formId, formUpdateId, tableId){
        this._formEl = document.getElementById(formId)
        this._table = document.getElementById(tableId)
        this._formUpdateEl = document.getElementById(formUpdateId) 

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

            this.getPhoto().then(content =>{
                user.photo = content
                this.addLine(user)
                this._formEl.reset()
            }, e => {
                console.log("e")
            })

            btn.disabled = false
        })
    }

    onEdit(){
        document.querySelector(".btn-cancel").addEventListener("click", e=>{
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
            tr.dataset.user = JSON.stringify(user)
            
            tr.innerHTML = `
                <td><img src="${user.photo}" alt="User Image" class="img-circle img-sm"></td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${(user.admin) ? "Sim" : "Não"}</td>
                <td>${Utils.dateFormat(user.date)}</td>
                <td>
                    <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                    <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                </td>
            `
            console.log(tr)
            this.addEventsTr()
            this.updateCount()
        })
    }

    addEventsTr(){
        let btnsEdit = document.querySelectorAll(".btn-edit")  
        btnsEdit.forEach((btn)=>{
            btn.addEventListener("click", ()=>{
                this._formUpdateEl.querySelector("[type=submit]").disabled = false
                this.showPanelUpdate()
                var tr = btn.parentElement.parentElement
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

                this.updateCount()
            })
        })
    }

    getPhoto(){
        return new Promise((resolve, reject)=>{
            let fileReader = new FileReader();

            let imagem = [...this._formEl.elements].filter(item=>{
                if (item.name === "photo"){
                    return item
                }
            })

            let file = imagem[0].files[0]
    
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

    addLine(dataUser){
        this._table.innerHTML += `
        <tr data-user=${JSON.stringify(dataUser)}>
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? "Sim" : "Não"}</td>
            <td>${Utils.dateFormat(dataUser.date)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        </tr>
        `

        this.addEventsTr()
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

            document.querySelector("#number-users").innerHTML = numberUsers
            document.querySelector("#number-admin").innerHTML = numberAdmin
        })
    }
}