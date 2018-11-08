define({
    apiUrl: window.location.protocol + "//" + window.location.host +
            (window.location.host in {'localhost': 1, '192.168.1.100': 1} ?
                    location.pathname.slice(0, location.pathname.lastIndexOf('/')) : "")
            + "/api",
    roCharsRE: "\\u00C2\\u00C3\\u00CE\\u00E2\\u00E3\\u00EE\\u0102\\u0103\\u0218-\\u021B", //ÂÃÎâãîĂăȘșȚț
    contact: {
        mobile: '0777.777.777',
        email: 'email@domain.ro'
    },
    options: {
        handleAs: "json",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Content-Hash": "soyUshlcjtJZ8LQVqu4/ObCykgpFN2EUmfoESVaReiE="
        }
    }
});



