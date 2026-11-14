import multer, { StorageEngine } from "multer";

const storage: StorageEngine = multer.diskStorage({});

export const upload = multer({ storage });
