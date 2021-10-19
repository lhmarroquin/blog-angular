import { Component, OnInit } from '@angular/core';
import { User } from "../../models/user";
import { UserService } from "../../services/user.service";
import { global } from "../../services/global";

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService]
})
export class UserEditComponent implements OnInit {

  public page_title: string;
  public user: User;
  public identity;
  public token;
  public status;
  public froala_options: Object = {
    charCounterCount: true,
    toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat', 'alert', 'imageUpload'],
    toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat', 'alert', 'imageUpload'],
    toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat', 'alert', 'imageUpload'],
    toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat', 'alert', 'imageUpload'],
  };
  public url;




  public afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg,.jpeg,.png,.gif",
    maxSize: "50",
    uploadAPI:  {
      url: global.url+"user/upload",
      method:"POST",
      headers: {
        "Authorization" : this._userService.getToken()
      },
    },
    theme: "attachPin",
    hideProgressBar: true,
    hideResetBtn: true,
    hideSelectBtn: true,
    fileNameIndex: true,
    replaceTexts: {
      selectFileBtn: 'Select Files',
      resetBtn: 'Reset',
      uploadBtn: 'Upload',
      dragNDropBox: 'Drag N Drop',
      attachPinBtn: 'Sube tu avatar de usuario',
      afterUploadMsg_success: 'Successfully Uploaded !',
      afterUploadMsg_error: 'Upload Failed !',
      sizeLimit: 'Size Limit'
    }
  };

  constructor(
    private _userService: UserService
  ) {
    this.page_title = "Ajustes de usuario";
    this.user = new User(1, '', '', 'ROLE_USER', '', '', '', '');
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = global.url;
    this.user = new User(
      this.identity.sub,
      this.identity.name,
      this.identity.surname,
      this.identity.role,
      this.identity.email, '',
      this.identity.description,
      this.identity.image);
  }

  ngOnInit(): void {
  }

  onSubmit(form) {
    this._userService.update(this.token, this.user).subscribe(
      response => {
        if (response.status == 'success') {
          this.status = 'success';
          console.log(response);
          // Acturalizar usuario en session
          if (response.changes.name) {
            this.user.name = response.changes.name;
          }
          if (response.changes.surname) {
            this.user.surname = response.changes.surname;
          }
          if (response.changes.email) {
            this.user.email = response.changes.email;
          }
          if (response.changes.description) {
            this.user.description = response.changes.description;
          }
          if (response.changes.image) {
            this.user.image = response.changes.image;
          }
          this.identity = this.user;
          localStorage.setItem('identity', JSON.stringify(this.identity));
        }
      },
      error => {
        this.status = 'error';
        console.log(<any>error);
      }
    )
  }

  avatarUpload(datos) {
    console.log(datos.response);
    let data = JSON.parse(datos.response);
    this.user.image = data.image;
  }

}
