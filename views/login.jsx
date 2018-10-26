var React = require('react');
var DefaultLayout = require('./layouts/default');

class login extends React.Component {
  render() {
    return (
      
        <DefaultLayout locals = {this.props.locals}>
              <div className="container-fluid ">
                <div className="col-xs-4 col-sm-4 col-md-4 col-lg-3">
                    <div className="media text-center" >
                        <img src='/images/logo.png' className="logo "></img>
                    </div>
                </div>

                <div className="col-xs-8 col-sm-8 col-md-8 col-lg-6 event-container ">
                      <h2 className="page-header whiteColor">Login  </h2>
                      <form method ="post" action="/users/login">
                          <div className="form-group form-custom">
                              <label className="whiteColor">Email</label>
                              <input type="text" className="form-control login" name="username" placeholder="Email"></input>
                          </div>
                          <div className="form-group form-custom">
                              <label className="whiteColor">Password</label>
                              <input type="password" className="form-control login" name = "password" placeholder="Password"></input>
                          </div>
                          <button type="submit" className="btn btn-default">Submit</button>
                      </form>
                      <div className="whiteColor changePass">
                          <a className="whiteColor" href="./resetpassword">Forgot password?</a> 
                      </div>
                </div>     
             </div>
 
      </DefaultLayout>
            
      
    );
  }
}

module.exports = login;