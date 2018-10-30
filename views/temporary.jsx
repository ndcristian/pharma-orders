                  <li role="presentation">
                    <a href={locals.user ? "/admin" : "/users/register"} className="whiteColor">{locals.user ? "Admin: "+locals.user.surname : 'Register'} </a>
                  </li>
                  <li role="presentation">
                    <a href={locals.user ? "/admin" : "/users/register"} className="whiteColor">{locals.user ? "Admin: "+locals.user.surname : 'Register'} </a>
                  </li>
                  <li role="presentation">
                    <a href={locals.user ? '/users/logout' : '/users/login'} className="whiteColor">{locals.user ? 'Logout' : 'Login'}</a>
                  </li> 



 <ul className="nav nav-pills pull-right">
                <li role="presentation">
                    <a href="/users/login" className="whiteColor">'Login' </a>
                </li>
                <li role="presentation">
                    <a href="/users/register" className="whiteColor">'Register' </a>
                </li>
          </ul>