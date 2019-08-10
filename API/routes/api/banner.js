let express = require('express')
let router = express.Router()

let mgdb = require('../../utils/mgdb')

router.get('/',(req,res,next)=>{
  console.log('banner')
  mgdb({
    url:'mongodb://127.0.0.1:27017',
    dbName:'local',
    collectionName:'gao'
  },(collection)=>{
    collection.find({

    },{
    }).toArray((err,result)=>{
      console.log('err',err)
      if(!err){
        res.send({err:1,msg:'成功',data:result})
      }
    })
  })
})
router.get('/:_id',(req,res,next)=>{
  console.log(req.params)
  let _id = req.params._id;
  mgdb({
    url:'mongodb://127.0.0.1:27017',
    dbName:'local',
    collectionName:'gao'
  },(collection,client,ObjectID)=>{
    collection.find({
      _id:ObjectID(_id)
    }).toArray((err,result)=>{
      console.log('result',result)
      if(!err){
        res.send({err:0,msg:'查询成功',data:result[0]})
      }
    })
  })
})



module.exports = router;