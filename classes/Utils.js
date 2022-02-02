class Utils{
    static dateFormat(date){
        if(date.getDate() < 10){
            var dia = "0" + date.getDate() 
        }

        if(date.getMonth() < 10){
            var mes = "0" + (date.getMonth() + 1)
        }

        return dia + "/" + mes + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes()
    }
}