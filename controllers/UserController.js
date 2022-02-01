class UserController{
    constructor(formId, tableId){
        this._formEl = document.getElementById(formId)
        this._table = document.getElementById(tableId)

        this.onSubmit()
    }

    onSubmit(){
        this._formEl.addEventListener("submit", e=>{
            e.preventDefault()
            let user = this.getValues()

            this.getPhoto((content)=>{
                user.photo = content
                this.addLine(user)
            })
        })
    }

    getPhoto(callback){
        let fileReader = new FileReader();

        let imagem = [...this._formEl.elements].filter(item=>{
            if (item.name === "photo"){
                return item
            }
        })

        let file = imagem[0].files[0]
        console.log(file)

        fileReader.onload = ()=>{
            callback(fileReader.result)
        }

        fileReader.readAsDataURL(file)
    }

    getValues(){
        let user = {};
        [...this._formEl.elements].forEach(function(field){
            if(field.name == "gender"){
                if(field.checked) user[field.name] = field.value
            }else{
                user[field.name] = field.value
            }
        })
    
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
        <tr>
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser._name}</td>
            <td>${dataUser._email}</td>
            <td>${dataUser._admin}</td>
            <td>${dataUser._birth}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        </tr>
        `
    }
}