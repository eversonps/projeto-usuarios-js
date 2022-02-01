var fields = document.querySelectorAll("#form-user-create [name]")
var user = {}

function addLine(user){
    var tabela = document.querySelector("#table-users")
    var linha = document.createElement("tr")

    linha.innerHTML = `
    <tr>
        <td><img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm"></td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.admin}</td>
        <td>${user.birth}</td>
        <td>
            <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
        </td>
    </tr>
    `
    tabela.appendChild(linha)
}

document.getElementById("form-user-create").addEventListener("submit", e=>{
    e.preventDefault()
    
    fields.forEach(function(field){
        if(field.name == "gender"){
            if(field.checked) user[field.name] = field.value
        }else{
            user[field.name] = field.value
        }
    })

    addLine(user)
})