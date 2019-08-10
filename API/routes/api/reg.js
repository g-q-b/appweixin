let express = require('express')
let router = express.Router()
let mgdb = require('../../utils/mgdb')
let fs = require('fs');
let pathLib = require('path');
let bcrypt = require('bcrypt');

router.post('/',(req,res,next)=>{
  
  let {username,password,nikename,icon} = req.body;
  // username/password 是必传参数 不传不兜库
  if(!username || !password){
    res.send({err:1,msg:'username,password为必传参数'});
    return;
  }
  let follow = 0;
  let fans = 0;
  let time = Date.now();//生成注册时间
  password = bcrypt.hashSync(password, 10); 
  nikename = nikename || '系统给的'; //借助第三方昵称生成库

  // console.log('reg',req.file);// multer === dest  req.files   multer ===storage req.file

  if(!req.file && req.files.length>0 ){
    //改名 整合路径 存到 icon
    fs.renameSync(
      req.files[0].path,
      req.files[0].path + pathLib.parse(req.files[0].originalname).ext
    )
    icon = '/upload/user/' + req.files[0].filename + pathLib.parse(req.files[0].originalname).ext
  }else{
    icon = '/upload/noimage.png';
  }

  // 兜库校验username/password 
  mgdb({
    collectionName: 'login'
  },(collection,client)=>{
    collection.find({
      username
    },{

    }).toArray((err,result)=>{
      if(!err){
        if(result.length>0){
          //不通过 返回错误信息
          res.send({err:1,msg:'用户名已存在'})
          // fs.unlinkSync('./public'+icon)
          client.close()

        }else{
          //通过   返回用户数据  插入库 返回插入后的数据
          collection.insertOne({
            username,password,nikename,follow,fans,time,icon
          },(err,result)=>{
            if(!err){
              // req.session[key]=result.insertedId
              res.send({err:1,msg:'注册成功',data:result.ops[0]})
            }else{
              res.send({err:1,msg:'user集合操作失败'})
              client.close()
            }
          })
        }
      }else{
        res.send({err:1,msg:'user集合操作失败'})
        client.close()
      }
    })
  })
  
   
})

module.exports = router;