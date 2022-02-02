class UserController{
    constructor(formId, tableId){
        this._formEl = document.getElementById(formId)
        this._table = document.getElementById(tableId)

        this.onSubmit()
    }

    onSubmit(){
        let btn = document.querySelector("[type=submit]")
        this._formEl.addEventListener("submit", e=>{
            document.querySelectorAll(".form-group").forEach(function(parentField){
                console.log(parentField)
                parentField.classList.remove("has-error")
            })

            btn.disabled = true
            e.preventDefault()
            let user = this.getValues()

            if(!user) return false

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

    getValues(){
        let user = {}
        let isValid = true;
        [...this._formEl.elements].forEach(function(field){

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
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        </tr>
        `

        this.updateCount()
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