const User = require('../models/User')
const bcrypt = require('bcryptjs')
const { use } = require('../routes/toughtsRoutes')


module.exports = class AuthController {

    static  login(req, res){
        res.render('auth/login')

    }

    static async loginPost(req, res){

        const {email, password} = req.body

        //find user 

        const user = await User.findOne({where: {email: email}})

        if(!user){
            req.flash('message', 'Úsuario nâo encontrado.')
            res.render('auth/login')

            return
        }

        //check password is match

        const passwordMatch = bcrypt.compareSync(password, user.password)

        if(!passwordMatch){
            req.flash('message', 'Senha incorreta.')
            res.render('auth/login')

            return
        }


        
    

        req.session.userid = user.id
        console.log(req.session)
        console.log(req.session.userid)

        req.flash('message', 'Autenticacâo realizada com sucesso!')


        req.session.save(()=> {
            res.redirect('/')

         })
    }



    static  register(req, res){
        res.render('auth/register')

    }

    static async registerPost(req,res){
        const {name, email, password, passwordConfirm} = req.body

        if(password != passwordConfirm){
            req.flash('message', 'As senhas não conferem, tente novamente.')
            res.render('auth/register')

            return
        }

        //check user if exists
        const checkifUserExist = await User.findOne({where: {email: email}})

        if(checkifUserExist){
            req.flash('message', 'O E-mail já está em uso.')
            res.render('auth/register')

            return
        }


        //create a password

        const salt = bcrypt.genSaltSync(10)

        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            name,
            email,
            password: hashedPassword
        }

        try {

           const createdUser =  await User.create(user)

            req.session.userid = createdUser.id
            console.log(req.session)
            console.log(req.session.userid)

            req.flash('message', 'Cadastro criada com sucesso!')


            req.session.save(()=> {
                res.redirect('/')

            })

           
        
            
        } catch (error) {
            console.log(error)
        }




    }

    static logout(req, res){
        req.session.destroy()
        res.redirect('/login')
    }
}

