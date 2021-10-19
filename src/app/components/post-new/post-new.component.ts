import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { UserService } from "../../services/user.service";
import { CategoryService } from "../../services/category.service";
import { PostService } from "../../services/post.service";
import { Post } from "../../models/post";
import {global} from "../../services/global";

@Component({
  selector: 'app-post-new',
  templateUrl: './post-new.component.html',
  styleUrls: ['./post-new.component.css'],
  providers: [UserService, CategoryService, PostService]
})
export class PostNewComponent implements OnInit {

  public pageTitle: string;
  public identity: string;
  public token: string;
  public post: Post;
  public categories;
  public isEdit: boolean;

  public status: string;
  public froala_options: Object = {
    charCounterCount: true,
    language: 'es',
    toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat', 'imageUpload'],
    toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat', 'imageUpload'],
    toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat', 'imageUpload'],
    toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat', 'imageUpload'],
  };

  public afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg,.jpeg,.png,.gif",
    maxSize: "50",
    uploadAPI:  {
      url: global.url+"post/upload",
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
    attachPinBtn: 'Subir imagen',
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
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _categoryService: CategoryService,
    private _postService: PostService
  ) {
    this.pageTitle = 'Crear una entrada';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.isEdit = false;
  }

  ngOnInit(): void {
    this.getCategories();
    const id: number = +this.identity.sub;

    this.post = new Post(1, id, 1, '', '', null, null);
    console.log(this.post);
  }

  getCategories() {
    this._categoryService.getCategories().subscribe(
      response => {
        if( response.status == 'success' ) {
          this.categories = response.categories;
        }
      },
      error => {

      }
    );
  }

  onSubmit(form) {
    this._postService.create(this.token, this.post).subscribe(
      response => {
        if( response.status == 'success' ) {
          this.post = response.post;
          this.status = 'success';
          this._router.navigate(['/inicio']);
        }
      },
      error => {
        console.log(error);
        this.status = 'error';
      }
    );
  }

  imageUpload(data) {
    console.log(data.response);
    let imageData = JSON.parse(data.response);
    this.post.image = imageData.image;
  }

  resetVar() {
    console.log('resetVar');
  }

}
