const { google } = require('googleapis');

const criarObjetoDrive = (req, res, next) => {

    const oauth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URL
    );

    let tokens = req.headers['authorization'];
        
    //cortando caracteres "j:" do token e convertendo em objeto
    tokens = JSON.parse(tokens.slice(2));

    oauth2Client.setCredentials(tokens);

    const drive = google.drive({version: 'v3', auth: oauth2Client});

    req.drive = drive;

    next();
}

module.exports = criarObjetoDrive;

