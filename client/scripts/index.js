import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.7.8/dist/vue.esm.browser.js'

const app = new Vue({
    el: '#app',
    data: {
        user:false,
        reg_username:'',
        reg_password:'',
        reg_passwordRpt:'',
        username: '',
        password: '',
        screen: 'main',//main, register, login

    },
    methods:{
        register(){
          let stop = false
          if(this.reg_username == ''){

            alert('Логин не может быть пустым!')
            stop = true
          }
          if(!stop && this.reg_password != this.reg_passwordRpt){

            alert('Пароли не совпадают!')
            stop = true
          }
          if(stop == false){
            console.log('123')
            axios
            .post('/api/register', { login: this.reg_username, password: this.hashPassword(this.reg_password)})
            .then(res => {
             console.log('Ответ о регистрации')
             console.log(res)
             if(res == false){
              alert('Произошла ошибка')
              this.reg_password = ''
              this.reg_passwordRpt = ''
              this.reg_username = ''
              return
             }
             else{
              alert('Регистрация прошла успешно!')
              this.username = this.reg_username
              this.password = this.reg_password
             }
            })
            .catch(error => {
             alert('Ошибка регистрации!');
             console.error(error);

            });
          }
          
        },
        login() {
            // Выполняем запрос к бэкэнду для авторизации
            axios.post('/api/login', { username: this.username, password: this.password })
              .then(response => {
                // Сохраняем токен авторизации в куки
                document.cookie = `token=${response.data.token}; expires=${new Date(response.data.expiresAt)}; path=/`;
                alert('Вы успешно авторизованы!');
              })
              .catch(error => {
                console.error(error);
                alert('Ошибка авторизации!');
              });
          },
          logout() {
            // Удаляем токен авторизации из куки
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            alert('Вы успешно вышли из системы!');
          },
          hashPassword(password) {
            // Используем sha256 для хэширования пароля
            return sha256(password);
          },
    },
    mounted(){

    }
})