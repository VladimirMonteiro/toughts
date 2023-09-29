
const Tought = require('../models/Tought')
const User = require('../models/User')

const {Op, where} = require('sequelize')


module.exports = class ToughtsController{

    static async showToughts(req,res){


        let search = ''

        if(req.query.search){
            search = req.query.search
        }
      
        const toughtsData = await Tought.findAll({include: User, where: {title: {[Op.like]: `%${search}%`}}} )

        const toughts = toughtsData.map((results)=> results.get({plain: true}))

        console.log(toughts)

        let toughtsQty = toughts.length

        if(toughtsQty === 0){
            toughtsQty = false
        }


        
      
      
        res.render('toughts/home', {toughts, search, toughtsQty})
        
    }

    static async dashboard(req, res){

        const userId = req.session.userid

        const user = await User.findOne({where: {id: userId, }, include: Tought, plain: true} )

        if(!user){
            res.redirect('/login')
        }

       
        
        const toughts = user.Toughts.map((results)=> results.dataValues)



        let emptyToughts = false
  

        if(toughts.length === 0){
            emptyToughts = true
       
        }

        console.log(emptyToughts)

        res.render('toughts/dashboard', { toughts,emptyToughts})
    }

    static async createToughtPost(req, res){

        const tought = {
            title: req.body.title,
            UserId: req.session.userid
        }



        try {

            await Tought.create(tought)
            req.flash('message', 'Pensamento criado com sucesso!')

            req.session.save(()=>{
    
            res.redirect('/toughts/dashboard')
    
            })
            
        } catch (error) {
            console.log(error)
            
        }

      



    }

    static async editTought(req, res){

        const id = req.params.id

        const tought = await Tought.findOne({raw: true, where: {id: id}})

        res.render('toughts/edit', {tought})
    }


    static async editToughtPost(req, res){

        const id = req.body.id

        const tought = {
            title: req.body.title
        }

        await Tought.update(tought, {where: {id: id}})
        
        req.flash('message', 'Pensamento atualizado com sucesso!')
        
        req.session.save(()=> {
            res.redirect('/toughts/dashboard')
        })
    }

    static  createTought(req,res){
        res.render('toughts/create')

    }

    static async removeTought(req, res){
        const id = req.body.id
        const userId = req.session.userid

       try {

        await Tought.destroy({where: {id: id, UserId: userId}})
        req.flash('message', 'Pensamento Excluido com sucesso!')

        req.session.save(()=>{
            res.redirect('/toughts/dashboard')
        })
        
       } catch (error) {

        console.log(error)

       }
    }

}