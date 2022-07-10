import {Router} from 'express';
import path from 'path';
import {HTML_FILES_PATH} from '../config';
import data from "../data";

const router = Router();

router.get('/', (req, res) => {
    const page = path.join(HTML_FILES_PATH, 'game.html');
    res.sendFile(page);
});

router.get('/texts/:id', (req, res) => {
    const textId: number = +req.params.id;
    res.status(200).send(JSON.stringify({text: data.texts[textId]}))
});

export default router;
