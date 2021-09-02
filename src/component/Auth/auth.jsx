import { setAPI } from "../../data_function"

class Auth {  
    login(info) {
      setAPI('auth/admin', {  //login API 호출
        adminID : info.id,
        adminPW : info.pwd
      }).then(res => {
        if(res.message === '성공적으로 로그인되었음.') {  //성공여부
          sessionStorage.setItem('company', res.company)
          sessionStorage.setItem('level', res.level)
          sessionStorage.setItem('tocken', info.id) //d인자로 받는 토큰을 session storge 에 저장
          sessionStorage.setItem('name', res.name)
          location.reload(true)
        }
        else {  
          alert('Please check your ID or Password')
        }
      })
    }
  
    logout() {
      /* eslint no-restricted-globals:0 */
      sessionStorage.clear()
      location.reload(true)
    }
  
    isAuthenticated() { // 로그인 여부 확인
      return sessionStorage.getItem('tocken')//tocken 확인
    }
    isAdmin() { return sessionStorage.getItem('level') === 1} //Admin 여부 확인
  }
  
  export default new Auth();
  