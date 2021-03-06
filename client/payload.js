class Payload {
    constructor() {
        this._discord="",
        this._anonymous=false;
        this._terms=false,
        this._files=[]
        this._totalSize=0
        this.recaptcha=''
    }
    set discord(discordname) {
      this._discord = discordname;
    }
    get discord() {
      return this._discord;
    }
    set anonymous(bool) {
      this._anonymous = bool;
    }
    get anonymous() {
      return this._anonymous;
    }
    set terms(bool) {
        this._terms = bool;
      }
      get terms() {
        return this._terms;
      }
      set files(files) {
        this._files = files;
      }
      get files() {
        return this._files;
      }

      set setSize(totalSize) {
        this._totalSize = totalSize;
      }
      get getSize() {
        return this._totalSize;
      }
      set token(token) {
        this.recaptcha = token;
      }
      get token() {
        return this.recaptcha;
      }
      setToken(s){
        this['g-recaptcha-response'] =s
      }
      

      addSize(s){
        var c = parseInt(this._totalSize) + parseInt(s)
        this._totalSize =c
      }
      removeSize(s){
        var c = parseInt(this._totalSize) - parseInt(s)
        this._totalSize=c
      }
      computeTotalSize(){
        var total=0
        for(var i=0;i<this._files.length;i++){
          total=parseInt(total)+parseInt(this._files[i].weight)
          total=parseInt(total)+parseInt(this._files[i].weightimg)
        }
        this._totalSize = total
        return total
      }

      createFilePayload(vox,imgpath,name,sizeX,weight,weightimg){
        if(vox==undefined){vox=""}
        if(imgpath==undefined){imgpath=""}
        if(name==undefined){name=""}
        if(sizeX==undefined){sizeX=""}
        if(weight==undefined){weight=0}
        if(weightimg==undefined){weightimg=0}
        this._files.push({vox:vox,imgPath:imgpath,name:name,sizeX:sizeX,weight:parseInt(weight),weightimg:parseInt(weightimg)})
      }


      setFileByIndex(index,file){
          this._files[index]=file
      }
      getFileByIndex(index){
        return this._files[index]
    }
    setFileAttribute(index,attribute,value){
        this._files[index][attribute]=value
    }
    getFileAttribute(index,attribute){
        return this._files[index][attribute]
    }
    addFileToPayload(File){
      this._files.push(File)
    }
}
module.exports = Payload

