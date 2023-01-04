const cloudinary = require('cloudinary');
const fs = require('fs');

cloudinary.config({
    cloud_name: 'duxye7yni', 
    api_key: '139385764525565', 
    api_secret: 'SR8O8cUpssbLkd-rV18eQBTOVHo'
});


exports.uploadImages = async (req,res) => {
    try {
        const { path } = req.body;
        let files = Object.values(req.files).flat();
        let images = [];
        for(const file of files){
            const url = await sendCloudinaryToFile(file,path);
            images.push(url);
            pathRemove(file.tempFilePath);
        }
        res.json(images);
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

exports.listImages = async (req,res) => {
    try {
        const {path,sort,max} = req.body;
        cloudinary.v2.search.expression(`${path}`).sort_by('created_at',`${sort}`).max_results(max).execute().then((result)=> res.json(result)).catch((err)=> console.log(err));
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

const sendCloudinaryToFile = async (file,path)=> {
    return new Promise((resolve)=> {
        cloudinary.v2.uploader.upload(
            file.tempFilePath,{
                folder:path
            },(err,res)=> {
                if(err){
                    pathRemove(file.tempFilePath);
                    return res.status(400).json({message:'Resim yükleme hatalı'})
                }
                resolve({
                    url:res.secure_url,
                })
            }
        )
    })
}

const pathRemove = (path)=> {
    fs.unlink(path,(err)=> {
       if(err) throw err;
    });
}