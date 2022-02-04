class User{
    constructor(name, gender, birth, country, email, password, photo, admin){
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
}