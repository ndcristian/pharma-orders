var React = require('react');
var DefaultLayout = require('./layouts/default');

class index extends React.Component {
  render() {
    return (
      
        <DefaultLayout >
              <div className="container-fluid ">
                <div className="col-xs-8 col-sm-4 col-md-4 col-lg-3">
                    <div className="media text-left" >
                        <b>Etix Comenzi</b><p>Este o aplicatie care integreaza fluxul de comenzi si va ajuta sa luati cea mai buna decizie de achiztie.
                      Orice decizie de achizitie este comunicata automat catre toate punctele de vanzare . Astfel, se poate vedea de unde s-a comandat, cu ce conditii
                      si cand va fi livrata comanda. </p>
                      <p>In plus, toate informatiile despre comanda sunt memorate si vor fi afisate la urmatoarea achizitie.</p>
                    </div>
                </div>

                <div className="col-xs-12 col-sm-8 col-md-8 col-lg-9 event-container whiteColor">
                  <div className="media text-center" >
                        <img src='/images/shema.JPG' className="logo"></img>
                  </div>
                </div>     
            </div>
      </DefaultLayout>
    );
  }
}

module.exports = index;