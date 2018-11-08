var React = require('react');
var DefaultLayout = require('./layouts/default');

class main extends React.Component {
  render() {
    return (
      
        <DefaultLayout locals = {this.props.locals}>
              <div className="container-fluid ">
                  <script src="../web/app/appConfig.js"  ></script>
                  <script src="../vendors/dojo/dojo.js" async ></script>

            </div>
      </DefaultLayout>
    );
  }
}

module.exports = main;