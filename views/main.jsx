var React = require('react');
var DefaultLayout = require('./layouts/default');

class main extends React.Component {
  render() {
    return (
      
        <DefaultLayout locals = {this.props.locals}>
              <div className="container-fluid ">
                <div className="col-xs-8 col-sm-4 col-md-4 col-lg-3">
                    <div className="media text-center" >
                        <img src='/images/logo.png' className="logo "></img>
                      
                    </div>
                </div>

                <div className="col-xs-12 col-sm-8 col-md-8 col-lg-9 event-container ">
                   Your main applicatin here
                </div>     
            </div>
      </DefaultLayout>
    );
  }
}

module.exports = main;