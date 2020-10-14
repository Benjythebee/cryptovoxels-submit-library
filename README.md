# cryptovoxels-submit-library
 Voxel library submission form

This is a website that allows users to upload up to 25mb of .vox files and sends them to an email address upon submission.
The website renders the 3d model and lets its users take a screenshot of the model.

If you clone this repo, make sure you create a `.env` file and add the following in it:

```
PORT=8000
NODE_ENV="development"
HOST="localhost"
smtpNodeMailer='smtps://username:Password@YourSMTPURL/?pool=true'
SEND_TO_EMAIL="yourEmail@somewhere.com"
```

### To do:
- improve render quality.
- Potentially let users upload their own background.
