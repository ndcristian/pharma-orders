var React = require('react');
import {appName, infoLivrare}  from "../../routes/models/appconfig";

class DefaultLayout extends React.Component {
    
  render() {
    //if not "locals" set , then this.props.locals.user will cause an error and we can't check if user exist 
    // this pice of code help us to avaoid this error and use check user 
    console.log('din default.jsx this.props is:', this.props);
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
    //------------------------------------------------------------------
    return (
     
      <html>
        <head>
          <title>{appName}</title>
          <link rel="stylesheet" href="/css/bootstrap.css" />
          <link rel="stylesheet" href="/css/main.css" />
        </head>
        <body id='root'>
          <div className="container">
            <div className="header clearfix"> 
              <nav>
                <ul className="nav nav-pills pull-right">
                  <li role="presentation">
                    <a href={locals.user ? "/admin" : "/users/register"} className="whiteColor">{locals.user ? "Admin: "+locals.user.surname : 'Register'} </a>
                  </li>
                  <li role="presentation">
                    <a href={locals.user ? '/users/logout' : '/users/login'} className="whiteColor">{locals.user ? 'Logout' : 'Login'}</a>
                  </li>
                </ul>
              </nav>
               <h3 className="text-muted whiteColor">{appName}</h3>
            </div>
            {locals.error_msg.length ?  <div className='alert alert-danger'>{locals.error_msg}</div> : ""}
            {this.props.children}
          </div>
        </body>
      </html>
    );
  }
}

module.exports = DefaultLayout;