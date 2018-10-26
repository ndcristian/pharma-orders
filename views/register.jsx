var React = require('react');
var DefaultLayout = require('./layouts/default');

class login extends React.Component {
  render() {
    return (
      
        <DefaultLayout title={this.props.title} appName = {this.props.name} user={this.props.user}>
              <form method ="post" action="/users/register">
                  <div className="form-group form-custom">
                    <label className="whiteColor">Nume </label>
                    <input type="text" className="form-control" placeholder="Name" name="name"></input>
                  </div>
                  <div class="form-group form-custom">
                    <label className="whiteColor">Prenume</label>
                    <input type="text" className="form-control" placeholder="Surname" name="surname"></input>
                  </div>
                  <div className="form-group form-custom">
                    <label className="whiteColor">Email</label>
                    <input type="email" className="form-control" placeholder="Email" name="email"></input>
                  </div>
                   <div className="form-group form-custom">
                    <label className="whiteColor">Password</label>
                    <input type="password" className="form-control" placeholder="Password" name="password"></input>
                  </div>
                  <div className="form-group form-custom">
                    <label className="whiteColor">Confirm Password</label>
                    <input type="password" className="form-control" placeholder="Password" name="password2"></input>
                  </div>
                   <button type="submit" className="btn btn-default">Submit</button>
            </form>
 
      </DefaultLayout>
            
      
    );
  }
}

module.exports = login;