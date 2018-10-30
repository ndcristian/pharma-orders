var React = require('react');
var DefaultLayout = require('./layouts/default');
import {infoLivrare}  from "../routes/models/appconfig";
class account extends React.Component {
  render() {
    return (
        <DefaultLayout locals = {this.props.locals}>
            <h2 className="page-header whiteColor">Account info</h2>
            <form className = "name " method ="post" action="/users/account">
              <div className="form-group form-custom whiteColor capitol">
                  User:
              </div>
              <div className="form-group form-custom-string ">
                <label className="whiteColor">Nume</label>
                <input type="text" className="form-control login" name="name" placeholder="Name" value= {this.props.locals.user.name}></input>
              </div>
              <div className="form-group form-custom-string ">
                <label className="whiteColor">Prenume</label>
                <input type="text" className="form-control login" name="surname" placeholder="Surname" value={this.props.locals.user.surname}></input>
              </div>
              <div>
                 <button type="submit" className="btn btn-default">Save</button>
              </div>
            </form>
        
            <form className = "address" method ="post" action="/users/address">
                <div className="form-group form-custom whiteColor capitol">
                  Date livrare: 
                  </div>
                <div className="form-group form-custom-string ">
                  <label className="whiteColor">Nume Locatie</label>
                  <input type="text" className="form-control login " name="location" placeholder="Ex: Home,Work"></input>
                </div>
                
                <div className="form-group form-custom-string ">
                  <label className="whiteColor">Judet</label>
                  <input type="text" className="form-control login" name="county" placeholder="County"></input>
                </div>
                <div className="form-group form-custom-string ">
                  <label className="whiteColor">Oras</label>
                  <input type="text" className="form-control login" name="city" placeholder="City"></input>
                </div>
                <div className="form-group form-custom-string ">
                  <label className="whiteColor">Strada</label>
                  <input type="text" className="form-control login" name="street" placeholder="Street"></input>
                </div>
                <div className="form-group form-custom-number ">
                  <label className="whiteColor">Str.Nr.</label>
                  <input type="text" className="form-control login" name="number" placeholder="Number"></input>
                </div>
                <div className="form-group form-custom-number ">
                  <label className="whiteColor">Bloc</label>
                  <input type="text" className="form-control login" name="mansion" placeholder="Mansion"></input>
                </div>
                <div className="form-group form-custom-number ">
                  <label className="whiteColor">Scara</label>
                  <input type="text" className="form-control login" name="staircase" placeholder="Staircase"></input>
                </div>
                <div className="form-group form-custom-number ">
                  <label className="whiteColor">Etaj</label>
                  <input type="text" className="form-control login" name="floor" placeholder="Floor"></input>
                </div>
                <div className="form-group form-custom-number ">
                  <label className="whiteColor">Apartament</label>
                  <input type="text" className="form-control login" name="apartment" placeholder="Apartment"></input>
                </div>
                <div className="form-group form-custom-number ">
                  <label className="whiteColor">Telefon</label>
                  <input type="text" className="form-control login" name="phone" placeholder="Phone"></input>
                </div>
                <div>
                 <button type="submit" className="btn btn-default">Save</button>
                </div>
             </form>
                
                
        </DefaultLayout>
            
      
    );
  }
}

module.exports = account;