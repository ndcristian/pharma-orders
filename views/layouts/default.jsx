var React = require('react');
import {appName}  from "../../routes/models/appconfig";

//this function test IF user exist and change menu according with that
function UserMenu (props){
      const user = props.user;
      if (user){
        if(user.rol === 'admin' || user.rol === 'root') {
           return (
          <ul className="nav nav-pills pull-right">
              <li role="presentation">
                  <a href="/users/logout" className="whiteColor">Logout </a>
              </li>
              <li role="presentation">
                  <a href="/users/account" className="whiteColor">{user.surname} </a>
              </li>
              <li role="presentation">
                  <a href="/admin" className="whiteColor">{user.rol.charAt(0).toUpperCase() + user.rol.slice(1)} </a>
              </li>
          </ul>
        )
        } else {
          return (
          <ul className="nav nav-pills pull-right">
              <li role="presentation">
                  <a href="/users/logout" className="whiteColor">Logout </a>
              </li>
              <li role="presentation">
                  <a href="/account" className="whiteColor">{user.surname} </a>
              </li>
          </ul>
        )
        }
       
      } 
        return (
          <ul className="nav nav-pills pull-right">
                <li role="presentation">
                    <a href="/users/login" className="whiteColor">Login </a>
                </li>
                <li role="presentation">
                    <a href="/users/register" className="whiteColor">Register </a>
                </li>
          </ul>
        )
    };

class DefaultLayout extends React.Component {
  
  render() {
    //if not "locals" set , then this.props.locals.user will cause an error and we can't check if user exist 
    // this pice of code help us to avaoid this error and use check user and error_msg.length
    var locals = {
      error_msg: [],
      success_msg:[],
      error:[]
    };
     if (!this.props.locals){
        //locals = {error_msg: false};
       console.log('din default.jsx if not locals is:', locals);
     } else 
     {
        locals = this.props.locals;
        console.log('din default.jsx if yes locals is:', locals);
      }
    
    const headerName = {
      padding:'10px',
      fontSize :'100%'
    };
    
    return (
      <html>
        <head>
          <title>{appName}</title>
          <link rel="stylesheet" href="/css/bootstrap.css" />
          <link rel="stylesheet" href="/css/main.css" />
          <link rel="stylesheet" href="../web/app/resources/app.css"/>
        </head>
        <body id='root' className="flat">
          <div className="container">
                <div className="col-xs-8 col-sm-4 col-md-4 col-lg-3 whiteColor " style={headerName}>{appName}</div>
               <div className="col-xs-12 col-sm-8 col-md-8 col-lg-9 event-container whiteColor">
                  <nav>
                      <UserMenu user={locals.user}/>
                  </nav>
              </div>
               
           
            {locals.error_msg.length ?  <div className='alert alert-danger'>{locals.error_msg}</div> : ""}
            {locals.success_msg.length ?  <div className='alert alert-success'>{locals.success_msg}</div> : ""}
            {this.props.children}
          </div>
        </body>
      </html>
    );
  }
}

module.exports = DefaultLayout;