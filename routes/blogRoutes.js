import express from "express";
const router = express.Router();
import blogController from '../controllers/blogController.js';


router.get("/", blogController.blog_index);
router.post("/load-more", blogController.blog_load_more)
router.post("/", blogController.blog_create_post);
router.get("/create", blogController.blog_create_get);
router.get("/:id", blogController.blog_details);
router.get("/delete/:id", blogController.blog_delete);
router.get("/update/:id", blogController.blog_update_get);
router.post("/:id", blogController.blog_update_patch);



export default router;
