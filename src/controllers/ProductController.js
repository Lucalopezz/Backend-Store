import Product from '../models/Products.js'

export default class UserController {
    static async createProduct(req, res){
        const {name, description, price, quantity} = req.body
    }
}