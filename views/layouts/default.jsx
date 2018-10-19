var React = require('react');

class DefaultLayout extends React.Component {
   
  render() {
    
    return (
     
      <html>
        <head><title>{this.props.title}</title>
          <link rel="stylesheet" href="/css/bootstrap.css" />
          <link rel="stylesheet" href="/css/main.css" />
        </head>
        <body id='root'>{this.props.children}
          <div className="container">
            <div className="header clearfix"> 
              <nav>
                <ul className="nav nav-pills pull-right">
                  <li role="presentation">
                    <a href="/api/admin" className="whiteColor">{this.props.appName}</a>
                  </li>
                </ul>
              </nav>
          
            </div>
          
          </div>
        
        </body>
      </html>
    );
  }
}

module.exports = DefaultLayout;