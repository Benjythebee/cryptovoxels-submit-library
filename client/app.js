App = {
    loading: false,
    filenames:[],
    files: [],
    payload: {},
    clonedItem:{},
    modal:{},
    load: async () => {
     // await App.loadWeb3()
     // await App.loadAccount()
     await App.render()
    },
  
    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8

    render: async () => {
      // Prevent double render
      if (App.loading) {
        return
      }

      // Update app loading state
      
      App.setLoading(true)
      App.blockToggle()
      App.payload = new PayLoad()
      // Render Tasks
      App.clonedItem=$("#repeatable_media")[0].cloneNode(true)
      
      $("#media_list").on('click',"#addBox",e=>{

        App.addBox($(e.target).closest('div[class^="box"]'))
      })
      $("#media_list").on('click',"#removeBox",e=>{

        App.removeBox($(e.target).closest('div[class^="box"]'))
      })
      $("#media_list").on('click',".loadToCanvas",async (e)=>{



        var dom=$(e.target).closest('div[class^="box"]')[0]
        var index = await App.getElementIndex(dom);
        var urlInput=$(e.target).closest('div[class^="box"]').find(".file-input").val()
        if(App.payload.getFileByIndex(index).vox!=""){
          urlInput = App.payload.getFileByIndex(index).vox
        }
        /*if(App.files[index].vox!=""){
          urlInput = App.files[index].vox
        }*/
        
        upload_vox(urlInput,dom,App.filenames[index])


      })
      
      App.modal = new BulmaModal(".modal") 
      $(".showTerms").on('click',e=>{
        $('.modal-card-body').html(`<div class=""><p class="modal-text has-text-black">Submiting your models and discord ID means you're:</p>
        <ul>
        <li>- Letting go of your private ownership rights of the model. This means you are</li>
        <ul>
          <li>*Letting others copy,modify the model however they wish.</li>
          <li>*Letting others distribute your model however they wish.</li>
      </ul>
        <li>- Allowing a moderator to contact you on discord if there is a problem with your submission</li>
        </ul>
        </div>
        <div class="">
        <p></p>
        <p class="modal-text has-text-black">
        We will usually disclose the name of contributors at the bottom at the page of the Voxel Library. 
        However, if your name doesn't appear, you may contact a Moderator.
        </p></div>`)
        $('.modal').find('.modal-close').removeClass("is-hidden")
        App.modal.show('Terms of submission')
      })
      $(".modal-close").on('click',e=>{
        App.modal.close()
      })
      // Update loading state
      App.setLoading(false)
    },
    getElementIndex: async(node)=>{
      var index = 0;
      while ( (node = node.previousElementSibling) ) {
          index++;
      }
      return index;
  },
    addBox: async(node)=>{
      var htmlElm = node[0];
      var newBox =  $(App.clonedItem.cloneNode(true))
      var index = await App.getElementIndex(htmlElm);
      newBox.attr("id","box-"+(index+1))
      var arrayBoxes=node.parent().children();
      if(index == (arrayBoxes.length - 1)){

        node.find('nav').remove();
        
        $('.container #media_list').append(newBox)
      }
      
  },
  removeBox: async(node)=>{
    var htmlElm = node[0];

    var index = await App.getElementIndex(htmlElm);

    var arrayBoxes=node.parent().children();
    if(index == (arrayBoxes.length - 1) && index!=0){
      
      var MenuTemplate=node.find('nav').clone();
      console.log(MenuTemplate[0])
      $(arrayBoxes[index-1]).find('.media-content').append(MenuTemplate[0])

      node.remove()
    }
    
},
    uploadFile: async(element)=>{

      
      var iMaxFilesize = 5242880; // 5MB
      var oTimer = 0;
      var sResultFileSize = '';

      function bytesToSize(bytes) {
        var sizes = ['Bytes', 'KB', 'MB'];
        if (bytes == 0) return 'n/a';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
    };
      const ParentofElement= element.closest('div[class^="box"]');
      JParentofElement = $(ParentofElement);
      JParentofElement.find('.is-danger').addClass("is-hidden");
      JParentofElement.find('#takescreen').html('<div class="loader is-loading"></div>');
      JParentofElement.find('.file-name').html('')
      
      var indexOfBox = await App.getElementIndex(ParentofElement)

      var voxFile = element.files[0];

/* Upload file function is here*/
      var SubmitOK=true;
      // prepare HTML5 FileReader
      var oReader = new FileReader();
      oReader.fileName = voxFile.name;
      oReader.onload = function(e) {

          // we are going to display some custom image information here
          sResultFileSize = bytesToSize(voxFile.size);
          JParentofElement.find('.file-name').html( e.target.fileName.substring(0,7)+"...")
          JParentofElement.find('#fileinfovox').css("display", "block");
          JParentofElement.find('#filenamevox').html('Name: ' + e.target.fileName);
          JParentofElement.find('#filesizevox').html('Size: ' + sResultFileSize);

          if(voxFile.size>iMaxFilesize){
            SubmitOK=false
            JParentofElement.find('.errorToobig').removeClass("is-hidden");
          }

          if(e.target.fileName.split('.').pop()!="vox"){ 
            SubmitOK=false
            JParentofElement.find('.errorInvalid').removeClass("is-hidden");
          }
          var formdata = new FormData();
          formdata.append('voxfile',voxFile,e.target.fileName)


          if(SubmitOK){
            axios.post('/submit_file',formdata,
            {
              headers: {'Content-Type': 'multipart/form-data' }
          }
          )
          .then(res => { // then print response status
            if(!res.data.err){
              if(App.filenames.length==0){
                App.filenames.push(e.target.fileName);
                App.payload.createFilePayload(res.data.msg,'',e.target.fileName,'',voxFile.size)

                //App.payload.addFileToPayload({vox:res.data.msg,imgPath:'',name:e.target.fileName,size:''})
              }else{
                App.payload.setFileByIndex(indexOfBox,{vox:res.data.msg,imgPath:'',name:e.target.fileName,sizeX:'',weight:voxFile.size,weightimg:0})
                //App.payload.addFileToPayload({vox:res.data.msg,imgPath:'',name:e.target.fileName,size:''})
                App.filenames[indexOfBox]=e.target.fileName
              } 
              console.log(App.payload)
              var newPayloadTotal=App.payload.computeTotalSize()
              $(".Total_weight").html(bytesToSize(newPayloadTotal))
              upload_vox(res.data.msg,ParentofElement,e.target.fileName)
              

            }else{
              JParentofElement.find('.errorInvalid').removeClass("is-hidden");
            
            }
          })
          .catch(err => { // then print response status
            console.log(err)
            JParentofElement.find('.errorUploading').removeClass("is-hidden");
            return false
          })

          }// End if submitOK




        } // end file reader
        
        oReader.readAsDataURL(voxFile);
    },

    sendSubmission: async(json)=>{
      $('.modal-card-body').html(`
      <div class="has-text-centered">
      <div class="ball-loader ">
        <div class="ball-loader-ball ball1"></div>
        <div class="ball-loader-ball ball2"></div>
        <div class="ball-loader-ball ball3"></div>
      </div>
      </div>
      `)
      App.modal.show('Sending submission')
      axios.post("/sendReport", {report:json})
      .then(res => { // then print response status
        return true
      })
      .catch(err => { // then print response status
        console.log('not sent')
        return false
      })
    },
    blockToggle: async()=>{
      $('.toggleInput').prop('disabled', function(i, v) { return !v; });
    },
    setLoading: (boolean) => {
      App.loading = boolean
      const loader = $('#loader')
      const content = $('#content')
      if (boolean) {
        loader.show()
        content.hide()
      } else {
        loader.hide()
        content.show()
      }
    }
  }
  
  $(() => {
    
    $(window).on('load',() => {

      App.load()

    })
  })