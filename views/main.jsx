var React = require('react');
var DefaultLayout = require('./layouts/default');

class main extends React.Component {
  render() {
    return (
      
        <DefaultLayout locals = {this.props.locals}>
             
                  <script src="../web/app/appConfig.js"  ></script>
                  <script src="../vendors/dojo/dojo.js" async ></script>

          
      </DefaultLayout>
    );
  }
}

module.exports = main;