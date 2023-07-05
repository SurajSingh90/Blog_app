import express from 'express';
const routes = express.Router()
import usersRoutes from './Users/Auth.routes';
import CategoryRoutes from './categroy/categroy';
import blogroutes from './Blog/blog.routes';
import favorite from './favorite/facorite.route';
const PATH ={
    USERS:'/users',
    Category:'/category',
    BLOG:'/blog',
    Favorite:'/favoriteBlog'
}
routes.use(PATH.USERS,usersRoutes)
routes.use(PATH.Category,CategoryRoutes)
routes.use(PATH.BLOG,blogroutes)
routes.use(PATH.Favorite,favorite)
export default routes