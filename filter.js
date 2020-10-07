const voxFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(vox)$/)) {
        req.fileValidationError = 'Only vox files are allowed!';
        return cb(new Error('Only vox files are allowed!'), false);
    }
    cb(null, true);
};
exports.voxFilter = voxFilter;