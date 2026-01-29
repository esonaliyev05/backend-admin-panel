import multer from "multer";
import path from "path";
import fs from "fs";

const ensure_dir = (dir: string) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const uploads_root = path.join(process.cwd(), "uploads");
ensure_dir(uploads_root);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensure_dir(uploads_root);
    cb(null, uploads_root);
  },
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    const ext = path.extname(safe);
    const base = path.basename(safe, ext);
    cb(null, `${base}_${Date.now()}${ext}`);
  }
});

export const upload = multer({ storage });
