const nodemailer = require('nodemailer');

const { google } = require('googleapis');

const { OAuth2 } = google.auth;

const oauth_link = 'https://developers.google.com/oauthplayground'

const {BASE_URL,EMAIL,FACEDB_ID,REFRESH_TOKEN,ACCESS_TOKEN,FACEDB_SECRET } = process.env;

const auth2= new OAuth2(FACEDB_ID,FACEDB_SECRET,REFRESH_TOKEN,oauth_link)

exports.sendEmail = (email,username,url) => {
   
    auth2.setCredentials({refresh_token:REFRESH_TOKEN});

    const accessToken = auth2.getAccessToken();

    const stmp = nodemailer.createTransport({
        service:'gmail',
        auth:{
            type:'OAuth2',
            user:EMAIL,
            clientId:FACEDB_ID,
            clientSecret:FACEDB_SECRET,
            refreshToken:REFRESH_TOKEN,
            accessToken
        }
    })

    const mailOptions = {
        from:EMAIL,
        to:email,
        subject:'Facebook email onayı',
        html:`
        <div style="width: 100%; height:"fit-content" display: flex;  flex-direction: column;"><div style="display:flex;align-items:center; flex-direction:row;"><img style="width:50px;height:50px" src="https://brandlogos.net/wp-content/uploads/2016/09/facebook-icon-preview-1.png" alt=""><span style="font-size:18px;font-weight:700;color:#3d6bcf">Eylem gerekliliği:Facebook hesabınızı etkinleştirin.</span></div><div style="width:100%;height:1px;background-color:#c7c7c7;margin-top:5px"></div><div style="display:flex;flex-direction:column;gap:10px;border-bottom:1px solid #c7c7c7;padding-bottom:10px"><span style="padding:5px 0;font-size:16px;margin-top:5px">Merhaba ${username}</span><span style="padding:5px 0;font-size:16px">Yakın zamanda Facebook'ta bir hesap oluşturdunuz. Kaydınızı tamamlamak için lütfen hesabınızı onaylayın.</span><a href=${url} style="padding:5px 0;font-size:18px;background:#3d6bcf;padding:15px 10px;width:140px;display:flex;align-items:center;justify-content:center;border-radius:5px;color:#fff">Hesabı Onayla</a><span style="font-size:16px;color:#b8b8b8">Facebook tüm arkadaşlarınızla iletişim halinde kalmanıza izin verir, facebook'a kaydolduktan sonra fotoğraf paylaşabilir, etkinlikler düzenleyebilir ve çok daha fazlasını yapabilirsiniz.</span></div>
        `
    }
    stmp.sendMail(mailOptions,(err,res)=> {
        if(err) return err;

        return res;
    })
   
}

exports.sendCodeEmail = (email,username,code) => {
   
    auth2.setCredentials({refresh_token:REFRESH_TOKEN});

    const accessToken = auth2.getAccessToken();

    const stmp = nodemailer.createTransport({
        service:'gmail',
        auth:{
            type:'OAuth2',
            user:EMAIL,
            clientId:FACEDB_ID,
            clientSecret:FACEDB_SECRET,
            refreshToken:REFRESH_TOKEN,
            accessToken
        }
    })

    const mailOptions = {
        from:EMAIL,
        to:email,
        subject:'Facebook email onayı',
        html:`
        <div style="width: 100%; height:"fit-content" display: flex;  flex-direction: column;"><div style="display:flex;align-items:center; flex-direction:row;"><img style="width:50px;height:50px" src="https://brandlogos.net/wp-content/uploads/2016/09/facebook-icon-preview-1.png" alt=""><span style="font-size:18px;font-weight:700;color:#3d6bcf">Eylem gerekliliği:Facebook hesabınızı etkinleştirin.</span></div><div style="width:100%;height:1px;background-color:#c7c7c7;margin-top:5px"></div><div style="display:flex;flex-direction:column;gap:10px;border-bottom:1px solid #c7c7c7;padding-bottom:10px"><span style="padding:5px 0;font-size:16px;margin-top:5px">Merhaba ${username}</span><span style="padding:5px 0;font-size:16px">Yakın zamanda Facebook'ta bir hesap oluşturdunuz. Kaydınızı tamamlamak için lütfen hesabınızı onaylayın.</span><a  style="padding:5px 0;font-size:18px;background:#3d6bcf;padding:15px 10px;width:140px;display:flex;align-items:center;justify-content:center;border-radius:5px;color:#fff">${code}</a><span style="font-size:16px;color:#b8b8b8">Facebook tüm arkadaşlarınızla iletişim halinde kalmanıza izin verir, facebook'a kaydolduktan sonra fotoğraf paylaşabilir, etkinlikler düzenleyebilir ve çok daha fazlasını yapabilirsiniz.</span></div>
        `
    }
    stmp.sendMail(mailOptions,(err,res)=> {
        if(err) return err;

        return res;
    })
   
}