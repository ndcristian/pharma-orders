var React = require('react');
var DefaultLayout = require('./layouts/default');

class index extends React.Component {
  render() {
    return (
      
        <DefaultLayout title={this.props.title} appName = {this.props.name} user={this.props.user}>
              <div className="container-fluid ">
                <div className="col-xs-8 col-sm-4 col-md-4 col-lg-3">
                    <div className="media text-center" >
                        <img src='/images/logo.png' className="logo "></img>
                    </div>
                </div>

                <div className="col-xs-8 col-sm-8 col-md-8 col-lg-6 event-container ">
                      <h2 className="page-header whiteColor">Account Login</h2>
                      <form method ="post" action="/users/resetpassword">
                        <div className="form-group form-custom">
                          <label className="whiteColor">Email</label>
                          <input type="text" className="form-control login" name="username" placeholder="Email"></input>
                        </div>
                        <button type="submit" className="btn btn-default">Reset</button>
                      </form>
                </div>     
            </div>
      </DefaultLayout>
    );
  }
}

module.exports = index;