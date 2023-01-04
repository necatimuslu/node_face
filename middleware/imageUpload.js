const fs = require('fs');
module.exports = async function(req,res,next){
    try {
        if(!req.files || Object.values(req.files).flat().length === 0){
            return res.status(400).json({message:'Dosya seçilmedi'});
        }
        let files = Object.values(req.files).flat();
        
        files.forEach((file)=> {
            
            if(file.mimetype !== 'image/png'  && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg'  ){
                pathRemove(file.tempFilePath);
                return res.status(400).json({message:'Dosya uzantısı hatalı'});
            }
            if(file.size > 1024 * 1024 * 5){
                return res.status(400).json({message:'Dosya boyutu istenilenden büyük'});
            }
            next();
        })
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

const pathRemove = (path)=> {
     fs.unlink(path,(err)=> {
        if(err) throw err;
     });
}

