class User{
    constructor(name, gender, birth, country, email, password, photo, admin){
        this._id
        this._name = name
        this._gender = gender
        this._birth = birth
        this._country = country
        this._email = email
        this._password = password
        this._photo = photo
        this._admin = admin
        this._date = new Date()
    }

    get id(){
        return this._id
    }

    get date(){
        return this._date
    }

    set date(date){
        this._date = date
    }

    get name(){
        return this._name
    }

    get gender(){
        return this._gender
    }

    get birth(){
        return this._birth
    }

    get country(){
        return this._country
    }

    get email(){
        return this._email
    }

    get password(){
        return this._password
    }

    set photo(photo){
        this._photo = photo
    }

    get photo(){
        return this._photo
    }

    get admin(){
        return this._admin
    }

    loadFromJSON(dataUser){
        for (let name in dataUser){
            switch(name){
                case "_date":
                    console.log("entrou")
                    this[name] = new Date(dataUser[name])
                    break
                default:
                    this[name] = dataUser[name]
            }
        }
    }

    static getUsersStorage(){
        let users = []

        if(localStorage.getItem("users")){
            users = JSON.parse(localStorage.getItem("users"))
        }

        return users
    }

    getNewId(){
        let usersID = localStorage.getItem("usersID")
        if(!usersID) usersID = 0
        
        usersID++
        localStorage.setItem("usersID", usersID)
        return usersID
    }

    save(user){
        let users = User.getUsersStorage()
        console.log(users)
        if(this.id > 0){
            users.map(u=>{
                if(u._id == this.id){
                    Object.assign(u, this)
                }

                return u
            })
        }else{
            this._id = this.getNewId()
            users.push(this)
        }

        localStorage.setItem("users", JSON.stringify(users))
    }

    remove(){
        let users = User.getUsersStorage()
        users.forEach((u, index)=>{
            if(u._id == this._id){
                users.splice(index, 1)
            }
        })

        localStorage.setItem("users", JSON.stringify(users))
    }
}