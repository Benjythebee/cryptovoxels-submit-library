Modals={
    welcome: ()=>{

        return`

            <header class="modal-card-head">
              <p class="modal-card-title">Hey there,</p>
              <button class="delete" aria-label="close"></button>
            </header>
            <section class="modal-card-body">
                    <section class="hero is-primary">
                    <div class="hero-body">
                    <div class="container">
                        <h1 class="title">
                        How to submit.
                        </h1>
                    </div>
                    </div>
                </section>
    
                <div class="content">
                <div class="block">
                    <ol type="1">
                        <li>Upload your .vox file and wait for the Preview to load.</li>
                        <li>Once loaded, click and drag around the preview to move the camera to have a better point of view.</li>
                        <li>Press 'Take a screenshot'</li>
                        <li>Finish the form and submit!</li>
                    </ol>
                    </div>
                    <div class="block">
                    Here is are examples of acceptable and non-acceptable screenshots:
                    <div class="level is-mobile">
                        <div class="level-item">
                            <img src='/components/castle_example.png' class="image is-128x128" alt="example">
                        </div>
                        <div class="level-item">
                            <img src='/components/castle_bad_example.png' class="image is-128x128" alt="example">
                        </div>
                    </div>
                    <div class="block">
                    To add / remove a file, click on the
                    <span class="icon is-small">
                    <i class="fas fa-plus" aria-hidden="true"></i>
                    </span>
                     or 
                    <span class="icon is-small">
                    <i class="fas fa-minus" aria-hidden="true"></i>
                    </span>

                    </div>
                    <div class="block">
                        <h5>Things to know: This form only takes a maximum payload of 25mb.</h5>
                    </div>
    
                </div>
            </section>
            <footer class="modal-card-foot">
            </footer>`
    },
    loading: ()=>{

        return`

            <header class="modal-card-head">
              <p class="modal-card-title">Loading...</p>
              <button class="delete" aria-label="close"></button>
            </header>
            <section class="modal-card-body">
                    <div class="ball-loader">
                    <div class="ball-loader-ball ball1"></div>
                    <div class="ball-loader-ball ball2"></div>
                    <div class="ball-loader-ball ball3"></div>
                </div>
            </section>
            <footer class="modal-card-foot">
            </footer>`
    },
    terms: ()=>{

        return`
            <header class="modal-card-head">
              <p class="modal-card-title">Terms of use</p>
              <button class="delete" aria-label="close"></button>
            </header>
            <section class="modal-card-body">
            <section class="modal-card-body">
            <section class="hero is-primary">
            <div class="hero-body">
            <div class="container">
                <h1 class="title">
                    Submission terms and conditions.
                </h1>
                <h2 class="subtitle">
                So we're on the same page
                </h2>
            </h1>
            </div>
            </div>
        </section>

        <div class="content">
        <div class="block">
            <p class="modal-text">Submiting your models and discord ID means you're:</p>
            <ul>
            <li>- Letting go of your private ownership rights of the model. This means you are</li>
            <ul>
              <li>*Letting others copy,modify the model however they wish.</li>
              <li>*Letting others distribute your model however they wish.</li>
          </ul>
          <li>- Allowing a moderator to contact you on discord if there is a problem with your submission</li>
          </ul>


            </div>
            <div class="block">
                <p class="modal-text">
                We will usually disclose the name of contributors at the bottom at the page of the Voxel Library. 
                However, if your name doesn't appear, you may contact a Moderator.
                </p>
            </div>
            <div class="block">
            <h4 class="subtitle">Privacy policy:</h4>
                <p class="modal-text">
                We do not collect any data appart from the data you submit: Your discord name and your files.
                </p>
            </div>
        </div>
            </section>
            <footer class="modal-card-foot">
            </footer>`
    },
    submitted: ()=>{

        return`

            <header class="modal-card-head">
                <p class="modal-card-title">Submitted.</p>
                <button class="delete" aria-label="close"></button>
            </header>
            <section class="modal-card-body">
                <div class="block">
                <p><strong>Submission sent!</strong></p>
                </div>
                <div class="block">
                <p> If everything goes well the page will be refreshed...</p>
                </div>
            </section>
            <footer class="modal-card-foot">
            </footer>`
    },
    error: ()=>{

        return`

            <header class="modal-card-head">
                <p class="modal-card-title">Submission on standby.</p>
                <button class="delete" aria-label="close"></button>
            </header>
            <section class="modal-card-body">
                <div class="block">
                <p><strong>Error !</strong></p>
                </div>
                <div class="block">
                <p>Some inputs are missing...</p>
                </div>
            </section>
            </div>
            <footer class="modal-card-foot">
            </footer>`
    }
}