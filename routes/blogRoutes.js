import express from "express";
const router = express.Router();
import blogController from "../controllers/blogController.js";
import routeCache from "../routeCache.js";
const cache = routeCache.middleware;

router.get("/", blogController.blog_index);
router.post("/load-more", blogController.blog_load_more);
router.post("/", blogController.blog_create_post);
router.get("/create", cache(300), blogController.blog_create_get);
router.get("/:id", cache(300), blogController.blog_details);
router.get("/delete/:id", blogController.blog_delete);
router.get("/update/:id", cache(300), blogController.blog_update_get);
router.post("/:id", blogController.blog_update_patch);

export default router;
