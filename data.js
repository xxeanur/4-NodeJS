const db = require('rethinkdb');
const blogModel = require('./models/blog');
var conn = null;
class data {
    constructor() {
        conn = this.connection();
    }

    connection() {
        return (db.connect({ host: 'localhost', port: 28015, db: "blog_db" }));
    }

    async searchBlog(keyword) {
        let blogs = await db.table("blogs")
        .filter(db.row('title')
        .match(keyword))
        .run(await conn);
        return (blogs.toArray());
    }
    async getAllBlogs() {
        return ((await db.table('blogs').run(await conn)).toArray());
    }
    async getByIdBlog(id) {
        return (await db.table('blogs').get(id).run(await conn));
    }
    async updateBlog(blogModel) {
        try {
            let addToDate = (await db.table('blogs').get(blogModel.id).pluck('addToDate').run(await conn)).addToDate;
            blogModel.addToDate = addToDate;
            await db.table('blogs').update(blogModel).run(await conn);
        } catch (error) {
            console.log("güncellenirken hata olustu", error);
        }
        finally {
            console.log(`${blogModel.id}'ye sahip blog güncellendi.`);
        }
    }

    async removeBlog(id) {
        try {
            await db.table('blogs').get(id).delete().run(await conn);
        } catch (error) {
            console.log("Silinirken hata olustu", error);
        }
        finally {
            console.log(`${id}'ye sahip blog silindi.`);
        }
    }

    async addBlog(blogModel) {
        try {
            await db.table('blogs').insert(blogModel).run(await conn);
        } catch (error) {
            console.log(error);
        }
        finally {
            console.log("Eklendi", blogModel);
        }
    }
}

module.exports = data;
